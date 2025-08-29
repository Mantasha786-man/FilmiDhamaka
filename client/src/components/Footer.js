import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile responsive styles
  const mobileStyles = {
    container: {
      ...styles.container,
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '0.5rem' // Reduced gap between sections
    },
    section: {
      ...styles.section,
      flex: '1 1 100%',
      minWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '0.5rem' // Reduced margin between sections
    },
    list: {
      ...styles.list,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.3rem' // Reduced gap between list items
    },
    socialIcons: {
      ...styles.socialIcons,
      justifyContent: 'center',
      gap: '0.8rem' // Reduced gap between social icons
    }
  };

  const currentStyles = isMobile ? mobileStyles : styles;

  return (
    <footer style={styles.footer}>
      <div style={currentStyles.container}>

        {/* About Section */}
        <div style={currentStyles.section}>
          <h3 style={styles.title}>🎬 FilmiDhamaka</h3>
          <p style={styles.text}>
            The ultimate movie booking destination — from blockbusters to indie gems, we bring cinema to your fingertips.
          </p>
        </div>

        {/* Quick Menu (no a tags) */}
        <div style={currentStyles.section}>
          <h4 style={styles.subtitle}>Menu</h4>
          <ul style={currentStyles.list}>
            <li><span>Home</span></li>
            <li><span>About</span></li>
            <li><span>Movies</span></li>
            <li><span>Contact</span></li>
            <li><span>FAQs</span></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div style={currentStyles.section}>
          <h4 style={styles.subtitle}>Contact</h4>
          <p style={styles.text}>📍 Andheri West, Mumbai</p>
          <p style={styles.text}>📞 +91-9876543210</p>
          <p style={styles.text}>📧 support@filmidhamaka.com</p>
        </div>

        {/* Social Media */}
        <div style={currentStyles.section}>
          <h4 style={styles.subtitle}>Follow Us</h4>
          <div style={currentStyles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.icon}><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.icon}><i className="fab fa-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={styles.icon}><i className="fab fa-twitter"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={styles.icon}><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        © {new Date().getFullYear()} <strong>FilmiDhamaka</strong>. All rights reserved.
      </div>
    </footer>
  );
};

// 🎨 Clean Modern Style with Green Background
const styles = {
  footer: {
    backgroundColor: 'rgb(0, 46, 42)',
    color: '#e0e0e0',
    padding: '3rem 1rem 1rem',
    marginTop: '1rem', // Reduced margin-top to decrease space
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '1100px',
    margin: 'auto',
    justifyContent: 'space-between',
    gap: '2rem',
  },
  section: {
    flex: '1 1 220px',
    minWidth: '220px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '0.7rem',
    color: '#a5d6a7',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2',
    fontSize: '0.95rem',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
    fontSize: '1.5rem',
    marginTop: '0.5rem',
  },
  icon: {
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  bottomBar: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #33665f',
    fontSize: '0.9rem',
    color: '#aaa',
  },
};

export default Footer;
