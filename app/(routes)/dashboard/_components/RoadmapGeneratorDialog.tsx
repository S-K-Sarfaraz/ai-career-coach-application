'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NextRequest, NextResponse } from 'next/server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoaderIcon, SparkleIcon } from 'lucide-react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

const RoadmapGeneratorDialog = ({ openDialog, setOpenDialog, onGenerateComplete }: any) => {
  const roadmapId = uuidv4();
  const [userInput, setUserInput] = useState<string>()
  const [loading, setLoading]= useState<boolean>(false)
  const router = useRouter()
  const {has} = useAuth()

  const GenerateRoadmap = async () => {
    setLoading(true)
    try {
      // @ts-ignore
      const hasSubscriptionEnabled = await has({plan: 'pro', plan: 'premium'})
        if (!hasSubscriptionEnabled) {
          router.push('/billing')
          // setLoading(false)
          return // ⛔️ Stop execution if not subscribed
        }
      const result = await axios.post("/api/ai-roadmap-agent", {
        roadmapId: roadmapId,
        userInput: userInput,
      })

      const generated = result.data?.content || []
      router.push(`/ai-tools/ai-roadmap-agent/${roadmapId}`)
      console.log("Generated:", generated)

      // Notify parent
      onGenerateComplete(generated)
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add position and skill to generate roadmap.</DialogTitle>
          <DialogDescription asChild>
            <div className='mt2'>
              <Input
                onChange={(event) => setUserInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userInput && !loading) {
                    GenerateRoadmap()
                  }
                }}
                placeholder='e.g Full Stack Developer'
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button disabled={loading || !userInput} onClick={GenerateRoadmap}>
            {loading ? <LoaderIcon className='animate-spin' /> : <SparkleIcon />} Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default RoadmapGeneratorDialog