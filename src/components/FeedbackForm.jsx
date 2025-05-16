"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./FeedbackForm.css"

function FeedbackForm({ onFeedbackSubmitted }) {
  const [recipient, setRecipient] = useState("")
  const [feedback, setFeedback] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [category, setCategory] = useState("")
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Feedback categories
  const categories = [
    "Communication",
    "Collaboration",
    "Technical Skills",
    "Leadership",
    "Problem Solving",
    "Time Management",
    "Creativity",
    "Adaptability",
  ]

  useEffect(() => {
    // Fetch team members
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("/api/users")
        setTeamMembers(response.data.users)
      } catch (error) {
        console.error("Error fetching team members:", error)
      }
    }

    fetchTeamMembers()
  }, [])

  const handleAddCategory = () => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category])
      setCategory("")
    }
  }

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== categoryToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!recipient) {
      setError("Please select a team member to give feedback to.")
      return
    }

    if (!feedback) {
      setError("Please provide feedback content.")
      return
    }

    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      await axios.post("/api/feedback", {
        recipientId: recipient,
        feedback,
        categories: selectedCategories,
      })

      setSuccess("Your anonymous feedback has been submitted successfully.")

      // Reset form
      setRecipient("")
      setFeedback("")
      setSelectedCategories([])

      // Notify parent component
      if (onFeedbackSubmitted) {
        setTimeout(() => {
          onFeedbackSubmitted()
        }, 2000)
      }
    } catch (error) {
      setError("There was an error submitting your feedback. Please try again.")
      console.error("Error submitting feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="feedback-form-container">
      <h2>Give Anonymous Feedback</h2>
      <p className="form-description">Your feedback will be anonymous. The recipient will not know who submitted it.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="recipient" className="form-label">
            Team Member
          </label>
          <select
            id="recipient"
            className="form-select"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Select team member</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="feedback" className="form-label">
            Feedback
          </label>
          <textarea
            id="feedback"
            className="form-textarea"
            placeholder="Provide your constructive feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Categories</label>
          <div className="categories-container">
            {selectedCategories.map((cat) => (
              <div key={cat} className="category-badge">
                {cat}
                <button type="button" className="category-remove-btn" onClick={() => handleRemoveCategory(cat)}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="category-input-group">
            <select
              className="form-select category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories
                .filter((cat) => !selectedCategories.includes(cat))
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button type="button" className="btn category-add-btn" onClick={handleAddCategory} disabled={!category}>
              Add
            </button>
          </div>
        </div>

        <button type="submit" className="btn submit-btn" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm
