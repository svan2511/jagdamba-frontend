import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/admin'
import ScheduleConfig from '../../components/ui/ScheduleConfig'
import type { DaySchedule } from '../../components/ui/ScheduleConfig'

const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Gynecology', 'Urology', 'Oncology', 'Radiology']
const specialties = {
  'Cardiology': ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure', 'Preventive Cardiology'],
  'Neurology': ['Neurophysiology', 'Neuro Surgery', 'Pediatric Neurology', 'Stroke Management'],
  'Orthopedics': ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Trauma'],
  'Pediatrics': ['General Pediatrics', 'Neonatology', 'Pediatric Surgery', 'Pediatric ICU'],
  'Dermatology': ['Cosmetic Dermatology', 'Pediatric Dermatology', 'Laser Surgery'],
}

export default function AddDoctor() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    specialty: '',
    qualification: '',
    experience: '',
    designation: '',
    licenseNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    consultationFee: '',
    about: '',
  })

  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 'monday', label: 'Monday', isActive: true, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '13:00', breakEnd: '14:00' },
    { day: 'tuesday', label: 'Tuesday', isActive: true, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '13:00', breakEnd: '14:00' },
    { day: 'wednesday', label: 'Wednesday', isActive: true, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '13:00', breakEnd: '14:00' },
    { day: 'thursday', label: 'Thursday', isActive: true, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '13:00', breakEnd: '14:00' },
    { day: 'friday', label: 'Friday', isActive: true, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '13:00', breakEnd: '14:00' },
    { day: 'saturday', label: 'Saturday', isActive: false, startTime: '09:00', endTime: '14:00', slotDuration: 30, breakStart: '', breakEnd: '' },
    { day: 'sunday', label: 'Sunday', isActive: false, startTime: '09:00', endTime: '14:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least one working day is active
    const activeDays = schedules.filter(s => s.isActive)
    if (activeDays.length === 0) {
      toast.error('Please configure at least one working day')
      return
    }

    // Validate time ranges
    for (const schedule of activeDays) {
      if (schedule.startTime >= schedule.endTime) {
        toast.error(`${schedule.label}: End time must be after start time`)
        return
      }
      if (schedule.breakStart && schedule.breakEnd) {
        if (schedule.breakStart >= schedule.breakEnd) {
          toast.error(`${schedule.label}: Break end time must be after break start time`)
          return
        }
      }
    }

    try {
      setSaving(true)

      // Prepare base schedule data
      const doctorData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: 'Doctor@123',
        specialty: formData.department,
        qualification: formData.qualification,
        experience_years: parseInt(formData.experience) || 0,
        designation: formData.designation,
        bio: formData.about,
        consultation_fee: parseInt(formData.consultationFee) || 0,
        is_available: true,
      }

      const response = await adminApi.createDoctor(doctorData)

      if (response.success && response.data) {
        // Now save the schedule for this doctor
        const schedulePayload = activeDays.map(s => ({
          day_of_week: s.day,
          start_time: s.startTime,
          end_time: s.endTime,
          slot_duration: s.slotDuration,
          break_start: s.breakStart || undefined,
          break_end: s.breakEnd || undefined,
          is_active: true,
        }))

        await adminApi.saveDoctorSchedule({
          doctor_id: response.data.id,
          schedules: schedulePayload,
        })

        toast.success('Doctor added with schedule successfully!')
        navigate('/admin/doctors')
      } else {
        toast.error(response.message || 'Failed to add doctor')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add doctor'
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/doctors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Add New Doctor</h1>
          <p className="text-gray-500 text-sm">Fill in the doctor details and schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
          </div>
        </motion.div>

        {/* Professional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                disabled={!formData.department}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641] disabled:bg-gray-50"
              >
                <option value="">Select Specialty</option>
                {formData.department && specialties[formData.department as keyof typeof specialties]?.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Consultant"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
              <input
                type="text"
                name="qualification"
                required
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD, DM"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
          </div>
        </motion.div>

        {/* Practice Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Practice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (Rs.)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
              />
            </div>
          </div>
        </motion.div>

        {/* Schedule Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Schedule</h3>
          <ScheduleConfig schedules={schedules} onChange={setSchedules} />
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">About</h3>
          <textarea
            name="about"
            rows={4}
            value={formData.about}
            onChange={handleChange}
            placeholder="Write about the doctor's experience and expertise..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
          />
        </motion.div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/doctors')}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3e5641] text-white rounded-lg text-sm font-medium hover:bg-[#2d4030] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Doctor'}
          </button>
        </div>
      </form>
    </div>
  )
}