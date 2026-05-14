import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, CalendarDays, Star, User } from 'lucide-react'
import { doctorsApi } from '../api/doctors'

interface Doctor {
  id: number
  specialty: string
  qualification?: string
  experience_years: number
  bio?: string
  image?: string
  consultation_fee: number
  available_days: string[]
  start_time: string
  end_time: string
  is_available: boolean
  is_verified: boolean
  average_rating: number
  created_at?: string
  user: {
    id: number
    name: string
    email: string
    phone?: string
  }
}

const specialties = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'General Medicine',
]

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorsApi.getDoctors()
      if (response.success) {
        setDoctors(response.data)
      }
    } catch (err) {
      setError('Failed to load doctors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter doctors by search and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialties.length === 0 ||
      selectedSpecialties.includes(doctor.specialty)
    return matchesSearch && matchesSpecialty
  })

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  return (
    <main className="max-w-container mx-auto px-margin-page py-stack-lg pt-24">
      {/* Header Section */}
      <div className="mb-stack-lg">
        <h1 className="font-h1-display text-h1-display text-primary mb-unit">Find a Specialist</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Connect with our world-class medical professionals. Search by specialty, condition, or doctor's name to begin your journey to serenity.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-margin-page">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-stack-md">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-container transition-all text-body-md text-on-surface placeholder:text-outline outline-none"
              placeholder="Search by name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Groups */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-gutter shadow-[0_10px_40px_rgba(39,63,43,0.02)]">
            <div className="mb-stack-md border-b border-outline-variant/20 pb-stack-md">
              <h3 className="font-label-caps text-label-caps text-primary mb-stack-sm">Specialty</h3>
              <div className="space-y-unit">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                      className="rounded text-primary focus:ring-primary-container border-outline-variant bg-surface-container-low w-4 h-4 transition-colors"
                      type="checkbox"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-stack-md border-b border-outline-variant/20 pb-stack-md">
              <h3 className="font-label-caps text-label-caps text-primary mb-stack-sm">Availability</h3>
              <div className="space-y-unit">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="rounded text-primary focus:ring-primary-container border-outline-variant bg-surface-container-low w-4 h-4 transition-colors"
                    type="checkbox"
                  />
                  <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                    Available Today
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="rounded text-primary focus:ring-primary-container border-outline-variant bg-surface-container-low w-4 h-4 transition-colors"
                    type="checkbox"
                  />
                  <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                    Accepting New Patients
                  </span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid Layout */}
        <div className="flex-1">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-on-surface-variant">No doctors found matching your criteria.</p>
            </div>
          )}

          {/* Doctors Grid */}
          {!loading && !error && filteredDoctors.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-gutter">
                <p className="font-body-md text-on-surface-variant">
                  Showing <span className="font-semibold text-primary">{filteredDoctors.length}</span> Specialists
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-stack-md flex flex-col items-center text-center shadow-[0_10px_40px_rgba(39,63,43,0.02)] hover:shadow-[0_20px_50px_rgba(39,63,43,0.05)] transition-shadow duration-300 group"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-stack-sm border-4 border-surface-container-low relative">
                      {doctor.image ? (
                        <img
                          alt={doctor.user.name}
                          className="w-full h-full object-cover"
                          src={doctor.image}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-container flex items-center justify-center">
                          <User className="w-12 h-12 text-primary" />
                        </div>
                      )}
                      {doctor.is_available && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <span className={`inline-block px-3 py-1 rounded-full font-label-caps text-[10px] mb-2 ${
                      doctor.specialty === 'Cardiology' ? 'bg-primary-fixed/30 text-primary-fixed-variant' :
                      doctor.specialty === 'Neurology' ? 'bg-secondary-fixed/30 text-secondary' :
                      doctor.specialty === 'Orthopedics' ? 'bg-tertiary-fixed/30 text-tertiary' :
                      doctor.specialty === 'Pediatrics' ? 'bg-primary-container/30 text-on-primary-container' :
                      'bg-surface-container text-on-surface-variant'
                    }`}>
                      {doctor.specialty}
                    </span>

                    <h3 className="font-h3-sub text-h3-sub text-primary mb-1 group-hover:text-secondary transition-colors">
                      {doctor.user.name}
                    </h3>
                    <p className="font-data-mono text-data-mono text-on-surface-variant mb-4">
                      {doctor.qualification || 'MD'} • {doctor.experience_years} Yrs Exp
                    </p>

                    {/* Rating */}
                    {doctor.average_rating > 0 && (
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-body-sm text-on-surface">{doctor.average_rating.toFixed(1)}</span>
                      </div>
                    )}

                    <div className="w-full grid grid-cols-2 gap-unit mb-stack-md text-left bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10">
                      <div>
                        <p className="font-label-caps text-[10px] text-outline mb-1">Fee</p>
                        <p className="font-data-mono text-[13px] text-primary flex items-center gap-1">
                          ₹{doctor.consultation_fee}
                        </p>
                      </div>
                      <div>
                        <p className="font-label-caps text-[10px] text-outline mb-1">Available</p>
                        <p className="font-data-mono text-[13px] text-primary flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> {doctor.available_days?.slice(0, 2).join(', ') || 'Mon-Fri'}
                        </p>
                      </div>
                    </div>

                    {doctor.is_available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        className="w-full py-3 bg-gradient-to-r from-primary-container to-[#2d4030] text-on-primary rounded-lg font-body-md font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                      >
                        Book Appointment
                      </Link>
                    ) : (
                      <button className="w-full py-3 bg-surface-container-low text-primary border border-outline-variant/30 rounded-lg font-body-md font-medium hover:bg-surface-container-high transition-all duration-300">
                        View Profile
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}