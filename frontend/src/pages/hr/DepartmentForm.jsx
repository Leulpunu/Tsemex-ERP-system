import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedDepartment, createDepartment, getDepartment, updateDepartment } from '../../store/slices/departmentSlice'

const DepartmentForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedDepartment, isLoading, isError, message } = useSelector((state) => state.departments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedDepartment())
      reset({ name: '' })
      return
    }
    dispatch(getDepartment(id))
    return () => dispatch(clearSelectedDepartment())
  }, [dispatch, id, isEdit, reset])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedDepartment?._id) return
    reset({ name: selectedDepartment.name || '' })
  }, [isEdit, reset, selectedDepartment])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateDepartment({ id, departmentData: { name: data.name } })).unwrap()
        toast.success('Department updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createDepartment({ departmentData: { name: data.name }, companyId })).unwrap()
        toast.success('Department created')
      }
      navigate('/departments')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Department' : 'New Department'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/departments')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Department'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DepartmentForm

