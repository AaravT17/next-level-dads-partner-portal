import { useEffect, useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'
const labelClass = 'block text-sm font-medium text-neutral-700'
const phoneSelectClass =
  'rounded-lg border border-neutral-300 px-2 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'
const phoneNumberClass =
  'flex-1 min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'

// Not an exhaustive list of every country code — covers common regions.
// A proper long-term fix would use a phone-number library (e.g. libphonenumber-js).
const countryCodes = [
  { code: '+1', label: 'US/Canada (+1)' },
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+31', label: 'Netherlands (+31)' },
  { code: '+46', label: 'Sweden (+46)' },
  { code: '+47', label: 'Norway (+47)' },
  { code: '+45', label: 'Denmark (+45)' },
  { code: '+41', label: 'Switzerland (+41)' },
  { code: '+43', label: 'Austria (+43)' },
  { code: '+351', label: 'Portugal (+351)' },
  { code: '+30', label: 'Greece (+30)' },
  { code: '+353', label: 'Ireland (+353)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+82', label: 'South Korea (+82)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+66', label: 'Thailand (+66)' },
  { code: '+63', label: 'Philippines (+63)' },
  { code: '+84', label: 'Vietnam (+84)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+64', label: 'New Zealand (+64)' },
  { code: '+27', label: 'South Africa (+27)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+254', label: 'Kenya (+254)' },
  { code: '+20', label: 'Egypt (+20)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+54', label: 'Argentina (+54)' },
  { code: '+56', label: 'Chile (+56)' },
  { code: '+57', label: 'Colombia (+57)' },
  { code: '+51', label: 'Peru (+51)' },
]

type PhoneFieldProps = {
  label: string
  countryCodeName: string
  countryCodeValue: string
  numberName: string
  numberValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
}

function PhoneField({
  label,
  countryCodeName,
  countryCodeValue,
  numberName,
  numberValue,
  onChange,
  required,
}: PhoneFieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="mt-1 flex gap-2">
        <select name={countryCodeName} value={countryCodeValue} onChange={onChange} className={phoneSelectClass}>
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name={numberName}
          inputMode="numeric"
          pattern="[0-9]{4,14}"
          title="Enter 4 to 14 digits, numbers only"
          value={numberValue}
          onChange={onChange}
          className={phoneNumberClass}
          required={required}
        />
      </div>
    </div>
  )
}

type FormData = {
  name: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  city: string
  province: string
  website: string
  description: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhoneCountryCode: string
  contactPhoneNumber: string
  primaryGoals: string
  partnershipReason: string
  targetAudience: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phoneCountryCode: '+1',
  phoneNumber: '',
  city: '',
  province: '',
  website: '',
  description: '',
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhoneCountryCode: '+1',
  contactPhoneNumber: '',
  primaryGoals: '',
  partnershipReason: '',
  targetAudience: '',
}

type Props = {
  accessToken: string
  onSubmitted: () => void
}

function ApplicationForm({ accessToken, onSubmitted }: Props) {
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
      phone: formData.phoneNumber ? `${formData.phoneCountryCode} ${formData.phoneNumber}` : '',
      city: formData.city,
      province: formData.province,
      website: formData.website,
      description: formData.description,
      contact_name: formData.contactName,
      contact_title: formData.contactTitle,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhoneNumber
        ? `${formData.contactPhoneCountryCode} ${formData.contactPhoneNumber}`
        : '',
      application_answers: {
        primary_goals: formData.primaryGoals,
        partnership_reason: formData.partnershipReason,
        target_audience: formData.targetAudience,
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
              <PhoneField
                label="Organization phone (optional)"
                countryCodeName="phoneCountryCode"
                countryCodeValue={formData.phoneCountryCode}
                numberName="phoneNumber"
                numberValue={formData.phoneNumber}
                onChange={handleChange}
              />
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
              <PhoneField
                label="Contact phone (optional)"
                countryCodeName="contactPhoneCountryCode"
                countryCodeValue={formData.contactPhoneCountryCode}
                numberName="contactPhoneNumber"
                numberValue={formData.contactPhoneNumber}
                onChange={handleChange}
              />
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
              <label className={labelClass}>Target audience (optional)</label>
              <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} className={inputClass} />
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
