import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { RootLayout } from './rootLayout'
import { auth } from '../library/services'

export const PublicLayout = () => {
  const token = localStorage.getItem('token')
  const user = auth.getUserInfo();
  if(token) {
    if (user?.role === 'Admin') {
      window.location.href = '/Dashboard'
    } else {
      window.location.href = '/Shop'
    }
  }else{
    return <div>
        <Outlet />
    </div>
  }
}

export const PrivateLayout = () => {
    const token = localStorage.getItem('token')
    if(!token) {
      window.location.href = '/LoginPage'
    }else{
        return <RootLayout />
    }
}

