import { Save, Bell, Store, User, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const SettingsSection = ({ icon: Icon, title, iconColor, children }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const ToggleSwitch = ({ label, description, defaultChecked = false }) => (
  <label className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </div>
    <div className="relative">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
    </div>
  </label>
);

const PartnerSettings = () => {
  const { token } = useAuth();
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRestaurantProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center">Loading restaurant details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center">No restaurant profile found</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
      {/* Desktop: Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Restaurant Details */}
        <SettingsSection 
          icon={Store} 
          title="Restaurant Details" 
          iconColor="bg-orange-500"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
              <input
                type="text"
                defaultValue={restaurantData.restaurant_name || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                defaultValue={restaurantData.address || ''}
                rows={3}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={restaurantData.phone || ''}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={restaurantData.email || ''}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Owner Information */}
        <SettingsSection 
          icon={User} 
          title="Owner Information" 
          iconColor="bg-blue-500"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
              <input
                type="text"
                defaultValue={restaurantData.owner_name || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License</label>
              <input
                type="text"
                defaultValue={restaurantData.fssai || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection 
          icon={Bell} 
          title="Notifications" 
          iconColor="bg-purple-500"
        >
          <div className="space-y-0">
            <ToggleSwitch 
              label="New Order Alerts"
              description="Receive notifications for new orders"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Payment Updates"
              description="Get notified about settlements and payouts"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Marketing Updates"
              description="Receive promotional and marketing emails"
              defaultChecked={false}
            />
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection 
          icon={Lock} 
          title="Security" 
          iconColor="bg-red-500"
        >
          <button className="w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left text-sm font-medium">
            Change Password
          </button>
        </SettingsSection>
      </div>

      {/* Mobile: List Layout */}
      <div className="lg:hidden space-y-4">
        {/* Restaurant Details */}
        <SettingsSection 
          icon={Store} 
          title="Restaurant Details" 
          iconColor="bg-orange-500"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Restaurant Name</label>
              <input
                type="text"
                defaultValue={restaurantData.restaurant_name || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Address</label>
              <textarea
                defaultValue={restaurantData.address || ''}
                rows={3}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={restaurantData.phone || ''}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={restaurantData.email || ''}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Owner Information */}
        <SettingsSection 
          icon={User} 
          title="Owner Information" 
          iconColor="bg-blue-500"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Owner Name</label>
              <input
                type="text"
                defaultValue={restaurantData.owner_name || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">FSSAI License</label>
              <input
                type="text"
                defaultValue={restaurantData.fssai || ''}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection 
          icon={Bell} 
          title="Notifications" 
          iconColor="bg-purple-500"
        >
          <div className="space-y-0">
            <ToggleSwitch 
              label="New Order Alerts"
              description="Receive notifications for new orders"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Payment Updates"
              description="Get notified about settlements and payouts"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Marketing Updates"
              description="Receive promotional and marketing emails"
              defaultChecked={false}
            />
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection 
          icon={Lock} 
          title="Security" 
          iconColor="bg-red-500"
        >
          <button className="w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left text-sm font-medium">
            Change Password
          </button>
        </SettingsSection>
      </div>

      {/* Save Button */}
      <button className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium">
        <Save className="w-5 h-5" />
        Save Changes
      </button>
    </div>
  );
}

export default PartnerSettings;
