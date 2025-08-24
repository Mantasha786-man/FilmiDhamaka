import React from 'react';

function Service() {
  const services = [
    {
      icon: "🎬",
      title: "Movie Information",
      description: "Complete movie details with trailers, reviews, ratings and availability status for all movies.",
    },
    {
      icon: "🕒",
      title: "Showtime & Location",
      description: "Real-time show schedules with cinema locations and detailed event information and timings.",
    },
    {
      icon: "💺",
      title: "Seat Selection",
      description: "Interactive seat maps with real-time availability display and premium seating options available.",
    },
    {
      icon: "💳",
      title: "Online Payment",
      description: "Secure multiple payment options with instant confirmation and digital receipt generation.",
    },
    {
      icon: "📧",
      title: "E-Ticket",
      description: "Instant digital tickets with QR codes via email, SMS and mobile app delivery system.",
    },
    {
      icon: "🎉",
      title: "Promotional Offers",
      description: "Exclusive discounts, combo deals and special membership benefits for regular customers.",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary mt-1 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Premium Services</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Experience seamless movie booking with our comprehensive range of services
          </p>
          <div className="w-24 h-1 bg-secoundary mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto">
            We provide everything you need for a perfect movie experience, from booking to enjoyment
          </p>
        </div>
      </section>

      {/* Services Section - Using About component style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Service;
