"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import cx from "classnames"
import ChatBubble from "./ChatBubble"

export default function Chat({ className })  {
  const [typingMessage, setTypingMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)

      try {
        const { data } = await axios.get(`/api/chat`)
        setMessages(data.messages)
      } catch (err) {
        alert(err)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  const sendMessage = async () => {
    if (!typingMessage) return
    setTypingMessage("")
    adjustTextAreaHeight()
    setLoading(true)

    const updatedMessages = [{ role: "user", content: [{ type: "text", text: { value: typingMessage } }] }, ...messages]
    setMessages(updatedMessages)
    document.querySelector("#chatbox")?.scrollTo(0, 0)
    
    try {
      const { data } = await axios.post(`/api/chat`, { message: typingMessage })
      if (data.messages) {
        setMessages(data.messages)
      } else if (data.error) {
        alert(data.error)
      }
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  const adjustTextAreaHeight = () => {
    setTimeout(() => {
      const element = document.querySelector("#typing-area")
      element.style.height = "auto"
      element.style.height = `${element.scrollHeight}px`
    })
  }

  return (
    <div className={`flex flex-col justify-between gap-5 pb-6 w-full h-full overflow-hidden ${className}`}>
      <div id="chatbox" className="overflow-scroll flex flex-col-reverse px-4 gap-2">
        {messages.map((message, index) => <ChatBubble key={index} {...message} />)}
      </div>
      <div className="mx-4 shadow shadow-primary rounded-lg">
        <form 
          className="flex"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <textarea
            id="typing-area"
            onInput={adjustTextAreaHeight}
            onKeyDown={(e) => {
              if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            rows={1}
            className="flex-grow px-4 py-4 text-on-container h-[56px] max-h-[200px] bg-transparent outline-none resize-none"
            type="text"
            placeholder="Send a message"
            value={typingMessage}
            onChange={(e) => setTypingMessage(e.target.value)}
          />
          <div className="flex items-center px-3">
            <button type="submit" className={cx('flex justify-center items-center rounded w-[35px] h-[35px] transition-all ease-in-out', { 'bg-primary': typingMessage && !loading })} disabled={loading || !typingMessage}>
              <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill={(typingMessage && !loading) ? "#fff" : "#9ca3af"} d="M49.9 27.8C15.1 12.7-19.2 50.1-1.2 83.5L68.1 212.2c4.4 8.3 12.6 13.8 21.9 15c0 0 0 0 0 0l176 22c3.4 .4 6 3.3 6 6.7s-2.6 6.3-6 6.7l-176 22s0 0 0 0c-9.3 1.2-17.5 6.8-21.9 15L-1.2 428.5c-18 33.4 16.3 70.8 51.1 55.7L491.8 292.7c32.1-13.9 32.1-59.5 0-73.4L49.9 27.8z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}