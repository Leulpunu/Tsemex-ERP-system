import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Building, Pencil } from 'lucide-react'
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../../store/slices/departmentSlice'

const DepartmentList = () => {
  const dispatch = useDispatch()
  const { departments, isLoading, isError, message } = useSelector((state) => state.departments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getDepartments(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onCreate = async () => {
    const name = prompt('Department name')
    if (!name) return
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(createDepartment({ departmentData: { name }, companyId }))
  }

  const onEdit = async (dept) => {
    const name = prompt('New department name', dept.name)
    if (!name || name === dept.name) return
    await dispatch(updateDepartment({ id: dept._id, departmentData: { name } }))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this department?')) return
    await dispatch(deleteDepartment(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building size={28} className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus size={18} />
          New Department
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load departments'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                  No departments found. Create your first department.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.manager?.name || 'TBD'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(dept)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(dept._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DepartmentList
