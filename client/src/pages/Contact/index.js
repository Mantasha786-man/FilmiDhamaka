import React from 'react';
import PageTitle from '../../components/PageTitle';

function Contact() {
  const contactInfo = [
    {
      icon: "📍",
      title: "Address",
      details: "123 Movie Street, Cinema District\nMumbai, Maharashtra 400001"
    },
    {
      icon: "📞",
      title: "Phone",
      details: "+91 98765 43210\n+91 91234 56789"
    },
    {
      icon: "✉️",
      title: "Email",
      details: "info@filmidhamaka.com\nsupport@filmidhamaka.com"
    },
    {
      icon: "🕒",
      title: "Business Hours",
      details: "Mon-Fri: 9:00 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-primary mt-1 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            We're here to help you with all your movie booking needs
          </p>
          <div className="w-24 h-1 bg-secoundary mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Have questions or need assistance? Our team is ready to provide you with the best support
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Google Map */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Find Us Here</h2>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.715872556229!2d72.82461431538457!3d19.03398825807885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3f7f3e3b3d%3A0x3b3b3b3b3b3b3b3b!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1622540000000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FilmiDhamaka Location Map"
                  className="w-full"
                ></iframe>
              </div>
              <p className="text-gray-600 mt-4 text-center">
                Visit our office in the heart of Mumbai's cinema district
              </p>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Send us a Message</h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <textarea
                      rows="4"
                      placeholder="Your Message"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer support team is available 24/7 to help you
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <button className="bg-secoundary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300">
              Call Now: +91 98765 43210
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
              Live Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
