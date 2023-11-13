import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export default function MapOverlay({ placeId, title, onClose }) {
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadResult = async () => {
      setLoading(true)
      try {
        const { data } = await axios("/api/map", {
          params: {
            placeId
          }
        })
        setResult(data)
      } catch {
        setResult(null)
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [placeId, setLoading])

  return <div className="absolute left-0 w-full bottom-0 px-8 py-6 z-50">
    <div className="relative bg-white rounded-t-xl min-h-[200px] max-h-[70vh] p-4 overflow-auto">
      <div className="flex items-center gap-4">
        {result?.thumbnail && <Image src={result?.thumbnail} width={120} height={120} alt={result?.title || title} />}
        <div className="flex flex-col py-1">
          <span>{result?.title || title}</span>
          {result?.reviews && <span className="text-sm text-gray-500">{result?.rating} ({result?.reviews})</span>}
          <span className="text-sm text-gray-500">{result?.address}</span>
          <span className="text-sm text-gray-500">{result?.open_state}</span>
        </div>
      </div>
      {result?.user_reviews?.most_relevant && <div className="mt-4">
        <div className="text-sm">Reviews</div>
        <div className="-my-4">
          {result.user_reviews.most_relevant.map((review, index) => (
            <div key={index} className="flex flex-col gap-3 bg-container rounded my-4 px-4 py-2">
              <span className="text-gray-600">{review.username} (Rating: {review.rating})</span>
              <p>{review.description}</p>
              <span className="text-gray-400">{review.date}</span>
            </div>
          ))}
        </div>
      </div>}
      {loading && <div className='flex items-center'><span className='thinking'></span></div>}
      <button className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-400" />
      </button>
    </div>
  </div>
}