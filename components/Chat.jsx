"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import cx from "classnames"
import ChatBubble from "./ChatBubble"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBroom } from "@fortawesome/free-solid-svg-icons"

export default function Chat({ className, onAction })  {
  const [typingMessage, setTypingMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const loadMessages = async () => {
      await axios.get('/api/initiate-session')
      .then(() => console.log("Session started"))
      .catch(() => console.log("Failed to initiate session. Refreshing is wise move."))

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

    const cleanTypingMessage = typingMessage.trim()

    setMessages([
      { role: "user", content: [{ type: "text", text: { value: cleanTypingMessage } }] }, 
      ...messages
    ])
    document.querySelector("#chatbox")?.scrollTo(0, 0)
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: cleanTypingMessage
        })
      })

      const reader = response.body.getReader()
      while (true) {
        const {value, done} = await reader.read();
        if (done) break;

        const rawData = new TextDecoder().decode(value)
        const data = rawData.split("<--JSON").filter(dt => dt)
        data.forEach(dt => {
          const { messages, action, actionArgs } = JSON.parse(dt)
          if (messages) {
            setMessages(messages)
          }
          if (action) {
            onAction(action, actionArgs)
          }
        })
      }
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      await axios.delete("/api/chat")
      setMessages([])
    } catch (e) {
      alert(e)
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
    <>
      <div className='absolute right-0 top-0 h-[50px] flex items-center px-4'>
        <button className='group bg-slate-100 w-[32px] h-[32px] rounded' onClick={clearChat}>
          <FontAwesomeIcon icon={faBroom} className='text-gray-500 group-hover:text-gray-800' />
        </button>
      </div>
      <div className={`flex flex-col justify-between gap-5 pb-6 w-full h-full overflow-hidden ${className}`}>
        <div id="chatbox" className="overflow-scroll flex flex-col-reverse px-4 gap-2">
          {loading && <ChatBubble role="assistant" type="thinking" />}
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
    </>
  )
}