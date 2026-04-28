import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";

export default function Step1({ formData, setFormData, errors, setErrors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
        <input
          type="text"
          value={formData.restaurantName}
          onChange={(e) => {
            setFormData({ ...formData, restaurantName: e.target.value });
            if (errors.restaurantName) {
              setErrors({ ...errors, restaurantName: "" });
            }
          }}
          placeholder="Enter restaurant name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.restaurantName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.restaurantName && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.restaurantName}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
        <input
          type="text"
          value={formData.ownerName}
          onChange={(e) => {
            setFormData({ ...formData, ownerName: e.target.value });
            if (errors.ownerName) {
              setErrors({ ...errors, ownerName: "" });
            }
          }}
          placeholder="Enter owner name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.ownerName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.ownerName && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.ownerName}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) {
              setErrors({ ...errors, email: "" });
            }
          }}
          placeholder="restaurant@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.email ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.email && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            setFormData({ ...formData, phone: e.target.value });
            if (errors.phone) {
              setErrors({ ...errors, phone: "" });
            }
          }}
          placeholder="+91 98765 43210"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.phone ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.phone && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
