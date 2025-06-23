'use client'
import React from 'react'
import AiToolCard from './AiToolCard'

export const aiToolList = [
   {
     name: 'AI Career Q&A Chat',
     description: 'Chat with AI Agent',
     icon: '/chatbot.png',
     path: '/ai-tools/ai-chat',
     button: "Let's Chat",
   },
   {
     name: 'AI Resume Analyzer',
     description: 'Improve your resume',
     icon: '/resume.png',
     path: '/ai-tools/ai-resume-analyzer',
     button: 'Analyze Now',
   },
   {
     name: 'Career Roadmap Generate',
     description: 'Build your roadmap',
     icon: '/roadmap.png',
     path: '/ai-tools/ai-roadmap-agent',
     button: 'Generate Now',
   },
   {
     name: 'Cover Letter Generator',
     description: 'Write a cover latter',
     icon: '/cover.png',
     path: 'cover-latter-generator',
     button: 'Create Now',
   },
]

const AiTools = () => {

  return (
    <div className='mt-7 p-5 border rounded-xl'>
        <h2 className='font-bold text-lg'>Available AI Tools</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, dolore.</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
          {
            aiToolList.map((tool:any, index) => (
              <AiToolCard tool={tool} key={index}/>
            ))
          }
        </div>
    </div>
  )
}

export default AiTools