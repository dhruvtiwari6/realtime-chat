import {Route ,Routes ,createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate} from 'react-router-dom'
import { Chat } from './pages/chat'
import { Register } from './pages/register'
import { Login } from './pages/login'
import { RootLayout } from './pages/RootLayout'
import { Logout } from './pages/logout'
import { UserProvider } from './pages/userProvider.jsx'


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element = {<RootLayout/>}>
        <Route path ='/chat' element = {<Chat/>} />
        <Route path ='/register' element = {<Register/>} />
        <Route path= '/login' element = {<Login/>} />
        <Route path='/logout' element = {<Logout/>} />
        </Route>
    )
  )

  return ( 
    <UserProvider>
          <RouterProvider router={router} />
    </UserProvider>

)
}

export default App
