import { useEffect, useState } from 'react'

type Message = {
  id: string
  chat_id: string
  sender_id: string | null
  sender_name: string | null
  content: string
  is_deleted: boolean
  created_at: string
}

type Chat = {
  id: string
  organization_id: string
  organization_name: string
}

type Props = {
  accessToken: string
}

function Messaging({ accessToken }: Props) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
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
        // Backend returns newest-first (for pagination) — reverse for a top-to-bottom chat view.
        const data: Message[] = await messagesRes.json()
        setMessages(data.reverse())
      }
    } catch {
      setError('Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !chat) return
    setSending(true)
    setError(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organization-chats/${chat.id}/messages`, {
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
    } catch {
      setError('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <p className="p-6 text-neutral-600">Loading messages...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
      <p className="mt-1 text-neutral-600">Your conversation with the Next Level Dads team.</p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-neutral-200 bg-white">
        <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && <p className="text-sm text-neutral-500">No messages yet — say hello below.</p>}
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-800">
              {m.sender_name && (
                <p className="mb-1 text-xs font-medium text-neutral-500">{m.sender_name}</p>
              )}
              {m.is_deleted ? <span className="italic text-neutral-400">Message deleted</span> : m.content}
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 p-4">
          {chat ? (
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
          ) : (
            <p className="text-sm text-neutral-500">
              No conversation found for your organization yet — this shouldn't normally happen, contact support if it
              persists.
            </p>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Messaging
