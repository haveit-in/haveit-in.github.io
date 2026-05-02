import { Link, useNavigate } from "react-router";
import { Store, Upload, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const sections = [
  { id: "basic", name: "Basic Details" },
  { id: "restaurant", name: "Restaurant Info" },
  { id: "documents", name: "Documents" },
  { id: "bank", name: "Bank Details" },
];

export function RegistrationPage() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cuisine: [],
    fssai: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
  });
  const [activeSection, setActiveSection] = useState("basic");
  const navigate = useNavigate();
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/partner/waiting-approval");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="hidden lg:block w-80 fixed h-screen bg-gradient-to-br from-orange-50 to-white border-r border-gray-200 p-8">
          <Link to="/" className="flex items-center gap-3 mb-12">
              <img 
                src="/image/22.png" 
                alt="HaveIt Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-semibold">
                <span className="text-orange-500">HaveIt</span>{' '}
                <span className="text-gray-900">Partner</span>
              </span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold mb-2">Register Your Restaurant</h2>
            <p className="text-gray-600 mb-8">Partner with HaveIt and grow your business</p>

            <nav className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-white shadow-sm border border-orange-200"
                      : "hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        activeSection === section.id
                          ? "bg-orange-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={activeSection === section.id ? "font-medium" : ""}>
                      {section.name}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-80">
          <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/image/22.png" 
                alt="HaveIt Logo" 
                className="h-8 w-auto"
              />
              <span className="font-semibold">
                <span className="text-orange-500">HaveIt</span>{' '}
                <span className="text-gray-900">Partner</span>
              </span>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 lg:p-12">
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-bold mb-2">Register Your Restaurant</h1>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            <div
              id="basic"
              ref={(el) => (sectionRefs.current.basic = el)}
              className="mb-16 scroll-mt-8"
            >
              <h2 className="text-2xl font-bold mb-6">Basic Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    placeholder="e.g., Spice Garden Restaurant"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Full name as per documents"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              id="restaurant"
              ref={(el) => (sectionRefs.current.restaurant = el)}
              className="mb-16 scroll-mt-8"
            >
              <h2 className="text-2xl font-bold mb-6">Restaurant Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Complete Address *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your restaurant's complete address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Mumbai, Bangalore, Delhi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-3">Cuisine Type(s) *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["North Indian", "South Indian", "Chinese", "Continental", "Italian", "Fast Food"].map((cuisine) => (
                      <label
                        key={cuisine}
                        className={`flex items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.cuisine.includes(cuisine)
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.cuisine.includes(cuisine)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, cuisine: [...formData.cuisine, cuisine] });
                            } else {
                              setFormData({
                                ...formData,
                                cuisine: formData.cuisine.filter((c) => c !== cuisine),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-2">FSSAI License Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.fssai}
                    onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                    placeholder="14-digit FSSAI license number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your FSSAI license is required to partner with us
                  </p>
                </div>
              </div>
            </div>

            <div
              id="documents"
              ref={(el) => (sectionRefs.current.documents = el)}
              className="mb-16 scroll-mt-8"
            >
              <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-3">Restaurant Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 mb-1">
                      Click to upload restaurant images
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB (Max 5 images)</p>
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-3">Menu Card</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 mb-1">Click to upload menu</p>
                    <p className="text-sm text-gray-500">PDF, PNG, or JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="bank"
              ref={(el) => (sectionRefs.current.bank = el)}
              className="mb-16 scroll-mt-8"
            >
              <h2 className="text-2xl font-bold mb-6">Bank Details</h2>
              <p className="text-gray-600 mb-6">
                This information is needed to process your payments
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    placeholder="Name as per bank account"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, accountNumber: e.target.value })
                      }
                      placeholder="Bank account number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      placeholder="e.g., SBIN0001234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 lg:-mx-12 px-6 lg:px-12 py-6 mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-orange-600 hover:underline">
                    terms and conditions
                  </a>
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to="/"
                    className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Submit Application
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default RegistrationPage;
