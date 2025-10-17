import HeroSection from '../components/sections/HeroSection';
import Navbar from '../components/sections/Navbar';
import ProjectSection from '../components/sections/ProjectSection';

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <ProjectSection />
        </>
    );
}