import './Footer.css'

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="Uber Logo" />
            <p>Move the way you want with Uber.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Newsroom</a>
            </div>
            <div className="footer-column">
              <h3>Products</h3>
              <a href="#">Ride</a>
              <a href="#">Drive</a>
              <a href="#">Business</a>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <a href="#">Help Center</a>
              <a href="#">Safety</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="footer-social-download">
          <div className="social-icons">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="YouTube">YT</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">LI</a>
          </div>
          <div className="download-buttons">
            <button className="download-btn store-btn">App Store</button>
            <button className="download-btn play-btn">Google Play</button>
          </div>
        </div>

        <hr />

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Uber Clone | Developed by Team DevVerse</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
