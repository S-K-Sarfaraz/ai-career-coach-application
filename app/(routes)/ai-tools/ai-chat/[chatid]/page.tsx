'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import { ReactNode } from 'react'
import Markdown from 'react-markdown'
import { Components } from 'react-markdown'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'


const markdownComponents = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white my-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 my-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 my-2" {...props} />
  ),
  p: (props: any) => (
    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed my-2" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  li: (props: any) => (
    <li className="ml-6 list-disc text-gray-700 dark:text-gray-300 leading-relaxed my-1" {...props} />
  ),
  ul: (props: any) => (
    <ul className="pl-4 my-2 space-y-1" {...props} />
  ),
  ol: (props: any) => (
    <ol className="pl-4 my-2 list-decimal space-y-1" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-blue-400 pl-4 pr-2  italic text-gray-600 dark:text-gray-300 rounded my-4" {...props} />
  ),
  code: ({ inline, className, children, ...props }: any) => {
    return inline ? (
      <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-purple-700 dark:text-purple-300" {...props}>
        {children}
      </code>
    ) : (
      <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm font-mono leading-relaxed my-4 shadow-inner">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
};

type messages = {
    content: string,
    role: string,
    type: string
}


const AiChat = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const [messageList, setMessageList] = useState<messages[]>([])
    const {chatid} = useParams()
    const id = uuidv4()
    const router = useRouter()

    useEffect(()=>{
      chatid && getMessageList()
    },[chatid])
    
    const getMessageList = async () => {
      const result = await axios.get('/api/history?recordId='+chatid)
      console.log(result.data)
      setMessageList(result?.data?.content)
    }

    const onSend = async () => {
        setLoading(true)
        try {
            setMessageList(prev=>[...prev,{
                content: userInput,
                role: "user",
                type: "text"
            }])
            setUserInput('')
            const result = await axios.post("/api/ai-career-chat-agent", {
                userInput: userInput
            })
            console.log(result.data)
            setMessageList(prev=>[...prev,result.data])
        } catch (err: any) {
            if (err.response?.status === 429) {
                alert("Rate limit exceeded. Please wait a few seconds and try again.");
            } else {
                alert("An error occurred. Please try again.");
            }
            console.error(err);
        }
        setLoading(false)
        setUserInput('')
    }

    useEffect(()=>{
      messageList.length > 0 && updateMessageList()
    },[messageList])

    const updateMessageList = async ()=>{
      const result = await axios.put('/api/history',{
        content: messageList,
        recordId: chatid
      })
      console.log(result)
    }

      const onNewChat = async () => {
        setLoading(true)
        try {
          const result = await axios.post('/api/history', {
            recordId: id,
            content: [],
          })
          console.log(result)
          router.replace(`/ai-tools/ai-chat/${id}`)
        } catch (error) {
          console.error("Failed to create history", error)
        } finally {
          setLoading(false)
        }
      }

  return (
    <div className='px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto'>
        <div className='flex items-center justify-between gap-8 mb-4'>
            <div>
                <h2 className='text-lg font-bold'>AI Career Q&A Chat</h2>
                <p className='text-gray-400 text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut illum veritatis nihil autem non deserunt animi minima. Explicabo, iure corrupti.</p>
            </div>
            <Button onClick={onNewChat}>+ New Chat</Button>
        </div>
        <div className='flex flex-col h-[80vh]'>
            {messageList?.length <= 0 &&<div className='mt-5'><EmptyState selectQuestion={(question:string) => setUserInput(question)}/></div>}
            <div className='flex-1'>
                {
                    messageList?.map((message, index) => (
                        <div key={index}>
                        {/* Message aligned based on sender */}
                        <div className={`flex mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg gap-2 max-w-[80%] ${message.role === 'user' ? 'bg-gray-200 text-black' : 'bg-gray-50 text-black'}`}>
                            <Markdown components={markdownComponents}>   
                                {message.content}
                            </Markdown>
                            </div>
                        </div>

                        {/* Loader shown only for the last message, always at flex-start */}
                        {loading && messageList.length - 1 === index && (
                            <div className="flex justify-start mb-2">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm border border-blue-200 dark:border-blue-700">
                                <LoaderCircle className="animate-spin w-4 h-4" />
                                <span className="text-sm font-medium">Thinking...</span>
                                </div>
                            </div>
                        )}
                        </div>
                    ))
                    }
            </div>
            <div className='flex justify-between items-center gap-3 absolute bottom-5 w-[50%]'>
                <Input
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userInput.trim() && !loading) {
                      onSend()
                    }
                  }}
                  placeholder='Type here'
                />
                <Button onClick={onSend} disabled={loading}><Send/></Button>
            </div>
        </div>
    </div>
  )
}

export default AiChat