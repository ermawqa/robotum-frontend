// general imports
import Navbar from '../components/sections/common-sections/Navbar';
import FooterSection from '../components/sections/common-sections/FooterSection';

// specific imports
import HeroSection from '../components/sections/join-us-sections/HeroSection';
import WhyWeSection from '../components/sections/join-us-sections/WhyWeSection';
import ApplicationSection from '../components/sections/join-us-sections/ApplicationSection';

import { useEffect } from 'react';

const JoinUs = () => {
    useEffect(() => {
        document.title = 'RoboTUM | Join Us';
    }, []);

    return (
        <>
            <Navbar />
            <HeroSection />
            <WhyWeSection />
            <ApplicationSection />
            <FooterSection />
        </>
    );
}

export default JoinUs;