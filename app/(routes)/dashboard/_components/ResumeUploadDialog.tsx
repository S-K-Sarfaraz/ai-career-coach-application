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
import { toast } from 'sonner'


const ResumeUploadDialog = ({ openResumeUpload, setOpenResumeDialog }: any) => {
  const [file, setFile] = useState<any>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { has } = useAuth()

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
  formData.append('recordId', recordId)
  formData.append('resumeFile', file)

  try {
    // @ts-ignore
    const hasProSubscriptionEnabled = await has({ plan: 'pro' })
    // @ts-ignore
    const hasPremiumSubscriptionEnabled = await has({ plan: 'premium' })

    if (!hasProSubscriptionEnabled && !hasPremiumSubscriptionEnabled) {
      router.push('/billing')
      return
    }

    const result = await axios.post("/api/ai-resume-analyzer", formData)

    if (result.status === 500) {
      throw new Error('Internal Server Error')
    }

    console.log(result.data)
    router.push(`/ai-tools/ai-resume-analyzer/${recordId}`)
    setOpenResumeDialog(false)
  } catch (error: any) {
    console.error("Error uploading resume:", error)
    
    setOpenResumeDialog(false)  // close the dialog box
    
    toast.error("Resume analysis failed. Please try again later.")  // show error toast
  } finally {
    setLoading(false)
  }
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
