import React, { useEffect } from 'react';
import { 
  Bus, 
  Users, 
  Map, 
  Shield, 
  Clock, 
  Leaf,
  Trophy
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/home/about.css';
import AboutImageBus from '../assets/home-image/about-us-bus.png';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Anish Sharma",
      position: "Founder & CEO",
      image: "/api/placeholder/120/120",
      bio: "With over 15 years in the transportation industry, Anish founded Go Sewa with a vision to transform bus travel in Nepal."
    },
    {
      id: 2,
      name: "Priya Thapa",
      position: "Operations Director",
      image: "/api/placeholder/120/120",
      bio: "Priya ensures that every journey with Go Sewa is smooth, safe, and exceeds customer expectations."
    },
    {
      id: 3,
      name: "Raj Gurung",
      position: "Fleet Manager",
      image: "/api/placeholder/120/120",
      bio: "Raj oversees our entire fleet, ensuring all vehicles meet our strict safety and comfort standards."
    },
    {
      id: 4,
      name: "Sunita Poudel",
      position: "Customer Experience Head",
      image: "/api/placeholder/120/120",
      bio: "Sunita leads our customer service team with a passion for creating memorable travel experiences."
    }
  ];

  const milestones = [
    {
      year: "2010",
      title: "Founded in Kathmandu",
      description: "Go Sewa started with just 5 buses operating between Kathmandu and Pokhara."
    },
    {
      year: "2013",
      title: "Expanded to Eastern Nepal",
      description: "Added routes connecting major eastern cities including Biratnagar and Dharan."
    },
    {
      year: "2016",
      title: "Introduced Deluxe Service",
      description: "Launched premium deluxe buses with enhanced comfort features and onboard services."
    },
    {
      year: "2018",
      title: "Tourist Services Launch",
      description: "Specialized services for tourists connecting major attractions across Nepal."
    },
    {
      year: "2021",
      title: "Digital Transformation",
      description: "Launched our online booking platform and mobile app for seamless travel planning."
    },
    {
      year: "2023",
      title: "100+ Bus Fleet Milestone",
      description: "Celebrated reaching a fleet of over 100 buses serving all regions of Nepal."
    }
  ];

  const values = [
    {
      id: 1,
      icon: Users,
      title: "Customer First",
      description: "We prioritize our passengers' needs, comfort, and satisfaction above all else."
    },
    {
      id: 2,
      icon: Shield,
      title: "Safety",
      description: "Rigorous maintenance schedules and trained drivers ensure the highest safety standards."
    },
    {
      id: 3,
      icon: Clock,
      title: "Reliability",
      description: "We understand the importance of punctuality and strive to maintain our schedules."
    },
    {
      id: 4,
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to reducing our environmental impact through modern, efficient vehicles."
    }
  ];

  const achievements = [
    "Nepal Tourism Board's 'Best Transport Service Provider' (2022)",
    "Rated #1 Bus Service by Nepal Traveler Magazine (2021)",
    "Recognized for 'Excellence in Customer Service' by Transport Association of Nepal (2023)",
    "Awarded 'Most Reliable Bus Operator' for 3 consecutive years (2020-2022)"
  ];

  return (
    <div className="about-section">
      <div className="about-hero" data-aos="fade-down">
        <div className="about-hero-content">
          <h1>About Go Sewa</h1>
          <p className="tagline">Connecting Nepal with Comfort and Reliability</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-intro" data-aos="fade-up" data-aos-delay="100">
          <div className="about-intro-content">
            <h2>Our Story</h2>
            <p>Founded in 2010, Go Sewa has grown from a small local operator to Nepal's leading bus service provider. Our journey began with a simple mission: to transform bus travel in Nepal by providing safe, comfortable, and reliable transportation services that connect people across our beautiful country.</p>
            <p>Today, with a fleet of over 100 modern buses, we serve thousands of passengers daily, connecting major cities, tourist destinations, and remote areas throughout Nepal. Our commitment to excellence, safety, and customer satisfaction has made us the preferred choice for locals and tourists alike.</p>
            <div className="intro-stats">
              {[
                { number: "100+", label: "Modern Buses" },
                { number: "50+", label: "Destinations" },
                { number: "500,000+", label: "Happy Passengers" },
                { number: "13", label: "Years of Service" }
              ].map((stat, index) => (
                <div className="stat-item" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-intro-image" data-aos="fade-left" data-aos-delay="200">
            <img src={AboutImageBus} alt="Go Sewa Fleet" />
          </div>
        </section>

        <section className="about-values" data-aos="fade-up" data-aos-delay="300">
          <h2>Our Core Values</h2>
          <div className="values-container">
            {values.map((value, index) => (
              <div className="value-card" key={value.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="value-icon">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-milestones" data-aos="fade-up" data-aos-delay="400">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} 
                key={index} 
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'} 
                data-aos-delay={index * 100}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-team" data-aos="fade-up" data-aos-delay="500">
          <h2>Meet Our Team</h2>
          <p className="team-intro">Our dedicated team works tirelessly to ensure you have the best travel experience across Nepal.</p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-member" key={member.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <h4>{member.position}</h4>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-achievements" data-aos="fade-up" data-aos-delay="600">
          <div className="achievements-content">
            <h2>Our Achievements</h2>
            <ul className="achievements-list">
              {achievements.map((achievement, index) => (
                <li key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <Trophy className="w-5 h-5 achievement-icon" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="achievements-image" data-aos="fade-left" data-aos-delay="700">
            <img src={AboutImageBus} alt="Go Sewa Awards" />
          </div>
        </section>

        <section className="about-mission" data-aos="fade-up" data-aos-delay="800">
          <div className="mission-card" data-aos="zoom-in" data-aos-delay="900">
            <div className="mission-icon">
              <Map className="w-8 h-8" />
            </div>
            <h2>Our Mission</h2>
            <p>To provide safe, comfortable, and reliable transportation services that connect people and places across Nepal, enhancing the travel experience for locals and tourists alike while contributing to the country's development.</p>
          </div>
          <div className="vision-card" data-aos="zoom-in" data-aos-delay="800">
            <div className="vision-icon">
              <Bus className="w-8 h-8" />
            </div>
            <h2>Our Vision</h2>
            <p>To be Nepal's most trusted transportation provider, recognized for excellence in service, safety, and innovation, making travel accessible and enjoyable for everyone.</p>
          </div>
        </section>

        <section className="about-cta" data-aos="fade-up" data-aos-delay="800">
          <h2>Experience the Go Sewa Difference</h2>
          <p>Join thousands of satisfied travelers who choose Go Sewa for their journeys across Nepal.</p>
          <div className="cta-buttons">
            <button className="book-now-btn">
              Book Your Journey
            </button>
            <button className="contact-btn">
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;