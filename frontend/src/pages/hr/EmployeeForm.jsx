import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createEmployee, getEmployee, updateEmployee, clearSelectedEmployee } from '../../store/slices/employeeSlice'
import { getDepartments } from '../../store/slices/departmentSlice'

const EmployeeForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedEmployee, isLoading, isError, message } = useSelector((state) => state.employees)
  const { departments } = useSelector((state) => state.departments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    joinDate: '',
    position: '',
    departmentId: '',
  })

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getDepartments(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedEmployee())
      return
    }
    dispatch(getEmployee(id))
    return () => {
      dispatch(clearSelectedEmployee())
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit || !selectedEmployee?._id) return
    setFormData({
      firstName: selectedEmployee.firstName || '',
      lastName: selectedEmployee.lastName || '',
      email: selectedEmployee.email || '',
      phone: selectedEmployee.phone || '',
      joinDate: selectedEmployee.joinDate ? String(selectedEmployee.joinDate).slice(0, 10) : '',
      position: selectedEmployee.position || '',
      departmentId: selectedEmployee.departmentId?._id || selectedEmployee.departmentId || '',
    })
  }, [isEdit, selectedEmployee])

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    if (isEdit) {
      await dispatch(updateEmployee({ id, employeeData: formData }))
    } else {
      await dispatch(createEmployee({ employeeData: formData, companyId }))
    }
    navigate('/employees')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>

      {isError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Something went wrong'}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">First name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Last name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Join date</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">—</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
            <input
              name="position"
              value={formData.position}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Employee'}
        </button>
      </form>
    </div>
  )
}

export default EmployeeForm

