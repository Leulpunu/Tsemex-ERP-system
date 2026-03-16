import { Building, Plus } from 'lucide-react'

const PropertyList = () => {
  const properties = [
    { _id: '1', name: 'Tsemex Tower', type: 'Commercial', address: 'Downtown Dubai', size: 5000, price: 2500000, status: 'available' },
    { _id: '2', name: 'Seaside Apartments', type: 'Residential', address: 'JBR Dubai', size: 2500, price: 1200000, status: 'rented' },
    { _id: '3', name: 'Grand Hotel', type: 'Hotel', address: 'Marina Dubai', size: 15000, price: 8500000, status: 'available' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'sold': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Building className="text-teal-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{property.name}</h3>
                <p className="text-sm text-gray-500">{property.type}</p>
              </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">{property.address}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="text-gray-800">{property.size.toLocaleString()} sq ft</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="text-gray-800 font-semibold">${property.price.toLocaleString()}</span>
              </div>

            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
          </div>
        ))}
      </div>
  )
}

export default PropertyList
