import React from "react";
import { FaCheckCircle, FaTimesCircle, FaCrown, FaRobot, FaChartLine, FaUserTie, FaLaptopCode, FaMedal, FaShieldAlt } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks, SiHackerrank } from "react-icons/si";
import { motion } from "framer-motion";

const plans = [
  {
    title: "Coding Explorer",
    price: "$0/month",
    popular: false,
    features: [
      { icon: <FaUserTie className="text-blue-400" />, text: "Peer mock interviews" },
      { icon: <FaLaptopCode className="text-green-400" />, text: "Basic compiler (3 languages)" },
      { icon: <FaRobot className="text-purple-400" />, text: "5 AI queries/day" },
      { icon: <FaChartLine className="text-yellow-400" />, text: "Public performance stats" },
    ],
    unavailable: [
      "Expert mock interviews",
      "Premium DSA sheets",
      "Company-wise interview kits",
      "Startup incubator access",
    ],
    cta: "Get Started"
  },
  {
    title: "Job Seeker Pro",
    price: "$9.99/month",
    popular: true,
    features: [
      { icon: <FaUserTie className="text-blue-400" />, text: "2 expert interviews/month" },
      { icon: <FaLaptopCode className="text-green-400" />, text: "All programming languages" },
      { icon: <FaRobot className="text-purple-400" />, text: "Unlimited AI assistance" },
      { icon: <FaChartLine className="text-yellow-400" />, text: "Advanced analytics" },
      { icon: <FaMedal className="text-red-400" />, text: "Curated DSA sheets" },
    ],
    unavailable: [
      "Startup incubator access",
      "Priority job referrals"
    ],
    cta: "Choose Pro"
  },
  {
    title: "Elite Developer",
    price: "$99.99/year",
    popular: false,
    features: [
      { icon: <FaCrown className="text-yellow-400" />, text: "Unlimited expert interviews" },
      { icon: <FaLaptopCode className="text-green-400" />, text: "Cloud IDE with debugging" },
      { icon: <FaRobot className="text-purple-400" />, text: "GPT-4 code explainer" },
      { icon: <FaChartLine className="text-yellow-400" />, text: "Personalized DSA roadmap" },
      { icon: <FaMedal className="text-red-400" />, text: "FAANG interview kits" },
      { icon: <FaShieldAlt className="text-blue-400" />, text: "Startup funding guidance" },
    ],
    unavailable: [],
    cta: "Go Elite"
  },
];

const Premium = () => {
  return (
    <div className="min-h-screen text-yellow-500 bg-gradient-to-br from-gray-900 to-[#18181c] py-16 px-4">
      {/* Header with Trust Badges */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-blue-800/30 px-6 py-2 rounded-full mb-6"
        >
          <FaCrown className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">TRUSTED BY TOP CODERS</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Career-Boosting
          </span> Premium Plans
        </h1>
        
        <div className="flex justify-center gap-8 my-6">
          <SiLeetcode className="text-3xl text-orange-500" />
          <SiGeeksforgeeks className="text-3xl text-green-500" />
          <SiHackerrank className="text-3xl text-emerald-400" />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.4 }}
            whileHover={{ scale: 1.1 }}
            className={`rounded-xl overflow-hidden border ${plan.popular ? "border-yellow-400 shadow-lg  shadow-yellow-400/20" : "border-gray-700"} bg-gray-800/50 backdrop-blur-sm`}
          >
            {plan.popular && (
              <div className="bg-yellow-400 text-black font-bold text-center py-4">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-6">
              <h3 className={`text-2xl font-bold text-center mb-2 ${plan.popular ? "text-yellow-400" : "text-white"}`}>
                {plan.title}
              </h3>
              <p className="text-3xl font-bold text-center my-4">{plan.price}</p>
              
              <div className="space-y-4 mt-6">
                <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <FaCheckCircle /> Included Features
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{feature.icon}</span>
                      <span className="text-gray-200">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.unavailable.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                    <FaTimesCircle /> Not Included
                  </h4>
                  <ul className="space-y-3">
                    {plan.unavailable.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-400">
                        <span className="text-xl mt-0.5">✖</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className={`w-full mt-8 py-3 rounded-lg font-bold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DSA Sheet Preview */}
      <div className="max-w-4xl mx-auto mt-16 bg-gray-800/50 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-center text-blue-400 mb-6">
          <FaMedal className="inline mr-2" /> Premium DSA Sheet Preview
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            "FAANG SDE Sheet (300+ Problems)",
            "Dynamic Programming Masterclass",
            "Graph Theory Interview Kit",
            "System Design Blueprint",
            "OOPs Cheat Sheets",
            "SQL & NoSQL Patterns"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-700/50 px-4 py-3 rounded-lg">
              <FaCheckCircle className="text-green-400" />
              <span className="text-gray-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Assurance */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="inline-flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-full">
          <FaShieldAlt className="text-green-400 text-xl" />
          <span className="text-gray-300">256-bit encrypted payments · 7-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default Premium;