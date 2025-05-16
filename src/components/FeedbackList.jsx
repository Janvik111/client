import "./FeedbackList.css"

function FeedbackList({ feedback, isLoading, error, emptyMessage, showRecipient = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="feedback-loading">
        <div className="loading-spinner"></div>
        <p>Loading feedback...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!feedback || feedback.length === 0) {
    return <div className="feedback-empty">{emptyMessage}</div>
  }

  return (
    <div className="feedback-list">
      {feedback.map((item) => (
        <div key={item.id} className="feedback-item">
          {showRecipient && item.recipientName && (
            <div className="feedback-recipient">
              <span className="recipient-name">{item.recipientName}</span>
            </div>
          )}

          <div className="feedback-date">Received on {formatDate(item.date)}</div>

          <div className="feedback-content">{item.content}</div>

          {item.categories && item.categories.length > 0 && (
            <div className="feedback-categories">
              {item.categories.map((category) => (
                <span key={category} className="category-tag">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FeedbackList
