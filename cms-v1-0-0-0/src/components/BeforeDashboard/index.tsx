/* eslint-disable react/no-unescaped-entities */
import { Banner } from 'payload/components'

import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner type="success">
        <h3>🎉 Welcome to Our Upgraded CMS System! 🚀</h3>
        <p>
          We're thrilled to introduce you to our newly enhanced Content Management System! With improved features, a more intuitive interface, and powerful tools to make your work easier and more efficient, we're confident you'll love the experience.
        </p>
        <p>
          Dive in, explore the new capabilities, and let's continue creating amazing content together!
        </p>
      </Banner>
    </div>
  )
}

export default BeforeDashboard
