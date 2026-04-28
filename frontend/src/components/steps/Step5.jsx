export default function Step5({ formData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Restaurant Name</p>
          <p className="font-medium">{formData.restaurantName || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Owner Name</p>
          <p className="font-medium">{formData.ownerName || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{formData.email || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Phone</p>
          <p className="font-medium">{formData.phone || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="font-medium">{formData.address || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">City</p>
          <p className="font-medium">{formData.city || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Cuisine Types</p>
          <p className="font-medium">{formData.cuisine.join(", ") || "Not selected"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">FSSAI License</p>
          <p className="font-medium">{formData.fssai || "Not provided"}</p>
        </div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          By submitting, you agree to our terms and conditions. Your application will be reviewed within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
