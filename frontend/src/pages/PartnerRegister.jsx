import { Link, useNavigate } from "react-router";
import Store from "lucide-react/dist/esm/icons/store";
import Check from "lucide-react/dist/esm/icons/check";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy loaded step components
const Step1 = lazy(() => import("../components/steps/Step1"));
const Step2 = lazy(() => import("../components/steps/Step2"));
const Step3 = lazy(() => import("../components/steps/Step3"));
const Step4 = lazy(() => import("../components/steps/Step4"));
const Step5 = lazy(() => import("../components/steps/Step5"));

const steps = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Restaurant Info" },
  { id: 3, name: "Uploads" },
  { id: 4, name: "Bank Details" },
  { id: 5, name: "Review & Submit" },
];

export function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Clear form data on successful submission
  const clearFormData = () => {
    localStorage.removeItem("partnerFormData");
  };

  // Auto-save draft functionality
  useEffect(() => {
    try {
      const dataToSave = {
        ...formData,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem("partnerFormData", JSON.stringify(dataToSave));
    } catch (error) {
      console.log("Error saving form data:", error);
    }
  }, [formData, currentStep]);

  // Restore on reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem("partnerFormData");
      if (saved) {
        const parsedData = JSON.parse(saved);
        
        // Only restore if data is recent (within 24 hours)
        const isRecent = (Date.now() - parsedData.timestamp) < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          // Restore form data
          setFormData({
            restaurantName: parsedData.restaurantName || "",
            ownerName: parsedData.ownerName || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            address: parsedData.address || "",
            city: parsedData.city || "",
            cuisine: parsedData.cuisine || [],
            fssai: parsedData.fssai || "",
            accountNumber: parsedData.accountNumber || "",
            ifsc: parsedData.ifsc || "",
            accountHolder: parsedData.accountHolder || "",
          });
          
          // Restore current step if valid
          if (parsedData.currentStep && parsedData.currentStep >= 1 && parsedData.currentStep <= 5) {
            setCurrentStep(parsedData.currentStep);
          }
        }
      }
    } catch (error) {
      console.log("Error restoring form data:", error);
      // Clear corrupted data
      localStorage.removeItem("partnerFormData");
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Indian phone number validation: +91 followed by 10 digits, or just 10 digits
    const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase());
  };

  const validateAccountNumber = (accountNumber) => {
    // Account number should be 9-18 digits
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber.replace(/\s/g, ''));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.restaurantName.trim()) {
        newErrors.restaurantName = "Restaurant name is required";
      }
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (formData.cuisine.length === 0) {
        newErrors.cuisine = "Please select at least one cuisine type";
      }
      if (!formData.fssai.trim()) {
        newErrors.fssai = "FSSAI license number is required";
      }
    }

    if (step === 4) {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!validateAccountNumber(formData.accountNumber)) {
        newErrors.accountNumber = "Account number should be 9-18 digits";
      }
      if (!formData.ifsc.trim()) {
        newErrors.ifsc = "IFSC code is required";
      } else if (!validateIFSC(formData.ifsc)) {
        newErrors.ifsc = "Please enter a valid IFSC code";
      }
      if (!formData.accountHolder.trim()) {
        newErrors.accountHolder = "Account holder name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit form data to backend
        try {
          const token = localStorage.getItem("access_token");
          console.log("Token from localStorage:", token);

          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/apply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
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
            }),
          });

          console.log("Response status:", res.status);
          const data = await res.json();
          console.log("Response data:", data);

          if (data.success) {
            // Clear form data on successful submission
            clearFormData();
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Registration submission failed:", error);
          alert("Failed to submit registration. Please try again.");
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-orange-50 overflow-hidden">
      {/* Sticky Header + Stepper */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3 md:hidden">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">HaveIt Partner</span>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{steps[currentStep - 1].name}</span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-orange-600 rounded-full transition-all"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 h-full px-4">
        
        {/* Left Panel - Branding + Vertical Stepper (Sticky) */}
        <div className="hidden md:flex flex-col h-full sticky top-0 py-10">
          
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">HaveIt Partner</span>
            </div>

            {/* Stepper */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 relative">
                  
                  {/* Vertical Line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-[2px] bg-gray-200"></div>
                  )}

                  {/* Active Progress Line */}
                  {index !== steps.length - 1 && currentStep > step.id && (
                    <div className="absolute left-[15px] top-8 h-full w-[2px] bg-orange-600"></div>
                  )}

                  {/* Circle */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 z-10 bg-white
                    ${
                      currentStep > step.id
                        ? "bg-orange-600 border-orange-600 text-white"
                        : currentStep === step.id
                        ? "border-orange-600 text-orange-600 ring-4 ring-orange-100"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </p>

                    {currentStep === step.id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Fill required details
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fixed content */}
          <div className="mt-auto text-sm text-gray-500">
            Need help? Contact support
          </div>
        </div>

        {/* Right Panel - Form Area (Scrollable) */}
        <div className="md:col-span-2 h-full overflow-y-auto py-10 pr-2">
          
          <h1 className="text-3xl font-bold mb-2">
            Register Your Restaurant
          </h1>
          <p className="text-gray-600 mb-6">
            Complete the steps below to get started
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-10 border mb-20">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
          <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
            {currentStep === 1 && <Step1 formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 3 && <Step3 formData={formData} setFormData={setFormData} />}
            {currentStep === 4 && <Step4 formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 5 && <Step5 formData={formData} />}
          </Suspense>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Sticky Bottom CTA */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="flex justify-end gap-3">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border rounded-lg"
                >
                  Back
                </button>
              ) : (
                <Link to="/" className="px-6 py-3 border rounded-lg text-center">
                  Cancel
                </Link>
              )}

              <button
                onClick={handleNext}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md"
              >
                {currentStep === 5 ? "Submit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
