import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from "react-redux";

export default function Header() {

    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const isSignUpPage = location.pathname === '/signup';
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm', searchTerm);

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }

    }, [])

    return (

        <div className='bg-slate-200 shadow-md' style={{ zIndex: 9999, top: "0px", position: "sticky" }}>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Sahand</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className='flex bg-slate-100 p-3 rounded-lg items-center'>
                    <input type='text' id='search' autoComplete='off' placeholder='Search...'
                        className=' text-sm bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>

                <ul className='flex gap-4 effects'>
                    <NavLink to='/' className='links'>
                        <li className='hidden sm:inline text-slate-700'>
                            Home
                        </li>
                    </NavLink>
                    <NavLink to='/about' className='links'>
                        <li className='hidden sm:inline text-slate-700'>
                            About
                        </li>
                    </NavLink>

                    {
                        currentUser ? (
                            <NavLink to='/profile'>
                                <img src={currentUser.avatar} alt="avatar" className='rounded-full h-7 w-7 object-cover' />
                            </NavLink>
                        ) : (
                            <div>
                                {isSignUpPage ? (
                                    <NavLink to='/signup' className='links'>
                                        <li className=' text-slate-700'>Sign Up</li>
                                    </NavLink>
                                ) : (
                                    <NavLink to='/signin' className='links'>
                                        <li className=' text-slate-700'>Sign In</li>
                                    </NavLink>
                                )}
                            </div>
                        )
                    }


                </ul>

            </div>
        </div>

    )
}
