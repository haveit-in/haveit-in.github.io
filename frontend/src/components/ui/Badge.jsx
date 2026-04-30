import React from "react";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border";
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    preparing: "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-slate-100 text-slate-700 border-slate-200",
    blocked: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, config = {} }) => {
  const defaultConfig = {
    pending: { variant: "pending", label: "Pending" },
    preparing: { variant: "preparing", label: "Preparing" },
    "in-transit": { variant: "info", label: "In Transit" },
    delivered: { variant: "delivered", label: "Delivered" },
    cancelled: { variant: "cancelled", label: "Cancelled" },
    active: { variant: "active", label: "Active" },
    inactive: { variant: "inactive", label: "Inactive" },
    blocked: { variant: "blocked", label: "Blocked" },
  };

  const statusConfig = config[status] || defaultConfig[status] || { variant: "default", label: status };
  
  return (
    <Badge variant={statusConfig.variant} className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  );
};

export const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: { variant: "info", label: "Admin" },
    restaurant_owner: { variant: "info", label: "Partner" },
    user: { variant: "success", label: "Customer" },
  };

  const config = roleConfig[role] || { variant: "default", label: role };
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
