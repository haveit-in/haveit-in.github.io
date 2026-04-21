import { useState, useEffect, useRef } from 'react'
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
  const [hoveredLeftDesktop, setHoveredLeftDesktop] = useState(null)
  const [hoveredRightDesktop, setHoveredRightDesktop] = useState(null)
  const [hoveredLeftMobile, setHoveredLeftMobile] = useState(null)
  const [hoveredRightMobile, setHoveredRightMobile] = useState(null)
  const [hoverLeftTrigger, setHoverLeftTrigger] = useState(false)
  const [hoverRightTrigger, setHoverRightTrigger] = useState(false)

  const mobileDropdownRef = useRef(null)

  // Handle outside clicks and close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setLeftOpen(false)
        setRightOpen(false)
      }
    }

    if (leftOpen || rightOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [leftOpen, rightOpen])

  // Handle scroll to close dropdowns
  useEffect(() => {
    const handleScroll = () => {
      if (leftOpen || rightOpen) {
        setLeftOpen(false)
        setRightOpen(false)
      }
    }

    if (leftOpen || rightOpen) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [leftOpen, rightOpen])

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
      {/* Desktop Content Bar - Glassmorphism Style */}
      <nav 
        className="hidden md:block sticky top-20 z-40"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Navigation Items - Individual Pills with Glassmorphism */}
            <div className="flex items-center gap-3">
              {leftMenuItems.map((item) => (
                <MagnetWrapper key={item.id}>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:text-orange-500 hover:font-bold whitespace-nowrap backdrop-blur-md"
                    onMouseEnter={() => setHoveredLeftDesktop(item.id)}
                    onMouseLeave={() => setHoveredLeftDesktop(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      border: hoveredLeftDesktop === item.id ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                      boxShadow: hoveredLeftDesktop === item.id ? '0 4px 15px rgba(0, 0, 0, 0.04), 0 0 20px rgba(255, 140, 0, 0.6)' : '0 4px 15px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {item.label}
                  </button>
                </MagnetWrapper>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right Navigation Items - Individual Pills with Glassmorphism */}
            <div className="flex items-center gap-3">
              {rightMenuItems.map((item) => (
                <MagnetWrapper key={item.id}>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:text-orange-500 hover:font-bold whitespace-nowrap backdrop-blur-md"
                    onMouseEnter={() => setHoveredRightDesktop(item.id)}
                    onMouseLeave={() => setHoveredRightDesktop(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      border: hoveredRightDesktop === item.id ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                      boxShadow: hoveredRightDesktop === item.id ? '0 4px 15px rgba(0, 0, 0, 0.04), 0 0 20px rgba(255, 140, 0, 0.6)' : '0 4px 15px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {item.label}
                  </button>
                </MagnetWrapper>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Content Bar - Glassmorphism Style */}
      <nav 
        className="md:hidden sticky top-40 z-40"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
        }}
      >
        <div className="px-4 py-2">
          <div ref={mobileDropdownRef} className="flex items-center justify-between w-full gap-2">
            {/* Left Dropdown */}
            <div className="relative">
              <MagnetWrapper>
                <button
                  type="button"
                  onClick={() => {
                    setLeftOpen(!leftOpen)
                    if (rightOpen) setRightOpen(false)
                  }}
                  onMouseEnter={() => setHoverLeftTrigger(true)}
                  onMouseLeave={() => setHoverLeftTrigger(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-full transition-all duration-200 text-gray-700 font-semibold text-sm backdrop-blur-md whitespace-nowrap"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: hoverLeftTrigger ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                    boxShadow: hoverLeftTrigger ? '0 0 20px rgba(255, 140, 0, 0.6)' : '0 0 10px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <span>Menu</span>
                  <ChevronDownIcon size={16} isOpen={leftOpen} />
                </button>
              </MagnetWrapper>

              {/* Left Dropdown Content */}
              {leftOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 rounded-2xl border overflow-hidden z-50 p-2 min-w-max"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {leftMenuItems.map((item) => (
                      <MagnetWrapper key={item.id}>
                        <button
                          type="button"
                          onClick={() => setLeftOpen(false)}
                          onMouseEnter={() => setHoveredLeftMobile(item.id)}
                          onMouseLeave={() => setHoveredLeftMobile(null)}
                          className="px-4 py-2 text-xs font-medium text-gray-700 rounded-full transition-all duration-200 hover:text-orange-500 hover:font-bold whitespace-nowrap backdrop-blur-md"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: hoveredLeftMobile === item.id ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                            boxShadow: hoveredLeftMobile === item.id ? '0 0 15px rgba(255, 140, 0, 0.6)' : '0 0 8px rgba(0, 0, 0, 0.02)',
                          }}
                        >
                          {item.label}
                        </button>
                      </MagnetWrapper>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Dropdown */}
            <div className="relative">
              <MagnetWrapper>
                <button
                  type="button"
                  onClick={() => {
                    setRightOpen(!rightOpen)
                    if (leftOpen) setLeftOpen(false)
                  }}
                  onMouseEnter={() => setHoverRightTrigger(true)}
                  onMouseLeave={() => setHoverRightTrigger(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-full transition-all duration-200 text-gray-700 font-semibold text-sm backdrop-blur-md whitespace-nowrap"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: hoverRightTrigger ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                    boxShadow: hoverRightTrigger ? '0 0 20px rgba(255, 140, 0, 0.6)' : '0 0 10px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <span>Support</span>
                  <ChevronDownIcon size={16} isOpen={rightOpen} />
                </button>
              </MagnetWrapper>

              {/* Right Dropdown Content */}
              {rightOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 rounded-2xl border overflow-hidden z-50 p-2 min-w-max"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {rightMenuItems.map((item) => (
                      <MagnetWrapper key={item.id}>
                        <button
                          type="button"
                          onClick={() => setRightOpen(false)}
                          onMouseEnter={() => setHoveredRightMobile(item.id)}
                          onMouseLeave={() => setHoveredRightMobile(null)}
                          className="px-4 py-2 text-xs font-medium text-gray-700 rounded-full transition-all duration-200 hover:text-orange-500 hover:font-bold whitespace-nowrap backdrop-blur-md"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: hoveredRightMobile === item.id ? '2px solid rgba(255, 140, 0, 0.8)' : '2px solid rgba(180, 180, 180, 0.4)',
                            boxShadow: hoveredRightMobile === item.id ? '0 0 15px rgba(255, 140, 0, 0.6)' : '0 0 8px rgba(0, 0, 0, 0.02)',
                          }}
                        >
                          {item.label}
                        </button>
                      </MagnetWrapper>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default ContentBar
