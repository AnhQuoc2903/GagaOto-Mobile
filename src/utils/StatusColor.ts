// src/utils/StatusColor.ts
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "DONE":
      return "#10b981";
    case "IN_PROGRESS":
      return "#f59e0b";
    case "CANCELLED":
      return "#ef4444";
    case "PENDING":
      return "#6b7280";
    default:
      return "#64748b";
  }
};

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case "DONE":
      return "#d1fae5";
    case "IN_PROGRESS":
      return "#fed7aa";
    case "CANCELLED":
      return "#fee2e2";
    case "PENDING":
      return "#f3f4f6";
    default:
      return "#f1f5f9";
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case "PAID":
      return "#10b981";
    case "PARTIAL":
      return "#f59e0b";
    case "UNPAID":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "#ef4444";
    case "MEDIUM":
      return "#f59e0b";
    case "LOW":
      return "#10b981";
    default:
      return "#64748b";
  }
};
