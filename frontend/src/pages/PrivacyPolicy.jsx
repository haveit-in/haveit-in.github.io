import { useState } from 'react'
import { Shield, Eye, Lock, Cookie, ChevronDown, ArrowRight } from 'lucide-react'

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'collection', label: 'Data Collection' },
    { id: 'usage', label: 'Data Usage' },
    { id: 'sharing', label: 'Data Sharing' },
    { id: 'security', label: 'Data Security' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'contact', label: 'Contact' },
  ]

  const content = {
    overview: {
      title: 'Privacy Policy Overview',
      content: `
        <p class="mb-4">At Haveit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food and grocery delivery services.</p>
        <p class="mb-4">By using Haveit, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, please do not use our service.</p>
        <p><strong>Last Updated:</strong> January 2024</p>
      `
    },
    collection: {
      title: 'Information We Collect',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Personal Information</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Name, email address, phone number</li>
          <li>Delivery address and location data</li>
          <li>Payment information (processed securely)</li>
          <li>Account credentials (encrypted)</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Order Information</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Order history and preferences</li>
          <li>Restaurant and grocery choices</li>
          <li>Delivery instructions</li>
          <li>Feedback and ratings</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Device Information</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>IP address and device type</li>
          <li>Browser and operating system</li>
          <li>App usage patterns</li>
          <li>Location data (with your consent)</li>
        </ul>
      `
    },
    usage: {
      title: 'How We Use Your Information',
      content: `
        <p class="mb-4">We use the information we collect for various purposes, including:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Service Delivery:</strong> Process and deliver your orders efficiently</li>
          <li><strong>Account Management:</strong> Create and manage your account</li>
          <li><strong>Personalization:</strong> Recommend restaurants and items based on your preferences</li>
          <li><strong>Communication:</strong> Send order updates, promotions, and support messages</li>
          <li><strong>Security:</strong> Detect fraud and protect against unauthorized access</li>
          <li><strong>Improvement:</strong> Analyze usage patterns to improve our services</li>
          <li><strong>Legal Compliance:</strong> Comply with legal obligations and regulations</li>
        </ul>
      `
    },
    sharing: {
      title: 'Data Sharing Practices',
      content: `
        <p class="mb-4">We may share your information in the following circumstances:</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Service Providers</h3>
        <p class="mb-4">We share information with third-party service providers who perform services on our behalf, such as:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Payment processors</li>
          <li>Delivery partners</li>
          <li>Restaurant and grocery partners</li>
          <li>Cloud hosting services</li>
          <li>Analytics providers</li>
        </ul>
        <h3 class="text-lg font-semibold mt-6 mb-3">Legal Requirements</h3>
        <p class="mb-4">We may disclose your information if required by law or in response to valid legal requests, including:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Court orders or subpoenas</li>
          <li>Government investigations</li>
          <li>Protection of our rights and property</li>
          <li>Prevention of fraud or illegal activities</li>
        </ul>
      `
    },
    security: {
      title: 'Data Security Measures',
      content: `
        <p class="mb-4">We implement robust security measures to protect your information:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest</li>
          <li><strong>Secure Payments:</strong> Payment information is processed through PCI-compliant providers</li>
          <li><strong>Access Control:</strong> Strict access controls for our employees and systems</li>
          <li><strong>Regular Audits:</strong> Regular security audits and vulnerability assessments</li>
          <li><strong>Data Minimization:</strong> We collect only the information necessary for our services</li>
        </ul>
        <p class="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
      `
    },
    rights: {
      title: 'Your Privacy Rights',
      content: `
        <p class="mb-4">You have the following rights regarding your personal information:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Request correction of inaccurate data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
          <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Objection:</strong> Object to processing of your data</li>
        </ul>
        <p class="mt-4">To exercise these rights, please contact us at privacy@haveit.in. We will respond to your request within 30 days.</p>
      `
    },
    cookies: {
      title: 'Cookie Policy',
      content: `
        <p class="mb-4">We use cookies and similar technologies to enhance your experience:</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Essential Cookies</h3>
        <p class="mb-4">Required for basic functionality, including login, cart management, and security.</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Performance Cookies</h3>
        <p class="mb-4">Help us understand how visitors use our website to improve performance.</p>
        <h3 class="text-lg font-semibold mt-6 mb-3">Marketing Cookies</h3>
        <p class="mb-4">Used to deliver relevant advertisements and track marketing campaigns.</p>
        <p class="mt-4">You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect your experience.</p>
      `
    },
    contact: {
      title: 'Contact Us',
      content: `
        <p class="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
        <div className="space-y-2">
          <p><strong>Email:</strong> guguloth.kumar@alumni.iitd.ac.in</p>
          <p><strong>Phone:</strong> +91 9599761722</p>
          <p><strong>Address:</strong> PrashantNagar, Warangal Dist, 506001, Telangana, India</p>
        </div>
        <p class="mt-4">We will respond to your inquiry within 30 days of receipt.</p>
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-black">Privacy Policy</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Your privacy matters to us. Learn how we protect and use your information.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4 px-2">Quick Navigation</h3>
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

            {/* Key Highlights */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">Clear policies on how we use your data</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-3">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">Industry-standard encryption and security</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 mb-3">
                  <Cookie className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Control</h3>
                <p className="text-sm text-gray-600">Full control over your data and preferences</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Still have questions?</h3>
                  <p className="text-sm text-gray-600">Our privacy team is here to help</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                  Contact Us
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
