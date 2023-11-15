"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Chat from '@/components/Chat'
import Map from '@/components/Map'
import MapOverlay from '@/components/MapOverlay'
import useMap from './hooks/useMap'

export default function Home() {
  const { selectedBusiness, resetSelectedBusiness, handleAction } = useMap()

  return (
    <main>
      <header className='h-[50px] flex justify-center items-center gap-2'>
        <FontAwesomeIcon icon={faCompass} className='text-lg' />
        <h1 className='text-lg'>Wander</h1>
      </header>
      <div className='flex h-[calc(100vh-50px)]'>
        <div className='relative flex-shrink-0 w-1/2 px-6 pb-6'>
          <Map />
          {selectedBusiness && <MapOverlay placeId={selectedBusiness.place_id} title={selectedBusiness.title} onClose={() => resetSelectedBusiness()} />}
        </div>
        <Chat className='w-1/2' onAction={handleAction} />
      </div>
    </main>
  )
}
