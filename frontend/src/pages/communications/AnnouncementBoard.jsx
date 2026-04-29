import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createAnnouncement, getAnnouncements } from '../../store/slices/announcementSlice'
import { getDepartments } from '../../store/slices/departmentSlice'

const AnnouncementBoard = () => {
  const dispatch = useDispatch()
  const { announcements, isLoading } = useSelector((state) => state.announcements)
  const { departments } = useSelector((state) => state.departments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)
  const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      content: '',
      type: 'announcement',
      departmentId: '',
      date: new Date().toISOString().slice(0, 16),
      status: 'published',
    },
  })

  useEffect(() => {
    dispatch(getAnnouncements(companyId ? { companyId } : undefined))
    dispatch(getDepartments(companyId ? { companyId } : undefined))
  }, [dispatch, companyId])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        departmentId: data.departmentId || undefined,
        date: data.date ? new Date(data.date).toISOString() : undefined,
      }
      await dispatch(createAnnouncement({ announcementData: payload, companyId })).unwrap()
      toast.success('Announcement published')
      reset()
    } catch (error) {
      toast.error(error || 'Failed to publish announcement')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements & Meetings</h1>
        <p className="text-gray-600">Publish team-wide updates, meeting invites, and office notices.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input {...register('title', { required: true })} placeholder="Announcement title" className="px-3 py-2 rounded-lg border border-gray-300" />
        <select {...register('type')} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="announcement">announcement</option>
          <option value="meeting">meeting</option>
          <option value="policy">policy</option>
          <option value="event">event</option>
          <option value="urgent">urgent</option>
        </select>
        <select {...register('departmentId')} className="px-3 py-2 rounded-lg border border-gray-300">
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <input type="datetime-local" {...register('date')} className="px-3 py-2 rounded-lg border border-gray-300" />
        <textarea {...register('content', { required: true })} placeholder="Message content..." className="md:col-span-2 min-h-28 px-3 py-2 rounded-lg border border-gray-300" />
        <div className="md:col-span-2">
          <button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold">
            {isLoading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {announcements.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.departmentId?.name || 'All Departments'}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{item.type}</span>
            </div>
            <p className="text-gray-700 mt-3 whitespace-pre-wrap">{item.content}</p>
            <p className="text-xs text-gray-500 mt-3">
              {new Date(item.date || item.createdAt).toLocaleString()} by {item.createdBy?.name || 'System'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementBoard
