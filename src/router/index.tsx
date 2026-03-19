import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/views/HomePage'
import ChatView from '@/views/ChatView'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    element: <ChatView />,
  },
])
