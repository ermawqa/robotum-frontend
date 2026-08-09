import * as assets from "@assets";
import Button from "@components/ui/Button";

const WhyWeSection = () => {
  return (
    <section
      id="why-we-section"
      className="section-container text-white font-sans section-dark-secondary surface-pattern"
      aria-labelledby="why-heading"
    >
      <div className="flex flex-col gap-20">
        {/* Header */}
        <div className="text-center">
          <h2
            id="why-heading"
            className="heading heading-h1 font-bold leading-tight text-balance mb-6"
          >
            Why RoboTUM?
          </h2>
          <p className="text-text2 md:text-text1 text-white/80 max-w-3xl mx-auto leading-relaxed">
            Learn, build, and innovate together with students who share your
            passion for robotics.
          </p>
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Why RoboTUM features"
        >
          {[
            { icon: assets.handsOnIcon, title: "Hands-on experience" },
            { icon: assets.teamsIcon, title: "Interdisciplinary teams" },
            { icon: assets.eventsIcon, title: "Competitions & events" },
          ].map((item, index) => (
            <div
              role="listitem"
              key={index}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl px-8 py-12 text-center flex flex-col items-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_rgba(59,130,246,0.25)]"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-20 h-20 mb-5 transition-transform duration-300 hover:scale-110"
              />
              <p className="text-text1 font-semibold capitalize">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <h3 className="heading heading-h2 font-bold mb-6">
            Who are we looking for?
          </h3>
          <p className="text-text2 md:text-text1 text-white/80 mb-4 leading-relaxed">
            At RoboTUM, we are seeking high-performing, motivated, and efficient
            students to help transform Munich into the robotics hub it is
            destined to be. We are highly selective and expect the highest
            quality of work. In exchange, we offer you value in the form of a
            community of equally motivated and talented individuals, global
            connections in the industry, and opportunities to develop your
            skills to the state of the art.
          </p>
          <p className="text-text2 md:text-text1 text-white/80 leading-relaxed mb-8">
            You don’t need to be an expert - just bring motivation and
            willingness to learn. We’ll support you from day one.
          </p>
          <Button variant="primary" scrollTarget="application">
            Join Now ↓
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyWeSection;
