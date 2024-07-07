import { useEffect, useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((swReg) => {
          console.log('Service Worker registered', swReg);

          // Requesting notification permission
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
              // You can now subscribe the user to push notifications
              console.log('Subscribing to push notifications...', permission);
            } else {
              console.log('Notification permission denied.');
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed', error);
        });
    }
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="logo" alt="tessarus-pwa logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className='text-orange-300'>tessarus-pwa</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
