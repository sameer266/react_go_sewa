// components/FeaturesSection.jsx
import React, { useEffect } from 'react';
import { Search, CreditCard, Clock, Shield, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../style/home/featuresSection.css';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Easy Booking',
      description: 'Book your tickets in just a few clicks with our user-friendly interface.',
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Secure Payments',
      description: 'Multiple payment options with secure transaction processing.',
      color: 'from-green-500 to-green-600',
      lightColor: 'bg-green-50',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you.',
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Guaranteed Safety',
      description: 'All our partner buses follow strict safety protocols for your journey.',
      color: 'from-orange-500 to-orange-600',
      lightColor: 'bg-orange-50',
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Heading */}
        <div
          className="text-center max-w-3xl mx-auto mb-16"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Why Choose <span className="text-green-600">Go Sewa</span>
          </h2>
          <p className="text-lg text-gray-600">
            Experience a new standard in bus travel with our innovative booking platform.
            Discover comfort, convenience, and reliability all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-xl ${feature.lightColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600/0 to-green-600/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}