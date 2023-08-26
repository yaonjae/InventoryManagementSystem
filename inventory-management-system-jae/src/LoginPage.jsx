import React from 'react';
import './index.css'
import { useState } from 'react';
import axios from 'axios';
import { auth } from './library/services';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regfirstname, setRegfirstname] = useState('');
    const [regLastname, setRegLastname] = useState('');
    const [regMiddle, setRegMiddle] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [inputType, setInputType] = useState('password');
    const [inputType2, setInputType2] = useState('password');
    const [inputType3, setInputType3] = useState('password');
    const [eyeClosed, setEyeClosed] = useState(false);
    const [eyeClosed2, setEyeClosed2] = useState(false);
    const [eyeClosed3, setEyeClosed3] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [notification, setNotification] = useState('');

    const checkRequiredFields = () => {
        if (
            username.trim() === '' ||
            password.trim() === ''
        ) {
            setNotification('Please fill out all required fields.');
            setShowModal(true);
            return false;
        }
        return true;
    };

    const checkRequiredFieldsRegister = () => {
        if (
            regUsername.trim() === '' ||
            regPassword.trim() === '' ||
            regConfirm.trim() === '' ||
            regfirstname.trim() === '' ||
            regLastname.trim() === '' ||
            regMiddle.trim() === '' ||
            regEmail.trim() === ''
        ) {
            setNotification('Please fill out all required fields.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!checkRequiredFields()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:8888/api/login',
                { username, password });
            auth.storeToken("Bearer " + response.data.token)
            window.location.href = '/';
        } catch (error) {
            console.error('Login failed:', error);
            setNotification('Incorrect Username or Password');
            setShowModal(true);
        }
    };

    const handleRegister = async () => {
        setShowRegistration(true)
    }

    const register = async (e) => {
        if (!checkRequiredFieldsRegister()) {
            return;
        }
        if (regPassword === regConfirm) {
            try {

                const response = await axios.post('http://localhost:8888/register', {
                    username: regUsername,
                    password: regConfirm,
                    lastname: regLastname,
                    firstname: regfirstname,
                    middle: regMiddle,
                    email: regEmail,
                    role: 'Customer'
                });

                console.log('User registered:', response.data);

                setShowRegistration(false);
                setNotification('Registration Success');
                setShowModal(true);
            } catch (error) {
                console.error('Registration failed:', error);
                setNotification('Registration failed');
            }
        } else {
            setNotification('Passwords do not match')
        }
    }

    const toggleInputType = () => {
        setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed((prevClosed) => !prevClosed);
    };
    const toggleInputType2 = () => {
        setInputType2((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed2((prevClosed) => !prevClosed);
    };
    const toggleInputType3 = () => {
        setInputType3((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed3((prevClosed) => !prevClosed);
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
                                            <svg className="h-8 w-8 text-white absolute right-1 top-1 bottom-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-8 w-8 text-white absolute right-1 top-1 bottom-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className='w-full flex flex-col justify-center items-center my-5'>
                                <button onClick={handleLogin} className='w-full font-bold p-3 text-xl bg-neutral-700 rounded text-neutral-400 hover:bg-green-800 hover:text-white hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-150'>Login</button>
                                <div className='w-full flex justify-center items-center gap-2 mt-4'>
                                    <p className='text-white text-lg'>Don't have an account?</p>
                                    <button onClick={handleRegister} className='text-green-700 text-lg font-bold hover:underline'>Signup</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-96 h-36 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">{notification}</h2>
                            <div className="flex justify-end">
                                <button onClick={() => { setShowModal(false), setUsername(''), setPassword('') }} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showRegistration && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-[500px] h-fit flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h1 className='mb-3 text-3xl font-bold text-white text-center'>Register</h1>
                            <div className='register-group'>
                                <label htmlFor="last">Last Name:</label>
                                <input type="text" name="" id="last" value={regLastname} onChange={(e) => setRegLastname(e.target.value)} />
                            </div>
                            <div className='register-group'>
                                <label htmlFor="first">First Name:</label>
                                <input type="text" name="" id="first" value={regfirstname} onChange={(e) => setRegfirstname(e.target.value)} />
                            </div>
                            <div className='register-group'>
                                <label htmlFor="middle">Middle Initial:</label>
                                <input type="text" name="" id="middle" value={regMiddle} onChange={(e) => setRegMiddle(e.target.value)} />
                            </div>
                            <div className='register-group'>
                                <label htmlFor="email">Email:</label>
                                <input type="text" name="" id="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                            </div>
                            <div className='register-group'>
                                <label htmlFor="regUsername">Username:</label>
                                <input type="text" name="" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
                            </div>
                            <div className='register-group-password'>
                                <div>
                                    <label htmlFor="regPassword">Password:</label>
                                    <input type={inputType2} name="" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                                    <button onClick={toggleInputType2}>
                                        {eyeClosed2 ? (
                                            <svg className="h-6 w-6 text-white absolute right-3 top-6 bottom-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-6 w-6 text-white absolute right-3 top-6 bottom-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div>
                                    <label htmlFor="regConfirm">Confirm Password:</label>
                                    <input type={inputType3} name="" id="regConfirm" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                                    <button onClick={toggleInputType3}>
                                        {eyeClosed3 ? (
                                            <svg className="h-6 w-6 text-white absolute right-3 top-6 bottom-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-6 w-6 text-white absolute right-3 top-6 bottom-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className='w-full text-center mb-5 text-white font-bold text-lg'>{notification}</p>
                            <div className="flex justify-end">
                                <button onClick={() => setShowRegistration(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={register} className="px-4 py-2 text-white bg-slate-900 hover:bg-green-800 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Register</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default LoginPage