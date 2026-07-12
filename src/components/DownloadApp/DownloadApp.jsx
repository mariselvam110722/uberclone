import './DownloadApp.css'

const DownloadApp = () => {
  return (
    <section className="download-app">
      <div className="container">
        <h2 className="section-title">There's more to love in the apps</h2>
        <div className="app-cards">
          <div className="app-card">
            <div className="app-card-content">
              <h3>Download the Driver app</h3>
              <p>Scan to download</p>
            </div>
            <div className="app-card-arrow">
              <span>&rarr;</span>
            </div>
          </div>
          <div className="app-card">
            <div className="app-card-content">
              <h3>Download the Uber app</h3>
              <p>Scan to download</p>
            </div>
            <div className="app-card-arrow">
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadApp
