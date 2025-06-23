'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Report from './_components/Report'

const AiREsumeAnayzer = () => {
  const { recordId } = useParams()
  const [pdfUrl, setPdfUrl] = useState<string | undefined>()
  const [aiReport, setAiReport] = useState<any>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recordId && GetResumeAnalyzerRecord()
  }, [recordId])

  const GetResumeAnalyzerRecord = async () => {
    try {
      const result = await axios.get('/api/history?recordId=' + recordId)
      setPdfUrl(result.data?.metaData)
      setAiReport(result.data?.content)
    } catch (error) {
      console.error("Failed to fetch resume data", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-1 h-screen gap-4 overflow-hidden">
      
      {/* Report Section - Scrollable but no visible scrollbar */}
      <div className="col-span-2 pr-4 h-full overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-2/4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        ) : (
          <Report aiReport={aiReport} />
        )}
      </div>

      {/* Resume Section - Scrollable but no scrollbar, iframe auto-height */}
      <div className="col-span-3 pr-2 h-full overflow-y-auto scrollbar-hide">
        <h2 className="font-bold text-2xl mb-5">Resume Preview</h2>

        {loading ? (
          <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg" />
        ) : (
          pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              width="100%"
              className="w-full rounded-lg border-none"
              style={{ height: 'auto', minHeight: '500px' }}
              onLoad={(e) => {
                const iframe = e.currentTarget
                try {
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                  const scrollHeight = iframeDoc?.body?.scrollHeight || 600
                  iframe.style.height = `${scrollHeight}px`
                } catch {
                  // Cross-origin PDF won't allow measuring height; fallback will do
                  iframe.style.height = `1200px`
                }
              }}
            />
          ) : (
            <div className="text-gray-500 text-sm">No PDF available to preview.</div>
          )
        )}
      </div>
    </div>
  )
}

export default AiREsumeAnayzer
