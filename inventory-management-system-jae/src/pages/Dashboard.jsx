const Dashboard = () => {
    return (
        <>
            <div className='w-full h-full p-4 flex flex-col justify-center items-center'>
                <div className="flex flex-wrap justify-center w-full h-full">
                    <div className="dashboard-group">
                        <h1>Icon</h1>
                        <div>
                            <h4>$0</h4>
                            <h2>Profit</h2>
                        </div>
                    </div>
                    <div className="dashboard-group">
                        <h1>Icon</h1>
                        <div>
                            <h4>$0</h4>
                            <h2>Revenue</h2>
                        </div>
                    </div>
                    <div className="dashboard-group">
                        <h1>Icon</h1>
                        <div>
                            <h4>$0</h4>
                            <h2>Stocks</h2>
                        </div>
                    </div>
                    <div className="dashboard-group">
                        <h1>Icon</h1>
                        <div>
                            <h4>$0</h4>
                            <h2>Income</h2>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full flex">
                    <div className="bg-slate-800 w-full h-64 m-2 rounded-md flex items-center justify-center">
                        <h1 className="text-white">Recent Activities Table</h1>
                    </div>
                    <div className="bg-slate-800 w-full h-64 m-2 rounded-md flex items-center justify-center">
                        <h1 className="text-white">Pending Orders Table</h1>
                    </div>
                </div>
                <div className="w-full h-full flex">
                    <div className="bg-slate-800 w-full h-60 m-2 rounded-md flex items-center justify-center">
                        <h1 className="text-white">Stocks Table</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard