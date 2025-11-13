import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import AddOn from '../components/AddOn'
import { Footer } from '../components/Footer'
const index = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Features/>
    <AddOn/>
    <Footer/>
    </>
  )
}

export default index