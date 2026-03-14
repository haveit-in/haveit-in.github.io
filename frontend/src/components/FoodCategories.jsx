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

// Food categories data - Row 1 and Row 2 combined (14 items total)
const foodCategories = [
  // Row 1
  { id: 1, name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop' },
  { id: 2, name: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop' },
  { id: 3, name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop' },
  { id: 4, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop' },
  { id: 5, name: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=300&fit=crop' },
  { id: 6, name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop' },
  // { id: 7, name: 'Idly', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop' },
  // Row 2
  { id: 8, name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop' },
  // { id: 9, name: 'Shawarma', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=300&fit=crop' },
  { id: 10, name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop' },
  { id: 11, name: 'Noodles', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop' },
  { id: 12, name: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop' },
  { id: 13, name: 'Shake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop' },
  { id: 14, name: 'Vada', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop' },
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

// Food Category Card Component
function FoodCategoryCard({ name, image }) {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mb-2 transition-transform duration-200 group-hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-sm text-[#3d3d3d] text-center font-medium">{name}</span>
    </div>
  )
}

// Main FoodCategories Component
export default function FoodCategories() {
  const foodSliderRef = useRef(null)
  const [hasMoreLeft, setHasMoreLeft] = useState(false)
  const [hasMoreRight, setHasMoreRight] = useState(true)

  const checkScrollBoundaries = useCallback(() => {
    if (foodSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = foodSliderRef.current
      const maxScroll = scrollWidth - clientWidth
      // Add small buffer (5px) for floating point precision
      setHasMoreLeft(scrollLeft > 5)
      setHasMoreRight(scrollLeft < maxScroll - 5 && maxScroll > 0)
    }
  }, [])

  useEffect(() => {
    const slider = foodSliderRef.current
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
    if (foodSliderRef.current) {
      const scrollAmount = 300
      const targetScroll = foodSliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      foodSliderRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Food Categories Section */}
        <SectionHeader
          title="Order our best food options"
          onScrollLeft={() => scrollSlider('left')}
          onScrollRight={() => scrollSlider('right')}
          hasMoreLeft={hasMoreLeft}
          hasMoreRight={hasMoreRight}
        />

        {/* Mobile: Horizontal scrollable grid (3 columns visible) */}
        <div
          ref={foodSliderRef}
          className="md:hidden overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4"
        >
          <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-4 min-w-max">
            {foodCategories.map((category) => (
              <FoodCategoryCard
                key={category.id}
                name={category.name}
                image={category.image}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 2 rows × 7 columns grid */}
        <div className="hidden md:grid grid-cols-7 gap-x-4 gap-y-6">
          {foodCategories.map((category) => (
            <FoodCategoryCard
              key={category.id}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
