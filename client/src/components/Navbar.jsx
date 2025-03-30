import React from 'react';
import { Link } from 'react-router-dom';
import  useAuth  from '../redux/hooks/useAuth'

const Navbar = () => {
    const { user, UpdateUserLogout } = useAuth()
    const handleClick = () => {
        UpdateUserLogout()
    }
    return (
        <nav className="nav-bar bg-slate-700 p-4 text-white">

            <div className=" mx-auto flex justify-between items-center">
                <Link to="/">
                    <div className="text-white flex font-bold text-xl">
                        <p className='text-green-500'></p>Fuck
                        <p className='text-green-500'>U</p>
                    </div>
                </Link>

                <div className="flex space-x-4">
                    {user && (
                        <div className='flex'>
                            <div className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">Hi 👋 {user}</div>
                            <button onClick={handleClick} className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">Logout</button>
                        </div>
                    )}
                    {!user && (
                    <div className='flex'>
                        <Link to="/login" className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">
                            Login
                        </Link>
                        <Link to="/register" className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">
                            Sign Up
                        </Link>
                    </div>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
