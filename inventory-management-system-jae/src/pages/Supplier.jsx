import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Supplier = () => {

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [terms, setTerms] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [alert, setAlert] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierForDelete, setSelectedSupplierForDelete] = useState([null])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedProductForDelete, setSelectedProductForDelete] = useState([null]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8888/api/products');
            setProducts(response.data);
        }
        catch (error) {
            console.error('Data fetch error:', error);
        }
    }

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:8888/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const getProductsBySupplierId = (supplierId) => {
        return products.filter(product => product.supplierId === supplierId);
    };

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
        searchSupplier();
    }, [searchQuery, suppliers]);

    const checkRequiredFields = () => {
        if (
            name.trim() === '' ||
            number.trim() === '' ||
            email.trim() === '' ||
            terms.trim() === ''
        ) {
            setNotification('Please fill out all required fields.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return false;
        }
        return true;
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!checkRequiredFields()) {
            return;
        }

        try {
            let response
            if (isEditMode) {
                response = await axios.put('http://localhost:8888/api/update-suppliers', {
                    id: selectedSupplier.id,
                    name,
                    number,
                    email,
                    terms
                });
                console.log('Product updated:', response.data);
                setIsEditMode(false);
            } else {
                response = await axios.post('http://localhost:8888/add-suppliers', {
                    name,
                    number,
                    email,
                    terms
                });
            }

            console.log('Supplier added:', response.data);
            fetchSuppliers();
            setName('');
            setNumber('');
            setEmail('');
            setTerms('');
            setNotification(isEditMode ? 'Supplier updated' : 'Supplier added')
            setTimeout(() => {
                setNotification('')
            }, 3000);
        } catch (error) {
            console.error('Error adding supplier:', error);
            setNotification(isEditMode ? 'Error updating supplier' : 'Error adding supplier')
            setTimeout(() => {
                setNotification('')
            }, 3000);
        }
    };

    const editSupplier = (supplier) => {
        setName(supplier.name);
        setNumber(supplier.number);
        setEmail(supplier.email);
        setTerms(supplier.terms);
        setIsEditMode(true);
        setSelectedSupplier(supplier);
    };

    const deleteProduct = async () => {
        if (selectedProductForDelete) {
            console.log(selectedProductForDelete);
            try {
                const response = await axios.delete('http://localhost:8888/api/delete-products', {
                    data: { id: selectedProductForDelete }
                });
                console.log('Product deleted:', response.data);
                closeModal2();
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const deleteSupplier = async () => {
        if (selectedSupplierForDelete) {
            if (getProductsBySupplierId(selectedSupplierForDelete).length > 0) {
                setAlert(true);
                closeModal();
            } else {
                try {
                    const response = await axios.delete('http://localhost:8888/api/delete-suppliers', {
                        data: { id: selectedSupplierForDelete }
                    });
                    console.log('Supplier deleted:', response.data);
                    closeModal();
                    fetchSuppliers();
                } catch (error) {
                    console.error('Error deleting supplier:', error);
                }
            }
        }
    };

    const openModal = (supplier) => {
        setIsModalOpen(true);
        setSelectedSupplierForDelete(supplier.id)
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal2 = (product) => {
        setIsModalOpen2(true);
        setSelectedProductForDelete(product.id)
    };

    const closeModal2 = () => {
        setIsModalOpen2(false);
    };

    const searchSupplier = () => {
        const filteredSuppliers = suppliers.filter((supplier) => {
            if (searchQuery.trim() === '') {
                return true;
            }
            return (
                supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredSuppliers(filteredSuppliers);
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
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>Suppliers</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input type="text" name="" id="" placeholder='Search Suppliers' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='outline-none bg-transparent text-white w-64 lg:w-96' />
                        </div>
                    </div>
                    <div className='w-full h-fit p-2 bg-slate-800 mt-5 flex rounded-md shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]'>
                        <div className='w-full p-2 flex flex-col lg:flex-row justify-between'>
                            <div className='w-full'>
                                <div className='supplier-group'>
                                    <label htmlFor="">Name: </label>
                                    <input type="text" name="" id="" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='supplier-group'>
                                    <label htmlFor="">Contact Number: </label>
                                    <input type="text" name="" id="" value={number} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                                <div className='supplier-group'>
                                    <label htmlFor="">Email: </label>
                                    <input type="text" name="" id="" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className='w-full'>
                                <div className='w-full lg:pl-4 xl:pl-10 flex flex-col'>
                                    <label htmlFor="" className='w-36 text-white text-base mb-2'>Delivery Terms: </label>
                                    <textarea name="" id="" cols="30" rows="10" value={terms} onChange={(e) => setTerms(e.target.value)} className='h-[75px] w-full lg:w-72 xl:w-80 text-black p-2 rounded-md' ></textarea>
                                </div>
                            </div>
                            <div className='w-full lg:w-80 p-2'>
                                <div className='w-full flex flex-col justify-end items-end h-full'>
                                    {notification &&
                                        <p className='text-white my-2 text-end'>{notification}</p>
                                    }
                                    <button onClick={(e) => submit(e, fetchSuppliers)} className='bg-neutral-800 w-20 h-10 xl:w-24 xl:h-14 rounded-md text-white font-bold text-lg hover:bg-green-800 duration-150 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>{isEditMode ? 'Update' : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mt-5 flex-wrap w-full h-full p-2 rounded-md'>
                    <div className='flex flex-wrap w-full h-fit p-2 justify-around gap-4'>
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map(supplier => (
                                <div className='flex flex-row w-[400px] h-[480px] bg-slate-800 p-3 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                                    <div className='w-full p-3'>
                                        <h1 className='text-white font-bold text-xs'>Products:</h1>
                                        {getProductsBySupplierId(supplier.id).length > 0 ? (
                                            getProductsBySupplierId(supplier.id).map(product => (
                                                <div className='w-full flex justify-between py-2'>
                                                    <div key={product.id}>
                                                        <h1 className='text-white text-sm'>{product.name}</h1>
                                                        <h1 className='text-white text-sm'>₱ {product.price}</h1>
                                                    </div>
                                                    <button onClick={() => openModal2(product)} className='bg-neutral-600 w-10 h-10 rounded-md hover:bg-neutral-500 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150'>
                                                        <svg className="h-7 text-white w-full hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-white text-center mt-4">No products</div>
                                        )}
                                    </div>
                                    <div className='border-white border-l-2'></div>
                                    <div className='w-full h-full flex flex-col p-2'>
                                        <div className='flex flex-col'>
                                            <div className='product-info'>
                                                <h1>Supplier ID:</h1>
                                                <p>{supplier.id}</p>
                                            </div>
                                            <div className='product-info'>
                                                <h1>Name:</h1>
                                                <p>{supplier.name}</p>
                                            </div>
                                            <div className='product-info'>
                                                <h1>Contact Number:</h1>
                                                <p>{supplier.number}</p>
                                            </div>
                                            <div className='product-info'>
                                                <h1>Email:</h1>
                                                <p>{supplier.email}</p>
                                            </div>
                                            <div className='product-info'>
                                                <h1>Delivery Terms:</h1>
                                                <p>{supplier.terms}</p>
                                            </div>
                                        </div>
                                        <div className='product-action'>
                                            <button onClick={() => editSupplier(supplier)}><svg className="h-7 text-white w-full hover:text-green-600" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg></button>
                                            <button onClick={() => openModal(supplier)}><svg className="h-7 text-white w-full hover:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />  <line x1="18" y1="9" x2="12" y2="15" />  <line x1="12" y1="9" x2="18" y2="15" /></svg></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-center mt-4">No Suppliers</div>
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
                        <div className="w-96 h-44 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Are you sure you want to delete this supplier?</h2>
                            <div className="flex justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => deleteSupplier(selectedSupplierForDelete)} className="px-4 py-2 bg-red-900 hover:bg-red-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Confirm Delete</button>
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
                        <div className="w-96 h-44 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Are you sure you want to delete this product?</h2>
                            <div className="flex justify-end">
                                <button onClick={() => closeModal2()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => deleteProduct(selectedProductForDelete)} className="px-4 py-2 bg-red-900 hover:bg-red-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Confirm Delete</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {alert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="fixed inset-0 bg-neutral-900 opacity-50 z-40"></div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-96 h-36 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
                        >
                            <h2 className="text-lg text-white font-bold mb-4">Deletion Blocked: This supplier is associated with existing products.</h2>
                            <div className="flex justify-end">
                                <button onClick={() => setAlert(false)} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Supplier