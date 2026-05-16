import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Phone,
  Bell,
  Menu,
  X,
  Globe,
  Share2,
  Tv,
  MapPin,
  Mail,
  ArrowRight,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { contactApi } from '../api/contact'
import toast from 'react-hot-toast'


export default function Contact() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await contactApi.submitContact(formData)

      if (response.success) {
        setIsSubmitted(true)
        toast.success('Thank you for contacting us! We will get back to you soon.')
      } else {
        toast.error(response.message || 'Failed to submit. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


const handleAboutClick = (value: string) => {
  navigate('/', {
    state: { scrollTo: value },
  });
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      message: '',
    })
    setIsSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-[#fdf7ff]">
      {/* Header - Same as Homepage */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdf7ff]/90 backdrop-blur-md border-b border-[#cbc4d2]/30 shadow-sm">
        <nav className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-[#4f378a]">Maa Jagdamba SSH</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-[#4f378a] font-bold border-b-2 border-[#4f378a] pb-1">Home</a>
           
            <a href="/about" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">About</a>
             <button
              onClick={() => handleAboutClick('services')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Departments
            </button>
            <a href="/doctors" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Doctors</a>

             <button
              onClick={() => handleAboutClick('reviews')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Reviews
            </button>

            <button
              onClick={() => handleAboutClick('blog')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Blog
            </button>
            <a href="/contact" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Contact</a>
            <button onClick={() => navigate('/login')} className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Login</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[#ba1a1a] font-bold px-4 py-2 border-2 border-[#ba1a1a] rounded-lg hover:bg-[#ba1a1a]/5 transition-all cursor-pointer">
              <Phone className="w-4 h-4" />
              <span>Emergency Call</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-[#e9ddff]/50 transition-colors">
                <Bell className="w-5 h-5 text-[#494551]" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#e9ddff]/50 transition-colors lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#494551]" /> : <Menu className="w-5 h-5 text-[#494551]" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fdf7ff] border-b border-[#cbc4d2]/30 px-6 py-4 space-y-2">
            <a href="/" className="block text-[#4f378a] font-bold py-2">Home</a>
            <a href="/about" className="block text-[#494551] py-2">About</a>
            <a href="/departments" className="block text-[#494551] py-2">Departments</a>
            <a href="/doctors" className="block text-[#494551] py-2">Doctors</a>
            <a href="/#reviews" className="block text-[#494551] py-2">Reviews</a>
            <a href="/#blog" className="block text-[#494551] py-2">Blog</a>
            <a href="/contact" className="block text-[#494551] py-2">Contact</a>
            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className="block text-[#494551] py-2">Login</button>
          </div>
        )}
      </header>

      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6750A4]/90 to-[#4f378a]/70"></div>
          <img
            alt="Contact Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=600&fit=crop"
          />
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white space-y-4"
            >
              <span className="inline-block px-4 py-2 bg-[#c9a74d] text-[#241a00] rounded-full text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
              <h1 className="text-5xl md:text-6xl font-extrabold">Contact Us</h1>
              <p className="text-lg text-white/90 max-w-xl">We are here to assist you with precision medical care and unparalleled support. Please reach out to us.</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="max-w-[1440px] mx-auto px-6 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Emergency Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#ba1a1a] text-white p-8 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">24/7 Emergency</h3>
                    <p className="text-white/80 text-sm">Immediate assistance</p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold">08954660008</p>
              </motion.div>

              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-[#cbc4d2]/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#e9ddff] rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-[#4f378a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1d1b20]">Hospital Location</h3>
                    <p className="text-[#494551] text-sm">Visit us today</p>
                  </div>
                </div>
                <p className="text-[#494551]">
                  WGVV+55F, Vasant Vihar,<br />
                  Saharanpur, Uttar Pradesh 247001
                </p>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-[#cbc4d2]/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#e9ddff] rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-[#4f378a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1d1b20]">Email Us</h3>
                    <p className="text-[#494551] text-sm">We respond within 24 hours</p>
                  </div>
                </div>
                <a href="mailto:info@maajagdamba.com" className="text-[#4f378a] font-semibold hover:underline">
                  info@maajagdamba.com
                </a>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-[#cbc4d2]/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#e9ddff] rounded-xl flex items-center justify-center">
                    <Phone className="w-7 h-7 text-[#4f378a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1d1b20]">Phone</h3>
                    <p className="text-[#494551] text-sm">Mon-Sat: 9AM - 6PM</p>
                  </div>
                </div>
                <p className="text-[#1d1b20] font-semibold">+91 8954660008</p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-[#cbc4d2]/30 overflow-hidden"
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 px-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Message Sent!</h2>
                  <p className="text-[#494551] text-center max-w-md mb-8">
                    Thank you for reaching out. Our patient relations team will respond to your inquiry within 24 hours.
                  </p>
                  <button
                    onClick={resetForm}
                    className="bg-[#4f378a] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#4f378a]/90 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="p-8 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#4f378a] mb-2">Send us a Message</h2>
                    <p className="text-[#494551]">Fill out the form below and we'll get back to you shortly.</p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#1d1b20] mb-2">
                          Full Name <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          className="w-full px-4 py-3 bg-[#f8f2fa] border border-[#cbc4d2]/50 rounded-xl focus:bg-white focus:border-[#4f378a] focus:outline-none transition-all"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1d1b20] mb-2">
                          Email Address <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 bg-[#f8f2fa] border border-[#cbc4d2]/50 rounded-xl focus:bg-white focus:border-[#4f378a] focus:outline-none transition-all"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#1d1b20] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 bg-[#f8f2fa] border border-[#cbc4d2]/50 rounded-xl focus:bg-white focus:border-[#4f378a] focus:outline-none transition-all"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1d1b20] mb-2">
                          Department
                        </label>
                        <select
                          name="department"
                          className="w-full px-4 py-3 bg-[#f8f2fa] border border-[#cbc4d2]/50 rounded-xl focus:bg-white focus:border-[#4f378a] focus:outline-none transition-all appearance-none"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select a department...</option>
                          <option value="general">General Inquiry</option>
                          <option value="appointments">Appointments & Scheduling</option>
                          <option value="billing">Billing & Insurance</option>
                          <option value="feedback">Patient Feedback</option>
                          <option value="complaint">Complaint</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1d1b20] mb-2">
                        Message <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <textarea
                        name="message"
                        placeholder="How can we help you today?"
                        rows={6}
                        className="w-full px-4 py-3 bg-[#f8f2fa] border border-[#cbc4d2]/50 rounded-xl focus:bg-white focus:border-[#4f378a] focus:outline-none transition-all resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#4f378a] text-white py-4 rounded-xl text-lg font-semibold hover:bg-[#4f378a]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-[#494551] text-center">
                      By submitting this form, you agree to our privacy practices.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Full Width Map Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 -mx-6 lg:-mx-12"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-[#cbc4d2]/30 overflow-hidden">
            <div className="p-6 border-b border-[#cbc4d2]/30">
              <h3 className="text-xl font-bold text-[#4f378a]">Find Us on Map</h3>
              <p className="text-sm text-[#494551]">Visit Maa Jagdamba Super Speciality Hospital</p>
            </div>
            <div className="h-[400px]">
              <iframe
                title="Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3479.123456789!2d77.54!3d29.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU4JzE0LjAiTiA3N8KwMzInMjQuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer - Same as Homepage */}
      <footer className="bg-[#e6e0e9] py-16 border-t border-[#cbc4d2]/30">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="font-black text-xl text-[#4f378a] mb-4">Maa Jagdamba Super Speciality</div>
              <p className="text-sm text-[#494551] mb-6">A premier medical institution dedicated to high-end surgical procedures and specialized patient care. Accredited by world-leading healthcare bodies.</p>
              <div className="flex gap-4">
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </span>
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Tv className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Quick Links</h4>
              <ul className="space-y-2">
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="/about">About the Hospital</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="/doctors">Our Doctors</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="/gallery">Gallery</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="/emergency">Emergency Services</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="/contact">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Contact Details</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">WGVV+55F, Vasant Vihar,<br />Saharanpur, Uttar Pradesh 247001</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">08954660008</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">info@maajagdamba.com</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-[#cbc4d2]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#494551]">© 2024 Maa Jagdamba Super Speciality Hospital. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-[#494551]">
              <a className="hover:text-[#4f378a]" href="#">Privacy Policy</a>
              <a className="hover:text-[#4f378a]" href="#">Terms of Service</a>
              <a className="hover:text-[#4f378a]" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}