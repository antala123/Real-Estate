import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFaliure, allError } from "../redux/user/userSlice"
import { useEffect } from 'react'
import Googleauth from '../Components/Googleauth'

export default function Singin({ setProgress }) {

  useEffect(() => {
    setProgress(10);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [])

  const [formData, setFormData] = useState({ email: "", password: "" });
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
      email: "", password: ""
    });

    try {
      // setLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
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
      navigate("/");
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
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form className='flex flex-col gap-4' onSubmit={submitHandler}>
          <input type='email' name='email' value={formData.email} placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={changeHandler} />
          <input type='password' name='password' value={formData.password} autoComplete='off' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={changeHandler} />

          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <Googleauth />

        <div className='text-center mt-5'>
          <p>Dont Have an account?

            <span className='ms-2'>
              <Link to='/signup'>
                <span className='text-blue-700'>Sign up</span>
              </Link>
            </span>

          </p>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>

    </div>
  )
}
