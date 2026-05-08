const SkeletonLoader = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export const RestaurantCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <SkeletonLoader className="h-40 w-full" />
      <div className="p-4 space-y-3">
        <SkeletonLoader height="h-5" width="w-3/4" />
        <SkeletonLoader height="h-4" width="w-1/2" />
        <SkeletonLoader height="h-4" width="w-1/4" />
      </div>
    </div>
  )
}

export const MenuItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex gap-4">
      <SkeletonLoader className="h-20 w-20 rounded-lg" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader height="h-5" width="w-3/4" />
        <SkeletonLoader height="h-4" width="w-full" />
        <SkeletonLoader height="h-4" width="w-1/2" />
      </div>
    </div>
  )
}

export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between">
        <SkeletonLoader height="h-5" width="w-1/3" />
        <SkeletonLoader height="h-6" width="w-1/4" />
      </div>
      <div className="space-y-2">
        <SkeletonLoader height="h-4" width="w-1/2" />
        <SkeletonLoader height="h-4" width="w-1/3" />
      </div>
      <SkeletonLoader height="h-10" width="w-1/4" />
    </div>
  )
}

export const CartItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-4">
      <SkeletonLoader className="h-16 w-16 rounded-lg" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader height="h-4" width="w-3/4" />
        <SkeletonLoader height="h-4" width="w-1/2" />
      </div>
      <SkeletonLoader height="h-8" width="w-8 rounded" />
    </div>
  )
}

export default SkeletonLoader
