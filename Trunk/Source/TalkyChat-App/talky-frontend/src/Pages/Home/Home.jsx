import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import { motion } from 'framer-motion';
import chatAnimation from "../../assets/LottiePlayers/Landing.json";
import './Home.scss';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="content">
        <motion.div
          className="text-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title">
            <span className="gradient-text">Talky Chat</span>
            <br />
            Simple, Secure Messaging
          </h1>
          
          <p className="subtitle">
            Connect instantly with end-to-end encryption and no distractions.
          </p>

          <div className="cta-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </button>
            <button 
              className="primary-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </motion.div>

        <motion.div
          className="animation-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Lottie animationData={chatAnimation} loop={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;