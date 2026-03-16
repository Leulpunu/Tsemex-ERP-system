import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Pencil, Users } from 'lucide-react'
import { deleteEmployee, getEmployees } from '../../store/slices/employeeSlice'

const EmployeeList = () => {
  const dispatch = useDispatch()
  const { employees, isLoading, isError, message } = useSelector((state) => state.employees)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getEmployees(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    await dispatch(deleteEmployee(id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link
          to="/employees/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Employee
        </Link>
      </div>

      {isError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load employees'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="text-blue-600" size={16} />
                    </div>
                    <span className="ml-3 font-medium text-gray-800">
                      {employee.firstName} {employee.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.position || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.departmentId?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/employees/${employee._id}/edit`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(employee._id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeList
