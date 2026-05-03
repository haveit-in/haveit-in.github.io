import { useState } from 'react'
import { FileText, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'acceptance', label: 'Acceptance' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'orders', label: 'Orders & Delivery' },
    { id: 'payments', label: 'Payments' },
    { id: 'cancellations', label: 'Cancellations' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'intellectual', label: 'Intellectual Property' },
    { id: 'limitation', label: 'Limitation of Liability' },
    { id: 'changes', label: 'Changes to Terms' },
  ]

  const content = {
    overview: {
      title: 'Terms & Conditions Overview',
      content: `
        <p class="mb-4">Welcome to Haveit. These Terms and Conditions govern your use of our food and grocery delivery platform. By accessing or using Haveit, you agree to be bound by these terms.</p>
        <p class="mb-4">Please read these terms carefully before using our service. If you do not agree with any part of these terms, you must not use our service.</p>
        <p><strong>Last Updated:</strong> January 2024</p>
      `
    },
    acceptance: {
      title: 'Acceptance of Terms',
      content: `
        <p class="mb-4">By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
        <p class="mb-4">If you are using our service on behalf of a company or entity, you represent and warrant that you have the authority to bind that entity to these terms.</p>
        <p>We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the updated terms.</p>
      `
    },
    accounts: {
      title: 'Account Terms',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Account Creation</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>You must be at least 18 years old to create an account</li>
          <li>You must provide accurate and complete information</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Account Responsibilities</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>You are solely responsible for all activities under your account</li>
          <li>You must not share your account with others</li>
          <li>You must not use our service for illegal or unauthorized purposes</li>
          <li>We reserve the right to suspend or terminate accounts for violations</li>
        </ul>
      `
    },
    orders: {
      title: 'Orders & Delivery',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Order Placement</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>All orders are subject to availability from our partner restaurants and stores</li>
          <li>We reserve the right to refuse or cancel any order for any reason</li>
          <li>Prices are subject to change without prior notice</li>
          <li>Product images are for illustration purposes only</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Delivery Terms</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Delivery times are estimates and not guaranteed</li>
          <li>We are not liable for delays caused by traffic, weather, or other factors beyond our control</li>
          <li>Someone must be available at the delivery address to receive the order</li>
          <li>If delivery cannot be completed, additional charges may apply</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Minimum Order</h3>
        <p>Minimum order value is ₹99 for food delivery and ₹149 for grocery orders. Orders below these values may be subject to additional fees.</p>
      `
    },
    payments: {
      title: 'Payment Terms',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Payment Methods</h3>
        <p class="mb-4">We accept the following payment methods:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Credit and debit cards (Visa, Mastercard, RuPay)</li>
          <li>UPI (Unified Payments Interface)</li>
          <li>Net banking</li>
          <li>Digital wallets (Paytm, Google Pay, PhonePe)</li>
          <li>Cash on delivery (select areas only)</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Payment Security</h3>
        <p class="mb-4">All payment transactions are processed through secure, PCI-compliant payment gateways. We do not store your complete payment information on our servers.</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Additional Charges</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Delivery fee varies by location and order value</li>
          <li>Service fee may apply to certain orders</li>
          <li>Taxes as applicable by law</li>
          <li>All charges are displayed before order confirmation</li>
        </ul>
      `
    },
    cancellations: {
      title: 'Cancellation Policy',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Customer Cancellations</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>You may cancel your order within 5 minutes of placement for a full refund</li>
          <li>Cancellations after 5 minutes may be subject to a cancellation fee</li>
          <li>Once the restaurant has started preparing your order, cancellations are not accepted</li>
          <li>For scheduled orders, cancellations must be made at least 2 hours before delivery time</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Platform Cancellations</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>We may cancel orders if the restaurant is unable to fulfill them</li>
          <li>We may cancel orders due to extreme weather or safety concerns</li>
          <li>In such cases, you will receive a full refund</li>
        </ul>
      `
    },
    refunds: {
      title: 'Refund Policy',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Refund Eligibility</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Full refund for cancelled orders within the cancellation window</li>
          <li>Refund for orders that could not be delivered due to platform issues</li>
          <li>Partial refund for missing or incorrect items (subject to verification)</li>
          <li>Refund for food quality issues (with photo evidence)</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Refund Process</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Refunds are processed within 5-7 business days</li>
          <li>Refunds are credited to the original payment method</li>
          <li>For cash on delivery orders, refunds are processed via bank transfer</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Non-Refundable Items</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Delivery fees are non-refundable except for platform cancellations</li>
          <li>Service charges are non-refundable</li>
          <li>Discounts applied to cancelled orders are not reissued</li>
        </ul>
      `
    },
    intellectual: {
      title: 'Intellectual Property',
      content: `
        <p class="mb-4">All content on the Haveit platform, including but not limited to text, graphics, logos, images, software, and code, is the property of Haveit or its licensors and is protected by copyright and other intellectual property laws.</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">What You Can Do</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>View and use our service for personal purposes</li>
          <li>Download materials for personal, non-commercial use</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">What You Cannot Do</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Copy, modify, or distribute our content without permission</li>
          <li>Use our trademarks or logos without authorization</li>
          <li>Reverse engineer our software or attempt to extract source code</li>
          <li>Use automated tools to scrape or harvest data from our platform</li>
        </ul>
      `
    },
    limitation: {
      title: 'Limitation of Liability',
      content: `
        <p class="mb-4">To the maximum extent permitted by law, Haveit shall not be liable for:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Any indirect, incidental, special, or consequential damages</li>
          <li>Loss of profits, data, or business opportunities</li>
          <li>Delays or failures in delivery due to third-party actions</li>
          <li>Food quality issues (addressed with partner restaurants)</li>
          <li>Errors or inaccuracies in restaurant or product information</li>
        </ul>
        <p class="mt-4">Our total liability shall not exceed the amount you paid for the specific order in question.</p>
      `
    },
    changes: {
      title: 'Changes to Terms',
      content: `
        <p class="mb-4">We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our platform.</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Notification of Changes</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Material changes will be communicated via email or in-app notification</li>
          <li>Continued use of the service constitutes acceptance of changes</li>
          <li>You should review these terms periodically for updates</li>
        </ul>
        <p class="mt-4">If you do not agree to the modified terms, you must discontinue use of our service.</p>
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-black">Terms & Conditions</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4 px-2">Quick Navigation</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> guguloth.kumar@alumni.iitd.ac.in</p>
                <p><strong>Phone:</strong> +91 9599761722</p>
                <p><strong>Address:</strong> PrashantNagar, Warangal Dist, 506001, Telangana, India</p>
              </div>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {content[activeSection].title}
              </h2>
              <div 
                className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content[activeSection].content }}
              />
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fair Terms</h3>
                <p className="text-sm text-gray-600">Balanced policies for both customers and partners</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 mb-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Refunds</h3>
                <p className="text-sm text-gray-600">Refunds processed within 5-7 business days</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Clear Policies</h3>
                <p className="text-sm text-gray-600">Transparent terms with no hidden clauses</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Need clarification?</h3>
                  <p className="text-sm text-gray-600">Our support team can help explain any terms</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
