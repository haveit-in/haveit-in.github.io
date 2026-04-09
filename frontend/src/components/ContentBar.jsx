import { useState } from 'react'
import MagnetWrapper from './MagnetWrapper.jsx'

const ChevronDownIcon = ({ size = 20, isOpen = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ContentBar = () => {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)

  const leftMenuItems = [
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'deals', label: 'Deals' },
    { id: 'freshproducts', label: 'Fresh Products' },
    { id: 'about', label: 'About' },
  ]

  const rightMenuItems = [
    { id: 'policy', label: 'Policy' },
    { id: 'faqs', label: "FAQ'S" },
    { id: 'help', label: 'Help & Support' },
  ]

  return (
    <>
      {/* Desktop Content Bar */}
      <nav className="hidden md:block sticky top-24 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Left Curved Box */}
            <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {leftMenuItems.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <MagnetWrapper>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  </MagnetWrapper>
                  {index < leftMenuItems.length - 1 && (
                    <div className="w-px h-4 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right Curved Box */}
            <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {rightMenuItems.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <MagnetWrapper>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  </MagnetWrapper>
                  {index < rightMenuItems.length - 1 && (
                    <div className="w-px h-4 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Content Bar */}
      <nav className="md:hidden sticky top-40 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 space-y-3">
          {/* Left Dropdown */}
          <div className="relative">
            <MagnetWrapper>
              <button
                type="button"
                onClick={() => setLeftOpen(!leftOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-3xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700">Menu</span>
                <ChevronDownIcon size={18} isOpen={leftOpen} />
              </button>
            </MagnetWrapper>

            {/* Left Dropdown Content */}
            {leftOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-50">
                {leftMenuItems.map((item) => (
                  <MagnetWrapper key={item.id} className="block w-full">
                    <button
                      type="button"
                      onClick={() => setLeftOpen(false)}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 transition-colors last:border-0"
                    >
                      {item.label}
                    </button>
                  </MagnetWrapper>
                ))}
              </div>
            )}
          </div>

          {/* Right Dropdown */}
          <div className="relative">
            <MagnetWrapper>
              <button
                type="button"
                onClick={() => setRightOpen(!rightOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-3xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700">Support & Policies</span>
                <ChevronDownIcon size={18} isOpen={rightOpen} />
              </button>
            </MagnetWrapper>

            {/* Right Dropdown Content */}
            {rightOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-50">
                {rightMenuItems.map((item) => (
                  <MagnetWrapper key={item.id} className="block w-full">
                    <button
                      type="button"
                      onClick={() => setRightOpen(false)}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 transition-colors last:border-0"
                    >
                      {item.label}
                    </button>
                  </MagnetWrapper>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default ContentBar
