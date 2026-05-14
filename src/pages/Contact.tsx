import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, MapPin, Mail, Phone, ArrowRight } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <main className="flex-grow pt-32 pb-stack-lg px-margin-page max-w-container mx-auto w-full">
      {/* Page Header */}
      <div className="mb-stack-lg text-center max-w-3xl mx-auto">
        <h1 className="font-h1-display text-h1-display text-primary mb-unit">Get in Touch</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          We are here to assist you with precision medical care and unparalleled support. Please reach out to the appropriate department.
        </p>
      </div>

      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-start">
        {/* Left Column: Details & Map */}
        <div className="flex flex-col gap-stack-md">
          {/* Prominent Emergency Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-error-container/20 border border-error/30 rounded-xl p-stack-md flex items-start gap-gutter shadow-sm"
          >
            <AlertCircle className="text-error text-4xl" />
            <div>
              <h2 className="font-h3-sub text-h3-sub text-error-container mb-1">24/7 Emergency Services</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-unit">
                For immediate medical assistance, please contact our emergency response unit directly.
              </p>
              <div className="font-data-mono text-data-mono text-error font-bold text-lg flex items-center">
                <Phone className="w-4 h-4 mr-1" /> 08954660008
              </div>
            </div>
          </motion.div>

          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md shadow-[0_10px_40px_rgba(39,63,43,0.02)]"
          >
            <h3 className="font-label-caps text-label-caps text-primary-fixed-variant mb-stack-sm uppercase tracking-widest">
              Clinic Location
            </h3>
            <div className="flex items-start gap-unit mb-stack-sm">
              <MapPin className="text-primary-container mt-1 w-5 h-5" />
              <div>
                <p className="font-body-md text-body-md text-on-surface font-medium">Maa Jagdamba Super Speciality</p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  WGVV+55F, Vasant Vihar<br />
                  Saharanpur, Uttar Pradesh 247001
                </p>
              </div>
            </div>
            <div className="w-full h-px bg-outline-variant/20 my-stack-sm"></div>
            <h3 className="font-label-caps text-label-caps text-primary-fixed-variant mb-stack-sm uppercase tracking-widest">
              General Inquiries
            </h3>
            <div className="flex flex-col gap-unit">
              <div className="flex items-center gap-unit">
                <Mail className="text-primary-container w-5 h-5" />
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="mailto:info@maajagdamba.com">
                  info@maajagdamba.com
                </a>
              </div>
              <div className="flex items-center gap-unit">
                <Phone className="text-primary-container w-5 h-5" />
                <span className="font-data-mono text-data-mono text-on-surface-variant">+91 8954660008</span>
              </div>
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden h-64 relative shadow-sm"
          >
            <div className="w-full h-full bg-surface-variant flex items-center justify-center">
              <span className="text-on-surface-variant">Map View - Saharanpur</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-outline-variant/20 flex items-center gap-2">
                <MapPin className="text-primary w-4 h-4" />
                <span className="font-label-caps text-label-caps text-primary">View on Maps</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-margin-page shadow-[0_20px_60px_rgba(39,63,43,0.04)] relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

          <h2 className="font-h2-header text-h2-header text-primary mb-2 relative z-10">Send us a Message</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md relative z-10">
            Our patient relations team aims to respond to all inquiries within 24 hours.
          </p>

          <form className="flex flex-col gap-gutter relative z-10" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed transition-all shadow-sm"
                id="name"
                placeholder="e.g. Jane Doe"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed transition-all shadow-sm"
                id="email"
                placeholder="jane@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="department">
                Department
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed transition-all shadow-sm"
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option disabled value="">
                    Select a department...
                  </option>
                  <option value="general">General Inquiry</option>
                  <option value="appointments">Appointments & Scheduling</option>
                  <option value="billing">Billing & Insurance</option>
                  <option value="feedback">Patient Feedback</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-outline">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed transition-all shadow-sm resize-none"
                id="message"
                placeholder="How can we help you today?"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button
              className="mt-unit bg-primary text-on-primary font-h3-sub text-body-lg py-4 rounded-lg hover:bg-primary-container transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group"
              type="submit"
            >
              Submit Inquiry
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-on-surface-variant/70 text-center mt-2 font-body-md">
              By submitting this form, you agree to our privacy practices.
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  )
}