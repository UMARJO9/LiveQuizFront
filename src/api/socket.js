import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || 'http://127.0.0.1:8000'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (token) {
    socket.auth = { token }
  }
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

export default socket
