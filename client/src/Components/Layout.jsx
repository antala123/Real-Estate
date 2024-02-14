import React from 'react'
import Routs from '../Routers/Routs'
import Header from './Header'

export default function Layout() {
    return (
        <div>
            <Header></Header>
            <div>
                <Routs></Routs>
            </div>
        </div>
    )
}
