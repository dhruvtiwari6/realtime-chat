import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import { Chat } from './pages/chat.tsx'
import { Register } from './pages/register.tsx'
import { Login } from './pages/login.tsx'
import { RootLayout } from './pages/RootLayout.tsx'
import { Logout } from './pages/logout.tsx'
import { UserProvider } from './pages/userProvider.tsx'


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
