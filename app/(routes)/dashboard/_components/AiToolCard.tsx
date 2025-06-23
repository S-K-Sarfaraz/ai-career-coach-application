'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ResumeUploadDialog from './ResumeUploadDialog'
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog'

interface TOOL {
  name: string
  description: string
  icon: string
  path: string
  button: string
}

type AIToolProps = {
  tool: TOOL
}

const AiToolCard = ({ tool }: AIToolProps) => {
  const id = uuidv4()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [openResumeUpload, serOpenResumeUpload] = useState(false)
  const [openRoadmapDialog, setOpenRoadmapDialog]= useState(false)

  const onClickButton = async () => { 
    if(tool.name === 'AI Resume Analyzer'){
      serOpenResumeUpload(true)
      return 
    }

    if(tool.path === '/ai-tools/ai-roadmap-agent'){
      setOpenRoadmapDialog(true)
      return
    }



    setLoading(true)
    try {
      const result = await axios.post('/api/history', {
        recordId: id,
        content: [],
        aiAgentType: tool.path
      })
      // console.log(result)
      router.push(`${tool.path}/${id}`)
    } catch (error) {
      console.error("Failed to create history", error)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="p-4 border rounded-lg hover:scale-[1.03] shadow-lg transition-transform duration-300 flex flex-col h-full">
    <Image src={tool.icon} width={40} height={40} alt={tool.name} />
    <h1 className="text-medium mt-2 font-bold">{tool.name}</h1>
    <p className="text-gray-400 flex-grow">{tool.description}</p>

    <div className="mt-auto pt-3">
      <Button 
        onClick={onClickButton} 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoaderCircle className="animate-spin w-4 h-4" />
            Loading...
          </>
        ) : (
          tool.button
        )}
      </Button>
    </div>

    <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={serOpenResumeUpload} />
    <RoadmapGeneratorDialog openDialog={openRoadmapDialog} setOpenDialog={() => setOpenRoadmapDialog(false)} />
  </div>
)

}

export default AiToolCard
