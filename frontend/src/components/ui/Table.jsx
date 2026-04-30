import React from "react";

export const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-slate-50 border-b border-slate-200">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-slate-200">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = "" }) => (
  <tr className={`hover:bg-slate-50 ${className}`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = "" }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
    {children}
  </td>
);

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && (
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-slate-500 text-sm mb-4">{description}</p>
    {action}
  </div>
);
