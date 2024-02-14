import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Listingitem from '../Components/Listingitem';

export default function Search({ setProgress }) {

    useEffect(() => {
        setProgress(10);
        setTimeout(() => {
            setProgress(100);
        }, 500);
    }, [])

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    // console.log(listing);

    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort_order: 'createdAt',
        order: 'desc'
    })

    // console.log(sidebardata);
    // console.log(listing);

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sort_orderFromUrl = urlParams.get('sort_order');
        const orderFromUrl = urlParams.get('order');
        // console.log("search",searchFromUrl);
        if (searchTermFromUrl || typeFromUrl || parkingFromUrl
            || furnishedFromUrl || offerFromUrl || sort_orderFromUrl || orderFromUrl) {

            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort_order: sort_orderFromUrl || 'createdAt',
                order: orderFromUrl || 'desc'
            });
        }

        const fetchlistingdata = async () => {
            try {
                setLoading(true)
                const searchQuery = urlParams.toString()
                // console.log(searchQuery,"search query");

                const res = await fetch(`/api/listing/get?${searchQuery}`)
                const data = await res.json()
                // console.log("data",data);
                if (data.success === false) {
                    console.log(data.message);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

        fetchlistingdata();

    }, [location.search])

    const handleChange = (e) => {

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({ ...sidebardata, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.id === 'sort_order') {

            const sort_order = e.target.value.split('_')[0] || 'createdAt';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort_order, order })
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams()

        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort_order', sidebardata.sort_order)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        // console.log(sidebardata.search,"search");
        navigate(`/search?${searchQuery}`)
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='bg-transparent border-b-2 sm:border-r-2 p-7 h-auto md:min-h-screen flex-2'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap'>Search Term:</label>
                        <input type="text" id="searchTerm" placeholder="Search..."
                            className="border rounded-lg p-3 w-full" value={sidebardata.searchTerm} onChange={handleChange}></input>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <label className="whitespace-nowrap">Type:</label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="all" className="w-5"
                                checked={sidebardata.type === 'all'} onChange={handleChange}></input>
                            <span>Rent &amp; Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id="rent" className="w-5"
                                checked={sidebardata.type === 'rent'} onChange={handleChange}
                            ></input>
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id="sale" className="w-5"
                                checked={sidebardata.type === 'sale'} onChange={handleChange}
                            ></input>
                            <span>Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id="offer" className="w-5"
                                checked={sidebardata.offer} onChange={handleChange}
                            ></input>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className="whitespace-nowrap">Amenities:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5"
                                checked={sidebardata.parking} onChange={handleChange}
                            ></input>
                            <span>Parking</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5"
                                checked={sidebardata.furnished} onChange={handleChange}
                            ></input>
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label>Sort:</label>
                        <select name="sort_order" id="sort_order" className="border rounded-lg p-3" onChange={handleChange} defaultValue="createdAt_desc">
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high </option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option></select>
                    </div>

                    <button className="bg-slate-700 text-white p-3 uppercase rounded-lg w-full">
                        Search
                    </button>

                </form>
            </div>


            <div className='flex-1'>
                <h1 className="text-3xl m-5 font-semibold border-b p-3 text-slate-700">Listing results:</h1>

                <div className='flex flex-wrap gap-4 p-7'>
                    {!loading && listing.length < 1 &&
                        (
                            <p className='text-xl text-slate-700 w-full'>No Listing Found...!</p>
                        )
                    }
                    {
                        loading ? (
                            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                        ) : (
                            <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                                {
                                    Array.isArray(listing) &&
                                    listing.map((item) => (
                                        <Listingitem key={item._id} item={item} ></Listingitem> 
                                    ))
                                }
                            </div>
                        )
                    }

                    {/* {
                        !loading && listing && Array.isArray(listing) && listing.map((listingItem) => (
                            <Listingitem key={listingItem._id} listing={listingItem}></Listingitem>
                        ))
                    } */}

                </div>
            </div>
        </div>
    )
}
