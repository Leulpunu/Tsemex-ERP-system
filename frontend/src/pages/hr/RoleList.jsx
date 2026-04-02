import { useState } from 'react'
import { useGetRolesQuery, useDeleteRoleMutation } from '../../store/slices/roleSlice'
import { Plus, Trash2, Edit3, Users, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const RoleList = () => {
  const { data: roles = [], isLoading } = useGetRolesQuery()
  const [deleteRole] = useDeleteRoleMutation()
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this role? Users assigned will lose role assignment.')) return
    setDeletingId(id)
    try {
      await deleteRole(id).unwrap()
      toast.success('Role deleted')
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete role')
    }
    setDeletingId(null)
  }

  if (isLoading) {
    return <div>Loading roles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={28} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        </div>
        <Link to="/hr/roles/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={18} />
          New Role
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Scope</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {role.department.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Level {role.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {role.dataScope}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link
                    to={`/hr/roles/${role._id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(role._id)}
                    disabled={deletingId === role._id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoleList

