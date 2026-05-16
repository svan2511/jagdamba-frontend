import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Star, Briefcase, CalendarDays, Clock, ArrowLeft, User, Phone, Mail, MapPin } from 'lucide-react'
import { doctorsApi, type DoctorsResponse } from '../api/doctors'
import type { RootState } from '../store'
import toast from 'react-hot-toast'

const specialtyColors: Record<string, { bg: string; text: string }> = {
  Cardiology: { bg: '#fce7e9', text: '#be123c' },
  Neurology: { bg: '#ede9fe', text: '#6d28d9' },
  Orthopedics: { bg: '#fef3c7', text: '#b45309' },
  Pediatrics: { bg: '#fce7f3', text: '#db2777' },
  Dermatology: { bg: '#d1fae5', text: '#047857' },
  'General Medicine': { bg: '#dbeafe', text: '#1d4ed8' },
  Ophthalmology: { bg: '#e0f2fe', text: '#0369a1' },
  Gastroenterology: { bg: '#ffedd5', text: '#c2410c' },
}

export default function DoctorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [doctor, setDoctor] = useState<DoctorsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDoctor()
  }, [id])

  const fetchDoctor = async () => {
    try {
      setLoading(true)
      const doctorId = id ? parseInt(id) : 0
      const response = await doctorsApi.getDoctor(doctorId)

      if (response.success) {
        setDoctor(response.data)
      } else {
        setError('Doctor not found')
      }
    } catch (err: any) {
      console.error(err)
      setError('Failed to load doctor details')
    } finally {
      setLoading(false)
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    return specialtyColors[specialty] || { bg: '#f3f4f6', text: '#6b7280' }
  }

  const handleBookClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment')
      navigate('/login?redirect=/doctors/' + id)
      return
    }
    if (user?.role !== 'patient') {
      toast.error('Only patients can book appointments')
      return
    }
    navigate('/patient/appointments')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Doctor not found</h2>
        <p className="text-gray-500 mb-4">{error || 'The doctor you are looking for does not exist'}</p>
        <button
          onClick={() => navigate('/doctors')}
          className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          Back to Doctors
        </button>
      </div>
    )
  }

  const specColor = getSpecialtyColor(doctor.specialty)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Doctors</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="relative">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden bg-[#e9ddff] flex items-center justify-center">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl md:text-6xl font-bold text-[#4f378a]">
                        {doctor.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    )}
                  </div>
                  {doctor.is_available && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full whitespace-nowrap">
                      Available
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctor.user.name}</h1>
                  <p className="text-gray-600 font-medium mb-3">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500 mb-4">{doctor.qualification || 'MD'} • {doctor.experience_years} years experience</p>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-semibold text-amber-700">
                        {doctor.average_rating > 0 ? doctor.average_rating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-sm text-amber-600">rating</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{doctor.experience_years} years</span>
                    </div>
                  </div>

                  <span
                    className="inline-block px-3 py-1.5 text-sm font-medium rounded-full"
                    style={{ backgroundColor: specColor.bg, color: specColor.text }}
                  >
                    {doctor.specialty}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* About Section */}
            {doctor.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              </motion.div>
            )}

            {/* Schedule Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Available Days</p>
                    <p className="text-gray-600">{doctor.available_days?.join(', ') || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Consultation Time</p>
                    <p className="text-gray-600">{doctor.start_time} - {doctor.end_time}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <span>{doctor.user.email}</span>
                </div>
                {doctor.user.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-500" />
                    </div>
                    <span>{doctor.user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </div>
                  <span>Maa Jagdamba Super Speciality Hospital</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Book Appointment</h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Consultation Fee</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{doctor.consultation_fee}</p>
                <p className="text-sm text-gray-500 mt-1">Per consultation</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="font-medium text-gray-900">Available Days</p>
                    <p className="text-sm text-gray-500">{doctor.available_days?.join(', ') || 'Mon-Fri'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="font-medium text-gray-900">Timing</p>
                    <p className="text-sm text-gray-500">{doctor.start_time} - {doctor.end_time}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookClick}
                disabled={!doctor.is_available}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  doctor.is_available
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {doctor.is_available ? 'Book Appointment' : 'Not Available'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                {isAuthenticated && user?.role === 'patient'
                  ? 'Click to book your appointment'
                  : 'Login as patient to book appointments'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}