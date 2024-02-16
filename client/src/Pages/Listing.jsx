import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaShare, FaMapMarkerAlt, FaBed, FaParking, FaBath, FaChair } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Contact from '../Components/Contact'

export default function Listing({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])


    SwiperCore.use([Navigation, Autoplay])
    const { id } = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const DiscountLasPrice = Number(listing && listing.regularPrice) - Number(listing && listing.discountPrice);

    
    useEffect(() => {

        const fetchlisting = async () => {
            try {
                setLoading(true)

                const res = await fetch(`/api/listing/get/${id}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return;
                }

                setListing(data)
                setLoading(false)
                setError(false)
            }
            catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchlisting();
    }, [id])


    return (
        <div>

            {loading === true ? (
                <p className="text-center my-7 text-2xl font-semibold text-green700">Loading...</p>
            ) : error === true ? (
                <p className="text-center my-7 text-2xl font-semibold text-green700">Something Went Wrong!</p>
            ) : listing !== null ? (
                <div>
                    <Swiper navigation autoplay={{ delay: 3000, pauseOnMouseEnter: true }}>
                        {
                            listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className="h-[500px]"
                                        style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            ) : ""}


            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare
                    className='text-slate-500'
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => {
                            setCopied(false);
                        }, 2000);
                    }}
                />
            </div>
            {copied && (
                <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                    Link copied!
                </p>
            )}

            {listing !== null && listing.name !== null ? (
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6'>
                    <div className='w-full'>
                        <p className='text-2xl font-semibold'>
                            {listing.Name} - ${' '}
                            <span>{DiscountLasPrice.toLocaleString('en-US')}</span>
                            {listing.type === 'rent' && ' / month'}
                        </p>

                        <p className='flex items-center mt-6 gap-2 text-slate-600 font-semibold my-2 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>

                        <div className='flex gap-4 justify-start items-center'>
                            <p className='p-2 text-red-700 rounded-md border border-red-700
                       hover:bg-red-700 hover:text-white hover:duration-700 hover:shadow-lg cursor-pointer'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='p-2 text-green-700 rounded-md border border-green-700
                                hover:bg-green-700 hover:text-white hover:duration-700 hover:shadow-lg cursor-pointer'>
                                    ${listing.discountPrice} Discount
                                </p>
                            )}
                        </div>

                        <p className='text-slate-800 my-3'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                    </div>

                    {currentUser && listing.userRef !== currentUser.id
                        && !contact && (
                            <button onClick={() => setContact(true)}
                                className='bg-slate-700 mt-6 text-white rounded-lg uppercase hover:opacity-95 p-3 w-full'>
                                Contact Landlord
                            </button>
                        )}
                    {contact && <Contact listing={listing}></Contact>}
                </div>
            ) : null}


        </div>
    )
}
