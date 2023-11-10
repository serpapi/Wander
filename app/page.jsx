"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Chat from '@/components/Chat'
import Map from '@/components/Map'
import * as maptilersdk from '@maptiler/sdk';

export default function Home() {

  const handleAction = (action, args) => {
    if (action === "addMapMarker") {
      if (window.map) {
        window.map.panTo([args.longitude, args.latitude])

        new maptilersdk.Marker({
          color: "#FF0000",
          draggable: false
        }).setLngLat([args.longitude, args.latitude])
        .addTo(window.map)
      }
    }
  }

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
        <Chat className='w-1/2' onAction={handleAction} />
      </div>
    </main>
  )
}
