import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Markdown from 'react-markdown'

export default function ChatBubble({ role, content, type = "message" }) {
  let bubbleClass = ''
  let profile = <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
    <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
  </div>
  if (role === 'assistant') {
    bubbleClass = 'bg-container rounded-lg'
    profile = <div className="flex flex-shrink-0 items-center justify-center bg-primary rounded w-[36px] h-[36px]">
      <FontAwesomeIcon icon={faCompass} className='text-white text-xl' />
    </div>
  }

  return <div className={`p-4 ${bubbleClass}`}>
    <div className="flex gap-4">
      {profile}
      {type === "thinking" 
        ? <div className='flex items-center'><span className='thinking'></span></div>
        : <div className="whitespace-pre-wrap py-1">
            <Markdown>{content[0].text?.value}</Markdown>
          </div>}
    </div>
  </div>
}