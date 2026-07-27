import { useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'
const labelClass = 'block text-sm font-medium text-neutral-700'

type FormData = {
  applicantType: string
  organizationName: string
  organizationType: string
  region: string
  website: string
  mission: string
  representativeName: string
  representativeTitle: string
  representativePhone: string
  representativeEmail: string
  primaryGoals: string
  partnershipReason: string
  estimatedReach: string
}

const initialFormData: FormData = {
  applicantType: '',
  organizationName: '',
  organizationType: '',
  region: '',
  website: '',
  mission: '',
  representativeName: '',
  representativeTitle: '',
  representativePhone: '',
  representativeEmail: '',
  primaryGoals: '',
  partnershipReason: '',
  estimatedReach: '',
}

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('Form data:', formData)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c9932e]">
            Partner Application
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            Join the Next Level Dads network
          </h1>
          <p className="mt-2 text-neutral-600">
            Tell us about your organization and how you'd like to partner with us.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>
                Are you applying as an individual or an organization?
              </label>
              <select
                name="applicantType"
                value={formData.applicantType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select one</option>
                <option value="individual">Individual</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Organization name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Organization type</label>
              <input
                type="text"
                name="organizationType"
                placeholder="e.g. Community Group, Wellness, Education"
                value={formData.organizationType}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Website (optional)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Mission statement</label>
              <textarea
                name="mission"
                rows={3}
                value={formData.mission}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <hr className="border-neutral-200" />

            <div>
              <label className={labelClass}>Representative name</label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Title (optional)</label>
                <input
                  type="text"
                  name="representativeTitle"
                  value={formData.representativeTitle}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input
                  type="tel"
                  name="representativePhone"
                  value={formData.representativePhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="representativeEmail"
                value={formData.representativeEmail}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <hr className="border-neutral-200" />

            <div>
              <label className={labelClass}>Primary goals</label>
              <textarea
                name="primaryGoals"
                rows={3}
                value={formData.primaryGoals}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Why do you want to partner with us?</label>
              <textarea
                name="partnershipReason"
                rows={3}
                value={formData.partnershipReason}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Estimated reach (optional)</label>
              <input
                type="text"
                name="estimatedReach"
                value={formData.estimatedReach}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800"
            >
              Submit application
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
