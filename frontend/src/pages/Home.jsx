import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <section className="py-16 text-center">
         <h1>Welcome to JobMart</h1> //another contents
      </section>
      <Footer /> 
    </div>
  );
};

export default Home;