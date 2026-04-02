import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateRoleMutation, useUpdateRoleMutation, useGetRolesQuery } from '../../store/slices/roleSlice'
import { Link, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Building2, Users, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const RoleForm = () => {
  const { id } = useParams()
  const { data: roles = [] } = useGetRolesQuery()
  const { createRole, isLoading: creating } = useCreateRoleMutation()
  const { updateRole, isLoading: updating } = useUpdateRoleMutation()
  const isEdit = !!id
  const isLoading = creating || updating

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateRole({ id, data }).unwrap()
        toast.success('Role updated')
      } else {
        await createRole(data).unwrap()
        toast.success('Role created')
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to save role')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/hr/roles" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
          Back to Roles
        </Link>
        <div className="flex items-center gap-2">
          {isEdit ? <Shield className="w-6 h-6 text-blue-600" /> : <Users className="w-6 h-6 text-indigo-600" />}
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Role' : 'New Role'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white rounded-xl shadow-sm border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Role name is required', maxLength: { value: 50, message: 'Max 50 chars' } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Finance Manager"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              {...register('department', { required: 'Department is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select department</option>
              <option value="C_SUIT">C-Suite</option>
              <option value="FINANCE">Finance</option>
              <option value="HR">Human Resources</option>
              <option value="SALES">Sales</option>
              <option value="OPERATIONS">Operations</option>
              <option value="CUSTOMER_SERVICE">Customer Service</option>
              <option value="PROJECT">Projects</option>
              <option value="IT">IT</option>
              <option value="LEGAL">Legal</option>
              <option value="RND">R&amp;D</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              {...register('level', { required: 'Level is required', min: { value: 1, message: 'Min 1' }, max: { value: 4, message: 'Max 4' } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select level</option>
              <option value={1}>1 - Executive</option>
              <option value={2}>2 - Manager</option>
              <option value={3}>3 - Supervisor</option>
              <option value={4}>4 - Staff</option>
            </select>
            {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Scope
            </label>
            <select
              {...register('dataScope')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="self">Self</option>
              <option value="team">Team</option>
              <option value="department">Department</option>
              <option value="cross_department">Cross Dept</option>
              <option value="enterprise">Enterprise</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Role responsibilities and scope..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Link
            to="/hr/roles"
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : (isEdit ? 'Update Role' : 'Create Role')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RoleForm

