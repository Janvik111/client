import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"
import App from "./App"

// Set base URL for API requests
axios.defaults.baseURL = "http://localhost:5000"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
