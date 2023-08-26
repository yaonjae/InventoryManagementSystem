import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Product = () => {

    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductForDelete, setSelectedProductForDelete] = useState([null]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const openModal = (product) => {
        console.log(product.quantity)
        if (product.quantity > 0) {
            setShowModal(true)
        } else {
            setIsModalOpen(true);
            setSelectedProductForDelete(product.id)
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

    const checkRequiredFields = () => {
        if (
            name.trim() === '' ||
            brand.trim() === '' ||
            category.trim() === '' ||
            price.trim() === '' ||
            selectedSupplier.trim() === '' ||
            description.trim() === ''
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
                response = await axios.put('http://localhost:8888/api/update-products', {
                    id: selectedProduct.id,
                    name,
                    brand,
                    category,
                    price,
                    supplierId: selectedSupplier,
                    description
                });
                console.log('Product updated:', response.data);
                setIsEditMode(false);
            } else {
                response = await axios.post('http://localhost:8888/api/add-products', {
                    name,
                    brand,
                    category,
                    price,
                    supplierId: selectedSupplier,
                    description
                });
            }

            console.log('Product added:', response.data);
            fetchProducts();
            setName('');
            setBrand('');
            setCategory('');
            setPrice('');
            setDescription('');
            setSelectedSupplier('');
            setNotification(isEditMode ? 'Product updated' : 'Product added')
            setTimeout(() => {
                setNotification('')
            }, 3000);
        } catch (error) {
            console.error('Error adding product:', error);
            setNotification(isEditMode ? 'Error updating product' : 'Error adding product')
            setTimeout(() => {
                setNotification('')
            }, 3000);
        }
    };

    const editProduct = (product) => {
        setName(product.name);
        setBrand(product.brand);
        setCategory(product.category);
        setPrice(product.price);
        setDescription(product.description);
        setSelectedSupplier(product.supplierId);
        setIsEditMode(true);
        setSelectedProduct(product);
        setSelectedProductForDelete(product);
    };

    const deleteProduct = async () => {
        if (selectedProductForDelete) {
            try {
                const response = await axios.delete('http://localhost:8888/api/delete-products', {
                    data: { id: selectedProductForDelete }
                });
                console.log('Product deleted:', response.data);
                closeModal();
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

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
                className='w-full h-full m-2 p-2'>
                <div className='relative xl:sticky xl:top-2'>
                    <div className='flex items-center justify-between mb-2'>
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>Products</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input type="text" name="" id="" placeholder='Search name, brand or category' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='outline-none bg-transparent h-5 text-white w-64 lg:w-96' />
                        </div>
                    </div>
                    <div className='w-full h-fit p-2 bg-slate-800 mt-5 flex rounded-md shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]'>
                        <div className='w-full p-2 flex flex-col gap-2 xl:flex-row justify-between'>
                            <div>
                                <div className='add-group'>
                                    <label htmlFor="">Name: </label>
                                    <input type="text" name="" id="" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='add-group'>
                                    <label htmlFor="">Brand: </label>
                                    <input type="text" name="" id="" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                </div>
                                <div className='add-group'>
                                    <label htmlFor="">Category: </label>
                                    <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="" hidden>Select Category</option>
                                        <option value="Appliances">Appliances</option>
                                        <option value="Accessory">Accessory</option>
                                        <option value="Books">Books</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Cosmetics">Cosmetics</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Personal Care">Personal Care</option>
                                        <option value="Toys">Toys</option>
                                    </select>
                                </div>
                                <div className='add-group'>
                                    <label htmlFor="">Price: </label>
                                    <input type="number" name="" id="" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <div className='add-group'>
                                    <label htmlFor="" >Supplier: </label>
                                    <select name="" id="" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                                        <option value="" hidden>Select a supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='add-group'>
                                    <label htmlFor="">Description: </label>
                                    <textarea name="" id="" cols="30" rows="10" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className='w-full p-2'>
                                <div className='flex flex-col justify-end items-end h-full'>
                                    {notification &&
                                        <p className='text-white my-2 text-end'>{notification}</p>
                                    }
                                    <button onClick={(e) => submit(e, fetchProducts)} className='bg-neutral-700 w-20 h-10 xl:w-24 xl:h-14 rounded-md text-white font-bold text-lg hover:bg-green-800 duration-150 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>{isEditMode ? 'Update' : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mt-5 flex-wrap w-full h-full p-2 rounded-md'>
                    <div className='flex flex-wrap w-full h-fit py-2 justify-around gap-2'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className='w-64 md:w-60 h-[480px] bg-slate-800 p-3 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                                    <div className='w-full h-full flex flex-col'>
                                        <div className='flex flex-col'>
                                            <div className='product-info'>
                                                <h1>Product ID:</h1>
                                                <p>{product.id}</p>
                                            </div>
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
                                                <p>{suppliers.find(supplier => supplier.id === product.supplierId)?.name}</p>
                                            </div>
                                            <div className='product-info'>
                                                <h1>Description:</h1>
                                                <p>{product.description}</p>
                                            </div>
                                        </div>
                                        <div className='product-action'>
                                            <button onClick={() => editProduct(product)}>
                                                <svg className="h-7 text-white w-full hover:text-green-600" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                                    <line x1="16" y1="5" x2="19" y2="8" />
                                                </svg>
                                            </button>
                                            <button onClick={() => openModal(product)}>
                                                <svg className="h-7 text-white w-full hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
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
                        <div className="w-96 h-44 flex flex-col justify-between bg-slate-800 p-6 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <h2 className="text-lg text-white font-bold mb-4">Are you sure you want to delete this product?</h2>
                            <div className="flex justify-end">
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={() => deleteProduct(selectedProductForDelete)} className="px-4 py-2 bg-red-900 hover:bg-red-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Confirm Delete</button>
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
                            <h2 className="text-lg text-white font-bold mb-4">Deletion Blocked: Product still exists in the inventory</h2>
                            <div className="flex justify-end">
                                <button onClick={() => { setShowModal(false), setUsername(''), setPassword('') }} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Ok</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Product