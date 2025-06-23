import { Button } from '@/components/ui/button'
import React from 'react'

const WelcomeBanner = () => {
  return (
    <div className='p-5 bg-gradient-to-r from-[#be575f] via-[#8338e3] to-[#ac76d6] rounded-xl'>
        <h2 className='font-bold text-2xl text-white'>AI Career Coach Agert</h2>
        <p className='text-white'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, asperiores. Sapiente in iusto earum? Rerum provident </p>
        <Button variant={'outline'} className='mt-5' >Let's Get Started</Button>
    </div>
  )
}

export default WelcomeBanner