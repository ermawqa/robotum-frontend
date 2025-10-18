import * as assets from '../../../assets'

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 bg-[#0B132B] text-white">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Get inspired, <br />
          get involved!
        </h1>
        <p className="text-lg font-medium max-w-lg">
          We are an interdisciplinary student club at TUM focused on robotics, innovation, and teamwork.
        </p>
        <a
          href="/apply"
          className="inline-block px-6 py-2 bg-[#4675C0] text-white rounded-full font-medium hover:bg-[#3561a3] transition duration-300"
        >
          apply now →
        </a>
      </div>
      <div className="mt-10 md:mt-0 md:ml-10 md:w-1/2">
        <img
          src={assets.allMembersImg}
          alt="Group of club members"
          className="rounded-[2rem] object-cover w-full h-auto shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;

