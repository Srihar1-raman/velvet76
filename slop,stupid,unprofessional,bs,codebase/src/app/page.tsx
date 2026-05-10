import { ConciergeWhatsAppLink } from "@/components/ConciergeWhatsAppLink";
import HomeClient from "@/components/HomeClient";
import { fleetTiers, services } from "@/lib/data";

export default function Home() {
  return (
    <>
      <HomeClient />
      <div className="cursor-glow" aria-hidden="true" />
      <header className="site-header nav-booking-tone v1-nav" data-animate="header">
        <div className="v1-nav-inner">
          <a className="v1-brand" href="#top" aria-label="Velvet Experience home">
            <img src="/assets/vevelt%20monogram%20on%20left,%20and%20velvet%20expeirence%20on%20right.png" alt="Velvet Experience" />
          </a>

          <nav className="v1-desktop-links" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#contact">Contact</a>
            <button className="v1-reserve-now-btn" id="v1-nav-reserve-now" type="button">Reserve now</button>
          </nav>

          <button className="v1-reserve-now-btn v1-reserve-now-mobile" id="v1-nav-reserve-now-mobile" type="button" hidden>
            Reserve now
          </button>
          <button className="v1-hamburger" id="v1-nav-open" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      <div className="v1-mobile-overlay" id="v1-mobile-overlay" aria-hidden="true"></div>
      <aside className="v1-mobile-menu" id="v1-mobile-menu" aria-hidden="true">
        <div className="v1-mobile-head">
          <a className="v1-brand" href="/" aria-label="Velvet Experience home">
            <img src="/assets/vevelt%20monogram%20on%20left,%20and%20velvet%20expeirence%20on%20right.png" alt="Velvet Experience" />
          </a>
          <button type="button" id="v1-nav-close" className="v1-mobile-close" aria-label="Close menu">Close</button>
        </div>
        <div className="v1-mobile-body">
          <div className="v1-mobile-intro">
            <p className="v1-mobile-kicker">Velvet Experience</p>
            <p className="v1-mobile-subtitle">Choose where you want to go next.</p>
          </div>
          <nav className="v1-mobile-nav" aria-label="Mobile navigation">
            <p className="v1-mobile-nav-group-label">Explore</p>
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="v1-mobile-actions">
            <button className="v1-mobile-cta-btn" id="v1-mobile-menu-reserve" type="button">Reserve now</button>
            <ConciergeWhatsAppLink className="v1-mobile-cta-btn v1-mobile-secondary-cta">
              Speak to Concierge
            </ConciergeWhatsAppLink>
          </div>
          <p className="v1-mobile-helper">Private chauffeur rides for Delhi NCR and IGI Airport.</p>
        </div>
      </aside>
      <button type="button" className="v1-continue-booking" id="v1-continue-booking" hidden>
        Continue booking
      </button>

      <main id="top">
        <section className="hero" aria-label="Velvet Experience introduction">
          <div className="hero__media" aria-hidden="true">
            <video
              className="hero__media-el hero__media-video"
              src="/assets/hero2.mp4"
              autoPlay
              muted
              playsInline
              preload="metadata"
              data-hero-media="video"
            />
            <img
              className="hero__media-el hero__media-image is-active"
              src="/assets/new%20landing%20test.png"
              alt=""
              loading="eager"
              data-hero-media="image"
            />
            <video
              className="hero__media-el hero__media-video"
              src="/assets/hero1.mp4"
              autoPlay
              muted
              playsInline
              preload="metadata"
              data-hero-media="video"
            />
            <div className="hero__wash"></div>
          </div>
          <div className="hero__content" id="hero-content">
            <p className="eyebrow hero__eyebrow">Gurugram and Delhi NCR</p>
            <h1 className="hero__title split-heading">Your Time Deserves Better</h1>
            <p className="hero__copy">
              CHAUFFEUR-DRIVEN<br />LUXURY MOBILITY EXPERIENCE
            </p>
          </div>
          <div className="hero-booking-wrapper v1-booking-wrap" id="hero-booking-wrapper">
            <div className="v1-booking-modes" aria-label="Booking mode">
              <button type="button" data-v1-mode="airport">Airport transfer</button>
              <button type="button" data-v1-mode="oneway" className="is-active">One-way</button>
              <button type="button" data-v1-mode="hourly">By the hour</button>
            </div>
            <div className="hero-booking-card v1-booking-card is-collapsed" id="booking-card">
              <div className="v1-airport-controls" data-v1-airport-controls>
                <div className="v1-transfer-toggle">
                  <button type="button" data-v1-airport-type="arrival" className="is-active">Arrival</button>
                  <button type="button" data-v1-airport-type="departure">Departure</button>
                </div>
                <div className="v1-terminal-toggle">
                  <button type="button" data-v1-terminal="Terminal 1 (T1), IGI Airport, New Delhi">T1</button>
                  <button type="button" data-v1-terminal="Terminal 2 (T2), IGI Airport, New Delhi">T2</button>
                  <button type="button" data-v1-terminal="Terminal 3 (T3), IGI Airport, New Delhi" className="is-active">T3</button>
                  <button type="button" data-v1-terminal="Private Jet Terminal (T4), IGI Airport, New Delhi">Private Jet Terminal (T4)</button>
                </div>
              </div>
              <div className="v1-fields-shell">
                <label>
                  <span>Pickup location</span>
                  <input data-v1-field="pickup" type="text" placeholder="Address, airport, hotel, …" />
                </label>
                <label>
                  <span data-v1-drop-label>Drop-off location</span>
                  <input data-v1-field="drop" type="text" placeholder="Address, airport, hotel, …" />
                </label>
                <label className="v1-date-field">
                  <span>Date</span>
                  <input data-v1-field="date" type="text" placeholder="Select date" readOnly aria-haspopup="dialog" />
                </label>
                <label className="v1-time-field">
                  <span>Pickup time</span>
                  <input data-v1-field="time" type="text" placeholder="Select time" readOnly aria-haspopup="listbox" />
                </label>
                <div className="v1-book-action">
                  <button type="button" id="v1-book-submit">View options</button>
                </div>
              </div>
              <p className="v1-booking-quote">Every mile, unmistakably <span>Velvet</span>.</p>
            </div>
          </div>
          <div className="booking-anchor" id="booking" aria-hidden="true"></div>
        </section>

        <section className="premise section-pad" aria-label="Velvet promise">
          <div className="monogram-field" aria-hidden="true"></div>
          <div className="premise__inner premise__inner--with-stage">
            <div className="premise__copy">
              <p className="eyebrow">The Velvet standard</p>
              <h2 className="premise__line split-heading">Not a cab.</h2>
              <h2 className="premise__line split-heading">Not a rental.</h2>
              <h2 className="premise__line split-heading">A private movement experience.</h2>
            </div>
            <div className="motion-reel__stage premise-reel-stage" data-motion-stage>
              <video src="/assets/fleet-reel.mp4" muted playsInline autoPlay loop preload="metadata"></video>
              <div className="motion-reel__ticker" aria-hidden="true">
                <span>Gurugram</span>
                <span>Delhi NCR</span>
                <span>IGI Airport</span>
                <span>Private Terminal</span>
              </div>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <p className="eyebrow">Three ways to move</p>
            <h2 id="services-title" className="section-title split-heading">Luxury that fits the day.</h2>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article
                key={service.name}
                className="service-item reveal-item service-capsule"
                data-hover-img={service.image}
                data-service-mode={index === 0 ? "oneway" : index === 1 ? "airport" : "hourly"}
                role="button"
                tabIndex={0}
                aria-label={`Book ${service.name}: open booking form with this ride type`}
              >
                <span className="item-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.name}</h3>
                <p>{service.line}</p>
                <strong>{service.scope}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="fleet-tiers section-pad" id="fleet" aria-labelledby="fleet-title">
          <div className="fleet-tiers__header">
            <div>
              <p className="eyebrow">Choose the mood</p>
              <h2 id="fleet-title" className="section-title split-heading">Three levels of arrival.</h2>
            </div>
            <p>Model examples may vary by availability. Every ride keeps the Velvet chauffeur standard.</p>
          </div>
          <div className="fleet-tiers__stage">
            <div className="fleet-tiers__selector" role="tablist" aria-label="Service tier" data-active-index={fleetTiers.length - 1}>
              {fleetTiers.map((tier, index) => (
                <button
                  key={tier.key}
                  className={`fleet-tiers__tier-btn reveal-item${index === fleetTiers.length - 1 ? " is-active" : ""}`}
                  type="button"
                  data-tier-index={index}
                  data-tier-key={tier.key}
                  role="tab"
                  aria-selected={index === fleetTiers.length - 1 ? "true" : "false"}
                >
                  <span className="fleet-tiers__tier-eyebrow">{tier.eyebrow}</span>
                  <span className="fleet-tiers__tier-name">{tier.name.replace("Velvet ", "")}</span>
                </button>
              ))}
            </div>
            <div className="fleet-tiers__showroom">
              <div className="fleet-tiers__ambient" aria-hidden="true"></div>
              <div className="fleet-tiers__car-display">
                <img className="fleet-tiers__car" src="/assets/elite%20tier%20bmw%205%20series%20bg%20removed.png.png" alt="" aria-hidden="true" />
              </div>
              <div className="fleet-tiers__dock">
                <div className="fleet-tiers__car-switch" role="tablist" aria-label="Vehicle">
                  {fleetTiers[fleetTiers.length - 1].cars.map((car, index) => (
                    <button
                      key={car.model}
                      className={`fleet-tiers__car-btn${index === 0 ? " is-active" : ""}`}
                      type="button"
                      data-car-index={index}
                      role="tab"
                      aria-selected={index === 0 ? "true" : "false"}
                    >
                      {car.model}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="fleet-tiers__details" aria-live="polite">
              <p className="fleet-tiers__models">{`${fleetTiers[fleetTiers.length - 1].cars.map((c) => c.model).join(" / ")} or similar`}</p>
              <p className="fleet-tiers__spec"></p>
              <p className="fleet-tiers__points">{fleetTiers[fleetTiers.length - 1].points.join(" · ")}</p>
            </div>
          </div>
        </section>

        <section className="chauffeur section-pad" aria-labelledby="chauffeur-title">
          <div className="chauffeur__text">
            <p className="eyebrow">The human layer</p>
            <h2 id="chauffeur-title" className="section-title split-heading">A chauffeur trained for the whole experience.</h2>
            <p>
              The green uniform, the open door, the quiet cabin, the flight-aware pickup. Velvet is designed around the moments most services ignore.
            </p>
          </div>
          <div className="chauffeur__sequence">
            <figure className="story-frame is-active">
              <img src="/assets/chauffeur-trunk.jpg" alt="Velvet chauffeur preparing a car" />
              <figcaption>Arrival</figcaption>
            </figure>
            <figure className="story-frame">
              <img src="/assets/chauffeur-door.jpg" alt="Velvet chauffeur holding an umbrella by an open rear door" />
              <figcaption>Door opened</figcaption>
            </figure>
            <figure className="story-frame">
              <img src="/assets/interior-seat.jpg" alt="Luxury rear seat interior with Velvet detail" />
              <figcaption>Seated comfort</figcaption>
            </figure>
            <figure className="story-frame">
              <img src="/assets/cup-handoff.jpg" alt="Velvet branded drink handed to passenger" />
              <figcaption>Refreshments</figcaption>
            </figure>
            <figure className="story-frame">
              <video src="/assets/interior-reel.mp4" muted playsInline autoPlay loop preload="metadata"></video>
              <figcaption>Smooth departure</figcaption>
            </figure>
            <figure className="story-frame">
              <img src="/assets/emblem-close.jpg" alt="Velvet emblem close-up detail" />
              <figcaption>Quiet proof</figcaption>
            </figure>
          </div>
        </section>

        <footer className="closing" id="contact" aria-label="Velvet Experience footer">
          <div className="closing__watermark" aria-hidden="true"></div>
          <div className="closing__shell">
            <section className="closing__standards" aria-label="Velvet service standards">
              <article>
                <span>Selection Standard</span>
                <p>Every chauffeur is vetted against our 20-point standard and trained in discipline, hygiene, etiquette, route conduct, and guest safety.</p>
              </article>
              <article>
                <span>Guest-Ready Cabin</span>
                <p>Coffee protocols, fragrance setup, cabin temperature, and arrival presentation are checked before service. Luxury lives in the details.</p>
              </article>
              <article>
                <span>Impeccably Prepared</span>
                <p>White-gloved service, grooming standards, hygiene discipline, and presentation consistency are maintained across every ride category.</p>
              </article>
            </section>

            <section className="closing__cta" aria-label="Reserve a Velvet ride">
              <div className="closing__cta-head">
                <h2 className="split-heading">Ready to reserve.</h2>
              </div>
              <div className="closing__cta-concierge-fields">
                <label className="closing__concierge-label" htmlFor="closing-concierge-query">Request a call back</label>
                <textarea
                  id="closing-concierge-query"
                  className="closing__concierge-input"
                  placeholder="Enter trip details: date, pickup & drop, vehicle count, any preferences"
                  rows={4}
                  maxLength={600}
                ></textarea>
              </div>
              <div className="closing__cta-intro-actions">
                <button className="button button--closing-velvet" type="button" data-scroll-book>Reserve a Ride</button>
              </div>
              <ConciergeWhatsAppLink className="closing__concierge closing__concierge--cta">
                Speak to Concierge
              </ConciergeWhatsAppLink>
            </section>

            <div className="closing__shell-foot">
              <p className="closing__tagline">
                Private chauffeur luxury for airport, business, and city movement.
              </p>
              <div className="closing__cta-tail">
                <div className="closing__cta-socials" aria-label="Connect with Velvet">
                  <ConciergeWhatsAppLink>WhatsApp</ConciergeWhatsAppLink>
                  <a href="https://instagram.com/velvetexperienceindia" target="_blank" rel="noreferrer">Instagram</a>
                  <a href="mailto:business@velvetexperience.com">Email</a>
                </div>
                <nav className="closing__footer-nav" aria-label="Company links">
                  <a href="#" aria-label="About Us placeholder">About Us</a>
                  <a href="#" aria-label="Privacy Policy placeholder">Privacy</a>
                  <a href="#" aria-label="Terms and Conditions placeholder">Terms &amp; Conditions</a>
                </nav>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}