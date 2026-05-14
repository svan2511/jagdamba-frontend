import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit2, Mail, Phone, Calendar, Clock, Stethoscope, Award, Users, Loader2, Coffee } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi, type DoctorResponse } from '../../api/admin'

interface BaseSchedule {
  id: number
  day_of_week: string
  start_time: string
  end_time: string
  slot_duration: number
  break_start: string | null
  break_end: string | null
  is_active: boolean
}

interface DoctorScheduleData {
  id: number
  base_schedules: BaseSchedule[]
  is_available: boolean
}

export default function ViewDoctor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [doctor, setDoctor] = useState<DoctorResponse | null>(null)
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorScheduleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await adminApi.getDoctor(parseInt(id))

        if (response.success && response.data) {
          setDoctor(response.data)

          // Fetch doctor's schedules
          const schedulesResponse = await adminApi.getDoctorSchedules()
          if (schedulesResponse.success && schedulesResponse.data) {
            const schedulesData = Array.isArray(schedulesResponse.data)
              ? schedulesResponse.data.find((d: any) => d.id === parseInt(id))
              : null
            if (schedulesData) {
              setDoctorSchedules(schedulesData as DoctorScheduleData)
            }
          }
        } else {
          toast.error('Doctor not found')
          navigate('/admin/doctors')
        }
      } catch (err) {
        console.error('Failed to fetch doctor:', err)
        toast.error('Failed to load doctor details')
        navigate('/admin/doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!doctor) {
    return null
  }

  const name = doctor.user?.name || 'Doctor'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const status = (doctor.is_available && doctor.user?.is_active !== false) ? 'Active' : 'Inactive'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/doctors')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#273f2b]">Doctor Details</h1>
            <p className="text-gray-500 text-sm">View doctor information</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/doctors/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#3e5641] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">{initials}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-500 text-sm">{doctor.specialty || 'Doctor'}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{doctor.user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{doctor.user?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Joined: {doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3e5641]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#3e5641]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">0</span>
                  <span className="text-sm text-gray-500 block">Patients</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">★</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">{doctor.average_rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm text-gray-500 block">Rating</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#d36135]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">{doctor.experience_years || 0} yrs</span>
                  <span className="text-sm text-gray-500 block">Experience</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Specialty</span>
                  <span className="font-medium text-gray-800">{doctor.specialty || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Qualification</span>
                  <span className="font-medium text-gray-800">{doctor.qualification || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Consultation Fee</span>
                  <span className="font-medium text-gray-800">₹{doctor.consultation_fee || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Verified</span>
                  <span className="font-medium text-gray-800">{doctor.is_verified ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Availability - Detailed Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Schedule</h3>

            {doctorSchedules?.base_schedules && doctorSchedules.base_schedules.length > 0 ? (
              <div className="space-y-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                  const schedule = doctorSchedules.base_schedules.find((s: BaseSchedule) => s.day_of_week === day)
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1, 3)

                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        schedule?.is_active
                          ? 'bg-green-50 border-green-100'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-12 text-center py-1 rounded-lg text-sm font-medium ${
                          schedule?.is_active
                            ? 'bg-[#3e5641] text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {dayName}
                        </span>
                        {schedule?.is_active ? (
                          <span className="text-sm text-gray-700">
                            {schedule.start_time} - {schedule.end_time}
                            <span className="text-gray-400 ml-2">({schedule.slot_duration} min slots)</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not available</span>
                        )}
                      </div>
                      {schedule?.is_active && schedule.break_start && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Coffee className="w-4 h-4" />
                          <span className="text-xs">{schedule.break_start} - {schedule.break_end}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3 mb-4">
                  {Array.isArray(doctor.available_days) && doctor.available_days.length > 0
                    ? doctor.available_days.map((day: string) => (
                      <span key={day} className="px-4 py-2 bg-[#3e5641]/10 text-[#3e5641] rounded-lg text-sm font-medium">
                        {day}
                      </span>
                    ))
                    : (
                      <span className="text-gray-500">No schedule configured</span>
                    )}
                </div>
                {doctor.start_time && doctor.end_time && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{doctor.start_time} - {doctor.end_time}</span>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio || 'No bio available'}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}