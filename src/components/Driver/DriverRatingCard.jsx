import React from 'react'
import './DriverRatingCard.css'

/**
 * DriverRatingCard Component
 * Reusable card displaying overall driver score, star breakdown, passenger compliment badges, and recent review comments.
 */
const DriverRatingCard = ({ ratings }) => {
  if (!ratings) return null

  const total = ratings.totalRatedTrips || 1000
  const fivePct = Math.round(((ratings.fiveStarCount || 950) / total) * 100)
  const fourPct = Math.round(((ratings.fourStarCount || 40) / total) * 100)
  const threePct = Math.round(((ratings.threeStarCount || 8) / total) * 100)
  const twoPct = Math.round(((ratings.twoStarCount || 1) / total) * 100)
  const onePct = Math.round(((ratings.oneStarCount || 1) / total) * 100)

  return (
    <div className="driver-rating-card">
      <div className="rating-card-hdr">⭐ Driver Ratings & Feedback</div>

      <div className="rating-top-split">
        <div className="overall-score-box">
          <div className="score-num">{ratings.overall || '4.98'}</div>
          <div className="score-stars">★★★★★</div>
          <div className="score-total">{total} Total Ratings</div>
        </div>

        <div className="rating-bars-wrap">
          <div className="star-bar-row">
            <span>5 ★</span>
            <div className="star-bar-track"><div className="star-bar-fill" style={{ width: `${fivePct}%` }}></div></div>
            <span>{ratings.fiveStarCount || 1345}</span>
          </div>
          <div className="star-bar-row">
            <span>4 ★</span>
            <div className="star-bar-track"><div className="star-bar-fill" style={{ width: `${fourPct}%` }}></div></div>
            <span>{ratings.fourStarCount || 28}</span>
          </div>
          <div className="star-bar-row">
            <span>3 ★</span>
            <div className="star-bar-track"><div className="star-bar-fill" style={{ width: `${threePct}%` }}></div></div>
            <span>{ratings.threeStarCount || 5}</span>
          </div>
          <div className="star-bar-row">
            <span>2 ★</span>
            <div className="star-bar-track"><div className="star-bar-fill" style={{ width: `${twoPct}%` }}></div></div>
            <span>{ratings.twoStarCount || 1}</span>
          </div>
          <div className="star-bar-row">
            <span>1 ★</span>
            <div className="star-bar-track"><div className="star-bar-fill" style={{ width: `${onePct}%` }}></div></div>
            <span>{ratings.oneStarCount || 1}</span>
          </div>
        </div>
      </div>

      <div className="compliments-section">
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#000' }}>🏆 Top Passenger Compliments</div>
        <div className="compliments-grid">
          {ratings.compliments?.map((comp) => (
            <div key={comp.id} className="comp-badge">
              <span>{comp.icon}</span>
              <span>{comp.title}</span>
              <span style={{ color: '#666', fontSize: '12px' }}>({comp.count})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#000', marginBottom: '8px' }}>💬 Recent Passenger Reviews</div>
        {ratings.recentReviews?.map((rev) => (
          <div key={rev.id} className="review-item">
            <div className="rev-top">
              <span>{rev.author}</span>
              <span style={{ color: '#ffc107' }}>{'★'.repeat(rev.rating)} • {rev.date}</span>
            </div>
            <div className="rev-comment">"{rev.comment}"</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DriverRatingCard
