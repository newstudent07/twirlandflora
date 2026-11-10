import React from 'react';
import './ServiceStrip.css';

const ServiceStrip = () => {
  const services = [
    { title: "100% Handmade", desc: "Sourced directly from sustainable growers" },
    { title: "Artisanal Design", desc: "hand-crafted with love" },
    { title: "All India Delivery", desc: "Arriving perfectly in bloom" }
  ];

  return (
    <section className="service-strip">
      <div className="container service-container">
        {services.map((svc, idx) => (
          <div className={`service-item reveal delay-${idx + 1}`} key={idx}>
            <h4 className="service-title">{svc.title}</h4>
            <p className="service-desc">{svc.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceStrip;
