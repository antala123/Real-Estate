import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFaliure, allError } from "../redux/user/userSlice"
import { useEffect } from 'react'
import Googleauth from '../Components/Googleauth'

export default function Singup({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])

    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const changeHandler = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }
    // console.log('formData', formData);

    const submitHandler = async (e) => {
        e.preventDefault();

        setFormData({
            username: "", email: "", password: ""
        });

        try {
            // setLoading(true);
            dispatch(signInStart());
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            console.log(data);

            if (data.success === false) {
                // setLoading(false);
                // setError(data.message);
                dispatch(signInFaliure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            // setLoading(false);
            // setError(null);
            navigate("/signin");
        }
        catch (error) {
            dispatch(signInFaliure(error.message));
            // setLoading(false);
            // setError(error.message);
        }
    }

    useEffect(() => {
        dispatch(allError());
    }, [dispatch])

    return (
        <div>
            <div className='p-3 max-w-lg mx-auto'>
                <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
                <form className='flex flex-col gap-4' onSubmit={submitHandler} >
                    <input type='name' name='username' placeholder='Username' className='border p-3 rounded-lg' value={formData.username} id='username' onChange={changeHandler} />
                    <input type='email' name='email' placeholder='Email' className='border p-3 rounded-lg' value={formData.email} id='email' onChange={changeHandler} />
                    <input type='password' name='password' placeholder='Password' className='border p-3 rounded-lg' value={formData.password} autoComplete='false' id='password' onChange={changeHandler} />

                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? "Loading..." : "Sign Up"}
                    </button>


                </form>

                <Googleauth />

                <div className='text-center mt-5'>
                    <p>Have an account?
                        <span className='ms-2'>
                            <Link to='/signin'>
                                <span className='text-blue-700'>Sign in</span>
                            </Link>
                        </span>
                    </p>
                </div>

                <div>
                    {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
                </div>
            </div>
        </div>
    )
}
