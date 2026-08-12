import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'

const inputClass =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'
const labelClass = 'block text-sm font-medium text-neutral-700'

type FormData = {
  name: string
  email: string
  phone: string
  city: string
  province: string
  website: string
  description: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  primaryGoals: string
  partnershipReason: string
  estimatedReach: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  province: '',
  website: '',
  description: '',
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  primaryGoals: '',
  partnershipReason: '',
  estimatedReach: '',
}

type Props = {
  onSubmitted: () => void
}

function ApplicationForm({ onSubmitted }: Props) {
  const { accessToken, logout } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!submitted) return
    const timer = setTimeout(onSubmitted, 2000)
    return () => clearTimeout(timer)
  }, [submitted, onSubmitted])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      province: formData.province,
      website: formData.website,
      description: formData.description,
      contact_name: formData.contactName,
      contact_title: formData.contactTitle,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone,
      application_answers: {
        primary_goals: formData.primaryGoals,
        partnership_reason: formData.partnershipReason,
        estimated_reach: formData.estimatedReach,
      },
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organizations/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Something went wrong.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-2xl font-bold text-neutral-900">Application submitted!</h1>
            <p className="mt-2 text-neutral-600">We'll review your application and get back to you soon.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c9932e]">Partner Application</p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">Join the Next Level Dads network</h1>
          <p className="mt-2 text-neutral-600">
            Tell us about your organization and how you'd like to partner with us.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Organization name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Organization email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Organization phone (optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Website (optional)</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Province</label>
                <select name="province" value={formData.province} onChange={handleChange} className={inputClass} required>
                  <option value="">Select province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="NT">Northwest Territories</option>
                  <option value="NU">Nunavut</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="YT">Yukon</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tell us about your organization</label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className={inputClass} required />
            </div>

            <hr className="border-neutral-200" />

            <div>
              <label className={labelClass}>Contact name</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Contact title (optional)</label>
              <input type="text" name="contactTitle" value={formData.contactTitle} onChange={handleChange} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Contact email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Contact phone (optional)</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <hr className="border-neutral-200" />

            <div>
              <label className={labelClass}>What are your primary goals?</label>
              <textarea name="primaryGoals" rows={3} value={formData.primaryGoals} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Why do you want to partner with us?</label>
              <textarea name="partnershipReason" rows={3} value={formData.partnershipReason} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Estimated reach (optional)</label>
              <input type="text" name="estimatedReach" value={formData.estimatedReach} onChange={handleChange} className={inputClass} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationForm
