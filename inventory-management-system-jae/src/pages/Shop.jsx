import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../library/services';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const userRole = auth.getUserInfo();
    const [showModal, setShowModal] = useState(false);

    const openModal = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8888/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Data fetch error:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:8888/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
        searchProduct();
    }, [searchQuery, products]);

    const searchProduct = () => {
        const filteredProducts = products.filter((product) => {
            if (searchQuery.trim() === '') {
                return true;
            }
            return (
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredProducts(filteredProducts);
    };

    const addToCart = async (e) => {
        e.preventDefault();
        const selectedSupplierName = suppliers.find((supplier) => supplier.id === selectedProduct.supplierId)?.name;

        if (selectedProduct && quantity > 0) {
            try {
                const response = await axios.post('http://localhost:8888/api/customerOrder', {
                    userId: userRole.user_id,
                    productId: selectedProduct.id,
                    supplierId: selectedProduct.supplierId,
                    quantity: quantity,
                    maxQuantity: selectedProduct.quantity,
                    price: quantity * selectedProduct.price,
                    productName: selectedProduct.name,
                    supplierName: selectedSupplierName,
                });

                console.log('Order added:', response.data);
                setShowModal(true);
                setIsModalOpen(false);
                fetchProducts();
            } catch (error) {
                console.error('Error adding order:', error);
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
                <div className='sticky top-2'>
                    <div className='flex items-center justify-between mb-2'>
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>Shop</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='Search Product'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='outline-none bg-transparent text-white w-64 lg:w-96'
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mt-5 flex-wrap w-full h-full p-2 rounded-md'>
                    <div className='flex flex-wrap w-full h-fit py-2 justify-around gap-2'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts
                                .filter((product) => product.quantity > 0)
                                .map((product) => (
                                    <div key={product.id} className='w-64 lg:w-72 h-[420px] bg-slate-800 p-3 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                                        <div className='w-full h-full flex flex-col'>
                                            <div className='flex flex-col'>
                                                <div className='product-info'>
                                                    <h1>Name:</h1>
                                                    <p>{product.name}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Brand:</h1>
                                                    <p>{product.brand}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Category:</h1>
                                                    <p>{product.category}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Quantity:</h1>
                                                    <p>{product.quantity}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Price:</h1>
                                                    <p>₱ {product.price}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Supplier:</h1>
                                                    <p>{suppliers.find((supplier) => supplier.id === product.supplierId)?.name}</p>
                                                </div>
                                                <div className='product-info'>
                                                    <h1>Description:</h1>
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                            <div className='product-action'>
                                                <button onClick={() => openModal(product)}><svg className="h-7 text-white w-full hover:text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-white text-center mt-4">No products</div>
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
                            <div className='flex items-center gap-2'>
                                <h1 className='text-white font-bold text-base'>Product: </h1>
                                <p className='text-white text-base'>{selectedProduct.name}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-white font-bold text-base'>Price: </h1>
                                <p className='text-white text-base'>₱ {selectedProduct.price}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-white font-bold text-base'>Quantity: </h1>
                                <p className='text-white text-base'>{selectedProduct.quantity}</p>
                            </div>
                            <div className='flex flex-col items-center mb-4'>
                                <h1 className='mb-2 text-white font-bold text-lg'>Quantity</h1>
                                <input type="number" name="" id="" value={quantity} onChange={(e) => setQuantity(Math.max(0, Math.min(selectedProduct.quantity, parseInt(e.target.value, 10))))} className='w-16 h-14 text-center font-bold rounded-lg text-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]' />
                                <div className='flex justify-center mt-2 gap-1'>
                                    <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className='w-10 h-10 font-bold bg-neutral-700 rounded-l-xl text-white text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>-</button>
                                    <button onClick={() => setQuantity(Math.min(selectedProduct.quantity, quantity + 1))} className='w-10 h-10 font-bold bg-neutral-700 rounded-r-xl text-white text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>+</button>
                                </div>
                            </div>
                            <div className="flex h-full items-end justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={(e) => addToCart(e, fetchProducts, fetchSuppliers)} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Add to My Cart</button>
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
                            <h2 className="text-lg text-white font-bold mb-4">Added to My Cart</h2>
                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Shop;
