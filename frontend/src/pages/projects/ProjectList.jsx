import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HardHat, Plus, Trash2, Pencil } from 'lucide-react'
import { createProject, deleteProject, getProjects, updateProject } from '../../store/slices/projectSlice'

const ProjectList = () => {
  const dispatch = useDispatch()
  const { projects, isLoading, isError, message } = useSelector((state) => state.projects)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getProjects(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onCreate = async () => {
    const name = prompt('Project name')
    if (!name) return
    const startDate = prompt('Start date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10))
    if (!startDate) return
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(createProject({ projectData: { name, startDate: new Date(startDate).toISOString() }, companyId }))
  }

  const onEdit = async (project) => {
    const name = prompt('Project name', project.name)
    if (!name) return
    await dispatch(updateProject({ id: project._id, projectData: { name } }))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await dispatch(deleteProject(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardHat size={28} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load projects'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">
          {isLoading ? 'Loading…' : `${projects.length} project(s)`}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && projects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No projects found. Create your first project.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.projectCode || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button type="button" onClick={() => onDelete(p._id)} className="text-red-600 hover:text-red-900">
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

export default ProjectList
