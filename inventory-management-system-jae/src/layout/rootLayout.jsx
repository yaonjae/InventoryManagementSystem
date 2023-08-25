import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { auth } from '../library/services'

export const RootLayout = () => {

    const userRole = auth.getUserInfo()

    return (
        <div className='flex'>
            <Sidebar />
            <Outlet />
        </div>
    )
}
