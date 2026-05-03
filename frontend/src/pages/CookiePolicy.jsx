import { useState } from 'react'
import { Cookie, CheckCircle, XCircle, Settings, Shield, Info } from 'lucide-react'

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'types', label: 'Cookie Types' },
    { id: 'usage', label: 'How We Use Cookies' },
    { id: 'management', label: 'Managing Cookies' },
    { id: 'third-party', label: 'Third-Party Cookies' },
    { id: 'updates', label: 'Policy Updates' },
  ]

  const content = {
    overview: {
      title: 'Cookie Policy Overview',
      content: `
        <p class="mb-4">At Haveit, we use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.</p>
        <p class="mb-4">By using our platform, you consent to the use of cookies as described in this policy. You can manage your cookie preferences through your browser settings.</p>
        <p><strong>Last Updated:</strong> January 2024</p>
      `
    },
    types: {
      title: 'Types of Cookies We Use',
      content: `
        <h3 class="text-lg font-semibold mt-6 mb-3">Essential Cookies</h3>
        <p class="mb-4">These cookies are necessary for the website to function properly. They enable core functionality such as:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>User authentication and login</li>
          <li>Shopping cart management</li>
          <li>Security and fraud prevention</li>
          <li>Remembering your preferences</li>
        </ul>
        <p class="mb-4"><strong>Note:</strong> These cookies cannot be disabled as they are essential for our service to operate.</p>

        <h3 class="text-lg font-semibold mt-6 mb-3">Performance Cookies</h3>
        <p class="mb-4">These cookies help us understand how visitors interact with our website by collecting information about:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Pages visited and time spent on each page</li>
          <li>Error messages encountered</li>
          <li>Website performance metrics</li>
        </ul>

        <h3 class="text-lg font-semibold mt-6 mb-3">Functional Cookies</h3>
        <p class="mb-4">These cookies enable enhanced functionality and personalization, such as:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Remembering your language preferences</li>
          <li>Saving your delivery addresses</li>
          <li>Displaying relevant content based on your location</li>
        </ul>

        <h3 class="text-lg font-semibold mt-6 mb-3">Marketing Cookies</h3>
        <p class="mb-4">These cookies are used to deliver relevant advertisements and track marketing campaign effectiveness. They may be set by us or third-party advertising partners.</p>
      `
    },
    usage: {
      title: 'How We Use Cookies',
      content: `
        <p class="mb-4">We use cookies for the following purposes:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>To provide and improve our services:</strong> Essential cookies ensure our platform functions correctly</li>
          <li><strong>To analyze usage patterns:</strong> Performance cookies help us understand how users interact with our platform</li>
          <li><strong>To personalize your experience:</strong> Functional cookies remember your preferences and settings</li>
          <li><strong>To deliver relevant content:</strong> Marketing cookies show you personalized advertisements</li>
          <li><strong>To ensure security:</strong> Cookies help protect against fraud and unauthorized access</li>
        </ul>
      `
    },
    management: {
      title: 'Managing Your Cookie Preferences',
      content: `
        <p class="mb-4">You have several options to manage cookies:</p>
        
        <h3 class="text-lg font-semibold mt-6 mb-3">Browser Settings</h3>
        <p class="mb-4">Most web browsers allow you to control cookies through their settings. You can:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Block all cookies</li>
          <li>Accept only first-party cookies</li>
          <li>Delete existing cookies</li>
          <li>Set notifications when cookies are set</li>
        </ul>
        <p class="mb-4"><strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of our platform.</p>

        <h3 class="text-lg font-semibold mt-6 mb-3">Browser-Specific Instructions</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Chrome:</strong> Settings > Privacy and security > Cookies and other site data</li>
          <li><strong>Firefox:</strong> Options > Privacy & Security > Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences > Privacy > Manage Website Data</li>
          <li><strong>Edge:</strong> Settings > Cookies and site permissions > Manage cookies</li>
        </ul>
      `
    },
    'third-party': {
      title: 'Third-Party Cookies',
      content: `
        <p class="mb-4">We may allow third-party services to place cookies on your device for the following purposes:</p>
        
        <h3 class="text-lg font-semibold mt-6 mb-3">Analytics Services</h3>
        <p class="mb-4">We use analytics tools like Google Analytics to understand user behavior and improve our services.</p>

        <h3 class="text-lg font-semibold mt-6 mb-3">Advertising Partners</h3>
        <p class="mb-4">Our advertising partners may use cookies to serve personalized advertisements based on your browsing history.</p>

        <h3 class="text-lg font-semibold mt-6 mb-3">Social Media Platforms</h3>
        <p class="mb-4">Social media buttons and widgets may set cookies when you interact with them.</p>

        <p class="mt-4">These third-party cookies are subject to the respective privacy policies of those services. We encourage you to review their policies for more information.</p>
      `
    },
    updates: {
      title: 'Updates to This Policy',
      content: `
        <p class="mb-4">We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements.</p>
        
        <h3 class="text-lg font-semibold mt-6 mb-3">Notification of Changes</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Material changes will be communicated via email or in-app notification</li>
          <li>The "Last Updated" date will be revised with each change</li>
          <li>Continued use of our platform constitutes acceptance of the updated policy</li>
        </ul>

        <p class="mt-4">We recommend reviewing this policy periodically to stay informed about our cookie practices.</p>
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-black">Cookie Policy</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Learn about how we use cookies to enhance your experience.
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

            {/* Cookie Settings CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Your Preferences</h3>
                    <p className="text-sm text-gray-600">Customize your cookie settings</p>
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Open Settings
                </button>
              </div>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">Clear information about cookie usage</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">Cookies used for security purposes</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 mb-3">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Control</h3>
                <p className="text-sm text-gray-600">Full control over your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
