"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Chat from '@/components/Chat'
import Map from '@/components/Map'
import { useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  useEffect(() => {
    axios.get('/api/initiate-session')
      .then(() => console.log("Session started"))
      .catch(() => console.log("Failed to initiate session. Refreshing is wise move."))
  }, [])

  return (
    <main>
      <header className='h-[50px] flex justify-center items-center gap-2'>
        <FontAwesomeIcon icon={faCompass} className='text-lg' />
        <h1 className='text-lg'>Wander</h1>
      </header>
      <div className='relative flex h-[calc(100vh-50px)]'>
        <div className='flex-shrink-0 w-1/2 px-6 pb-6'>
          <Map />
        </div>
        <Chat className='w-1/2' />
      </div>
    </main>
  )
}
