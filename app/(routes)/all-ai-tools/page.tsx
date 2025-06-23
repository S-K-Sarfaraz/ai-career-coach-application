'use client'
import React from 'react'
import AiTools from '../dashboard/_components/AiTools'

const AllAiTools = () => {
  return (
    <div className="min-h-screen w-full bg-muted/20 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Powerful AI Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of AI-powered tools designed to help you work smarter, create faster, and solve complex problems with ease.
          </p>
        </div>

        {/* AI Tools List */}
        <AiTools />
      </div>
    </div>
  )
}

export default AllAiTools
