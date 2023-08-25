import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Stock = () => {

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [notification, setNotification] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

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

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8888/stocks');
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
        fetchStocks();
        searchProduct();
    }, [searchQuery, products]);

    const calculateRemainingQuantity = (quantity, maxQuantity) => maxQuantity - quantity;

    const cost = (quantity, maxQuantity, price) => (maxQuantity - quantity) * price;

    const pendingOrders = stocks.filter((stock) => stock.isReceived === null);

    const searchProduct = () => {
        const filteredProducts = products.filter((product) => {
            if (searchQuery.trim() === '') {
                return true;
            }
            return (
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredProducts(filteredProducts);
    };

    const openModal = (product) => {
        setSelectedProduct(product)
        const supplier = suppliers.find((supplier) => supplier.id === product.supplierId);
        setSelectedSupplier(supplier);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setSelectedSupplier(null);
    };

    const replenishStock = async () => {
        if (selectedProduct && selectedSupplier) {
            try {
                const response = await axios.post('http://localhost:8888/api/stocks', {
                    productId: selectedProduct.id,
                    supplierId: selectedSupplier.id,
                    orderDate: new Date(),
                    quantity: selectedProduct.maxQuantity - selectedProduct.quantity,
                    productName: selectedProduct.name,
                    supplierName: selectedSupplier.name,
                    cost: (selectedProduct.maxQuantity - selectedProduct.quantity) * selectedProduct.price
                });
                console.log('Order Sent:', response.data);
                closeModal();
            } catch (error) {
                console.error('Error ordering product:', error);
            }
        } else {
            console.error('Selected product or supplier is null.');
        }
    }

    const updateProductQuantity = (productId, receivedQuantity) => {
        setProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.id === productId) {
                    product.quantity += receivedQuantity;
                }
                return product;
            });
        });
    };

    const receivedStock = async (stockId, productId, receivedQuantity) => {
        try {
            await axios.put('http://localhost:8888/api/update-stocks', {
                id: stockId,
                isReceived: true,
                receivedQuantity: receivedQuantity,
            });

            updateProductQuantity(productId, receivedQuantity);

            setStocks(prevStocks => prevStocks.filter(stock => stock.id !== stockId));
        } catch (error) {
            console.error('Error receiving stock:', error);
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
                        <h1 className='text-2xl lg:text-4xl text-white font-bold'>Stocks</h1>
                        <div className='flex items-center bg-slate-800 border-2 border-white rounded-md p-2 justify-between gap-2'>
                            <input type="text" name="" id="" placeholder='Search name' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='outline-none bg-transparent text-white w-64 lg:w-96' />
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit p-2 mt-5 flex">
                    <div className="w-full h-fit flex flex-wrap justify-around gap-2">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="w-48 md:w-52 xl:w-72 h-fit bg-slate-800 p-2 flex flex-col items-center rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                                    <div className='w-full h-32 xl:h-40 flex justify-center'>
                                        <Doughnut
                                            data={{
                                                labels: [],
                                                datasets: [
                                                    {
                                                        data: [calculateRemainingQuantity(product.quantity, product.maxQuantity), product.quantity],
                                                        backgroundColor: [
                                                            'rgba(255, 99, 132, 0.6)',
                                                            'rgba(54, 162, 235, 0.6)'
                                                        ],
                                                    },
                                                ],
                                            }}
                                        />
                                    </div>
                                    <h1 className='font-bold text-xl xl:text-2xl text-white mb-2 w-full text-center'>{product.quantity}/{product.maxQuantity}</h1>
                                    <div className='stock-group'>
                                        <h1>Product Name:</h1>
                                        <p>{product.name}</p>
                                    </div>
                                    <div className='stock-group'>
                                        <h1>Supplier:</h1>
                                        <p>{suppliers.find(supplier => supplier.id === product.supplierId)?.name}</p>
                                    </div>
                                    <button onClick={() => openModal(product)} className='w-full text-xs xl:text-base bg-neutral-700 p-2 my-2 font-bold text-white rounded-md hover:bg-green-800 duration-150 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]' disabled={product.quantity === product.maxQuantity}>{product.quantity === product.maxQuantity ? 'Stock Full' : 'Replenish Stock'}</button>
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-center mt-4">No products</div>
                        )}
                    </div>
                    <div className="w-80 xl:w-96 h-[500px] sticky top-20 overflow-auto bg-slate-800 rounded-md p-2 ml-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                        <h1 className="font-bold text-white text-sm mb-2">Pending Orders</h1>
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map(stock => (
                                <div key={stock.id} className="border-t-2 p-2 w-full">
                                    <div className="pending-order-group">
                                        <h1>Product Name:</h1>
                                        <p>{stock.productName}</p>
                                    </div>
                                    <div className="pending-order-group">
                                        <h1>Supplier:</h1>
                                        <p>{stock.supplierName}</p>
                                    </div>
                                    <div className="pending-order-group">
                                        <h1>Date Ordered:</h1>
                                        <p>{stock.orderDate}</p>
                                    </div>
                                    <div className="pending-order-group">
                                        <h1>Quantity:</h1>
                                        <p>{stock.quantity}</p>
                                    </div>
                                    <div className="pending-order-group">
                                        <h1>Cost:</h1>
                                        <p>₱ {stock.cost}</p>
                                    </div>
                                    <button onClick={() => receivedStock(stock.id, stock.productId, stock.quantity)} className="w-full bg-neutral-700 text-xs xl:text-base p-2 my-2 rounded-md font-bold text-white hover:bg-green-800 duration-150 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]">Received</button>
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-center mt-4">No pending orders</div>
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
                        <div className="w-[900px] h-fit bg-slate-800 rounded-lg relative z-50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                            <div className='w-full flex justify-between px-2'>
                                <div className='w-full h-fit m-2 p-2 flex flex-col items-start'>
                                    <h1 className='text-white font-bold text-xl mb-5'>Product</h1>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Name:</h1>
                                        <p className='text-white text-base'>{selectedProduct?.name}</p>
                                    </div>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Category:</h1>
                                        <p className='text-white text-base'>{selectedProduct?.category}</p>
                                    </div>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Price:</h1>
                                        <p className='text-white text-base'>₱ {selectedProduct?.price}</p>
                                    </div>
                                    <div className='w-full my-2'>
                                        <h1 className='text-white font-bold text-base'>Description:</h1>
                                        <p className='text-white text-base'>{selectedProduct?.description}</p>
                                    </div>
                                </div>
                                <div className='w-full flex items-center m-2 p-2 relative'>
                                    <div className='w-full text-center mb-36'>
                                        <h1 className='text-white font-bold text-xl'>Quantity = Cost</h1>
                                        <h1 className='text-white font-bold text-2xl'>{calculateRemainingQuantity(selectedProduct?.quantity, selectedProduct?.maxQuantity)} = ₱ {cost(selectedProduct?.quantity, selectedProduct?.maxQuantity, selectedProduct.price)}</h1>
                                    </div>
                                    <div className="arrow">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className='w-full h-fit m-2 p-2 flex flex-col items-end'>
                                    <h1 className='text-white font-bold text-xl mb-5'>Supplier</h1>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Name:</h1>
                                        <p className='text-white text-base'>{selectedSupplier?.name}</p>
                                    </div>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Contact Number:</h1>
                                        <p className='text-white text-base'>{selectedSupplier?.number}</p>
                                    </div>
                                    <div className='w-full my-2 flex justify-between items-center'>
                                        <h1 className='text-white font-bold text-base'>Email:</h1>
                                        <p className='text-white text-base'>{selectedSupplier?.email}</p>
                                    </div>
                                    <div className='w-full my-2'>
                                        <h1 className='text-white font-bold text-base'>Delivery Terms:</h1>
                                        <p className='text-white text-base'>{selectedSupplier?.terms}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full p-2 flex justify-end'>
                                <button onClick={() => closeModal()} className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-700 rounded-md mr-2 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Cancel</button>
                                <button onClick={replenishStock} className="px-4 py-2 bg-green-900 hover:bg-green-700 text-white rounded-md hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] duration-150">Replenish Stock</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Stock