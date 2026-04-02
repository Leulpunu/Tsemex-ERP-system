import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetRoomsQuery } from '../../store/slices/chatSlice'
import { MessageCircle, Search, Plus, Users, X } from 'lucide-react'
import io from 'socket.io-client'

const ChatSidebar = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('')
  const [socket, setSocket] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const user = useSelector(state => state.auth.user)
  const token = user?.token

const { data: roomsData, isLoading, error } = useGetRoomsQuery()


  useEffect(() => {
    if (token && !socket) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      })
      setSocket(newSocket)
      
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [token, socket])

  const rooms = roomsData?.data || []


  const filteredRooms = rooms.filter(room => 
    room.name?.toLowerCase().includes(search.toLowerCase()) ||
    room.participants.some(p => p.name.toLowerCase().includes(search.toLowerCase()))
  )

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    if (socket) {
      socket.emit('joinRoom', room._id)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading chats...</div>
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[45] hidden lg:block"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full lg:w-96 h-screen bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <MessageCircle className="text-blue-600" size={24} />
          <h2 className="font-semibold text-gray-800 flex-1">Messages</h2>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Plus size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Users size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No chats yet</p>
              <p className="text-sm mt-1">Start a new conversation</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                  selectedRoom?._id === room._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => handleRoomSelect(room)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {room.participants[0]?.name[0] || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 truncate">
                      {room.name || room.participants.map(p => p.name).join(', ')}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {room.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(room.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default ChatSidebar
