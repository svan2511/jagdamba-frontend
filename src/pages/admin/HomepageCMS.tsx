import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Phone, Mail, MapPin, Clock, Eye, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'

const sections = [
  { id: 1, name: 'Hero Section', status: 'Active', lastUpdated: '2024-10-10' },
  { id: 2, name: 'About Section', status: 'Active', lastUpdated: '2024-10-08' },
  { id: 3, name: 'Services Section', status: 'Active', lastUpdated: '2024-10-05' },
  { id: 4, name: 'Doctors Section', status: 'Active', lastUpdated: '2024-09-28' },
  { id: 5, name: 'Testimonials', status: 'Inactive', lastUpdated: '2024-09-15' },
  { id: 6, name: 'Contact Section', status: 'Active', lastUpdated: '2024-10-12' },
]

const heroContent = {
  title: 'Your Health, Our Priority',
  subtitle: 'Advanced healthcare with compassionate care at Maa Jagdamba Super Speciality Hospital',
  ctaText: 'Book Appointment',
  ctaLink: '/appointment',
  emergencyText: 'Emergency: 08954660008',
}

const aboutContent = {
  heading: 'About Maa Jagdamba Hospital',
  description: 'Maa Jagdamba Super Speciality Hospital is a leading healthcare provider in Saharanpur, committed to delivering world-class medical services with a patient-centric approach. Our state-of-the-art facilities and expert medical professionals ensure the highest quality of care.',
  features: [
    '24/7 Emergency Services',
    'Advanced Diagnostic Facilities',
    'Expert Medical Professionals',
    'Patient-Centric Care',
  ],
}

const contactContent = {
  address: 'WGVV+55F, Vasant Vihar, Saharanpur, Uttar Pradesh 247001',
  phone: '08954660008',
  email: 'info@maajagdambahospital.com',
  hours: 'Open 24/7',
}

export default function HomepageCMS() {
  const [activeTab, setActiveTab] = useState('sections')
  const [heroData, setHeroData] = useState(heroContent)
  const [aboutData, setAboutData] = useState(aboutContent)
  const [contactData, setContactData] = useState(contactContent)
  const [sectionStatus, setSectionStatus] = useState(sections)

  const toggleSectionStatus = (id: number) => {
    setSectionStatus(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Homepage CMS</h1>
          <p className="text-gray-500 text-sm">Manage homepage content and sections</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 border border-gray-100 shadow-sm inline-flex">
        {['sections', 'hero', 'about', 'contact'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#3e5641] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Sections Overview */}
      {activeTab === 'sections' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Page Sections</h3>
            <p className="text-sm text-gray-500">Enable or disable sections on the homepage</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Section</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Last Updated</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectionStatus.map((section) => (
                <tr key={section.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-800">{section.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleSectionStatus(section.id)}
                      className="flex items-center gap-2"
                    >
                      {section.status === 'Active' ? (
                        <ToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        section.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {section.status}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{section.lastUpdated}</td>
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-1">
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Hero Section Editor */}
      {activeTab === 'hero' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Hero Section Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                  <input
                    type="text"
                    value={heroData.ctaLink}
                    onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Number</label>
                <input
                  type="text"
                  value={heroData.emergencyText}
                  onChange={(e) => setHeroData({ ...heroData, emergencyText: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="bg-gradient-to-r from-[#3e5641] to-[#2d4030] rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{heroData.title}</h2>
            <p className="text-white/80 mb-4">{heroData.subtitle}</p>
            <button className="px-6 py-2.5 bg-[#d36135] rounded-lg font-medium">{heroData.ctaText}</button>
            <p className="mt-4 text-sm text-white/70">{heroData.emergencyText}</p>
          </div>
        </motion.div>
      )}

      {/* About Section Editor */}
      {activeTab === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">About Section Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input
                  type="text"
                  value={aboutData.heading}
                  onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                <textarea
                  value={aboutData.features.join('\n')}
                  onChange={(e) => setAboutData({ ...aboutData, features: e.target.value.split('\n') })}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact Section Editor */}
      {activeTab === 'contact' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Contact Section Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={contactData.hours}
                    onChange={(e) => setContactData({ ...contactData, hours: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}