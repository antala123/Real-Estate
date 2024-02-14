import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
// import SwiperCore from 'swiper';
// import 'swiper/css/bundle';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import img1 from '../assets/Image/img1.jpg';
import img2 from '../assets/Image/img2.jpg';
import img3 from '../assets/Image/img3.jpg';
import img4 from '../assets/Image/img4.jpg';
import img5 from '../assets/Image/img5.jpg';
import { RiHomeOfficeFill } from 'react-icons/ri';
import { IoIosHome } from 'react-icons/io';
import { RiFileTextLine } from 'react-icons/ri';
import { IoIosKey } from 'react-icons/io';
import Listingitem from '../Components/Listingitem'


export default function Home({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])

    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };
    // SwiperCore.use([Navigation, Autoplay])
    const [offerlisting, setOfferlisting] = useState([])
    const [salelisting, setSalelisting] = useState([])
    const [rentlisting, setRentlisting] = useState([])

    useEffect(() => {

        const fetchofferlisting = async () => {
            try {
                const res = await fetch(`/api/listing/get?offer=true&limit=4`)
                const data = await res.json()
                setOfferlisting(data)
                // fetchrentlisting()
            }
            catch (error) {
                console.log(error);
            }
        }

        const fetchrentlisting = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=rent&limit=4`)
                const data = await res.json()
                setRentlisting(data)
                // fetchsalelisting()
            }
            catch (error) {
                console.log(error);
            }
        }

        const fetchsalelisting = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=sale&limit=4`)
                const data = await res.json()
                setSalelisting(data)
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchofferlisting();
        fetchrentlisting();
        fetchsalelisting();
    }, [])


    return (
        <div>
            <div className='max-w-6xl mx-auto py-28 px-3'>
                <div className='flex flex-col gap-6'>
                    <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl' aria-label='perfect'>
                        Find your next <span className='text-slate-500 typewriter nocaret'></span>
                        <br />
                        place with ease
                    </h1>
                    <div className='text-gray-400 text-xs sm:text-sm'>
                        Sahand Estate will help you find your home fast, easy and comfortable.
                        <br />
                        We have a wide range of properties for you to choose from.
                    </div>
                    <Link to="/search" className='text-xs sm:text-sm text-blue-800 font-bold'>
                        <button type='button'>Let's Start now...</button>
                    </Link>
                </div>
            </div>


            <Swiper
                // navigation 
                // autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                spaceBetween={30}
                centeredSlides={true}
                effect={"fade"}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                pagination={{
                    clickable: true,
                }}
                // navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src={img1} alt="images" className="h-[500px] w-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={img2} alt="images" className="h-[500px] w-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={img3} alt="images" className="h-[500px] w-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={img4} alt="images" className="h-[500px] w-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={img5} alt="images" className="h-[500px] w-full object-cover" />
                </SwiperSlide>
                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>


            <div className=' container py-24 mx-auto'>
                <div className=' mb-16'>
                    <h2 className=' text-3xl xl:text-5xl font-semibold text-slate-600'>How It works?
                        <br className=' lg:block hidden' /> Find a
                        <span className=' font-bold text-gray-700'>perfect home</span></h2>
                </div>
                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className=' pe-5 pb-2 flex flex-col items-end md:border-e-2 border-gray-400 '>
                        <div className=''>
                            <div>
                                {/* <i className="ri-home-office-fill text-5xl text-slate-700 "></i> */}
                                <RiHomeOfficeFill className="text-5xl text-slate-700" />
                            </div>
                            <h3 className=' mt-4 text-2xl font-bold text-slate-600'>Find real estate</h3>
                            <p className=' text-lg font-normal text-gray-500 mt-1'>Sumo petentium ut per,
                                at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.</p>
                        </div>
                    </div>
                    <div className=' pe-5 pb-2 flex flex-col items-end lg:border-e-2 border-gray-400'>
                        <div className=''>
                            <div>
                                {/* <i className="icofont icofont-home text-5xl text-slate-700"></i> */}
                                <IoIosHome className="text-5xl text-slate-700" />
                            </div>
                            <h3 className=' mt-4 text-2xl font-bold text-slate-600'>Meet relator</h3>
                            <p className=' text-lg font-normal text-gray-500 mt-1'>Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.</p>
                        </div>
                    </div>
                    <div className=' pe-5 pb-2 flex flex-col items-end md:border-e-2 border-gray-400'>
                        <div className=''>
                            <div>
                                {/* <i className="ri-file-text-line text-5xl text-slate-700"></i> */}
                                <RiFileTextLine className="text-5xl text-slate-700" />
                            </div>
                            <h3 className=' mt-4 text-2xl font-bold text-slate-600'>Documents</h3>
                            <p className=' text-lg font-normal text-gray-500 mt-1'>Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.</p>
                        </div>
                    </div>
                    <div className=' pe-5 pb-2 flex flex-col items-end'>
                        <div className=' '>
                            <div>
                                {/* <i className="icofont icofont-key text-5xl text-slate-700"></i> */}
                                <IoIosKey className="text-5xl text-slate-700" />

                            </div>
                            <h3 className=' mt-4 text-2xl font-bold text-slate-600'>Take the keys</h3>
                            <p className=' text-lg font-normal text-gray-500 mt-1'>Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerlisting && offerlisting.length > 0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                                Show more offers
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerlisting.map((item) => (
                                <Listingitem item={item} key={item._id}></Listingitem>
                            ))}
                        </div>
                    </div>
                )}

                {rentlisting && rentlisting.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                                Show more places for rent
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentlisting.map((item) => (
                                <Listingitem item={item} key={item._id} ></Listingitem>
                            ))}
                        </div>
                    </div>
                )}

                {salelisting && salelisting.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                                Show more places for sale
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {salelisting.map((item) => (
                                <Listingitem item={item} key={item._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
