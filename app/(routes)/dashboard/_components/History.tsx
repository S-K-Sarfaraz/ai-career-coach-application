'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { aiToolList } from './AiTools'
import Link from 'next/link'

interface HistoryItem {
  recordId: string
  aiAgentType: string
  createdAt: string
}

const History = () => {
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getHistory()
  }, [])

  const getHistory = async () => {
    try {
      const result = await axios.get('/api/history')
      setUserHistory(result.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const GetAgentName = (path: string) => {
    return aiToolList.find(item => item.path === path)
  }

  return (
    <div className='mt-5 p-5 border rounded-xl'>
      <h2 className='text-lg font-bold'>Previous History</h2>
      <p className='text-gray-400'>What you previously worked on, you can find here.</p>

      {loading ? (
        <div className='flex flex-col items-center justify-center mt-8'>
          <Image src='/loading-2.gif' height={100} width={100} alt='loading' />
          <p className='mt-4 text-sm text-gray-500'>Fetching your history...</p>
        </div>
      ) : userHistory.length === 0 ? (
        <div className='flex flex-col mb-8 items-center justify-center mt-8'>
          <Image src={'/bulb.png'} height={40} width={40} alt='bulb' />
          <h2>You do not have any history.</h2>
          <Button className='mt-5'>Explore AI Tools</Button>
        </div>
      ) : (
        <div className='mt-4 max-h-[300px] overflow-y-auto space-y-3 pr-2'>
          {userHistory.map((history) => {
            const agent = GetAgentName(history.aiAgentType)
            return (
              <Link
                key={history.recordId}
                href={`${history.aiAgentType}/${history.recordId}`}
                className='flex justify-between items-center p-3 rounded-xl border hover:bg-muted transition-all'
              >
                <div className='flex gap-5 items-center'>
                  {agent?.icon && (
                    <Image src={agent.icon} alt='icon' height={20} width={20} />
                  )}
                  <h2>{agent?.name || 'Unknown Tool'}</h2>
                </div>
                <div>
                  <h2 className='text-sm text-gray-500'>{new Date(history.createdAt).toLocaleString()}</h2>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default History
