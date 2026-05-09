import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const MenuItemCard = ({ item, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {item.image || "🍽️"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
              item.is_available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.is_available ? "Available" : "Out of Stock"}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">{item.description || "No description"}</p>
        <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
        {item.discount_price && (
          <p className="text-sm text-gray-500 line-through">₹{item.discount_price}</p>
        )}
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={() => onEdit(item)}
        className="flex-1 py-2 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-medium"
      >
        <Edit className="w-3 h-3" />
        Edit
      </button>
      <button 
        onClick={() => onDelete(item)}
        className="py-2 px-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 flex items-center justify-center"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const PartnerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    image: '',
    is_veg: true,
    is_available: true,
    preparation_time: '',
    category_id: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    display_order: 0
  });

  const { token } = useAuth();

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/menu/items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        const error = await response.json();
        if (response.status === 404) {
          console.log('Restaurant profile not found - user needs to complete onboarding');
          setMenuItems([]);
          setNeedsOnboarding(true);
        } else {
          console.error('Error fetching menu items:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const error = await response.json();
        if (response.status === 404) {
          console.log('Restaurant profile not found - user needs to complete onboarding');
          setCategories([]);
          setNeedsOnboarding(true);
        } else {
          console.error('Error fetching categories:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Add new menu item
  const handleAddItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/menu/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        }),
      });
      
      if (response.ok) {
        setShowModal(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          discount_price: '',
          category_id: '',
          is_veg: false,
          is_available: true,
          preparation_time: 20,
          image: ''
        });
        fetchMenuItems(); // Refresh items
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/menu/items/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          fetchMenuItems(); // Refresh items
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });
      
      if (response.ok) {
        setShowCategoryModal(false);
        setCategoryFormData({ name: '', display_order: 0 });
        fetchCategories(); // Refresh categories
      } else {
        const error = await response.json();
        if (response.status === 404 && error.detail?.includes('Restaurant profile not found')) {
          alert('Please complete your restaurant profile first before adding menu items. Go to the Restaurant Profile section to complete onboarding.');
        } else {
          alert('Error adding category: ' + (error.detail || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  // Edit menu item (placeholder)
  const handleEditItem = (item) => {
    console.log('Edit item:', item);
    // TODO: Implement edit functionality
  };

  useEffect(() => {
    if (token) {
      Promise.all([fetchMenuItems(), fetchCategories()]).finally(() => {
        setLoading(false);
      });
    }
  }, [token]);

  // Filter items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Items' || 
                           categories.find(cat => cat.id === item.category_id)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category options for tabs
  const categoryOptions = ['All Items', ...categories.map(cat => cat.name)];

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading menu items...</div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 max-w-md text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Profile Required</h2>
          <p className="text-gray-600 mb-6">
            Please complete your restaurant profile first before you can manage menu items. Go to the Restaurant Profile section to add your restaurant details.
          </p>
          <button 
            onClick={() => window.location.href = '/partner/dashboard/settings'}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Complete Restaurant Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Menu Items</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCategoryModal(true)}
              className="px-3 py-2 lg:px-4 lg:py-3 bg-gray-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-medium"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              Add Category
            </button>
            <button 
              onClick={() => {
                if (categories.length === 0) {
                  alert('Please create a category first before adding menu items.');
                  setShowCategoryModal(true);
                } else {
                  setShowModal(true);
                }
              }}
              className="px-3 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-medium"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              Add Item
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categoryOptions.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm lg:text-base font-medium whitespace-nowrap transition-colors ${
              category === selectedCategory
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items - Responsive Layout */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No menu items found</div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <>
            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
            
            {/* Mobile: List Layout */}
            <div className="lg:hidden space-y-3">
              {filteredItems.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Menu Item</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                  <input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                <input
                  type="number"
                  value={formData.preparation_time}
                  onChange={(e) => setFormData({...formData, preparation_time: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Optional"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_veg}
                    onChange={(e) => setFormData({...formData, is_veg: e.target.checked})}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Category</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Main Course, Starters, Desserts"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={categoryFormData.display_order}
                  onChange={(e) => setCategoryFormData({...categoryFormData, display_order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Order in which this category appears"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnerMenu;
