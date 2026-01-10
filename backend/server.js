import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import mysql from "mysql2";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- MIDDLEWARE ---------------------- //
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------- DATABASE CONNECTION ---------------------- //
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "idlink_db",
});

db.connect((err) => {
  if (err) return console.error("❌ MySQL connection error:", err);
  console.log("✅ MySQL Connected");
});

// ---------------------- EMAIL (OPTIONAL) ---------------------- //
// Configure transporter if SMTP env vars are provided
let mailTransporter = null;
let mailerInfo = { mode: "none", configured: false, testAccountUser: null };

// Configure transporter: prefer explicit SMTP env vars, otherwise in non-production
// create an Ethereal test account so developers can send test emails without extra setup.
(async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("✅ Mail transporter configured");
    mailerInfo = { mode: "smtp", configured: true, testAccountUser: null };
  } else if (process.env.NODE_ENV !== "production") {
    try {
      const testAccount = await nodemailer.createTestAccount();
      mailTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("⚠️ Mail transporter using Ethereal test account for dev");
      console.log(`Ethereal credentials: ${testAccount.user} / ${testAccount.pass}`);
      mailerInfo = { mode: "ethereal", configured: true, testAccountUser: testAccount.user };
    } catch (err) {
      console.error("Failed to create Ethereal test account:", err);
    }
  } else {
    console.log("⚠️ Mail transporter not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS to enable email notifications.");
    mailerInfo = { mode: "none", configured: false, testAccountUser: null };
  }
})();

// ---------------------- FILE UPLOAD CONFIG ---------------------- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ---------------------- TEST ROUTE ---------------------- //
app.get("/", (req, res) => res.send("✅ IDLink Backend is Running"));

// ---------------------- AUTH ROUTES ---------------------- //

// Register
app.post("/api/register", async (req, res) => {
  const { idno, fullname, email, password, course, year, role } = req.body;
  if (!idno || !fullname || !email || !password || !role)
    return res.status(400).json({ message: "Missing required fields" });

  const checkSql = "SELECT * FROM users WHERE email = ? OR idno = ?";
  db.query(checkSql, [email, idno], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length > 0) return res.status(400).json({ message: "Email or ID already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = `
      INSERT INTO users (idno, fullname, email, password, course, year, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [idno, fullname, email, hashedPassword, course || null, year || null, role], (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Registration successful", fullname, role, idno, email });
    });
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    res.json({ message: "✅ Login successful", role: user.role, fullname: user.fullname, idno: user.idno });
  });
});

// ---------------------- APPLICATION ROUTES ---------------------- //

// GET all applications (students & employees) - optionally filter by user idno
app.get("/api/applications", (req, res) => {
  const userIdno = req.query.user; // Optional: filter by user idno

  let sql = `
    SELECT 
      a.id,
      a.app_id AS id_display,
      a.user_id,
      u.idno,
      u.fullname,
      u.email,
      u.course,
      u.year,
      a.department,
      a.status,
      DATE_FORMAT(a.date_submitted, '%Y-%m-%d') AS date,
      DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      a.remarks,
      a.photo,
      a.signature,
      a.cor
    FROM applications a
    JOIN users u ON u.id = a.user_id
    WHERE u.role IN ('student','employee')
  `;

  let params = [];
  if (userIdno) {
    sql += ` AND u.idno = ?`;
    params.push(userIdno);
  }

  sql += ` ORDER BY a.created_at DESC`;

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// GET users count
app.get("/api/users/count", (req, res) => {
  const sql = `SELECT COUNT(*) AS count FROM users`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    const count = results[0]?.count ?? 0;
    res.json({ count });
  });
});

// GET single application
app.get("/api/applications/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT a.*, u.idno, u.fullname, u.email, u.course, u.year
    FROM applications a
    JOIN users u ON u.id = a.user_id
    WHERE a.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Application not found" });
    res.json(results[0]);
  });
});

// CREATE new application (with file uploads)
app.post("/api/applications", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "signature", maxCount: 1 },
  { name: "cor", maxCount: 1 }
]), (req, res) => {
  const { firstName, lastName, middleName, idType, department, studentNumber, email, phone } = req.body;

  const photoFile = req.files.photo ? req.files.photo[0].filename : null;
  const signatureFile = req.files.signature ? req.files.signature[0].filename : null;
  const corFile = req.files.cor ? req.files.cor[0].filename : null;

  // Find user_id from users table
  const getUserSql = `SELECT id FROM users WHERE email = ? OR idno = ?`;
  db.query(getUserSql, [email, studentNumber], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user_id = results[0].id;

    const appIdPrefix = `APP${new Date().getFullYear()}`;
    const provisionalAppId = `${appIdPrefix}-${Date.now().toString().slice(-6)}`;

    const insertSql = `
      INSERT INTO applications 
      (app_id, user_id, department, status, remarks, photo, signature, cor) 
      VALUES (?, ?, ?, 'submitted', ?, ?, ?, ?)
    `;
    const remarks = `Application submitted by ${firstName} ${lastName}`;

    db.query(insertSql, [provisionalAppId, user_id, department, remarks, photoFile, signatureFile, corFile], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Application submitted successfully", app_id: provisionalAppId });
    });
  });
});

