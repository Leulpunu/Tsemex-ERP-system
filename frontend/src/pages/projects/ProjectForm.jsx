import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedProject, createProject, getProject, updateProject } from '../../store/slices/projectSlice'

const ProjectForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedProject, isLoading, isError, message } = useSelector((state) => state.projects)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      startDate: new Date().toISOString().slice(0, 10),
      status: 'planning',
      priority: 'medium',
      budget: 0,
      description: '',
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedProject())
      return
    }
    dispatch(getProject(id))
    return () => dispatch(clearSelectedProject())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedProject?._id) return
    reset({
      name: selectedProject.name || '',
      startDate: selectedProject.startDate ? String(selectedProject.startDate).slice(0, 10) : '',
      status: selectedProject.status || 'planning',
      priority: selectedProject.priority || 'medium',
      budget: selectedProject.budget ?? 0,
      description: selectedProject.description || '',
    })
  }, [isEdit, reset, selectedProject])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      startDate: new Date(data.startDate).toISOString(),
      status: data.status,
      priority: data.priority,
      budget: Number(data.budget || 0),
      description: data.description || '',
    }

    try {
      if (isEdit) {
        await dispatch(updateProject({ id, projectData: payload })).unwrap()
        toast.success('Project updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createProject({ projectData: payload, companyId })).unwrap()
        toast.success('Project created')
      }
      navigate('/projects')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Project' : 'New Project'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Start date</label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Budget</label>
            <input
              type="number"
              step="0.01"
              {...register('budget', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="planning">planning</option>
              <option value="in_progress">in_progress</option>
              <option value="on_hold">on_hold</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description (optional)</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm

