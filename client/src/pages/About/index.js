import React from 'react';

function About() {
  // const teamMembers = [
  //   {
  //     name: "John Smith",
  //     role: "Founder & CEO",
  //     description: "Passionate about revolutionizing the movie industry with innovative technology solutions.",
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  //   },
  //   {
  //     name: "Sarah Johnson",
  //     role: "CTO",
  //     description: "Tech enthusiast with 10+ years of experience in building scalable web applications.",
  //     image: "https://tse4.mm.bing.net/th/id/OIP.qLfEBmHbGd-sLNsQAdyPFgHaE8?pid=Api&P=0&h=180"
  //   },
  //   {
  //     name: "Mike Chen",
  //     role: "Lead Developer",
  //     description: "Full-stack developer specializing in React and Node.js applications.",
  //     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  //   },
  //   {
  //     name: "Emily Davis",
  //     role: "UX Designer",
  //     description: "Creating intuitive and beautiful user experiences for movie enthusiasts.",
  //     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  //   }
  // ];

  const features = [
    {
      icon: "🎬",
      title: "Seamless Booking",
      description: "Book your favorite movies with just a few clicks"
    },
    {
      icon: "💺",
      title: "Best Seats",
      description: "Choose your preferred seats with interactive seating maps"
    },
    {
      icon: "⭐",
      title: "Premium Experience",
      description: "Enjoy premium features and exclusive offers"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Book tickets anytime, anywhere from your mobile device"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary mt-1 text-white py-20">
        <div className="container  mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">We Make Movie Magic Happen</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Transforming the way you experience cinema with cutting-edge technology
          </p>
          <div className="w-24 h-1 bg-secoundary mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Founded in 2020, our mission is to bring the magic of movies to your fingertips. 
            We believe that everyone deserves a seamless and enjoyable movie booking experience.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <div className="flex-1">
              <div className="text-4xl font-bold text-secoundary mb-2">50K+</div>
              <p className="text-lg">Happy Customers</p>
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-secoundary mb-2">100+</div>
              <p className="text-lg">Movies Booked</p>
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-secoundary mb-2">24/7</div>
              <p className="text-lg">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Ready to Experience the Magic?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers who trust us for their cinema experience
          </p>
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300">
            Book Your Tickets Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;
