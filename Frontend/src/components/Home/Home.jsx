import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Landing from './Landing';
import Feature from './Feature';
import Mentors from './Mentors';
import Craousal from './Craousal';
import Faq from './Faq';
import Rate from './Rate';
import SearchBar from './SearchBar';
import LandingHome from './LandingHome';
import CodeEditor from '../Pages/CodeEditor';
import AiBot from '../Global/AiBot';

// Define transition animations
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  },
};

const Section = ({ children, animation }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={animation}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className='relative'>
      <Section animation={animations.fadeInUp}>
        <LandingHome />
      </Section>
      <Section animation={animations.fadeInUp}>
        <Landing />
      </Section>
      <Section animation={animations.fadeInRight}>
        <Craousal />
      </Section>
      <Section animation={animations.fadeInUp}>
        <Feature />
      </Section>
      <Section animation={animations.fadeInUp}>
        <SearchBar />
      </Section>
      <Section animation={animations.fadeInLeft}>
        <Faq />
      </Section>
      
    </div>
  );
};

export default Home;
