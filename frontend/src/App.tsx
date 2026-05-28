import { useEffect, useState } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Connecting...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendStatus(`Connected (Backend time: ${data.timestamp})`))
      .catch(() => setBackendStatus('Failed to connect to backend api'))
  }, [])

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Coworking Booking Platform</h1>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>
        Backend Status: <span style={{ color: backendStatus.startsWith('Connected') ? '#4caf50' : '#f44336' }}>{backendStatus}</span>
      </p>
    </div>
  )
}

export default App
