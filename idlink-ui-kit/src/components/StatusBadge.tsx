import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

export type StatusType =
  | "submitted"
  | "under_review"
  | "approved"
  | "returned"
  | "expired"
  | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    variant: "default" as const,
    icon: Clock,
    className: "bg-info text-info-foreground",
  },
  under_review: {
    label: "Under Review",
    variant: "default" as const,
    icon: AlertCircle,
    className: "bg-warning text-warning-foreground",
  },
  approved: {
    label: "Approved",
    variant: "default" as const,
    icon: CheckCircle,
    className: "bg-success text-success-foreground",
  },
  returned: {
    label: "Returned",
    variant: "default" as const,
    icon: XCircle,
    className: "bg-destructive text-destructive-foreground",
  },
  rejected: {
    label: "Rejected",
    variant: "default" as const,
    icon: XCircle,
    className: "bg-destructive text-destructive-foreground",
  },
  expired: {
    label: "Expired",
    variant: "default" as const,
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground",
  },
};

const StatusBadge = ({ status, showIcon = true }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge {...{ className: `${config.className} gap-1` }} variant={config.variant}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
