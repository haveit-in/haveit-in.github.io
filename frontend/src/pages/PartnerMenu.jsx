import { Plus, Search, Edit, Trash2 } from "lucide-react";

const menuItems = [
  { id: 1, name: "Paneer Butter Masala", category: "Main Course", price: "₹280", status: "Available", image: "🍛" },
  { id: 2, name: "Biryani", category: "Rice", price: "₹350", status: "Available", image: "🍚" },
  { id: 3, name: "Masala Dosa", category: "South Indian", price: "₹120", status: "Available", image: "🫓" },
  { id: 4, name: "Chicken Tikka", category: "Starters", price: "₹320", status: "Available", image: "🍗" },
  { id: 5, name: "Dal Makhani", category: "Main Course", price: "₹240", status: "Out of Stock", image: "🍲" },
  { id: 6, name: "Gulab Jamun", category: "Desserts", price: "₹80", status: "Available", image: "🍮" },
];

const MenuItemCard = ({ item }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {item.image}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
              item.status === "Available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.status}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">{item.category}</p>
        <p className="text-lg font-bold text-orange-600">{item.price}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 py-2 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-medium">
        <Edit className="w-3 h-3" />
        Edit
      </button>
      <button className="py-2 px-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 flex items-center justify-center">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const PartnerMenu = () => {
  return (
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Menu Items</h2>
          <button className="px-3 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-medium">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Add Item
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All Items', 'Main Course', 'Starters', 'Rice', 'Desserts'].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-xl text-sm lg:text-base font-medium whitespace-nowrap transition-colors ${
              category === 'All Items'
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
        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
        
        {/* Mobile: List Layout */}
        <div className="lg:hidden space-y-3">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerMenu;
