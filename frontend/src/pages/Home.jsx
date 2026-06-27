import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // මෙන්න මෙතනින් import කරන්න

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar /> {/* මෙතනට Navbar එක දාන්න */}
      
      {/* ඉතුරු කොටස් ඔක්කොම මෙතන */}
      <section className="py-16 text-center">
         <h1>Welcome to JobMart</h1>
      </section>
      <Footer /> {/* මෙතනට Footer එක දාන්න */}
    </div>
  );
};

export default Home;