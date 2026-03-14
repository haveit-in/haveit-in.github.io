import { useRef, useState, useEffect, useCallback } from 'react'

// ChevronLeft Icon component
const ChevronLeftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

// ChevronRight Icon component
const ChevronRightIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

// Grocery categories data
const groceryCategories = [
  { id: 1, name: 'Fresh', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop' },
  { id: 2, name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop' },
  { id: 3, name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop' },
  { id: 4, name: 'Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop' },
  { id: 5, name: 'Rice Atta and Dals', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop' },
  { id: 6, name: 'Masalas and Spices', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300&h=300&fit=crop' },
  { id: 7, name: 'Oils and Ghee', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop' },
  { id: 8, name: 'Munchies', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&h=300&fit=crop' },
]

// Section Header Component with arrows
function SectionHeader({ title, onScrollLeft, onScrollRight, hasMoreLeft, hasMoreRight }) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onScrollLeft}
          disabled={!hasMoreLeft}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all ${
            hasMoreLeft
              ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Previous"
        >
          <ChevronLeftIcon size={16} />
        </button>
        <button
          type="button"
          onClick={onScrollRight}
          disabled={!hasMoreRight}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all ${
            hasMoreRight
              ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Next"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}

// Grocery Category Card Component (square images with rounded corners)
function GroceryCategoryCard({ name, image }) {
  return (
    <div className="flex flex-col cursor-pointer group min-w-[100px] md:min-w-[140px]">
      <div className="w-24 h-24 md:w-36 md:h-36 rounded-xl overflow-hidden mb-2 transition-transform duration-200 group-hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-sm text-[#3d3d3d] font-medium">{name}</span>
    </div>
  )
}

// Main GroceriesCategories Component
export default function GroceriesCategories() {
  const grocerySliderRef = useRef(null)
  const [hasMoreLeft, setHasMoreLeft] = useState(false)
  const [hasMoreRight, setHasMoreRight] = useState(true)

  const checkScrollBoundaries = useCallback(() => {
    if (grocerySliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = grocerySliderRef.current
      const maxScroll = scrollWidth - clientWidth
      // Add small buffer (5px) for floating point precision
      setHasMoreLeft(scrollLeft > 5)
      setHasMoreRight(scrollLeft < maxScroll - 5 && maxScroll > 0)
    }
  }, [])

  useEffect(() => {
    const slider = grocerySliderRef.current
    if (!slider) return

    // Initial check
    checkScrollBoundaries()

    // Listen for scroll events
    slider.addEventListener('scroll', checkScrollBoundaries, { passive: true })
    
    // Also check on window resize
    window.addEventListener('resize', checkScrollBoundaries)

    return () => {
      slider.removeEventListener('scroll', checkScrollBoundaries)
      window.removeEventListener('resize', checkScrollBoundaries)
    }
  }, [checkScrollBoundaries])

  const scrollSlider = (direction) => {
    if (grocerySliderRef.current) {
      const scrollAmount = 300
      const targetScroll = grocerySliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      grocerySliderRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Shop groceries on Instamart"
          onScrollLeft={() => scrollSlider('left')}
          onScrollRight={() => scrollSlider('right')}
          hasMoreLeft={hasMoreLeft}
          hasMoreRight={hasMoreRight}
        />
        {/* Mobile & Desktop: Horizontal scrollable grocery cards */}
        <div
          ref={grocerySliderRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4"
        >
          <div className="flex gap-4 pb-4 min-w-max">
            {groceryCategories.map((category) => (
              <GroceryCategoryCard
                key={category.id}
                name={category.name}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
