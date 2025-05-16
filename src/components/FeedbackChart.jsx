"use client"

import { useRef, useEffect } from "react"
import "./FeedbackChart.css"

function FeedbackChart({ data }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) {
      return
    }

    // Clear previous chart
    chartRef.current.innerHTML = ""

    // Find the maximum count for scaling
    const maxCount = Math.max(...data.map((item) => item.count))

    // Create bars
    data.forEach((item, index) => {
      // Calculate bar height as percentage of max
      const percentage = (item.count / maxCount) * 100

      // Create bar container
      const barContainer = document.createElement("div")
      barContainer.className = "chart-bar-container"

      // Create bar
      const bar = document.createElement("div")
      bar.className = "chart-bar"
      bar.style.height = `${percentage}%`
      bar.style.backgroundColor = getBarColor(index)

      // Create tooltip
      const tooltip = document.createElement("div")
      tooltip.className = "chart-tooltip"
      tooltip.textContent = `${item.count} feedback(s)`

      // Create label
      const label = document.createElement("div")
      label.className = "chart-label"
      label.textContent = item.category

      // Assemble
      barContainer.appendChild(bar)
      barContainer.appendChild(tooltip)
      barContainer.appendChild(label)
      chartRef.current.appendChild(barContainer)

      // Add hover event
      barContainer.addEventListener("mouseenter", () => {
        tooltip.style.opacity = "1"
      })

      barContainer.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0"
      })
    })
  }, [data])

  // Generate colors for bars
  const getBarColor = (index) => {
    const colors = ["#4a6fa5", "#5d82b8", "#7095cb", "#83a8de", "#96bbf1", "#a9ceff", "#bcddff", "#cfecff", "#e2fbff"]

    return colors[index % colors.length]
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No feedback data available</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart" ref={chartRef}></div>
    </div>
  )
}

export default FeedbackChart
