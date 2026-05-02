import React from 'react'
import { ShoppingCart, Heart, MapPin, Clock, Star } from 'lucide-react'

const UserDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your order history and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saved Addresses</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 text-sm mt-1">Your latest food orders</p>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4].map((order) => (
              <div key={order} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                    <p className="text-sm text-gray-600">HaveIt Restaurant • 2 items</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$23.45</p>
                    <span className="inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              View All Orders →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Restaurants</h2>
            <p className="text-gray-600 text-sm mt-1">Your saved restaurants</p>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { name: 'HaveIt Restaurant', rating: 4.5, orders: 12 },
              { name: 'Pizza Palace', rating: 4.3, orders: 8 },
              { name: 'Burger Barn', rating: 4.7, orders: 6 },
              { name: 'Sushi Spot', rating: 4.8, orders: 4 },
            ].map((restaurant, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <p className="text-sm text-gray-600">{restaurant.rating} • {restaurant.orders} orders</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Browse More Restaurants →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors">
              <ShoppingCart className="w-8 h-8 text-orange-600 mb-3" />
              <p className="font-medium text-gray-900">Order Food</p>
              <p className="text-sm text-gray-600 mt-1">Browse restaurants</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
              <Heart className="w-8 h-8 text-red-600 mb-3" />
              <p className="font-medium text-gray-900">View Favorites</p>
              <p className="text-sm text-gray-600 mt-1">Your saved items</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <MapPin className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-medium text-gray-900">Manage Addresses</p>
              <p className="text-sm text-gray-600 mt-1">Delivery locations</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
