import { Link, useNavigate } from "react-router";
import { Store, Upload, ChevronRight, Check, X, Clock, FileText, Image as ImageIcon, Menu as MenuIcon, AlertCircle, CheckCircle2, UploadCloud, Eye, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const steps = [
  { id: 1, name: "Restaurant Details", icon: Store },
  { id: 2, name: "Documents Upload", icon: Upload },
  { id: 3, name: "Menu & Cuisine", icon: MenuIcon },
  { id: 4, name: "Bank Details", icon: FileText },
  { id: 5, name: "Review & Submit", icon: Check },
];

const cuisineOptions = [
  "North Indian", "South Indian", "Chinese", "Continental", "Italian",
  "Fast Food", "Biryani", "Street Food", "Desserts", "Beverages",
  "Healthy", "Seafood", "Mexican", "Thai", "Japanese"
];

export function RegistrationPage() {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Restaurant Details
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    fssai: "",

    // Documents
    documents: {
      fssaiCertificate: { file: null, status: 'pending', url: null },
      panCard: { file: null, status: 'pending', url: null },
      bankProof: { file: null, status: 'pending', url: null },
      restaurantImages: { files: [], status: 'pending', urls: [] },
      menuUpload: { file: null, status: 'pending', url: null }
    },

    // Menu & Cuisine
    cuisine: [],
    foodType: "both",
    costForTwo: "",
    workingHours: {
      openingTime: "",
      closingTime: ""
    },

    // Bank Details
    accountNumber: "",
    ifsc: "",
    accountHolder: "",

    // Terms
    agreeToTerms: false
  });

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Navigation helpers
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    // Only allow clicking on completed steps or next step
    if (stepId <= currentStep || stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  // Document upload handlers
  const handleDocumentUpload = async (docType, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', docType);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/upload-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (docType === 'restaurantImages') {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            restaurantImages: {
              ...prev.documents.restaurantImages,
              files: [...prev.documents.restaurantImages.files, file],
              status: 'uploaded',
              urls: [...prev.documents.restaurantImages.urls, result.file_url]
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: {
              file,
              status: 'uploaded',
              url: result.file_url
            }
          }
        }));
      }
      showToast('Document uploaded successfully');
    } catch (error) {
      showToast('Upload failed. Please try again.', 'error');
    }
  };

  const handleDocumentRemove = (docType, index = null) => {
    if (docType === 'restaurantImages' && index !== null) {
      const newFiles = formData.documents.restaurantImages.files.filter((_, i) => i !== index);
      const newUrls = formData.documents.restaurantImages.urls.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          restaurantImages: {
            files: newFiles,
            urls: newUrls,
            status: newFiles.length > 0 ? 'uploaded' : 'pending'
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [docType]: {
            file: null,
            status: 'pending',
            url: null
          }
        }
      });
    }
    showToast('Document removed');
  };

  // Cuisine toggle
  const toggleCuisine = (cuisine) => {
    setFormData({
      ...formData,
      cuisine: formData.cuisine.includes(cuisine)
        ? formData.cuisine.filter(c => c !== cuisine)
        : [...formData.cuisine, cuisine]
    });
  };

  // Form validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.restaurantName && formData.ownerName && formData.email &&
               formData.phone && formData.address && formData.city && formData.fssai;
      case 2:
        return formData.documents.fssaiCertificate.file &&
               formData.documents.panCard.file &&
               formData.documents.bankProof.file &&
               formData.documents.restaurantImages.files.length > 0 &&
               formData.documents.menuUpload.file;
      case 3:
        return formData.cuisine.length > 0 && formData.foodType &&
               formData.costForTwo && formData.workingHours.openingTime &&
               formData.workingHours.closingTime;
      case 4:
        return formData.accountNumber && formData.ifsc && formData.accountHolder;
      case 5:
        return formData.agreeToTerms;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showToast('Please login first', 'error');
      navigate('/partner/login');
      return;
    }

    try {
      console.log('Submitting restaurant application:', formData);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_name: formData.restaurantName,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          cuisine: formData.cuisine,
          fssai: formData.fssai,
          account_number: formData.accountNumber,
          ifsc: formData.ifsc,
          account_holder: formData.accountHolder,
          food_type: formData.foodType,
          cost_for_two: formData.costForTwo,
          opening_time: formData.workingHours.openingTime,
          closing_time: formData.workingHours.closingTime,
          fssai_certificate_url: formData.documents.fssaiCertificate.url,
          pan_card_url: formData.documents.panCard.url,
          bank_proof_url: formData.documents.bankProof.url,
          restaurant_images_urls: formData.documents.restaurantImages.urls,
          menu_url: formData.documents.menuUpload.url,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Application submitted successfully:', result);
        showToast('Application submitted successfully!');
        setSubmitted(true);
      } else {
        console.error('Application submission failed:', result);
        showToast(result.detail || 'Failed to submit application. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showToast('Error submitting application. Please check your connection and try again.', 'error');
    }
  };

  // If submitted, show waiting approval screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Application Submitted Successfully</h1>
          <p className="text-gray-600 mb-6">Your restaurant application is under review</p>
          
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-orange-800">
              <strong>Estimated review time:</strong> 24–48 hours
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Restaurant details submitted</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Documents uploaded</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-700">Verification pending</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Documents are manually verified by the HaveIt onboarding team.
          </p>

          <Link
            to="/partner/dashboard"
            className="inline-block w-full px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Document Upload Card Component
  const DocumentUploadCard = ({ title, docType, icon: Icon, multiple = false, accept }) => {
    const docData = multiple ? formData.documents[docType] : formData.documents[docType];
    const hasFile = multiple ? docData.files.length > 0 : docData.file;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG • Max 5MB</p>
          </div>
        </div>

        {!hasFile ? (
          <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/50 cursor-pointer transition-all">
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleDocumentUpload(docType, file);
              }}
            />
          </label>
        ) : (
          <div className="space-y-3">
            {multiple ? (
              docData.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(docData.urls[index], '_blank')}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDocumentRemove(docType, index)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{docData.file.name}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(docData.url, '_blank')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDocumentRemove(docType)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )}
            {multiple && docData.files.length < 5 && (
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 hover:bg-orange-50/50 cursor-pointer transition-all">
                <UploadCloud className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">Add more images</p>
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleDocumentUpload(docType, file);
                  }}
                />
              </label>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Stepper - Desktop */}
        <aside className="hidden lg:block w-72 fixed h-screen bg-white border-r border-gray-100 p-8">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <img 
              src="/image/22.png" 
              alt="HaveIt Logo" 
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold">
              <span className="text-orange-500">HaveIt</span>{' '}
              <span className="text-gray-900">Partner</span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-1">Restaurant Onboarding</h2>
            <p className="text-sm text-gray-500">Complete your profile</p>
          </div>

          <nav className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200">
              <div 
                className="w-full bg-orange-500 transition-all duration-300"
                style={{ height: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`relative w-full text-left p-4 rounded-xl transition-all mb-2 ${
                  currentStep === step.id
                    ? "bg-orange-50"
                    : currentStep > step.id
                    ? "hover:bg-gray-50"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={step.id > currentStep + 1}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep === step.id
                        ? "bg-orange-600 text-white shadow-md"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      currentStep === step.id ? "text-orange-600" : "text-gray-700"
                    }`}>
                      {step.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Progress Percentage */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-orange-600">{Math.round((currentStep / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/image/22.png" 
                  alt="HaveIt Logo" 
                  className="h-7 w-auto"
                />
                <span className="font-semibold text-sm">
                  <span className="text-orange-500">HaveIt</span>{' '}
                  <span className="text-gray-900">Partner</span>
                </span>
              </Link>
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of 5
              </span>
            </div>
            {/* Mobile Progress Bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 lg:p-12 pb-32">
            {/* Step 1: Restaurant Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Restaurant Details</h1>
                  <p className="text-gray-600">Tell us about your restaurant</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Restaurant Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      placeholder="e.g., Spice Garden Restaurant"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Full name as per documents"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Complete Address *</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your restaurant's complete address"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-gray-700">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Mumbai, Bangalore, Delhi"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-gray-700">FSSAI License Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.fssai}
                      onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                      placeholder="14-digit FSSAI license number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Your FSSAI license is required to partner with us
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documents Upload */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Documents Upload</h1>
                  <p className="text-gray-600">Upload your restaurant documents</p>
                </div>

                <div className="space-y-4">
                  <DocumentUploadCard
                    title="FSSAI Certificate"
                    docType="fssaiCertificate"
                    icon={FileText}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <DocumentUploadCard
                    title="PAN Card"
                    docType="panCard"
                    icon={FileText}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <DocumentUploadCard
                    title="Bank Proof"
                    docType="bankProof"
                    icon={FileText}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <DocumentUploadCard
                    title="Restaurant Images"
                    docType="restaurantImages"
                    icon={ImageIcon}
                    multiple={true}
                    accept=".jpg,.jpeg,.png"
                  />
                  <DocumentUploadCard
                    title="Menu Upload"
                    docType="menuUpload"
                    icon={MenuIcon}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900 mb-1">Verification Note</p>
                      <p className="text-sm text-orange-800">
                        Documents are manually verified by the HaveIt onboarding team. Approval may take 24–48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Menu & Cuisine Setup */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Menu & Cuisine Setup</h1>
                  <p className="text-gray-600">Configure your restaurant's menu details</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8">
                  {/* Cuisine Selection */}
                  <div>
                    <label className="block font-medium mb-4 text-gray-700">Cuisine Type(s) *</label>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => toggleCuisine(cuisine)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.cuisine.includes(cuisine)
                              ? "bg-orange-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Food Type */}
                  <div>
                    <label className="block font-medium mb-4 text-gray-700">Food Type *</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['veg', 'non-veg', 'both'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, foodType: type })}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            formData.foodType === type
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              formData.foodType === type ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                              {type === 'veg' ? '🥬' : type === 'non-veg' ? '🍗' : '🍽️'}
                            </div>
                            <span className="text-sm font-medium capitalize">{type}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost for Two */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Cost for Two (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.costForTwo}
                      onChange={(e) => setFormData({ ...formData, costForTwo: e.target.value })}
                      placeholder="e.g., 500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  {/* Working Hours */}
                  <div>
                    <label className="block font-medium mb-4 text-gray-700">Working Hours *</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Opening Time</label>
                        <input
                          type="time"
                          required
                          value={formData.workingHours.openingTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, openingTime: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Closing Time</label>
                        <input
                          type="time"
                          required
                          value={formData.workingHours.closingTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, closingTime: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Bank Details</h1>
                  <p className="text-gray-600">Add your bank information for payments</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      placeholder="Name as per bank account"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Account Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="Bank account number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">IFSC Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.ifsc}
                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                        placeholder="e.g., SBIN0001234"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">Security Note</p>
                        <p className="text-sm text-blue-800">
                          Your bank details are encrypted and securely stored. We use this information to process your payments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Review & Submit</h1>
                  <p className="text-gray-600">Review your information before submitting</p>
                </div>

                <div className="space-y-4">
                  {/* Restaurant Details Review */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Restaurant Details</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Restaurant Name</p>
                        <p className="font-medium">{formData.restaurantName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Owner Name</p>
                        <p className="font-medium">{formData.ownerName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{formData.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{formData.phone || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{formData.address || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">City</p>
                        <p className="font-medium">{formData.city || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">FSSAI License</p>
                        <p className="font-medium">{formData.fssai || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Review */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Documents</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className={`flex items-center justify-between p-3 rounded-lg ${formData.documents.fssaiCertificate.file ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.documents.fssaiCertificate.file ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {formData.documents.fssaiCertificate.file ? <Check className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-700">FSSAI Certificate</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.documents.fssaiCertificate.file ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {formData.documents.fssaiCertificate.file ? 'Uploaded' : 'Required'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${formData.documents.panCard.file ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.documents.panCard.file ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {formData.documents.panCard.file ? <Check className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-700">PAN Card</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.documents.panCard.file ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {formData.documents.panCard.file ? 'Uploaded' : 'Required'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${formData.documents.bankProof.file ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.documents.bankProof.file ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {formData.documents.bankProof.file ? <Check className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-700">Bank Proof</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.documents.bankProof.file ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {formData.documents.bankProof.file ? 'Uploaded' : 'Required'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${formData.documents.restaurantImages.files.length > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.documents.restaurantImages.files.length > 0 ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {formData.documents.restaurantImages.files.length > 0 ? <Check className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-700">Restaurant Images</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.documents.restaurantImages.files.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {formData.documents.restaurantImages.files.length > 0 ? `${formData.documents.restaurantImages.files.length} uploaded` : 'Required'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${formData.documents.menuUpload.file ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.documents.menuUpload.file ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {formData.documents.menuUpload.file ? <Check className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-700">Menu</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.documents.menuUpload.file ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {formData.documents.menuUpload.file ? 'Uploaded' : 'Required'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu & Cuisine Review */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Menu & Cuisine</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Cuisine Types</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.cuisine.length > 0 ? (
                            formData.cuisine.map((c) => (
                              <span key={c} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">No cuisines selected</span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500">Food Type</p>
                          <p className="font-medium capitalize">{formData.foodType || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cost for Two</p>
                          <p className="font-medium">₹{formData.costForTwo || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Opening Time</p>
                          <p className="font-medium">{formData.workingHours.openingTime || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Closing Time</p>
                          <p className="font-medium">{formData.workingHours.closingTime || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Review */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Bank Details</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Account Holder</p>
                        <p className="font-medium">{formData.accountHolder || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Account Number</p>
                        <p className="font-medium">{formData.accountNumber || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">IFSC Code</p>
                        <p className="font-medium">{formData.ifsc || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the HaveIt Partner{' '}
                        <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Sticky Bottom Navigation */}
          <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-white border-t border-gray-200 px-4 lg:px-12 py-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-w-[100px]"
                >
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-w-[100px]"
                >
                  Cancel
                </Link>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base min-w-[140px] ${
                    validateStep(currentStep)
                      ? "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">Save & Continue</span>
                  <span className="sm:hidden">Continue</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.agreeToTerms}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base min-w-[140px] ${
                    formData.agreeToTerms
                      ? "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">Submit For Review</span>
                  <span className="sm:hidden">Submit</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrationPage;
