import ChatSidebar from '../../components/Chat/ChatSidebar'
import ChatWindow from '../../components/Chat/ChatWindow'
import { useState } from 'react'

const ChatLayout = () => {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-0 lg:w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
        <ChatSidebar 
          isOpen={true}
          onClose={() => {}}
          onRoomSelect={setSelectedRoom}
        />
      </div>
      <div className="flex-1">
        <ChatWindow selectedRoom={selectedRoom} />
      </div>
    </div>
  )
}

export default ChatLayout

