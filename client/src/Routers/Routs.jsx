import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Singup from '../Pages/Singup';
import Singin from '../Pages/Singin';
import Profile from '../Pages/Profile';
import LoadingBar from 'react-top-loading-bar';
import { useState } from 'react';
import PrivateRoute from '../Components/PrivateRoute';
import CreateListing from '../Pages/CreateListing';
import UpdateListing from '../Pages/UpdateListing';
import Listing from '../Pages/Listing';
import Search from '../Pages/Search';
import ScrollToTop from 'react-scroll-to-top';

export default function Routs() {

    const [progress, setProgress] = useState(0);


    return (
        <div>
            <LoadingBar
                color='#7ba7db'
                height={4}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Routes>

                <Route path='/' element={<Home setProgress={setProgress} />}></Route>
                <Route path='/about' element={<About setProgress={setProgress} />}></Route>
                <Route path='/signup' element={<Singup setProgress={setProgress} />}></Route>
                <Route path='/signin' element={<Singin setProgress={setProgress} />}></Route>
                <Route path='/search' element={<Search setProgress={setProgress} />}></Route>
                <Route path='/listing/:id' element={<Listing setProgress={setProgress} />}></Route>
                <Route element={<PrivateRoute></PrivateRoute>}>
                    <Route path='/profile' element={<Profile setProgress={setProgress} />}></Route>
                    <Route path='/createlisting' element={<CreateListing setProgress={setProgress}  ></CreateListing>}></Route>
                    <Route path='/updatelisting/:id' element={<UpdateListing setProgress={setProgress}  ></UpdateListing>}></Route>
                </Route>

            </Routes>
            <ScrollToTop smooth color="#dce9f5" style={{ paddingLeft: "6px", backgroundColor: "#708090" }} />
        </div>
    )
}
