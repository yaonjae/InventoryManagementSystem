import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../library/services';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);


const Dashboard = () => {

    const [products, setProducts] = useState([]);
    const [customersCount, setCustomersCount] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const userRole = auth.getUserInfo();

    const pendingOrders = stocks.filter((stock) => stock.isReceived === null);
    const productsAbove50 = products.filter((product) => product.quantity >= 50).length;
    const productsBelow50 = products.filter((product) => product.quantity < 50).length;

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

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8888/user');
            setProfiles(response.data);
            const customers = response.data.filter(profile => profile.role === 'Customer');
            setCustomersCount(customers.length);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {

        fetchProfiles();
        fetchProducts();
        fetchSuppliers();
        fetchStocks();
    }, []);

    const countProductCategories = () => {
        const categoryCounts = {};

        products.forEach((product) => {
            const { category } = product;
            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        return categoryCounts;
    };

    const categoryCounts = countProductCategories();
    const categoryLabels = Object.keys(categoryCounts);
    const categoryData = Object.values(categoryCounts);

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
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className='text-4xl text-white font-bold'>Dashboard</h1>
                    </div>
                </div>
                <div className="w-full h-fit my-2 flex gap-2">
                    <div className="w-fit h-full flex gap-2">
                        <div className="w-full h-full flex flex-col gap-2">
                            <div className="dashboard-total">
                                <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                <div>
                                    <h1>{products.length}</h1>
                                    <h2>Products</h2>
                                </div>
                            </div>
                            <div className="dashboard-total">
                                <svg className="h-12 w-12 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="7" cy="17" r="2" />  <circle cx="17" cy="17" r="2" />  <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />  <line x1="3" y1="9" x2="7" y2="9" /></svg>
                                <div>
                                    <h1>{suppliers.length}</h1>
                                    <h2>Suppliers</h2>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col gap-2">
                            <div className="dashboard-total">
                                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <div>
                                    <h1>{pendingOrders.length}</h1>
                                    <h2>Pending Orders</h2>
                                </div>
                            </div>
                            <div className="dashboard-total">
                                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <div>
                                    <h1>{customersCount}</h1>
                                    <h2>Customers</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[263px] flex justify-center items-center bg-slate-800 p-4 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                        <div className='w-full h-48'>
                            <Pie
                                data={{
                                    labels: categoryLabels.map((label, index) => `${label} (${categoryData[index]})`),
                                    datasets: [
                                        {
                                            data: categoryData,
                                            backgroundColor: [
                                                'rgba(255, 99, 132)',
                                                'rgba(54, 162, 235)',
                                                'rgba(255, 206, 86)',
                                                'rgba(75, 192, 192)',
                                                'rgba(153, 102, 255)',
                                                'rgba(255, 159, 64)',
                                                'rgba(128, 128, 128)',
                                                'rgba(0, 128, 0)',
                                            ],

                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'left',
                                            labels: {
                                                padding: 20,
                                                font: {
                                                    weight: 'bold',
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[350px] my-2 flex gap-2">
                    <div className='w-1/3 h-full p-4 bg-slate-800 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                        <div className='w-full h-full flex justify-center items-center p-4'>
                            <Doughnut
                                data={{
                                    labels: [`Low Stocks (${productsBelow50})`, `High Stocks (${productsAbove50})`],
                                    datasets: [
                                        {
                                            data: [productsBelow50, productsAbove50],
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.6)',
                                                'rgba(54, 162, 235, 0.6)'
                                            ],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                font: {
                                                    weight: 'bold',
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className='w-2/3 h-full p-4 bg-slate-800 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                        <h1 className='text-xl font-bold text-white mb-4'>Low Stocks</h1>
                        <div className='overflow-y-auto h-[270px]'>
                            {products.filter((product) => product.quantity < 50).length === 0 ? (
                                <div className="text-white text-center mt-4">No low stocks</div>
                            ) : (
                                <table className='w-full border-b font-medium text-white'>
                                    <thead>
                                        <tr className='border-b font-medium h-10'>
                                            <th>Product ID</th>
                                            <th>Name</th>
                                            <th>Supplier</th>
                                            <th>Quantity</th>
                                            <th>Max Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products
                                            .filter((product) => product.quantity < 50)
                                            .map((product) => (
                                                <tr key={product.id} className='border-b text-center text-xs h-10 transition duration-300 ease-in-out hover:bg-slate-700'>
                                                    <td className='w-32'>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{suppliers.find(supplier => supplier.id === product.supplierId)?.name}</td>
                                                    <td className='text-red-500'>{product.quantity}</td>
                                                    <td>{product.maxQuantity}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Dashboard
