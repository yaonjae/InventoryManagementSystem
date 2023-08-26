import './index.css'
import Dashboard from './pages/Dashboard'
import Product from './pages/Product'
import Supplier from './pages/Supplier'
import Stock from './pages/Stock'
import Profile from './pages/Profile'
import Order from './pages/Order'
import LoginPage from './LoginPage'
import { Routes, Route, BrowserRouter, useNavigate, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import { PrivateLayout, PublicLayout } from './layout/module'
import { auth } from './library/services'
import Shop from './pages/Shop'
import MyCart from './pages/MyCart'
import ProfileCustomer from './pages/ProfileCustomer'

function App() {
  const userRole = auth.getUserInfo()
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<PublicLayout />} >
          <Route index path='/LoginPage' element={<LoginPage />} />
          <Route path='*' element={<Navigate to='/LoginPage' replace />} />
        </Route>
        <Route element={<PrivateLayout />}>
          {userRole?.role === 'Admin' &&
            <>
              <Route index path='/Dashboard' element={<Dashboard />} />
              <Route path='/Product' element={<Product />} />
              <Route path='/Order' element={<Order />} />
              <Route path='/Stock' element={<Stock />} />
              <Route path='/Supplier' element={<Supplier />} />
              <Route path='/Profile' element={<Profile />} />
              <Route path='*' element={<Navigate to='/Dashboard' replace />} />
            </>
          }
          {userRole?.role === 'Customer' &&
            <>
              <Route index path='/Shop' element={<Shop />} />
              <Route index path='/MyCart' element={<MyCart />} />
              <Route index path='/ProfileCustomer' element={<ProfileCustomer />} />
            </>
          }
        </Route>
      </>
    )
  )


  return (
    <RouterProvider router={router} />
  )
}

export default App
