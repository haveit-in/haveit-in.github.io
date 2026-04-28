import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";

export default function Step4({ formData, setFormData, errors, setErrors }) {
  const validateAccountNumber = (accountNumber) => {
    return /^\d{9,18}$/.test(accountNumber);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, accountNumber: value });
            
            // Real-time validation
            if (value.trim() && !validateAccountNumber(value)) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, accountNumber: "Account number should be 9-18 digits" } }));
            } else if (errors.accountNumber) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, accountNumber: "" } }));
            }
          }}
          placeholder="Enter account number"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.accountNumber ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.accountNumber && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.accountNumber}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
        <input
          type="text"
          value={formData.ifsc}
          onChange={(e) => {
            setFormData({ ...formData, ifsc: e.target.value });
            if (errors.ifsc) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, ifsc: "" } }));
            }
          }}
          placeholder="Enter IFSC code (e.g., SBIN0001234)"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.ifsc ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.ifsc && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.ifsc}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
        <input
          type="text"
          value={formData.accountHolder}
          onChange={(e) => {
            setFormData({ ...formData, accountHolder: e.target.value });
            if (errors.accountHolder) {
              setFormData(prev => ({ ...prev, errors: { ...prev.errors, accountHolder: "" } }));
            }
          }}
          placeholder="Enter account holder name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
            errors.accountHolder ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.accountHolder && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.accountHolder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
