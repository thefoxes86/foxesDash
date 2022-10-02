import { FC, useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import { WithChildren } from './interfaces/type'
import { SnackbarProvider } from 'notistack'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Domains from './pages/Domains'
import Login from './pages/Login'
import { initBackend } from './utils/backendless'
import SignUp from './pages/SignUp'

const App: FC<WithChildren<{}>> = () => {
  const navigate = useNavigate()

  useEffect(() => {
    initBackend()
    Backendless.UserService.isValidLogin().then((res: any) => {
      !res && navigate('/login')
    })
  }, [])
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Layout component={<Dashboard />} />} />
          <Route path="/domains" element={<Layout component={<Domains />} />} />
        </Routes>
      </SnackbarProvider>
    </div>
  )
}

export default App
