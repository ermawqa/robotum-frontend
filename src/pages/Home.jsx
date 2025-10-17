import HeroSection from '../components/sections/HeroSection';
import Navbar from '../components/sections/Navbar';
import ProjectSection from '../components/sections/ProjectSection';
import EventSection from '../components/sections/EventSection';
import JoinUsSection from '../components/sections/JoinUsSection';
import PartnersSection from '../components/sections/PartnersSection';
import FooterSection from '../components/sections/FooterSection';
import MissionSection from '../components/sections/MissionSection';

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