import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../library/services';
import { motion, AnimatePresence } from 'framer-motion';

const Order = () => {
    const [carts, setCarts] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const [date, setDate] = useState('');

    const userRole = auth.getUserInfo();

    const openModal = (userId) => {
        setSelectedUser(profiles.find((profile) => profile.id === userId));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:8888/customerOrders');
            setCarts(response.data);
        } catch (error) {
            console.error('Data fetch error:', error);
        }
    };

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8888/user');
            setProfiles(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchProfiles();
        const currentDate = new Date().toLocaleDateString();
        setDate(currentDate);
    }, []);

    const filteredOrders = () => {
        return carts.filter((cart) => {
            const user = profiles.find((profile) => profile.id === cart.userId);
            if (!user) return false;

            const fullName = `${user.lastname} ${user.firstname}`;
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const groupedOrders = {};
    filteredOrders().forEach((cart) => {
        if (!groupedOrders[cart.userId]) {
            groupedOrders[cart.userId] = [];
        }
        groupedOrders[cart.userId].push(cart);
    });

    const calculatePendingTotal = (userId) => {
        const userOrders = groupedOrders[userId] || [];
        const pendingOrders = userOrders.filter((cart) => cart.isPending === true && cart.isReceived === null);
        const total = pendingOrders.reduce((acc, cart) => acc + cart.quantity * cart.price, 0);
        return total;
    };

    const generateInvoice = () => {
    };

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
                <div className="sticky top-2">
                    <div className=" w-full flex items-center justify-between mb-2">
                        <h1 className="text-2xl lg:text-4xl text-white font-bold">Orders</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='Search name'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='outline-none bg-transparent text-white w-64 lg:w-96'
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-2 mt-5">
                    <div className="w-full">
                        <div className='w-full sticky top-16 bg-slate-800 rounded-lg p-4'>
                            <h1 className='text-white font-bold text-lg'>Pending Orders</h1>
                        </div>
                        {Object.keys(groupedOrders).map((userId) => (
                            <div className='px-3 mt-5' key={userId}>
                                <div className='flex justify-between items-center'>
                                    <h1 className="text-white font-bold text-xl lg:text-base xl:text-xl">
                                        Customer Name: {`${profiles.find((profile) => profile.id === userId)?.lastname}, 
                                                ${profiles.find((profile) => profile.id === userId)?.firstname} 
                                                ${profiles.find((profile) => profile.id === userId)?.middle}.`}
                                    </h1>
                                    <button onClick={() => openModal(userId)} className='h-fit w-fit p-3 lg:text-xs xl:text-base bg-w-full bg-neutral-700 font-bold text-white rounded-md hover:bg-green-800 duration-150 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>Generate Invoice</button>
                                </div>
                                {groupedOrders[userId]
                                    .filter((cart) => cart.isPending === true && cart.isReceived === null)
                                    .map((cart) => (
                                        <div key={cart.id} className="w-full p-3 bg-neutral-700 rounded-lg mt-2">
                                            <div className="cart-group-1">
                                                <h1>Product Name:</h1>
                                                <p>{cart.productName}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Supplier:</h1>
                                                <p>{cart.supplierName}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Quantity:</h1>
                                                <p>{cart.quantity}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Price:</h1>
                                                <p>₱ {cart.price}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Date Ordered:</h1>
                                                <p>{cart.orderDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                {groupedOrders[userId]
                                    .filter((cart) => cart.isPending === true && cart.isReceived === null)
                                    .length === 0 && (
                                        <div className="text-white text-center mt-4">No Pending Products</div>
                                    )}
                            </div>
                        ))}
                    </div>
                    <div className="border-r-4 border-white rounded-xl"></div>
                    <div className="w-full">
                        <div className='w-full sticky top-16 bg-slate-800 rounded-lg p-4'>
                            <h1 className='text-white font-bold text-lg'>Received</h1>
                        </div>
                        {Object.keys(groupedOrders).map((userId) => (
                            <div className='px-3' key={userId}>
                                <h1 className="text-white font-bold text-xl lg:text-base xl:text-xl mt-4">
                                    Customer Name: {`${profiles.find((profile) => profile.id === userId)?.lastname}, 
                                                ${profiles.find((profile) => profile.id === userId)?.firstname} 
                                                ${profiles.find((profile) => profile.id === userId)?.middle}.`}
                                </h1>
                                {groupedOrders[userId]
                                    .filter((cart) => cart.isPending === true && cart.isReceived === true)
                                    .map((cart) => (
                                        <div key={cart.id} className="w-full p-3 bg-neutral-700 rounded-lg mt-2">
                                            <div className="cart-group-1">
                                                <h1>Product Name:</h1>
                                                <p>{cart.productName}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Supplier:</h1>
                                                <p>{cart.supplierName}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Quantity:</h1>
                                                <p>{cart.quantity}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Price:</h1>
                                                <p>₱ {cart.price}</p>
                                            </div>
                                            <div className="cart-group-1">
                                                <h1>Date Ordered:</h1>
                                                <p>{cart.orderDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                {groupedOrders[userId]
                                    .filter((cart) => cart.isPending === true && cart.isReceived === true)
                                    .length === 0 && (
                                        <div className="text-white text-center mt-4">No Received Products</div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-5/6 md:w-4/6 lg:w-3/6 h-fit flex flex-col items-center justify-center bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h1 className='w-full text-end text-white text-4xl uppercase mb-5 font-bold'>Invoice</h1>
                            <div className='flex w-full mb-5'>
                                <div className='w-full text-white'>
                                    <h1 className='font-bold text-lg'>BILLED TO:</h1>
                                    <p>{`${selectedUser.lastname}, ${selectedUser.firstname} ${selectedUser.middle}`}</p>
                                    <p>{selectedUser.email}</p>
                                    {selectedUser.barangay || selectedUser.city || selectedUser.province ? (
                                        <p>
                                            {`${selectedUser.barangay}${selectedUser.barangay && selectedUser.city ? ', ' : ''}${selectedUser.city}${(selectedUser.barangay || selectedUser.city) && selectedUser.province ? ', ' : ''}${selectedUser.province}`}
                                        </p>
                                    ) : null}
                                </div>
                                <div className='w-full text-white flex justify-end'>
                                    <p>{date}</p>
                                </div>
                            </div>
                            <table className="w-full text-white mb-4">
                                <thead>
                                    <tr className='border-b font-medium h-10'>
                                        <th className='text-left'>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedOrders[selectedUser.id]
                                        .filter((cart) => cart.isPending === true && cart.isReceived === null)
                                        .map((cart) => (
                                            <tr key={cart.id} className='border-b h-10 text-sm transition duration-300 ease-in-out hover:bg-slate-700'>
                                                <td>{cart.productName}</td>
                                                <td className='text-center'>{cart.quantity}</td>
                                                <td className='text-center'>₱ {cart.price}</td>
                                            </tr>
                                        ))}
                                    <tr>
                                        <td colSpan="2"></td>
                                        <td className='text-center text-lg font-bold py-2'>
                                            Total: ₱ {calculatePendingTotal(selectedUser.id)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex w-full h-full items-end justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={generateInvoice} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Generate Invoice</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Order;
