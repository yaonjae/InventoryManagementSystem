import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../library/services';
import profileImage from '../assets/profile.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {

    const userRole = auth.getUserInfo();
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showNotification2, setShowNotification2] = useState(false);
    const [notification, setNotification] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regfirstname, setRegfirstname] = useState('');
    const [regLastname, setRegLastname] = useState('');
    const [regMiddle, setRegMiddle] = useState('');
    const [regRole, setRegRole] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regBarangay, setRegbarangay] = useState('');
    const [regCity, setRegCity] = useState('');
    const [regProvince, setRegProvince] = useState('');
    const [inputType2, setInputType2] = useState('password');
    const [inputType3, setInputType3] = useState('password');
    const [eyeClosed2, setEyeClosed2] = useState(false);
    const [eyeClosed3, setEyeClosed3] = useState(false);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8888/user');
            setProfiles(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchProfiles();
        searchProfile();
    }, [searchQuery, profiles]);

    const searchProfile = () => {
        const filteredProfiles = profiles.filter((profile) => {
            if (searchQuery.trim() === '') {
                return true;
            }
            return (
                profile.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                profile.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                profile.role.toLowerCase().includes(searchQuery.toLowerCase())

            );
        });
        setFilteredProfiles(filteredProfiles);
    };

    const formatAddress = (profile) => {
        const addressParts = [];
        if (profile.barangay) {
            addressParts.push(profile.barangay);
        }
        if (profile.city) {
            addressParts.push(profile.city);
        }
        if (profile.province) {
            addressParts.push(profile.province);
        }
        return addressParts.join(', ');
    };

    const openModal = () => {
        setShowModal(true);
        setIsEditMode(true);
        setRegLastname(userRole.lastname)
        setRegfirstname(userRole.firstname)
        setRegMiddle(userRole.middle)
        setRegEmail(userRole.email)
        setRegUsername(userRole.username)
        setRegRole(userRole.role)
        setRegConfirm('')
        setRegPassword('')
        setRegCity(userRole.city)
        setRegbarangay(userRole.barangay)
        setRegProvince(userRole.province)
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModalAdd = () => {
        setShowModal(true);
        setIsEditMode(false);
        setRegLastname('')
        setRegfirstname('')
        setRegMiddle('')
        setRegEmail('')
        setRegUsername('')
        setRegRole(null)
        setRegPassword('')
        setRegConfirm('')
        setRegCity('')
        setRegbarangay('')
        setRegProvince('')
    };

    const toggleInputType2 = () => {
        setInputType2((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed2((prevClosed) => !prevClosed);
    };
    const toggleInputType3 = () => {
        setInputType3((prevType) => (prevType === 'password' ? 'text' : 'password'));
        setEyeClosed3((prevClosed) => !prevClosed);
    };

    const editProfile = async () => {
        try {
            if (!regUsername || !regPassword || !regConfirm || !regEmail || !regRole || !regLastname || !regfirstname || !regMiddle || !regBarangay || !regCity || !regProvince) {
                setNotification('Please fill in all required fields.');
                return;
            }
            if (regPassword !== regConfirm) {
                setNotification('Passwords do not match.');
                return;
            } else {
                const response = await axios.put('http://localhost:8888/api/update-user', {
                    id: userRole.user_id,
                    username: regUsername,
                    password: regConfirm,
                    email: regEmail,
                    role: regRole,
                    lastname: regLastname,
                    firstname: regfirstname,
                    middle: regMiddle,
                    barangay: regBarangay,
                    city: regCity,
                    province: regProvince,
                });
                console.log('Product added:', response.data);
                fetchProfiles();
                setRegLastname('')
                setRegfirstname('')
                setRegMiddle('')
                setRegEmail('')
                setRegUsername('')
                setRegRole(null)
                setRegPassword('')
                setRegConfirm('')
                setRegCity('')
                setRegbarangay('')
                setRegProvince('')
                setNotification('Profile Updated: Logout Required')
                closeModal();
                setShowNotification2(true)
            }

        } catch (error) {
            console.error('Error adding profile:', error);
            setNotification('An error occurred while adding the profile.');
        }
    }

    const update = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    const addProfile = async () => {
        try {
            if (!regUsername || !regPassword || !regConfirm || !regEmail || !regRole || !regLastname || !regfirstname || !regMiddle || !regBarangay || !regCity || !regProvince) {
                setNotification('Please fill in all required fields.');
                return;
            }
            if (regPassword !== regConfirm) {
                setNotification('Passwords do not match.');
                return;
            } else {
                const response = await axios.post('http://localhost:8888/api/user', {
                    username: regUsername,
                    password: regConfirm,
                    email: regEmail,
                    role: regRole,
                    lastname: regLastname,
                    firstname: regfirstname,
                    middle: regMiddle,
                    barangay: regBarangay,
                    city: regCity,
                    province: regProvince,
                });
                console.log('Product added:', response.data);
                fetchProfiles();
                setRegLastname('')
                setRegfirstname('')
                setRegMiddle('')
                setRegEmail('')
                setRegUsername('')
                setRegRole(null)
                setRegPassword('')
                setRegConfirm('')
                setRegCity('')
                setRegbarangay('')
                setRegProvince('')
                setNotification(isEditMode ? 'Profile updated' : 'Profile added')
                closeModal();
                setShowNotification(true)
            }

        } catch (error) {
            console.error('Error adding profile:', error);
            setNotification('An error occurred while adding the profile.');
        }
    }

    const deleteProfile = async (profile) => {
        setUserToDelete(profile); // Step 2
    }

    const cancelDelete = () => {
        setUserToDelete(null); // Close the confirmation popup
    }

    const deleteProfileConfirm = async (profile) => {
        try {
            const response = await axios.delete('http://localhost:8888/api/delete-user', {
                data: { id: profile.id }
            });
            console.log('Profile deleted:', response.data);
            setUserToDelete(false)
            fetchProfiles();
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
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
                <div className='relative xl:sticky xl:top-2'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>Profile</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input type="text" name="" id="" placeholder='Search name, role' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='outline-none bg-transparent text-white w-64 lg:w-96' />
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col lg:flex-row'>
                    <div className='w-full lg:w-[600px] flex flex-row lg:flex-col h-fit p-5 mb-4 xl:sticky xl:top-16 bg-slate-800 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                        <div className='w-full flex justify-center items-start lg:items-center'>
                            <button className='w-44 h-44 bg-white rounded-full overflow-hidden'><img src={profileImage} alt="img" className='w-full h-full' /></button>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <div className='profile-group'>
                                <div>
                                    <p className='profile-head'>Name:</p>
                                    <p className='profile-value'>{(userRole.firstname + ' ' + userRole.middle + '. ' + userRole.lastname)}</p>
                                </div>
                                <div>
                                    <p className='profile-head'>Username:</p>
                                    <p className='profile-value'>{userRole.username}</p>
                                </div>
                                <div>
                                    <p className='profile-head'>Email:</p>
                                    <p className='profile-value'>{userRole.email}</p>
                                </div>
                                <div>
                                    <p className='profile-head'>Address:</p>
                                    <p className='profile-value'>{formatAddress(userRole)}</p>
                                </div>
                            </div>
                            <div className='w-full flex justify-end mt-5'>
                                <button onClick={() => openModal()} className='bg-neutral-600 w-14 h-10 rounded-md hover:bg-neutral-500 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150'><svg className="h-7 text-white w-full hover:text-green-600" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg></button>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex flex-wrap gap-2 mx-5'>
                        <div className='w-56 h-72 rounded-lg bg-slate-800 p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                            <button onClick={() => openModalAdd()} className='w-full h-full text-6xl text-gray-400 font-bold rounded-lg border-gray-400 border-dashed border-4 hover:text-white hover:border-white duration-150'>+</button>
                        </div>
                        {filteredProfiles.length > 0 ? (
                            filteredProfiles
                                .filter((profile) => profile.id !== userRole.user_id)
                                .map(profile => (
                                    <div className='w-56 h-72 rounded-lg bg-slate-800 p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                                        <div className='w-full h-52'>
                                            <div className='profile-group-users'>
                                                <p className='profile-head'>Name:</p>
                                                <p className='profile-value'>{(profile.firstname + ' ' + profile.middle + '. ' + profile.lastname)}</p>
                                            </div>
                                            <div className='profile-group-users'>
                                                <p className='profile-head'>Email:</p>
                                                <p className='profile-value'>{profile.email}</p>
                                            </div>
                                            <div className='profile-group-users'>
                                                <p className='profile-head'>Role:</p>
                                                <p className='profile-value'>{profile.role}</p>
                                            </div>
                                            <div className='profile-group-users'>
                                                <p className='profile-head'>Address:</p>
                                                <p className='profile-value'>{formatAddress(profile)}</p>
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-end'>
                                            <button onClick={() => deleteProfile(profile)} className='bg-neutral-600 w-14 h-10 rounded-md hover:bg-neutral-500 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150'><svg className="h-7 text-white w-full hover:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />  <line x1="18" y1="9" x2="12" y2="15" />  <line x1="12" y1="9" x2="18" y2="15" /></svg></button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-white text-center mt-4">No other users</div>
                        )}
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-3/5 h-fit flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
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
                            <div className='register-group'>
                                <label htmlFor="role">Role:</label>
                                <select name="" id="role" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                                    <option value="" hidden>Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Customer">Customer</option>
                                </select>
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
                                    <input type="text" name="" id="barangay" value={regBarangay} onChange={(e) => setRegbarangay(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="city">City:</label>
                                    <input type="text" name="" id="city" value={regCity} onChange={(e) => setRegCity(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="province">Province:</label>
                                    <input type="text" name="" id="province" value={regProvince} onChange={(e) => setRegProvince(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => (isEditMode ? editProfile() : addProfile())} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">{isEditMode ? 'Save' : 'Add'}</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showNotification && (
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
                                <button onClick={setShowNotification(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
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
                            <h2 className="text-lg text-white font-bold mb-4">{notification}</h2>
                            <div className="flex justify-end">
                                <button onClick={update} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {userToDelete && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-96 h-36 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Are you sure you want to delete this user?</h2>
                            <div className="flex justify-end">
                                <button onClick={cancelDelete} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => deleteProfileConfirm(userToDelete)} className="px-4 py-2 bg-red-900 hover:bg-red-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Delete</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Profile