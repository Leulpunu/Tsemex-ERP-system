import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { api } from '../../api/client'
import { MessageCircle, Paperclip, Send, ThumbsUp, Bot } from 'lucide-react'
import io from 'socket.io-client'

const ChatWindow = ({ selectedRoom }) => {

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedRoom?._id) return
      setIsLoading(true)
      try {
        const response = await api.get(`/chat/rooms/${selectedRoom._id}/messages`)
        setMessages(response.data?.data || [])
      } catch {
        setMessages([])
      } finally {
        setIsLoading(false)
      }
    }
    loadMessages()
  }, [selectedRoom?._id])

  useEffect(() => {
    if (selectedRoom && user?.token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token: user.token }
      })
      setSocket(newSocket)

      newSocket.emit('joinRoom', selectedRoom._id)

      newSocket.on('newMessage', (message) => {
        setMessages(prev => [message, ...prev])
      })

      return () => newSocket.close()
    }
  }, [selectedRoom, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom) return

    // Optimistic update
    const tempMessage = {
      _id: Date.now(),
      content: newMessage,
      sender: { _id: user._id, name: user.name },
      createdAt: new Date()
    }
    setMessages(prev => [tempMessage, ...prev])
    setNewMessage('')

    try {
      await api.post(`/chat/rooms/${selectedRoom._id}/messages`, { content: newMessage })
    } catch (err) {
      console.error('Failed to send message')
    }
  }

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
          <p>Choose a conversation from the sidebar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {selectedRoom.participants[0]?.name[0] || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {selectedRoom.name || selectedRoom.participants.map(p => p.name).join(', ')}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedRoom.participants.length} participant{selectedRoom.participants.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message._id || index} 
              className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender._id === user._id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border shadow-sm'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                  <span>{new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <ThumbsUp size={12} className="cursor-pointer hover:scale-110" />
                </div>
              </div>
              {message.sender._id !== user._id && (
                <button 
                  className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                  title="AI reply suggestion"
                >
                  <Bot size={16} className="text-blue-500" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            />
            <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
              <Paperclip size={18} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-2xl text-white transition-colors flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow

