import './RideOptions.css'

const RideOptions = () => {
  return (
    <section id="ride-options" className="ride-options">
      <div className="container">
        <h2 className="section-title">Ride Options</h2>
        <div className="ride-cards">
          <div className="ride-card">
            <img src="/images/uber-go.png" alt="Uber Go" />
            <h3>Uber Go</h3>
            <p>Affordable rides for your everyday travel.</p>
          </div>
          <div className="ride-card">
            <img src="/images/uber-auto.png" alt="Uber Auto" />
            <h3>Uber Auto</h3>
            <p>Quick and comfortable auto rides.</p>
          </div>
          <div className="ride-card">
            <img src="/images/uber-bike.png" alt="Uber Moto" />
            <h3>Uber Moto</h3>
            <p>Fast bike rides to beat traffic.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RideOptions
