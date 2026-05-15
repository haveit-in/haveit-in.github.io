import { Store, User, DollarSign, Clock, Star, FileText, CheckCircle, XCircle, Edit3, Check, AlertCircle, MapPin, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
  const icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;
  const Icon = icon;

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} ${textColor} shadow-lg z-50`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100 last:border-0">
    <label className="col-span-1 text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
    <div className="col-span-2 text-sm text-gray-700 font-medium">{value || '—'}</div>
  </div>
);

const EditableField = ({ label, value, onChange, type = "text", required = false }) => (
  <div className="mb-6">
    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
    />
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
      active
        ? 'text-orange-600 border-orange-600'
        : 'text-gray-600 border-transparent hover:text-gray-900'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const SectionCard = ({ icon: Icon, title, subtitle, children, isEditing, onEdit, onCancel, onSave, isSaving }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {!isEditing && onEdit && (
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {children}
      </div>
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>
);

const PartnerSettings = () => {
  const { token } = useAuth();
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Editable states for Bank Details
  const [bankData, setBankData] = useState({
    account_number: '',
    ifsc: '',
    account_holder: '',
  });

  // Editable states for Owner Information
  const [ownerData, setOwnerData] = useState({
    owner_name: '',
  });

  useEffect(() => {
    fetchRestaurantProfile();
  }, [token]);

  const fetchRestaurantProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/restaurant/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant profile');
      }

      const data = await response.json();
      setRestaurantData(data);
      setBankData({
        account_number: data.account_number || '',
        ifsc: data.ifsc || '',
        account_holder: data.account_holder || '',
      });
      setOwnerData({
        owner_name: data.owner_name || '',
      });
    } catch (err) {
      setError(err.message);
      setToast({ message: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    // Reset to original values
    if (restaurantData) {
      setBankData({
        account_number: restaurantData.account_number || '',
        ifsc: restaurantData.ifsc || '',
        account_holder: restaurantData.account_holder || '',
      });
      setOwnerData({
        owner_name: restaurantData.owner_name || '',
      });
    }
  };

  const handleSaveChanges = async (section) => {
    try {
      setSaving(true);
      
      const updateData = {
        restaurant_name: restaurantData.restaurant_name,
        owner_name: section === 'owner' ? ownerData.owner_name : restaurantData.owner_name,
        email: restaurantData.email,
        phone: restaurantData.phone,
        address: restaurantData.address,
        city: restaurantData.city,
        cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine : [restaurantData.cuisine],
        fssai: restaurantData.fssai,
        account_number: section === 'bank' ? bankData.account_number : restaurantData.account_number,
        ifsc: section === 'bank' ? bankData.ifsc : restaurantData.ifsc,
        account_holder: section === 'bank' ? bankData.account_holder : restaurantData.account_holder,
      };

      const response = await fetch('http://localhost:8000/restaurant/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update local state
      if (section === 'bank') {
        setRestaurantData(prev => ({
          ...prev,
          account_number: bankData.account_number,
          ifsc: bankData.ifsc,
          account_holder: bankData.account_holder,
        }));
      } else if (section === 'owner') {
        setRestaurantData(prev => ({
          ...prev,
          owner_name: ownerData.owner_name,
        }));
      }

      setEditingSection(null);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error && !restaurantData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Error Loading Settings</p>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={fetchRestaurantProfile}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="text-gray-600 font-medium">No restaurant profile found</p>
      </div>
    );
  }

  const cuisineList = Array.isArray(restaurantData.cuisine) 
    ? restaurantData.cuisine.join(', ') 
    : restaurantData.cuisine || '—';

  const createdDate = restaurantData.created_at 
    ? new Date(restaurantData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const approvedDate = restaurantData.approved_at 
    ? new Date(restaurantData.approved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600 text-sm">Manage your restaurant profile and business details</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8 text-white">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{restaurantData.restaurant_name}</h2>
                <div className="flex items-center gap-2 text-orange-100">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurantData.address}, {restaurantData.city}</span>
                </div>
              </div>
              <StatusBadge status={restaurantData.status} />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-8 overflow-x-auto">
            <div className="flex gap-4">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={Store}
                label="Overview"
              />
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                icon={SettingsIcon}
                label="Edit Settings"
              />
              <TabButton
                active={activeTab === 'metrics'}
                onClick={() => setActiveTab('metrics')}
                icon={Star}
                label="Metrics"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(100vh-400px)] overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Restaurant Information</h3>
                  <div className="space-y-4">
                    <ReadOnlyField label="Restaurant ID" value={restaurantData.id} />
                    <ReadOnlyField label="Cuisine Types" value={cuisineList} />
                    <ReadOnlyField label="Phone" value={restaurantData.phone} />
                    <ReadOnlyField label="Email" value={restaurantData.email} />
                    <ReadOnlyField label="FSSAI License" value={restaurantData.fssai} />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Operational Details</h3>
                  <div className="space-y-4">
                    <ReadOnlyField label="Delivery Time" value={restaurantData.delivery_time} />
                    <ReadOnlyField label="Delivery Fee" value={`₹${restaurantData.delivery_fee}`} />
                    <ReadOnlyField label="Delivery Radius" value={`${restaurantData.delivery_radius_km} km`} />
                    <ReadOnlyField label="Minimum Order" value={`₹${restaurantData.minimum_order}`} />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Owner Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Owner Information</h3>
                        <p className="text-xs text-gray-600 mt-0.5">Manage owner details</p>
                      </div>
                    </div>
                    {!editingSection || editingSection !== 'owner' ? (
                      <button
                        onClick={() => handleEditClick('owner')}
                        className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5 text-blue-600" />
                      </button>
                    ) : null}
                  </div>

                  {editingSection === 'owner' ? (
                    <div className="bg-white rounded-lg p-6 space-y-4 border border-blue-200">
                      <EditableField
                        label="Owner Name"
                        value={ownerData.owner_name}
                        onChange={(e) => setOwnerData({ ...ownerData, owner_name: e.target.value })}
                      />
                      <div className="flex gap-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => handleSaveChanges('owner')}
                          disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          <Check className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 border border-blue-200">
                      <ReadOnlyField label="Owner Name" value={restaurantData.owner_name} />
                    </div>
                  )}
                </div>

                {/* Bank Details Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Bank Account Details</h3>
                        <p className="text-xs text-gray-600 mt-0.5">Payment information</p>
                      </div>
                    </div>
                    {!editingSection || editingSection !== 'bank' ? (
                      <button
                        onClick={() => handleEditClick('bank')}
                        className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5 text-green-600" />
                      </button>
                    ) : null}
                  </div>

                  {editingSection === 'bank' ? (
                    <div className="bg-white rounded-lg p-6 space-y-4 border border-green-200">
                      <EditableField
                        label="Account Number"
                        value={bankData.account_number}
                        onChange={(e) => setBankData({ ...bankData, account_number: e.target.value })}
                      />
                      <EditableField
                        label="IFSC Code"
                        value={bankData.ifsc}
                        onChange={(e) => setBankData({ ...bankData, ifsc: e.target.value })}
                      />
                      <EditableField
                        label="Account Holder Name"
                        value={bankData.account_holder}
                        onChange={(e) => setBankData({ ...bankData, account_holder: e.target.value })}
                      />
                      <div className="flex gap-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => handleSaveChanges('bank')}
                          disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          <Check className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 space-y-4 border border-green-200">
                      <ReadOnlyField label="Account Number" value={restaurantData.account_number} />
                      <ReadOnlyField label="IFSC Code" value={restaurantData.ifsc} />
                      <ReadOnlyField label="Account Holder Name" value={restaurantData.account_holder} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
                  <div className="space-y-4">
                    <ReadOnlyField label="Rating" value={`${restaurantData.rating} / 5.0`} />
                    <ReadOnlyField label="Total Reviews" value={restaurantData.total_reviews} />
                    <ReadOnlyField label="Status" value={restaurantData.is_open ? '🟢 Open' : '🔴 Closed'} />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Application Timeline</h3>
                  <div className="space-y-4">
                    <ReadOnlyField label="Profile Created" value={createdDate} />
                    <ReadOnlyField label="Approved Date" value={approvedDate} />
                    <ReadOnlyField label="Current Status" value={restaurantData.status} />
                    {restaurantData.rejection_reason && (
                      <ReadOnlyField label="Rejection Reason" value={restaurantData.rejection_reason} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerSettings;
