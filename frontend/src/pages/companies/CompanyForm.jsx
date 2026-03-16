import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createCompany } from '../../store/slices/companySlice'

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'construction',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
    },
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(createCompany(formData))
    navigate('/companies')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Company</h1>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Company Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="construction">Construction</option>
            <option value="electro_mechanical">Electro-Mechanical</option>
            <option value="import_export">Import/Export</option>
            <option value="real_estate_hotel">Real Estate & Hotel</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={onChange}
            placeholder="Street"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={onChange}
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={onChange}
            placeholder="State"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={onChange}
            placeholder="Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Create Company
        </button>
      </form>
    </div>
  )
}

export default CompanyForm