// CREATE revalidation application for a user by idno
app.post("/api/applications/revalidate", (req, res) => {
  const { idno, fullname, role } = req.body;
  if (!idno) return res.status(400).json({ message: "idno is required" });

  const getUserSql = `SELECT id, fullname, role FROM users WHERE idno = ? OR email = ?`;
  db.query(getUserSql, [idno, idno], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user_id = results[0].id;
    const userFullname = results[0].fullname || fullname || null;

    const appIdPrefix = `APP${new Date().getFullYear()}`;
    const provisionalAppId = `${appIdPrefix}-${Date.now().toString().slice(-6)}`;

    const insertSql = `
      INSERT INTO applications 
      (app_id, user_id, department, status, remarks, photo, signature, cor) 
      VALUES (?, ?, ?, 'submitted', ?, ?, ?, ?)
    `;
    const remarks = `Revalidation requested${userFullname ? ` by ${userFullname}` : ''}`;

    db.query(insertSql, [provisionalAppId, user_id, null, remarks, null, null, null], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      // return the created application basic info
      const selectSql = `SELECT a.app_id AS id_display, u.fullname, a.status, DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM applications a JOIN users u ON u.id = a.user_id WHERE a.id = ?`;
      db.query(selectSql, [result.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ message: "Database error", error: err2 });
        res.status(201).json({ message: "Revalidation submitted", application: rows[0] });
      });
    });
  });
});

// UPDATE application status/remarks
app.put("/api/applications/:id", (req, res) => {
  const id = req.params.id;
  const { status, remarks, notify, pickup_date, batch } = req.body;
  const sql = `UPDATE applications SET status = ?, remarks = ? WHERE id = ?`;

  db.query(sql, [status, remarks || null, id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });

    // If notify requested and mail transporter is configured, fetch user info and send email
    if (notify) {
      const userSql = `SELECT u.email, u.fullname FROM applications a JOIN users u ON u.id = a.user_id WHERE a.id = ?`;
      db.query(userSql, [id], async (err2, rows) => {
        if (err2) return res.status(500).json({ message: "Database error" });
        if (rows.length === 0) return res.status(404).json({ message: "User not found for application" });

        const user = rows[0];

        // send email if transporter available and return preview info when possible
        if (mailTransporter) {
          // Build subject/body differently depending on whether a pickup_date was provided
          let subject = `Application Update`;
          let body = `Hello ${user.fullname},\n\nYour application status is now ${status}.\n\nRemarks: ${remarks || ""}\n\nPlease check the Track Status page for updates.\n\nRegards,\nIDLink Team`;

          if (pickup_date) {
            subject = `ID Pickup Scheduled`;
            body = `Hello ${user.fullname},\n\nYour ID is scheduled for pickup on ${pickup_date}${batch ? ` (Batch: ${batch})` : ""}.\n\nRemarks: ${remarks || ""}\n\nPlease check the Track Status page for updates.\n\nRegards,\nIDLink Team`;
          }

          try {
            const info = await mailTransporter.sendMail({
              from: process.env.FROM_EMAIL || process.env.SMTP_USER,
              to: user.email,
              subject,
              text: body,
            });

            const preview = nodemailer.getTestMessageUrl(info);
            console.log("Notification email sent:", info.response || info);
            if (preview) console.log("Preview URL:", preview);
            return res.json({ message: "Application updated and user notified", preview });
          } catch (mailErr) {
            console.error("Failed to send notification email:", mailErr);
            return res.status(200).json({ message: "Application updated but failed to send email", error: mailErr.message });
          }
        }

        // Mail transporter not configured, but still return success
        res.json({ message: "Application updated and user notified (no transporter)" });
      });
    } else {
      res.json({ message: "Application updated successfully" });
    }
  });
});

// DELETE application
app.delete("/api/applications/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM applications WHERE id = ?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Application deleted successfully" });
  });
});

// Development helper: send a test email (body: { to })
app.post('/api/test-email', express.json(), async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ message: 'Recipient (to) is required' });
  if (!mailTransporter) return res.status(500).json({ message: 'Mail transporter not configured' });

  try {
    const info = await mailTransporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: 'IDLink Test Email',
      text: 'This is a test email from IDLink backend.',
    });

    const preview = nodemailer.getTestMessageUrl(info);
    res.json({ message: 'Email sent', preview });
  } catch (err) {
    console.error('Test email failed:', err);
    res.status(500).json({ message: 'Failed to send test email', error: err.message });
  }
});

// Mailer status
app.get('/api/mailer-status', (req, res) => {
  res.json(mailerInfo);
});

// Send custom email
app.post('/api/send-email', express.json(), async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) return res.status(400).json({ message: 'to, subject and text are required' });
  if (!mailTransporter) return res.status(500).json({ message: 'Mail transporter not configured' });

  try {
    const info = await mailTransporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    const preview = nodemailer.getTestMessageUrl(info);
    res.json({ message: 'Email sent', preview });
  } catch (err) {
    console.error('Send email failed:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

// ---------------------- START SERVER ---------------------- //
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
