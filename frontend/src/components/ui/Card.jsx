import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-slate-900">
    {children}
  </h3>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-slate-500 mt-1">
    {children}
  </p>
);
