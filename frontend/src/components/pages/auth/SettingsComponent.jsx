import React from "react"
import { Helmet, } from "react-helmet"

export default function SettingsComponent() {
  return (
    <div className="container settings-container">
      <Helmet>
        <title>Settings - {process.env.REACT_APP_NAME}</title>
      </Helmet>
      <div>SettingsComponent</div>
    </div>
  )
}
