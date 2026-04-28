export default function Step3({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer">
          <p className="text-gray-600">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB (Max 5 images)</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Upload</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer">
          <p className="text-gray-600">Click to upload menu</p>
          <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
