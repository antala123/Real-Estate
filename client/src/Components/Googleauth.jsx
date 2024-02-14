import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { signInFaliure, signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function Googleauth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const googleHandleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
            const data = await res.json();
            if(data.success === false) {
                dispatch(signInFaliure(data.message))
                return;
            }
            dispatch(signInSuccess(data));
            navigate("/");
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <button onClick={googleHandleClick} type='button' className='bg-red-700 text-white p-3 mt-4 rounded-lg w-full uppercase hover:opacity-95'>
                Continue with google
            </button>
        </>
    )
}
