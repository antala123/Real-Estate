import React from 'react'
import { useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'



export default function CreateListing({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])

    const { id } = useParams()
    const [files, setFiles] = useState([])
    // console.log(files);
    const [formData, setFormData] = useState({
        imageUrls: [],
        Name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    });
    console.log(formData.imageUrls);


    const [imageUploadError, setImageUploadError] = useState(false)
    // console.log(formData);
    const navigate = useNavigate()
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchlisting = async () => {
            const res = await fetch(`/api/listing/get/${id}`)
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                return;
            }
            setFormData(data)
        }

        fetchlisting()
    }, [])

    const handleImageSubmit = (e) => {
        // e.preventDefault();  

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            setUploading(true);
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(true);
                setUploading(false);
            }).catch((err) => {
                console.log(err);
                setUploading(false);
                setImageUploadError("Image Upload Failed (2 MB max per Image...)")
            })
        }
        else {
            setImageUploadError("You can only upload 6 Images per Listing...")
            setUploading(false);
        }
    }



    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed", (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log(progress);
                    console.log(`Upload id ${progress}%`);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }


    // const handleChange = (e) => {

    //     if (e.target.id === 'sale' || e.target.id === 'rent') {
    //         setFormData({ ...formData, type: e.target.id })
    //     }

    //     if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
    //         setFormData({ ...formData, [e.target.id]: e.target.checked })
    //     } 
    //     if (e.target.id === 'number' || e.target.id === 'text' || e.target.id === 'checkbox') {
    //         setFormData({ ...formData, [e.target.id]: e.target.value })
    //     } 
    // }
    const handleChange = (e) => {
        if (e.target.id === 'rent' || e.target.id === 'sale') {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'checkboxs') {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }
        if (e.target.id === 'description') {
            setFormData({ ...formData, description: e.target.value });
        }
    }


    const imageRemoveHandler = (index) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) })
    }


    const formSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (formData.imageUrls.length < 1) {
                return setError("You must Upload at last one image");
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                return setError("'Discount price must be lower than regular price")
            }

            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, userRef: currentUser._id })
            })

            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            navigate(`/listing/${data._id}`)
            setLoading(false);
        }
        catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center my-7">Update a Listing</h1>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={formSubmitHandler}>
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder="Name" className="border p-3 rounded-lg"
                        id="Name" name='name' required value={formData.Name} onChange={handleChange}></input>
                    <textarea type="text" placeholder="Description" className="border p-3
                      rounded-lg" id="description" required value={formData.description} onChange={handleChange}></textarea>
                    <input type="text" placeholder="Address" className="border p-3 rounded-lg"
                        id="address" required value={formData.address} onChange={handleChange}></input>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" checked={formData.type === 'sale'} onChange={handleChange}></input>
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" checked={formData.type === 'rent'} onChange={handleChange}></input>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" checked={formData.parking} onChange={handleChange}></input>
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" checked={formData.furnished} onChange={handleChange}></input>
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" checked={formData.offer} onChange={handleChange}></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" min="1" max="10" className="p-3 border
                      border-gray-300 rounded-lg" required value={formData.bedrooms} onChange={handleChange}></input>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathrooms" min="1" max="10" className="p-3
                        border border-gray-300 rounded-lg" required value={formData.bathrooms} onChange={handleChange}></input>
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="regularPrice" min="1" max="10000000" className="p-3
                          border border-gray-300 rounded-lg" required value={formData.regularPrice} onChange={handleChange}></input>
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>

                                {formData.type === 'rent' && (
                                    <span className="text-xs">($ / Month)</span>
                                )}

                            </div>
                        </div>

                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input type="number" id="discountPrice" min="1" max="10000000" className="p-3
                          border border-gray-300 rounded-lg" required value={formData.discountPrice} onChange={handleChange}></input>
                                <div className="flex flex-col items-center">
                                    <p>Discounted price</p>

                                    {formData.type === 'rent' && (
                                        <span className="text-xs">($ / Month)</span>
                                    )}

                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:<span className="font-normal text-gray-600 ml-2">
                        The first image will be the cover (max 6)
                    </span></p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} type="file"
                            id="images" className="p-3 border border-gray-300
                         rounded w-full" accept="image/*" multiple></input>
                        <button onClick={handleImageSubmit} type='button' disabled={uploading}
                            className="p-3 text-green-700 rounded border border-green-700
                       hover:bg-green-700 hover:text-white hover:duration-700 hover:shadow-lg uppercase">
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    <p className='text-center-700 text-red-700'>{imageUploadError && imageUploadError}</p>


                    {
                        formData.imageUrls.length > 0 ?
                            (<div className='max-h-80 overflow-x-auto'>
                                {
                                    formData.imageUrls.map((url, index) => (
                                        <div key={url} className='flex justify-between p-3 border items-center' >
                                            <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                                            <button type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' onClick={() => imageRemoveHandler(index)}>Delete</button>
                                        </div>
                                    ))
                                }
                            </div>) : ""
                    }

                    <button type='submit' disabled={loading}
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
                        {loading ? "Creating..." : "Update Listing"}
                    </button>
                    {error && <p className='text-red-700 text-sm text-center'>{error}</p>}
                </div>
            </form >
        </div >
    )
}
