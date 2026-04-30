import { Link, useLocation } from "react-router";
import XCircle from "lucide-react/dist/esm/icons/x-circle";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";

export default function PartnerRejected() {
  const location = useLocation();
  const rejectionReason = location.state?.reason || "Your application did not meet our requirements.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
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
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Rejected</h1>
            <p className="text-gray-600">
              We're unable to approve your restaurant application at this time.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Reason for rejection:</h3>
                  <p className="text-sm text-red-800">{rejectionReason}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">What you can do:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Review the rejection reason above</li>
                <li>• Update your business information</li>
                <li>• Ensure all documents are valid</li>
                <li>• Contact support for clarification</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need help? Our support team is here to assist you.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/partner/register"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
              >
                Apply Again
              </Link>
              
              <Link
                to="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-center"
              >
                Back to Home
              </Link>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>support@haveit.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
