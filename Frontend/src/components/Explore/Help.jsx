import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaDiscord,
  FaTwitter,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaUser,
  FaKey,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I upgrade my subscription?",
      answer:
        "Navigate to the Premium page and select your desired plan. You can change plans anytime.",
    },
    {
      question: "Where can I access premium DSA sheets?",
      answer: "Once subscribed, visit the Resources section in your dashboard.",
    },
    {
      question: "How do mock interviews work?",
      answer:
        "Schedule interviews through the platform. Expert interviews require premium access.",
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel anytime from your account settings.",
    },
  ];

  const categories = [
    "Not able to login",
    "Subscription issues",
    "Technical problems",
    "Feature request",
    "Other",
  ];

  const resources = [
    {
      title: "Instagram",
      url: "https://www.instagram.com/tanwar_8191/",
      icon: <FaInstagram className="inline mr-2" />,
    },
    {
      title: "GitHub",
      url: "https://github.com/Himender-Singh",
      icon: <SiGithub className="inline mr-2" />,
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com/profile.php?id=100073221073175",
      icon: <FaFacebook className="inline mr-2" />,
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_USER_ID
      );

      // import.meta.env.

      toast.info("Help request submitted! We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to submit. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-blue-900 text-blue-200 px-6 py-2 rounded-full mb-4">
            <FaQuestionCircle className="mr-2" />
            <span className="font-semibold">HELP CENTER</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions or contact our support team
            directly.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Right Column - Contact & Resources */}
          <div className="space-y-8 flex md:col-span-1">
            {/* Modern Contact Form */}
            <div className="bg-gray-800 p-8 w-[35rem] rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                <FaEnvelope className="text-blue-400 mr-3" />
                Contact Support
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Name*
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email*
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Phone Number*
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white"
                    required
                  >
                    <option value="" className="text-gray-400">
                      Select a category
                    </option>
                    {categories.map((category, index) => (
                      <option
                        key={index}
                        value={category}
                        className="text-white"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all ${
                    isSubmitting
                      ? "opacity-80 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-blue-500/20"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            <div className="flex flex-col ml-4 gap-8 w-[40rem]">
              {/* Left Column - FAQs */}
              <div className="md:col-span-2">
                <h2 className="text-2xl p-4 bg-white rounded-full text-black font-bold mb-6 flex items-center">
                  <FaQuestionCircle className="text-blue-400 mr-3" />
                  Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-900/20"
                    >
                      <button
                        className={`w-full flex justify-between items-center p-4 text-left hover:bg-gray-800 ${
                          activeIndex === index ? "bg-gray-800" : ""
                        }`}
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="font-medium text-gray-100">
                          {faq.question}
                        </span>
                        {activeIndex === index ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </button>

                      {activeIndex === index && (
                        <div className="p-4 pt-0 text-gray-300 bg-gray-800">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Quick Help */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaPhone className="text-blue-400 mr-3" />
                  Quick Help
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaTwitter className="text-indigo-400 mr-3 text-xl" />
                    <span>
                      Join our{" "}
                      <a
                        href="https://x.com/HimenderSngh"
                        className="text-blue-400 hover:underline hover:text-blue-300"
                      >
                        Twitter
                      </a>
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaLinkedin className="text-blue-400 mr-3 text-xl" />
                    <span>
                      DM us on{" "}
                      <a
                        href="https://www.linkedin.com/in/himender-singh-54ba88282/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline hover:text-blue-300"
                      >
                        LinkedIn
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Follow Us on
                </h2>

                <ul className="space-y-3">
                  {resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 hover:underline py-2 px-3 rounded hover:bg-gray-700 transition"
                      >
                        {resource.icon}
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
