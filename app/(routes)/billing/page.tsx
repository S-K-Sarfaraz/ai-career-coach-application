import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const Billing = () => {
  return (
    <div>
        <h2 className='font-bold text-3xl'>Chose your Plan</h2>
        <p className='text-lg'>Select a subscription plan to get the full access to all AI Tools.</p>
        <div className='mt-5'>
            <PricingTable/>
        </div>
    </div>
  )
}

export default Billing