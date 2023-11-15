
import { useEffect, useRef, useState } from "react"
import * as maptilersdk from '@maptiler/sdk';

maptilersdk.config.apiKey = 'TwDPXTUT5y62rnrJfTxN';

export default function useMap() {
  const [selectedBusiness, setSelectedBusiness] = useState()
  const map = useRef()

  useEffect(() => {
    if (map.current) return
    map.current = new maptilersdk.Map({
      container: 'map',
      style: "streets-v2",
      center: [-97.74242805297416, 30.270557801221628],
      zoom: 14,
    })
  }, [])

  const fitToBounds = (coordinates) => {
    if (coordinates.length > 1) {
      map.current.fitBounds(new maptilersdk.LngLatBounds(coordinates), { maxZoom: 9, linear: false })
    } else if (coordinates.length === 1) {
      map.current.panTo(coordinates[0])
    }
  }

  const handleAction = (action, args) => {
    if (!map.current) return
  
    if (action === "addMapMarkers") {
      const coordinates = []
      args?.markers?.forEach(coordinate => {
        new maptilersdk.Marker({
          color: "#FF0000",
          draggable: false
        }).setLngLat([coordinate.longitude, coordinate.latitude])
          .addTo(map.current)

          coordinates.push(new maptilersdk.LngLat(coordinate.longitude, coordinate.latitude))
      })

      fitToBounds(coordinates)
    } else if (action === "addBusinessMapMarkers") {
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
          .addTo(map.current)

        coordinates.push(new maptilersdk.LngLat(business.longitude, business.latitude))
      })

      fitToBounds(coordinates)
    }
  }

  const resetSelectedBusiness = () => {
    setSelectedBusiness(null)
  }

  return { selectedBusiness, resetSelectedBusiness, handleAction }
}