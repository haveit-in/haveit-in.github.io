import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";

export default function Step2({ formData, setFormData, errors, setErrors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => {
            setFormData({ ...formData, address: e.target.value });
            if (errors.address) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, address: "" } }));
            }
          }}
          placeholder="Enter complete address"
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.address ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.address && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.address}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => {
            setFormData({ ...formData, city: e.target.value });
            if (errors.city) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, city: "" } }));
            }
          }}
          placeholder="Enter city"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.city ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.city && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.city}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
        <div className={`grid grid-cols-2 gap-3 ${errors.cuisine ? "border border-red-500 rounded-lg p-2" : ""}`}>
          {["North Indian", "South Indian", "Chinese", "Continental", "Italian", "Fast Food"].map((cuisine) => (
            <label key={cuisine} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-orange-500 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.cuisine.includes(cuisine)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, cuisine: [...formData.cuisine, cuisine] });
                  } else {
                    setFormData({ ...formData, cuisine: formData.cuisine.filter((c) => c !== cuisine) });
                  }
                  if (errors.cuisine) {
                    setFormData(prev => ({ ...prev, errors: { ...prev.errors, cuisine: "" } }));
                  }
                }}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{cuisine}</span>
            </label>
          ))}
        </div>
        {errors.cuisine && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.cuisine}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License Number</label>
        <input
          type="text"
          value={formData.fssai}
          onChange={(e) => {
            setFormData({ ...formData, fssai: e.target.value });
            if (errors.fssai) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, fssai: "" } }));
            }
          }}
          placeholder="Enter FSSAI license number"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.fssai ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.fssai && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.fssai}</span>
          </div>
        )}
      </div>
    </div>
  );
}
