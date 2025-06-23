'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RoadmapCanvas from './_components/RoadmapCanvas'
import RoadmapGeneratorDialog from '@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog'
import { Loader2 } from 'lucide-react'

const RoadmapGeneratorAgent = () => {
  const { roadmapId } = useParams()
  const [roadmapDetails, setRoadmapDetails] = useState<any>()
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    roadmapId && GetRoadmapDetails()
  }, [roadmapId])

  const GetRoadmapDetails = async () => {
    try {
      setLoading(true)
      const result = await axios.get('/api/history?recordId=' + roadmapId)
      setRoadmapDetails(result.data?.content)
    } catch (err) {
      console.error('Failed to load roadmap:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
      {/* Sidebar Card */}
      <div className="bg-white dark:bg-[#1c1c1e] border rounded-2xl shadow-md p-6 flex flex-col justify-between">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500 mt-2">Loading roadmap...</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-semibold text-2xl text-gray-800 dark:text-white">{roadmapDetails?.roadmapTitle}</h2>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-800 dark:text-white">Description:</span> {roadmapDetails?.description}
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-800 dark:text-white">Duration:</span> {roadmapDetails?.duration}
              </p>
            </div>
            <Button onClick={() => setOpenRoadmapDialog(true)} className="mt-6 w-full">
              + Create Another Roadmap
            </Button>
          </>
        )}
      </div>

      {/* Canvas Area */}
      <div className="col-span-2 w-full h-[80vh] bg-white dark:bg-[#111113] border rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <RoadmapCanvas
            initialNodes={roadmapDetails?.initialNodes}
            initialEdges={roadmapDetails?.initialEdges}
          />
        )}
      </div>

      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />
    </div>
  )
}

export default RoadmapGeneratorAgent
