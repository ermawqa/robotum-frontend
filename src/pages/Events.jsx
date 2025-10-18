// general imports
import Navbar from '../components/sections/common-sections/Navbar';
import FooterSection from '../components/sections/common-sections/FooterSection';

// specific imports
import HeroSection from '../components/sections/events-sections/HeroSection';
import EventsSection from '../components/sections/events-sections/EventsSection';

import { useEffect } from 'react';

const Events = () => {
    useEffect(() => {
        document.title = 'RoboTUM | Events';
    }, []);

    return (
        <>
            <Navbar />
            <HeroSection />
            <EventsSection />
            <FooterSection />
        </>
    );
}

export default Events;