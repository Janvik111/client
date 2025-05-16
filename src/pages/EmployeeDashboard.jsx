"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../components/Header"
import FeedbackForm from "../components/FeedbackForm"
import FeedbackList from "../components/FeedbackList"
import "./EmployeeDashboard.css"

function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("give-feedback")
  const [myFeedback, setMyFeedback] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch feedback received by the current user
    const fetchMyFeedback = async () => {
      try {
        const response = await axios.get("/api/feedback/me")
        setMyFeedback(response.data.feedback)
      } catch (error) {
        setError("Failed to load feedback. Please try again later.")
        console.error("Error fetching feedback:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (activeTab === "my-feedback") {
      fetchMyFeedback()
    }
  }, [activeTab])

  const handleFeedbackSubmitted = () => {
    // Switch to my-feedback tab after successful submission
    setActiveTab("my-feedback")
  }

  return (
    <div className="employee-dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h1>Employee Dashboard</h1>
            <p className="dashboard-description">
              Give anonymous feedback to your team members or view feedback you've received.
            </p>
          </div>

          <div className="dashboard-tabs">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === "give-feedback" ? "active" : ""}`}
                onClick={() => setActiveTab("give-feedback")}
              >
                Give Feedback
              </button>
              <button
                className={`tab-btn ${activeTab === "my-feedback" ? "active" : ""}`}
                onClick={() => setActiveTab("my-feedback")}
              >
                My Feedback
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "give-feedback" && <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />}

              {activeTab === "my-feedback" && (
                <FeedbackList
                  feedback={myFeedback}
                  isLoading={isLoading}
                  error={error}
                  emptyMessage="You haven't received any feedback yet."
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmployeeDashboard
