import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Search, Users as UsersIcon, UserCheck, UserX, Mail, Phone, Shield, User } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { getAuthHeaders } = useAuth();

  const roleConfig = {
    admin: {
      className: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Admin",
      icon: Shield,
    },
    restaurant_owner: {
      className: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Partner",
      icon: User,
    },
    user: {
      className: "bg-green-100 text-green-700 border-green-200",
      label: "Customer",
      icon: User,
    },
  };

  const statusConfig = {
    active: {
      className: "bg-green-100 text-green-700 border-green-200",
      label: "Active",
    },
    inactive: {
      className: "bg-slate-100 text-slate-700 border-slate-200",
      label: "Inactive",
    },
    blocked: {
      className: "bg-red-100 text-red-700 border-red-200",
      label: "Blocked",
    },
  };

  const mockUsers = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 234 567 8900",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "active",
      role: "user",
      totalOrders: 47,
      totalSpent: "$1,245.80",
      joinedDate: "2025-11-15",
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 234 567 8901",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      status: "active",
      role: "restaurant_owner",
      totalOrders: 0,
      totalSpent: "$0.00",
      joinedDate: "2025-12-03",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "+1 234 567 8902",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      status: "active",
      role: "user",
      totalOrders: 28,
      totalSpent: "$674.30",
      joinedDate: "2026-01-08",
    },
    {
      id: "4",
      name: "Alex Brown",
      email: "alex.brown@email.com",
      phone: "+1 234 567 8903",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      status: "inactive",
      role: "user",
      totalOrders: 15,
      totalSpent: "$345.20",
      joinedDate: "2025-10-22",
    },
    {
      id: "5",
      name: "Lisa Garcia",
      email: "lisa.garcia@email.com",
      phone: "+1 234 567 8904",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      status: "active",
      role: "restaurant_owner",
      totalOrders: 0,
      totalSpent: "$0.00",
      joinedDate: "2025-09-14",
    },
    {
      id: "6",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 234 567 8905",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      status: "blocked",
      role: "user",
      totalOrders: 8,
      totalSpent: "$156.40",
      joinedDate: "2026-02-10",
    },
    {
      id: "7",
      name: "Sophie Martin",
      email: "sophie.m@email.com",
      phone: "+1 234 567 8906",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      status: "active",
      role: "user",
      totalOrders: 41,
      totalSpent: "$1,023.60",
      joinedDate: "2025-11-28",
    },
    {
      id: "8",
      name: "Admin User",
      email: "admin@haveit.com",
      phone: "+1 234 567 8999",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      status: "active",
      role: "admin",
      totalOrders: 0,
      totalSpent: "$0.00",
      joinedDate: "2025-01-01",
    },
  ];

  const fetchUsers = useCallback(async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          // Use mock data if API fails
          setUsers(mockUsers);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        // Use mock data as fallback
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    }, [getAuthHeaders]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: UsersIcon,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Blocked Users",
      value: users.filter((u) => u.status === "blocked").length,
      icon: UserX,
      color: "from-red-500 to-red-600",
    },
  ];

  const RoleBadge = ({ role }) => {
    const config = roleConfig[role];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[status]?.className || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {statusConfig[status]?.label || status}
    </span>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="p-6 pb-4">
      {children}
    </div>
  );

  const CardContent = ({ children }) => (
    <div className="p-6 pt-0">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-900">
      {children}
    </h3>
  );

  const CardDescription = ({ children }) => (
    <p className="text-sm text-slate-500 mt-1">
      {children}
    </p>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 mt-1">Manage platform users and customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="restaurant_owner">Partners</option>
                <option value="user">Customers</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No users found matching your search
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  {/* User Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <RoleBadge role={user.role} />
                      <StatusBadge status={user.status} />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div>
                      <p className="text-xs text-slate-500">Total Orders</p>
                      <p className="font-semibold text-slate-900">{user.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total Spent</p>
                      <p className="font-semibold text-slate-900">{user.totalSpent}</p>
                    </div>
                  </div>

                  {/* Joined Date & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Joined {new Date(user.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-orange-200 text-xs font-medium rounded-lg text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      No users found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                            <span className="text-white font-semibold text-sm">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        {user.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {user.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {new Date(user.joinedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-orange-200 text-xs font-medium rounded-lg text-orange-600 bg-white hover:bg-orange-50"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
