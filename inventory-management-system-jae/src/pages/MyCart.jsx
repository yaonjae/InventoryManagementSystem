import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../library/services';
import { motion, AnimatePresence } from 'framer-motion';

const MyCart = () => {

    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showSelectProductModal, setShowSelectProductModal] = useState(false);

    const userRole = auth.getUserInfo();
    const filteredCarts = carts.filter((cart) => cart.userId === userRole.user_id);

    const formatAddress = () => {
        const addressParts = [];
        if (userRole.barangay) {
            addressParts.push(userRole.barangay);
        }
        if (userRole.city) {
            addressParts.push(userRole.city);
        }
        if (userRole.province) {
            addressParts.push(userRole.province);
        }
        return addressParts.join(', '); // Join address parts with commas
    };

    const handleCheckboxChange = (cart) => {
        if (selectedProducts.includes(cart)) {
            setSelectedProducts(selectedProducts.filter((product) => product !== cart));
        } else {
            setSelectedProducts([...selectedProducts, cart]);
        }
    };

    const openModal = (cart) => {
        if (selectedProducts.length > 0) {
            setSelectedProduct(cart);
            setIsModalOpen(true);
        } else {
            setShowSelectProductModal(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal2 = (cart) => {
        setSelectedProduct(cart);
        setIsModalOpen2(true);
    };

    const closeModal2 = () => {
        setIsModalOpen2(false);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8888/api/products');
            setProducts(response.data);
        }
        catch (error) {
            console.error('Data fetch error:', error);
        }
    }

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:8888/customerOrders');
            setCarts(response.data);
        }
        catch (error) {
            console.error('Data fetch error:', error);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const placeOrder = async () => {
        try {
            const orderDate = new Date();

            for (const selectedProduct of selectedProducts) {
                await axios.put('http://localhost:8888/api/update-customerOrder', {
                    id: selectedProduct.id,
                    isPending: true,
                    orderDate,
                });
            }
            for (const selectedProduct of selectedProducts) {
                const newQuantity = products.find(product => product.id === selectedProduct.productId)?.quantity;
                if (newQuantity !== undefined) {
                    await axios.put('http://localhost:8888/api/update-product-quantity', {
                        id: selectedProduct.productId,
                        quantity: newQuantity - selectedProduct.quantity,
                    });
                }
            }

            setSelectedProducts([]);
            fetchCart();
            closeModal();
            setShowModal(true);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const receivedOrder = async () => {
        if (selectedProduct) {
            try {
                await axios.put('http://localhost:8888/api/update-customerOrderReceived', {
                    id: selectedProduct.id,
                    isReceived: true,
                    receiveDate: new Date(),
                });

                fetchCart();
                closeModal2();
            } catch (error) {
                console.error('Error receiving order:', error);
            }
        }
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
                <div className='relative xl:sticky xl:top-2'>
                    <div className='flex items-center justify-between mb-2'>
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>My Cart</h1>
                    </div>
                </div>
                <div className="w-full flex flex-col xl:flex-row gap-2 mt-5">
                    <div className="w-full">
                        <div className="bg-slate-800 sticky top-16 w-full p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <h1 className="text-white font-bold text-lg">My Cart</h1>
                        </div>
                        {filteredCarts.length > 0 &&
                            filteredCarts
                                .filter((cart) => cart.isPending === null && cart.isReceived === null)
                                .map((cart, index, array) => (
                                    <div className='flex w-full h-fit gap-1 mt-2'>
                                        <div className='w-10 flex justify-center items-center bg-neutral-700 rounded-l-lg'>
                                            <input
                                                type="checkbox"
                                                name={`checkbox-${cart.id}`}
                                                id={`checkbox-${cart.id}`}
                                                className='w-5 h-5'
                                                value={cart}
                                                onChange={() => handleCheckboxChange(cart)}
                                            />
                                        </div>
                                        <div className='w-full'>
                                            <div key={cart.id} className="w-full p-3 bg-neutral-700 rounded-r-lg">
                                                <div className="cart-group-1">
                                                    <h1>Name:</h1>
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        {filteredCarts.filter(cart => cart.isPending === null && cart.isReceived === null).length === 0 ? (
                            <div className="text-white text-center mt-4">Cart Empty</div>
                        ) : (
                            <div className="cart-group-1">
                                <button onClick={() => openModal(filteredCarts[0])}>Place Order</button>
                            </div>
                        )}
                    </div>
                    <div className="border-r-4 border-white rounded-xl"></div>
                    <div className="w-full">
                        <div className="bg-slate-800 sticky top-16 w-full p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <h1 className="text-white font-bold text-lg">Pending Orders</h1>
                        </div>
                        {filteredCarts.length > 0 ? (
                            filteredCarts
                                .filter((cart) => cart.isPending === true && cart.isReceived === null)
                                .map((cart) => (
                                    <div key={cart.id} className="w-full p-3 bg-neutral-700 rounded-lg mt-2">
                                        <div className="cart-group-1">
                                            <h1>Name:</h1>
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
                                        <div className="cart-group-1">
                                            <h1>Address:</h1>
                                            <p>{formatAddress()}</p>
                                        </div>
                                        <div className="cart-group-1">
                                            <button onClick={() => openModal2(cart)}>Received</button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-white text-center mt-4">No pending orders</div>
                        )}
                    </div>
                    <div className="border-r-4 border-white rounded-xl"></div>
                    <div className="w-full">
                        <div className="bg-slate-800 sticky top-16 w-full p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <h1 className="text-white font-bold text-lg">Received</h1>
                        </div>
                        {filteredCarts.length > 0 ? (
                            filteredCarts
                                .filter((cart) => cart.isPending === true && cart.isReceived === true)
                                .map((cart) => (
                                    <div key={cart.id} className="w-full p-3 bg-neutral-700 rounded-lg mt-2">
                                        <div className="cart-group-1">
                                            <h1>Name:</h1>
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
                                            <h1>Date Received:</h1>
                                            <p>{cart.receiveDate}</p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-white text-center mt-4">No received products</div>
                        )}
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
                        <div className="w-96 h-fit flex flex-col bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <table className='w-full font-medium text-white'>
                                <thead>
                                    <tr className='border-b font-medium h-10'>
                                        <th className='w-32'>Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product) => (
                                        <tr key={product.id} className='border-b text-center text-sm h-10 transition duration-300 ease-in-out hover:bg-slate-700'>
                                            <td>{product.productName}</td>
                                            <td>{product.quantity}</td>
                                            <td>₱ {product.price / product.quantity}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="2"></td>
                                        <td className='text-center text-lg font-bold py-2'>
                                            Total: ₱{' '}
                                            {selectedProducts.reduce(
                                                (total, product) => total + ((product.price / product.quantity) * product.quantity),
                                                0
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex h-full items-end justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => placeOrder()} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Place Order</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isModalOpen2 && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-96 h-fit flex flex-col bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h1 className='text-white text-lg font-bold mb-4'>Product Received?</h1>
                            <div className="flex h-full items-end justify-end">
                                <button onClick={() => closeModal2()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => receivedOrder()} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Confirm</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
                            <h2 className="text-lg text-white font-bold mb-4">Order Placed</h2>
                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showSelectProductModal && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <div className="w-96 h-fit flex flex-col bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Select a product first</h2>
                            <div className="flex justify-end">
                                <button onClick={() => setShowSelectProductModal(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    )
}

export default MyCart