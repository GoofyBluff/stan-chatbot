import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! I’m Stan, your assistant 😊' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [facts, setFacts] = useState({ name: 'Unknown', hobbies: [], mood: 'neutral' })
  const messagesEndRef = useRef(null)

  const moodColors = {
    happy: 'bg-green-500',
    sad: 'bg-blue-500',
    angry: 'bg-red-500',
    neutral: 'bg-gray-500'
  }

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    neutral: '🙂'
  }

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, { sender: 'user', text: input }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://stan-chatbot-0swm.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: '123', message: input })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }])

      // Update facts if API returns them
      if (data.facts) {
        setFacts(data.facts)
      }
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Error connecting to server.' }])
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col">
        
        {/* Header with mood color & emoji */}
        <div className={`p-4 text-white text-center text-lg font-bold rounded-t-lg transition-all duration-500 ${moodColors[facts.mood] || 'bg-gray-500'}`}>
  Stan <span className="inline-block animate-bounceEmoji">{moodEmojis[facts.mood] || '🙂'}</span>
  
    </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-auto mb-4 h-96 border p-2 rounded">
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {m.text}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left text-gray-500 italic">Stan is typing...</div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input & Send Button */}
        <div className="flex">
          <input
            className="flex-1 border px-3 py-2 rounded-l"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
