import React from 'react'
import Hero from '../ClientComponents/Hero/Hero'
import Popular from '../ClientComponents/Popular/Popular'
import Offers from '../ClientComponents/Offers/Offers'
import NewCollections from '../ClientComponents/NewCollections/NewCollections'
import NewsLetter from '../ClientComponents/NewsLetter/NewsLetter'

const Shop = () => {
    return (
        <div>
            <Hero />
            <Popular />
            <Offers />
            <NewCollections />
            <NewsLetter />
        </div>
    )
}
export default Shop
