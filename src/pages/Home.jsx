import Navbar from '../components/sections/common-sections/Navbar';
import FooterSection from '../components/sections/common-sections/FooterSection';

import HeroSection from '../components/sections/homepage-sections/HeroSection';
import ProjectSection from '../components/sections/homepage-sections/ProjectSection';
import EventSection from '../components/sections/homepage-sections/EventSection';
import JoinUsSection from '../components/sections/homepage-sections/JoinUsSection';
import PartnersSection from '../components/sections/homepage-sections/PartnersSection';
import MissionSection from '../components/sections/homepage-sections/MissionSection';

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <MissionSection />
            <ProjectSection />
            <EventSection />
            <JoinUsSection />
            <PartnersSection />
            <FooterSection />
        </>
    );
}