import './Safety.css'

const Safety = () => {
  return (
    <section id="safety" className="safety">
      <div className="container safety-container">
        <div className="safety-image">
          <img src="/images/safety.png" alt="Safety" />
        </div>
        <div className="safety-content">
          <h2>Your safety drives us</h2>
          <p>
            Every ride includes GPS tracking, verified drivers,
            emergency assistance, and safety support for peace of mind.
          </p>
          <button className="learn-btn">Learn More</button>
        </div>
      </div>
    </section>
  )
}

export default Safety
