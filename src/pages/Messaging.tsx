import { useEffect, useState } from 'react'

type Message = {
  id: string
  sender_id: string | null
  content: string
  created_at: string
}

type Chat = {
  id: string
}

type Props = {
  accessToken: string
}

function Messaging({ accessToken }: Props) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadChat()
  }, [])

  async function loadChat() {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organization-chats/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (res.status === 404) {
        setChat(null)
        setMessages([])
        return
      }

      if (!res.ok) {
        setError('Failed to load messages.')
        return
      }

      const chatData: Chat = await res.json()
      setChat(chatData)

      const messagesRes = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/organization-chats/${chatData.id}/messages`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (messagesRes.ok) {
        setMessages(await messagesRes.json())
      }
    } catch {
      setError('Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!newMessage.trim()) return
    setSending(true)
    setError(null)

    try {
      let chatId = chat?.id

      if (!chatId) {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organization-chats`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (!res.ok) {
          setError('Failed to start conversation.')
          return
        }
        const newChat: Chat = await res.json()
        setChat(newChat)
        chatId = newChat.id
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organization-chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (!res.ok) {
        setError('Failed to send message.')
        return
      }

      const sentMessage: Message = await res.json()
      setMessages((prev) => [...prev, sentMessage])
      setNewMessage('')
      setComposing(false)
    } catch {
      setError('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <p className="p-6 text-neutral-600">Loading messages...</p>
  }

  const showComposer = composing || messages.length > 0

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
      <p className="mt-1 text-neutral-600">Your conversation with the Next Level Dads team.</p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-neutral-200 bg-white">
        <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-neutral-500">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-800">
              {m.content}
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 p-4">
          {!showComposer ? (
            <button
              onClick={() => setComposing(true)}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              New message
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message to the NLD team..."
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Messaging
