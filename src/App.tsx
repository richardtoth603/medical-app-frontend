import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MedicalAppComponent } from './components/medical-app'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MedicalAppComponent />
    </>
  )
}

export default App
