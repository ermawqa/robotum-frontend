import Navbar from '../components/sections/common-sections/Navbar';
import FooterSection from '../components/sections/common-sections/FooterSection';

import HeroSection from '../components/sections/about-us-sections/HeroSection';
import TeamSection from '../components/sections/about-us-sections/TeamSection';

export default function About() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <TeamSection />
            <FooterSection />
        </>
    );
}