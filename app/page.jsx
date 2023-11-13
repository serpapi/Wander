"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Chat from '@/components/Chat'
import Map from '@/components/Map'
import * as maptilersdk from '@maptiler/sdk';
import MapOverlay from '@/components/MapOverlay'
import { useEffect, useState } from 'react'

export default function Home() {
  const [selectedBusiness, setSelectedBusiness] = useState()

  const handleAction = (action, args) => {
    if (action === "addMapMarkers") {
      if (window.map) {
        const coordinates = []
        args?.markers?.forEach(coordinate => {
          new maptilersdk.Marker({
            color: "#FF0000",
            draggable: false
          }).setLngLat([coordinate.longitude, coordinate.latitude])
            .addTo(window.map)

            coordinates.push(new maptilersdk.LngLat(coordinate.longitude, coordinate.latitude))
        })

        if (coordinates.length > 1) {
          window.map.fitBounds(new maptilersdk.LngLatBounds(coordinates), { maxZoom: 9, linear: false })
        } else if (coordinates.length === 1) {
          window.map.panTo(coordinates[0])
        }
      }
    } else if (action === "addBusinessMapMarkers") {
      if (window.map) {
        const coordinates = []
        args?.markers?.forEach(business => {
          var el = document.createElement('div');
          el.id = business.place_id
          el.className = 'business-marker'
          el.setAttribute("data-json", JSON.stringify(business))

          el.addEventListener('click', function () {
            setSelectedBusiness(business)
          });

          new maptilersdk.Marker({
            element: el 
          }).setLngLat([business.longitude, business.latitude])
            .addTo(window.map)

          coordinates.push(new maptilersdk.LngLat(business.longitude, business.latitude))
        })

        if (coordinates.length > 1) {
          window.map.fitBounds(new maptilersdk.LngLatBounds(coordinates), { maxZoom: 13 })
        } else if (coordinates.length === 1) {
          window.map.panTo(coordinates[0])
        }
      }
    }
  }

  return (
    <main>
      <header className='h-[50px] flex justify-center items-center gap-2'>
        <FontAwesomeIcon icon={faCompass} className='text-lg' />
        <h1 className='text-lg'>Wander</h1>
      </header>
      <div className='flex h-[calc(100vh-50px)]'>
        <div className='relative flex-shrink-0 w-1/2 px-6 pb-6'>
          <Map />
          {selectedBusiness && <MapOverlay placeId={selectedBusiness.place_id} title={selectedBusiness.title} onClose={() => setSelectedBusiness(null)} />}
        </div>
        <Chat className='w-1/2' onAction={handleAction} />
      </div>
    </main>
  )
}
