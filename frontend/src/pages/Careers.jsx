import { useState } from 'react'
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Building, Users, Zap, Heart } from 'lucide-react'

export default function Careers() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const departments = [
    { id: 'all', label: 'All Departments' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'product', label: 'Product' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'operations', label: 'Operations' },
    { id: 'customer', label: 'Customer Success' },
  ]

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹25-35 LPA',
      posted: '2 days ago',
      featured: true
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'product',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹20-30 LPA',
      posted: '3 days ago',
      featured: true
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹15-25 LPA',
      posted: '5 days ago',
      featured: false
    },
    {
      id: 4,
      title: 'Backend Engineer',
      department: 'engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹20-30 LPA',
      posted: '1 week ago',
      featured: false
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'marketing',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹18-28 LPA',
      posted: '1 week ago',
      featured: false
    },
    {
      id: 6,
      title: 'Customer Success Lead',
      department: 'customer',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹12-18 LPA',
      posted: '2 weeks ago',
      featured: false
    },
  ]

  const benefits = [
    { icon: DollarSign, title: 'Competitive Salary', description: 'Market-leading compensation packages' },
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family' },
    { icon: Zap, title: 'Learning Budget', description: 'Annual allowance for courses and conferences' },
    { icon: Users, title: 'Team Events', description: 'Regular team outings and company retreats' },
    { icon: Clock, title: 'Flexible Hours', description: 'Work-life balance with flexible schedules' },
    { icon: Building, title: 'Modern Office', description: 'State-of-the-art workspace in prime locations' },
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = activeFilter === 'all' || job.department === activeFilter
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Join Our Team</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Build the future of food delivery with us. We're looking for passionate people to help us grow.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveFilter(dept.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === dept.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Work With Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
        
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                  job.featured ? 'border-l-4 border-l-orange-500' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      {job.featured && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{job.posted}</span>
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">No positions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all') }}
                className="mt-4 text-orange-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Culture Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Culture</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where everyone can thrive, learn, and make an impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-3">Innovation First</h3>
              <p className="text-sm text-gray-600">
                We encourage experimentation and learning. Fail fast, learn faster, and keep pushing boundaries.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Obsessed</h3>
              <p className="text-sm text-gray-600">
                Every decision starts with our customers. We're committed to delivering the best experience.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3">Collaborative Spirit</h3>
              <p className="text-sm text-gray-600">
                We win together. Cross-functional teams work closely to achieve common goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-3">Growth Mindset</h3>
              <p className="text-sm text-gray-600">
                We invest in our people's growth through mentorship, training, and career development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            Join a team that's passionate about revolutionizing food delivery. Your next career adventure awaits.
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            View All Positions
          </button>
        </div>
      </div>
    </div>
  )
}
