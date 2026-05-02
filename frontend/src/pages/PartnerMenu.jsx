import { Plus, Search, Edit, Trash2 } from "lucide-react";

const menuItems = [
  { id: 1, name: "Paneer Butter Masala", category: "Main Course", price: "₹280", status: "Available", image: "🍛" },
  { id: 2, name: "Biryani", category: "Rice", price: "₹350", status: "Available", image: "🍚" },
  { id: 3, name: "Masala Dosa", category: "South Indian", price: "₹120", status: "Available", image: "🫓" },
  { id: 4, name: "Chicken Tikka", category: "Starters", price: "₹320", status: "Available", image: "🍗" },
  { id: 5, name: "Dal Makhani", category: "Main Course", price: "₹240", status: "Out of Stock", image: "🍲" },
  { id: 6, name: "Gulab Jamun", category: "Desserts", price: "₹80", status: "Available", image: "🍮" },
];

const PartnerMenu = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Menu</h1>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
        <p className="text-gray-600">Manage your restaurant menu items</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {menuItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-3xl">
                  {item.image}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.category}</p>
              <p className="text-xl font-bold text-orange-600 mb-4">{item.price}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerMenu;
