import React from 'react';
import './index.css'
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inputType, setInputType] = useState('password');
    const [eyeClosed, setEyeClosed] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8888/api/login', { username, password });
            console.log(response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const toggleInputType = () => {
        setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed((prevClosed) => !prevClosed);
    };

    return (
        <>
            <div className='m-0 flex justify-center w-full h-screen items-center bg-gradient-to-r from-neutral-700 to-neutral-900'>
                <div className='w-[450px] md:w-[700px] h-[400px] m-2 relative flex justify-center md:justify-end rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]'>
                    <div className='w-full h-full p-5 flex items-center'>
                        <div className='w-[250px] h-fit hidden md:block'>
                            <h1 className='text-3xl font-bold text-white uppercase'>Inventory Management System</h1>
                            <p className='w-full border-2 border-white rounded my-3'></p>
                            <h4 className='text-lg font-bold text-white uppercase'>Jae A. Yaon</h4>
                        </div>
                    </div>
                    <div className='absolute w-[400px] h-[550px] md:h-[500px] p-5 bg-opacity-80 bg-slate-800 my-auto bottom-0 top-0 right-auto md:right-3 rounded-lg shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]'>
                        <div className='w-full h-full p-3 flex flex-col justify-center'>
                            <div className='w-full h-fit mb-5 block md:hidden text-center bg-slate-900 p-4 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                                <h1 className='text-xl font-bold text-white uppercase'>Inventory Management System</h1>
                                <p className='w-full border-2 border-white rounded my-3'></p>
                                <h4 className='text-base font-bold text-white uppercase'>Jae A. Yaon</h4>
                            </div>
                            <div className='w-full my-2'>
                                <label htmlFor="username" className='text-white font-bold text-lg'>Username:</label>
                                <input type="text" name="" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className='w-full bg-transparent border-b-2 border-white p-2 text-white outline-none' />
                            </div>
                            <div className='w-full my-2'>
                                <label htmlFor="password" className='text-white font-bold text-lg'>Password:</label>
                                <div className='flex border-b-2 border-white relative'>
                                    <input type={inputType} name="" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full bg-transparent p-2 pr-12 text-white outline-none' />
                                    <button onClick={toggleInputType}>
                                        {eyeClosed ? (
                                            <svg class="h-8 w-8 text-white absolute right-1 top-1 bottom-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg class="h-8 w-8 text-white absolute right-1 top-1 bottom-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className='w-full flex justify-center my-5'>
                                <button onClick={handleLogin} className='w-full font-bold p-3 text-xl bg-neutral-700 rounded text-neutral-400 hover:bg-green-800 hover:text-white hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-150'>Login</button>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    <input type="checkbox" name="" id="remember" />
                                    <label htmlFor="remember" className='ml-1 text-white'>Remember me</label>
                                </div>
                                <a href="" className='text-white hover:underline'>Forgot Password?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage