'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { File, Loader2Icon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

const ResumeUploadDialog = ({ openResumeUpload, setOpenResumeDialog }: any) => {
  const [file, setFile] = useState<any>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  

  const onFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log(file.name)
      setFile(file)
    }
  }

  const onUploadAndAnalyze = async () => {
    setLoading(true)
    const recordId = uuidv4()
    const formData = new FormData()
    const { has } =await useAuth()
    formData.append('recordId', recordId)
    formData.append('resumeFile', file)

    // @ts-ignore
    const hasSubscriptionEnabled =  has({ plan: 'pro'})
    if (!hasSubscriptionEnabled) {
      const resultHistory = await axios.get('/api/history')
      const historyList = resultHistory.data
      const isPresent = await historyList.find((item:any)=>item.aiAgentType=="/ai-tools/ai-resume-analyzer")
      router.push('/billing')
      if(isPresent){
        return null
      }
    }

    const result = await axios.post("/api/ai-resume-analyzer", formData)
    console.log(result.data)
    setLoading(false)
    router.push(`/ai-tools/ai-resume-analyzer/${recordId}`)
    setOpenResumeDialog(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && file && !loading) {
      onUploadAndAnalyze()
    }
  }

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Upload Resume PDF file!</DialogTitle>
          <DialogDescription>
            <div>
              <label htmlFor="resumeUpload" className='flex flex-col items-center justify-center p-7 border border-dashed rounded-xl hover:bg-slate-100 cursor-pointer'>
                <File className='h-10 w-10' />
                {file ? (
                  <h2 className='mt-3 text-blue-600'>{file.name}</h2>
                ) : (
                  <h2 className='mt-3'>Click here to upload file.</h2>
                )}
              </label>
              <input type="file" id='resumeUpload' onChange={onFileChange} accept='application/pdf' className='hidden' />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpenResumeDialog(false)}>Cancel</Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className='animate-spin' /> : <Sparkles />} Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ResumeUploadDialog
