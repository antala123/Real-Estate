import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import {
    updateUserInStart, updateUserInSuccess, updateUserInFaliure,
    deleteUserInStart, deleteUserInSuccess, deleteUserInFaliure,
    signoutUserInStart, signoutUserInFaliure, signoutUserInSuccess
} from "../redux/user/userSlice"
import { Link } from 'react-router-dom';


export default function Profile({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])

    const fileRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined)
    // console.log(file);
    const [filePerc, setFileperc] = useState(0)
    // console.log(filePerc);
    const [fileUploadError, setFileUploadError] = useState(false);
    // console.log(fileUploadError)
    const [formData, setFormData] = useState({});
    // console.log(formData)

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);


    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        // console.log(file.name);

        const fileName = new Date().getTime() + file.name;
        // console.log(fileName);

        const storageRef = ref(storage, fileName);
        // console.log(storageRef);

        const uploadTask = uploadBytesResumable(storageRef, file)
        // console.log(uploadTask);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileperc(Math.round(progress))
            // console.log(`Upload is ${progress}% done`);
        },
            (error) => {
                setFileUploadError(true)
                // console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                )
            }
        );
    }

    const dispatch = useDispatch();
    const [updateSuccess, setUpdateSuccess] = useState();

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserInStart())

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserInFaliure(data.message))
                return;
            }

            dispatch(updateUserInSuccess(data))
            setUpdateSuccess(true)
        }
        catch (error) {
            dispatch(updateUserInFaliure(error.message))
        }
    }

    const changeHandler = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }


    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserInStart())

            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserInFaliure(data.message))
                return;
            }

            dispatch(deleteUserInSuccess(data));
        }
        catch (error) {
            dispatch(deleteUserInFaliure(error.message))
        }
    }


    const handleSignoutUser = async () => {
        try {
            dispatch(signoutUserInStart())
            const res = await fetch(`/api/user/signout/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            console.log(data);

            if (data.success === false) {
                dispatch(signoutUserInFaliure(data.message))
                return;
            }

            dispatch(signoutUserInSuccess())
        }
        catch (error) {
            dispatch(signoutUserInFaliure(data.message))
        }
    }


    const [showlistingsError, setShowlistingsError] = useState(false)
    const [userListings, setUserListings] = useState([])

    const showlistingHandler = async () => {

        try {
            setShowlistingsError(false)
            const res = await fetch(`/api/user/listings/${currentUser._id}`)
            const data = await res.json()

            setUserListings(data)
        }
        catch (error) {
            setShowlistingsError(true)
        }
    }


    const deletelistingHandler = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE'
            })
            const data = await res.json()

            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (

        <div className='p-3 max-w-lg mx-auto'>
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={formSubmitHandler}>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' ></input>
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='rounded-full h-24 w-24  cursor-pointer  object-cover
                 self-center mt-2' alt="Profile"></img>
                <p className='text-sm self-center'>
                    {
                        fileUploadError ?
                            (<span className='text-red-700 font-semibold'>Error Image upload(image
                                must be less than 2 MB)</span>) :
                            filePerc > 0 && filePerc < 100 ? (
                                <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                            ) :
                                filePerc === 100 ? (
                                    <span className='text-green-700'>Image Successfully Uploaded!</span>
                                ) : ""
                    }
                </p>
                <input type='name' id='username' defaultValue={currentUser.username} onChange={changeHandler} placeholder='Username' className='border p-3  rounded-lg'></input>
                <input type='email' id='email' onChange={changeHandler} defaultValue={currentUser.email} placeholder='Email' className='border p-3 rounded-lg'></input>
                <input type='password' id='password' onChange={changeHandler} autoComplete='false' placeholder='Password' className='border p-3 rounded-lg'></input>
                <button className='bg-slate-700 text-white rounded-lg p-3 uppercase
                hover:opacity-95 disabled:opacity-80'>Update</button>
                <Link to="/createlisting">
                    <button className='bg-green-700 text-white rounded-lg p-3 uppercase
                    hover:opacity-95 disabled:opacity-80 w-full'>create listing</button>
                </Link>
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
                <span className='text-red-700 cursor-pointer' onClick={handleSignoutUser}>Sign Out</span>
            </div>

            <p className='text-red-700 mt-5 text-center font-semibold'>{error ? error :
                ""}</p>
            <p className='text-green-700 mt-5 text-center font-semibold'>{updateSuccess ?
                "User Updated Successfully....!" : ""}</p>

            <button className='text-green-700 w-full' onClick={showlistingHandler}>Show Listing</button>
            <p>{showlistingsError ? "Error Showing Listings" : ""}</p>


            {
                userListings.length > 0 ? (
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-2xl text-center mt-7 font-semibold'>Your Listing</h1>
                        {
                            userListings.map((listing) => (
                                <div key={listing._id} className='border rounded-lg p-3 flex justifybetween items-center gap-4'>
                                    <Link to={`/listing/${listing._id}`}>
                                        <img src={listing.imageUrls[0]} alt='listing cover' className='h-16
                                        w-16 object-contain' />
                                    </Link>
                                    <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-700 font-semibold hover:underline
                                    truncate'>
                                        <p>{listing.Name}</p>
                                    </Link>
                                    <div className='flex flex-col items-center'>
                                        <button onClick={() => deletelistingHandler(listing._id)} className='text-red-700 uppercase'>Delete</button>
                                        <Link to={`/updatelisting/${listing._id}`}>
                                            <button className='text-green-700 uppercase'>Edit</button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : ""
            }

        </div>

    )
}
