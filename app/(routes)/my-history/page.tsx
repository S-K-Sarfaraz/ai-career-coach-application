'use client'
import React from 'react'
import AiTools from '../dashboard/_components/AiTools'
import History from '../dashboard/_components/History'

const AllAiTools = () => {
  return (
    <div className="min-h-screen w-full bg-muted/20 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your Activity History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A list of all the AI tools you've used recently. You can revisit previous sessions and continue where you left off.
          </p>
        </div>

        {/* AI Tools List */}
        <History />
      </div>
    </div>
  )
}

export default AllAiTools
