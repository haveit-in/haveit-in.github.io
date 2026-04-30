import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false, 
  className = "", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500",
    outline: "bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 focus:ring-orange-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-sm",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const IconButton = ({ children, variant = "ghost", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-sm",
    outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500",
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
