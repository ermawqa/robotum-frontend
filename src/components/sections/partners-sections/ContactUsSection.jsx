import { useState } from "react";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import * as assets from "@assets";
import { logger } from "@utils/logger";

import emailjs from "emailjs-com";

export default function ContactUsSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const {
    VITE_EMAILJS_SERVICE_ID,
    VITE_EMAILJS_TEMPLATE_ID,
    VITE_EMAILJS_PUBLIC_KEY,
  } = import.meta.env;

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    emailjs
      .send(
        VITE_EMAILJS_SERVICE_ID,
        VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          message: formData.message,
        },
        VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setFormData({ name: "", company: "", email: "", message: "" });
        setSubmitted(true);
        setIsSubmitting(false);
      })
      .catch((error) => {
        logger.error("EmailJS error:", error);
        setErrorMessage(
          "Something went wrong while sending your message. Please try again in a moment.",
        );
        setIsSubmitting(false);
      });
  };

  if (submitted) {
    return (
      <section id="contact" className="section-dark-primary surface-pattern">
        <div className="section-container flex flex-col items-center text-center py-24">
          <h2 className="heading heading-h2 mb-4">Thank you!</h2>
          <p className="text-white/80 max-w-md mb-8">
            Your partnership request has been successfully submitted. Our team
            will get back to you shortly.
          </p>
          <Button to="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-dark-primary surface-pattern">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side: contact form */}
        <div>
          <h2 className="heading heading-h2 mb-6">Become a Partner</h2>
          <p className="text-text2 text-white/80 mb-8 max-w-prose">
            Interested in collaborating with RoboTUM? Fill out the form below
            and we’ll get in touch soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-elevated-1/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                autoComplete="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-elevated-1/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Company name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-elevated-1/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-elevated-1/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-300 bg-red-900/30 border border-red-500/40 rounded-md px-3 py-2">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>

          <p className="text-sm text-white/60 mt-6">
            *Alternatively, write to{" "}
            <a
              href="mailto:outreach@robotum.info"
              className="underline text-accent hover:text-blue-400"
            >
              outreach@robotum.info
            </a>
            .
          </p>
        </div>

        {/* Right side: contact card */}
        <div className="flex flex-col items-center bg-elevated-1/40 border border-white/10 rounded-2xl p-8 text-center">
          <ImageFrame
            src={assets.pavelImg}
            alt="Pavel Fenskii"
            className="w-40 h-40 rounded-full mb-5"
          />
          <h3 className="heading text-xl mb-2">Pavel Fenskii</h3>
          <p className="text-white/80 mb-4">Head of External Relations</p>
          <a
                    href="mailto:operations@robotum.info"
                    className="underline hover:text-white"
                  >
                    operations@robotum.info
                  </a>
          <p className="text-white/70 text-sm">+49 1737 401924</p>
        </div>
      </div>
    </section>
  );
}
