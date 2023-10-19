import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from '../assets/profile.jpg';
import { auth } from '../library/services';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileCustomer = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regfirstname, setRegfirstname] = useState('');
    const [regLastname, setRegLastname] = useState('');
    const [regMiddle, setRegMiddle] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [inputType2, setInputType2] = useState('password');
    const [inputType3, setInputType3] = useState('password');
    const [eyeClosed2, setEyeClosed2] = useState(false);
    const [eyeClosed3, setEyeClosed3] = useState(false);
    const [showNotification2, setShowNotification2] = useState(false);
    const [notification, setNotification] = useState('');
    const userRole = auth.getUserInfo();

    const openModal = () => {
        setRegLastname(userRole.lastname)
        setRegfirstname(userRole.firstname)
        setRegMiddle(userRole.middle)
        setRegEmail(userRole.email)
        setRegUsername(userRole.username)
        setRegConfirm('')
        setRegPassword('')
        setCity(userRole.city)
        setBarangay(userRole.barangay)
        setProvince(userRole.province)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateInfo = async (e) => {
        try {
            if (!regUsername || !regPassword || !regConfirm || !regEmail || !regLastname || !regfirstname || !regMiddle || !barangay || !city || !province) {
                setNotification('Please fill in all required fields.');
                return;
            }
            if (regPassword !== regConfirm) {
                setNotification('Passwords do not match.');
                return;
            } else {
                const response = await axios.put('http://localhost:8888/api/update-customer', {
                    id: userRole.user_id,
                    username: regUsername,
                    password: regConfirm,
                    email: regEmail,
                    lastname: regLastname,
                    firstname: regfirstname,
                    middle: regMiddle,
                    barangay: barangay,
                    city: city,
                    province: province,
                });
                console.log('Profile updated:', response.data);
                setRegLastname('')
                setRegfirstname('')
                setRegMiddle('')
                setRegEmail('')
                setRegUsername('')
                setRegPassword('')
                setRegConfirm('')
                setCity('')
                setBarangay('')
                setProvince('')
                closeModal();
                setShowNotification2(true)
            }

        } catch (error) {
            console.error('Error editing profile:', error);
            setNotification('An error occurred while editing the profile.');
        }
    }

    const toggleInputType2 = () => {
        setInputType2((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed2((prevClosed) => !prevClosed);
    };
    const toggleInputType3 = () => {
        setInputType3((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed3((prevClosed) => !prevClosed);
    };

    const logout = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: [null, 1, 1],
                    y: [null, -20, 0],
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="w-full h-full m-2 p-2">
                <div className='flex items-center justify-between mb-2'>
                    <h1 className='text-2xl xl:text-4xl text-white font-bold'>Profile</h1>
                </div>
                <div className='w-5/6 bg-slate-800 p-4 flex flex-col items-center lg:flex-row lg:items-start rounded-lg mt-5'>
                    <div className='w-72 flex justify-center'>
                        <button className='w-44 h-44 bg-white rounded-full overflow-hidden'><img  alt="" className='w-full h-full' /></button>
                    </div>
                    <div className='w-full h-full px-7'>
                        <h1 className='text-white text-xl font-bold'>Personal Information:</h1>
                        <div className="border-b-4 border-white rounded-xl"></div>
                        <div className='profile-customer'>
                            <h1>User ID:</h1>
                            <p>{userRole.user_id}</p>
                        </div>
                        <div className='profile-customer'>
                            <h1>Last Name:</h1>
                            <p>{userRole.lastname}</p>
                        </div>
                        <div className='profile-customer'>
                            <h1>First Name:</h1>
                            <p>{userRole.firstname}</p>
                        </div>
                        <div className='profile-customer'>
                            <h1>Middle Initial:</h1>
                            <p>{userRole.middle}</p>
                        </div>
                        <div className='profile-customer'>
                            <h1>Email:</h1>
                            <p>{userRole.email}</p>
                        </div>
                        <div className='profile-customer'>
                            <h1>username:</h1>
                            <p>{userRole.username}</p>
                        </div>
                        <h1 className='text-white text-xl font-bold mt-4'>Address:</h1>
                        <div className="border-b-4 border-white rounded-xl"></div>
                        <div className='w-full flex flex-col xl:flex-row'>
                            <div className='profile-customer-address'>
                                <h1>Barangay:</h1>
                                <p>{userRole.barangay}</p>
                            </div>
                            <div className='profile-customer-address'>
                                <h1>City/Municipality:</h1>
                                <p>{userRole.city}</p>
                            </div>
                            <div className='profile-customer-address'>
                                <h1>Province:</h1>
                                <p>{userRole.province}</p>
                            </div>
                        </div>
                        <div className='w-full flex justify-end mt-5'>
                            <button onClick={() => openModal()} className='bg-neutral-600 w-14 h-10 rounded-md hover:bg-neutral-500 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150'>
                                <svg className="h-7 text-white w-full hover:text-green-600" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                    <line x1="16" y1="5" x2="19" y2="8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-5/6 md:w-4/6 lg:w-1/2 h-fit flex flex-col bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
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
                            <div className='register-group-address'>
                                <div>
                                    <label htmlFor="barangay">Barangay:</label>
                                    <input type="text" name="" id="barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="city">City:</label>
                                    <input type="text" name="" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="province">Province:</label>
                                    <input type="text" name="" id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
                                </div>
                            </div>
                            <p className='text-white text-center w-full font-bold'>{notification}</p>
                            <div className="flex h-full items-end justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={updateInfo} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Update</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showNotification2 && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-96 h-36 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Profile Updated: Logout Required</h2>
                            <div className="flex justify-end">
                                <button onClick={logout} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ProfileCustomer