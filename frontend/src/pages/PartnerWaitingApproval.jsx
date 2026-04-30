import { Link } from "react-router";
import Clock from "lucide-react/dist/esm/icons/clock";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";

export default function PartnerWaitingApproval() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
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
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Under Review</h1>
            <p className="text-gray-600">
              Your restaurant application is being reviewed by our team.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Our team will review your application</li>
                <li>• We'll verify your business details</li>
                <li>• You'll receive an email notification</li>
                <li>• Usually takes 24hours to process</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              We'll notify you once your restaurant is approved.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
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
