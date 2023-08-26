import React from "react"
import { NavLink } from "react-router-dom"
import { auth } from "../library/services";

const Sidebar = () => {

    const handleLogout = async () => {
        localStorage.clear()
        window.location.href = '/'
    };

    const user = auth.getUserInfo()

    const items = [
        {
            link: <li><NavLink to="/LoginPage" onClick={handleLogout}><svg className="h-8 w-8 text-red-500 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />  <polyline points="16 17 21 12 16 7" />  <line x1="21" y1="12" x2="9" y2="12" /></svg><p>Logout</p></NavLink></li>,
            roles: ['Admin', 'Customer']
        }
    ]

    return (
        <>
            <div className='h-full w-fit p-2 sticky top-0'>
                <ul className='sidebar-group'>
                    {user?.role === 'Admin' && <li><NavLink to="/Dashboard"><svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />  <line x1="8" y1="21" x2="16" y2="21" />  <line x1="12" y1="17" x2="12" y2="21" /></svg><p>Dashboard</p></NavLink></li>}
                    {user?.role === 'Admin' && <li><NavLink to="/Product"><svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg><p>Products</p></NavLink></li>}
                    {user?.role === 'Admin' && <li><NavLink to="/Order"><svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="9" cy="21" r="1" />  <circle cx="20" cy="21" r="1" />  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg><p>Orders</p></NavLink></li>}
                    {user?.role === 'Admin' && <li><NavLink to="/Stock"><svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg><p>Stocks</p></NavLink></li>}
                    {user?.role === 'Admin' && <li><NavLink to="/Supplier"><svg className="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="7" cy="17" r="2" />  <circle cx="17" cy="17" r="2" />  <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />  <line x1="3" y1="9" x2="7" y2="9" /></svg><p>Suppliers</p></NavLink></li>}
                    {user?.role === 'Admin' && <li><NavLink to="/Profile"><svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><p>Profile</p></NavLink></li>}
                    {user?.role === 'Customer' && <li><NavLink to="/Shop"><svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg><p>Shop</p></NavLink></li>}
                    {user?.role === 'Customer' && <li><NavLink to="/MyCart"><svg class="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="9" cy="21" r="1" />  <circle cx="20" cy="21" r="1" />  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg><p>My Cart</p></NavLink></li>}
                    {user?.role === 'Customer' && <li><NavLink to="/ProfileCustomer"><svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><p>Profile</p></NavLink></li>}
                    {items.map(item => item.roles.includes(user?.role) && item.link)}
                </ul>
            </div>
        </>
    )
}

export default Sidebar
