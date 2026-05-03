import { useState } from 'react'
import { ArrowRight, Heart, Users, Target, Award, Clock } from 'lucide-react'

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('story')

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Partner Restaurants', value: '500+', icon: Heart },
    { label: 'Cities Served', value: '25+', icon: Target },
    { label: 'Avg Delivery Time', value: '25 min', icon: Clock },
  ]

  const values = [
    {
      title: 'Customer First',
      description: 'We prioritize your satisfaction above everything else. Your feedback shapes our decisions.',
      icon: Heart,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Quality Guaranteed',
      description: 'Every order is carefully prepared and delivered with the highest quality standards.',
      icon: Award,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Fast & Reliable',
      description: 'Our efficient delivery network ensures your food arrives hot and fresh, every time.',
      icon: Clock,
      color: 'bg-blue-50 text-blue-600'
    },
  ]

  const team = [
    { name: 'Guguloth Ajay Kumar', role: 'Founder & CEO', image: '👨‍💼' },
    { name: 'Priya Patel', role: 'COO', image: '👩‍💼' },
    { name: 'Amit Kumar', role: 'CTO', image: '👨‍💻' },
    { name: 'Sneha Reddy', role: 'Head of Operations', image: '👩‍🔬' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">About Haveit</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Delivering happiness, one meal at a time. We're on a mission to make food delivery simple, fast, and delightful.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {['story', 'mission', 'values'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'story' && (
          <div className="prose max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Haveit was founded in 2024 by Guguloth Ajay Kumar, an IIT Delhi graduate with a dual degree in Mathematics and Computing. 
                Frustrated with long wait times and cold food, he decided to build something better.
              </p>
              <p>
                Starting from a vision to revolutionize food delivery, we've grown to serve over 50,000 customers across 25 cities. 
                Our journey has been fueled by passion, innovation, and an unwavering commitment to quality.
              </p>
              <p>
                Today, we partner with 500+ restaurants and grocery stores, bringing you the best food and essentials 
                right to your doorstep. But we're just getting started.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="prose max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                To be the most trusted food and grocery delivery platform, connecting people with the food they love 
                and the essentials they need, with unmatched speed and reliability.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-6">What We Stand For</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quality: Only the best for our customers</li>
                <li>Speed: Because hunger doesn't wait</li>
                <li>Trust: Transparent pricing and reliable service</li>
                <li>Community: Supporting local businesses and creating jobs</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'values' && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${value.color} mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Team Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-4xl">
                  {member.image}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate people to join our team. Check out our careers page to see open positions.
          </p>
          <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            View Open Positions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
