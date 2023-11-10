import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Chat from '@/components/Chat'

export default function Home() {
  return (
    <main>
      <header className='h-[50px] flex justify-center items-center gap-2'>
        <FontAwesomeIcon icon={faCompass} className='text-lg' />
        <h1 className='text-lg'>Wander</h1>
      </header>
      <div className='flex h-[calc(100vh-50px)]'>
        <div className='flex-1 bg-blue-500'></div>
        <Chat className='flex-1 bg-white border-l border-gray-200' />
      </div>
    </main>
  )
}
