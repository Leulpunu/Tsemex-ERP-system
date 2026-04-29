import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, getTasks, updateTask } from '../../store/slices/taskSlice'
import { getDepartments } from '../../store/slices/departmentSlice'
import { getEmployees } from '../../store/slices/employeeSlice'
import { getKpis } from '../../store/slices/kpiSlice'

const TaskBoard = () => {
  const dispatch = useDispatch()
  const { tasks, isLoading } = useSelector((state) => state.tasks)
  const { departments } = useSelector((state) => state.departments)
  const { employees } = useSelector((state) => state.employees)
  const { kpis } = useSelector((state) => state.kpis)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      departmentId: '',
      assignedTo: '',
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      priority: 'medium',
      status: 'pending',
      kpiId: '',
    },
  })

  const selectedDepartment = watch('departmentId')

  useEffect(() => {
    dispatch(getTasks(companyId ? { companyId } : undefined))
    dispatch(getDepartments(companyId ? { companyId } : undefined))
    dispatch(getEmployees(companyId ? { companyId } : undefined))
    dispatch(getKpis())
  }, [dispatch, companyId])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        kpiId: data.kpiId || undefined,
        dueDate: new Date(data.dueDate).toISOString(),
      }
      await dispatch(createTask({ taskData: payload, companyId })).unwrap()
      toast.success('Task assigned successfully')
      reset()
    } catch (error) {
      toast.error(error || 'Failed to create task')
    }
  }

  const onStatusChange = async (task, status) => {
    try {
      await dispatch(updateTask({ id: task._id, taskData: { status } })).unwrap()
      toast.success('Task updated')
    } catch (error) {
      toast.error(error || 'Failed to update task')
    }
  }

  const filteredEmployees = selectedDepartment
    ? employees.filter((e) => (e.departmentId?._id || e.departmentId) === selectedDepartment)
    : employees

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Task Breakdown</h1>
        <p className="text-gray-600">Assign manager-to-officer tasks linked to KPI targets.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input {...register('title', { required: true })} placeholder="Task title" className="px-3 py-2 rounded-lg border border-gray-300" />
        <select {...register('departmentId', { required: true })} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <select {...register('assignedTo', { required: true })} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="">Assign to officer</option>
          {filteredEmployees.map((e) => (
            <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>
          ))}
        </select>
        <input type="date" {...register('dueDate', { required: true })} className="px-3 py-2 rounded-lg border border-gray-300" />
        <select {...register('priority')} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="critical">critical</option>
        </select>
        <select {...register('kpiId')} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="">Link KPI (optional)</option>
          {kpis.map((k) => (
            <option key={k._id} value={k._id}>{k.title}</option>
          ))}
        </select>
        <textarea {...register('description')} placeholder="Description" className="md:col-span-2 lg:col-span-3 px-3 py-2 rounded-lg border border-gray-300 min-h-24" />
        <div className="md:col-span-2 lg:col-span-3">
          <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
            {isLoading ? 'Saving...' : 'Assign Task'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">{tasks.length} task(s)</div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Officer</th>
              <th className="px-4 py-2 text-left">KPI</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t border-gray-100">
                <td className="px-4 py-2">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-gray-500">{task.priority}</div>
                </td>
                <td className="px-4 py-2">{task.departmentId?.name || '-'}</td>
                <td className="px-4 py-2">{task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : '-'}</td>
                <td className="px-4 py-2">{task.kpiId?.title || '-'}</td>
                <td className="px-4 py-2">
                  <select value={task.status} onChange={(e) => onStatusChange(task, e.target.value)} className="px-2 py-1 rounded border border-gray-300">
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="overdue">overdue</option>
                  </select>
                </td>
                <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskBoard
