import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Profile = () => {
  return (
    <div className='w-full'>
        <UserProfile/>
    </div>
  )
}

export default Profile