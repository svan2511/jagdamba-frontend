import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { User, Mail, Phone, Award, Star, Edit2, GraduationCap, Save, Camera, DollarSign, Calendar, FileText, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { doctorsApi } from '../../api/doctors'
import { getErrorMessage } from '../../api/client'
import { type RootState, type AppDispatch } from '../../store'
import { setUser } from '../../store/slices/authSlice'
import FullPageLoader from '../../components/FullPageLoader'

interface ScheduleDay {
  day: string
  day_key: string
  start_time: string
  end_time: string
  slot_duration: number
  break_start: string | null
  break_end: string | null
}

export default function DoctorProfile() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleDay[]>([])
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience_years: 0,
    bio: '',
    consultation_fee: 0,
    image: '',
    average_rating: 0,
  })

  const [formData, setFormData] = useState({ ...profileData })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await doctorsApi.getDoctorProfile()
      if (response.success && response.data) {
        const doctor = response.data
        const userData = doctor.user || user

        setProfileData({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          specialty: doctor.specialty || '',
          qualification: doctor.qualification || '',
          experience_years: doctor.experience_years || 0,
          bio: doctor.bio || '',
          consultation_fee: doctor.consultation_fee || 0,
          image: doctor.image || '',
          average_rating: doctor.average_rating || 0,
        })

        setFormData({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          specialty: doctor.specialty || '',
          qualification: doctor.qualification || '',
          experience_years: doctor.experience_years || 0,
          bio: doctor.bio || '',
          consultation_fee: doctor.consultation_fee || 0,
          image: doctor.image || '',
          average_rating: doctor.average_rating || 0,
        })

        setSchedule([])
        setImagePreview(doctor.image || null)
      }
    } catch (error) {
      toast.error('Failed to load profile')
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone || '')
      submitData.append('specialty', formData.specialty)
      submitData.append('qualification', formData.qualification)
      submitData.append('experience_years', String(formData.experience_years))
      submitData.append('bio', formData.bio)
      submitData.append('consultation_fee', String(formData.consultation_fee))
      if (selectedImage) {
        submitData.append('image', selectedImage)
      }

      const response = await doctorsApi.updateDoctorProfile(submitData)
      if (response.success) {
        toast.success('Profile updated successfully')
        setProfileData(formData)
        setSelectedImage(null)
        setIsEditing(false)

        // Update image preview immediately with the new image
        const newImage = response.data?.doctor?.image || response.data?.image || null
        if (newImage) {
          setImagePreview(newImage)
        }

        // Update Redux state with new profile image
        if (newImage) {
          dispatch(setUser({
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            doctor: {
              ...user?.doctor,
              image: newImage,
            }
          }))
        }

        fetchProfile()
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profileData)
    setSelectedImage(null)
    setImagePreview(profileData.image || null)
    setIsEditing(false)
  }

  function formatTime(time: string): string {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return <FullPageLoader message="Loading profile..." />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-on-background">My Profile</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your professional information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl font-medium hover:bg-surface-container-high/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Profile Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white/10,transparent_50%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/30">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-white/80">{getInitials(profileData.name || 'U')}</span>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-3 -right-3 w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-3xl font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 outline-none text-white w-full text-center md:text-left placeholder-white/50"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white">{profileData.name}</h2>
              )}

              {isEditing ? (
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="text-lg bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 outline-none text-white/90 w-full mt-3 text-center md:text-left"
                />
              ) : (
                <p className="text-lg text-white/90 font-medium mt-2">{profileData.specialty}</p>
              )}

              {isEditing ? (
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="Qualification / Degree"
                  className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 outline-none text-white/80 w-full mt-2 text-center md:text-left"
                />
              ) : (
                <p className="text-sm text-white/70 mt-1">{profileData.qualification}</p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-white">{profileData.average_rating.toFixed(1)}</span>
                  <span className="text-xs text-white/70">Rating</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                  <Award className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-white">{profileData.experience_years}</span>
                  <span className="text-xs text-white/70">Years</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/30 backdrop-blur-sm rounded-xl border border-green-400/30">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="font-bold text-white">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-on-background">{schedule.length}</p>
          <p className="text-sm text-on-surface-variant mt-1">Available Days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-on-background">${profileData.consultation_fee}</p>
          <p className="text-sm text-on-surface-variant mt-1">Consultation Fee</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-on-background">{profileData.average_rating.toFixed(1)}</p>
          <p className="text-sm text-on-surface-variant mt-1">Average Rating</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-on-background">{profileData.experience_years}</p>
          <p className="text-sm text-on-surface-variant mt-1">Years Experience</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Professional */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-background">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1 truncate">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Phone</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Add phone number"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1">{profileData.phone || 'Not added'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-background">Professional Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Qualification</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., MD, PhD, Fellowship"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1">{profileData.qualification || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Experience</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleInputChange}
                        min="0"
                        className="w-24 bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary"
                      />
                      <span className="text-on-surface-variant">years</span>
                    </div>
                  ) : (
                    <p className="text-on-background font-medium mt-1">{profileData.experience_years} Years</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Consultation Fee</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-on-surface-variant">$</span>
                      <input
                        type="number"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleInputChange}
                        min="0"
                        className="w-24 bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary"
                      />
                      <span className="text-on-surface-variant">per visit</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-primary mt-1">${profileData.consultation_fee}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-background">About Me</h3>
            </div>

            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-surface-container/30 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 resize-none text-on-background"
                placeholder="Tell patients about yourself, your experience, and your approach to healthcare..."
              />
            ) : (
              <p className="text-on-surface-variant leading-relaxed">
                {profileData.bio || 'No bio added yet. Add a bio to help patients get to know you better.'}
              </p>
            )}
          </motion.div>
        </div>

        {/* Right Column - Schedule */}
        <div className="space-y-6">
          {/* Schedule Card - Read Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-on-background">Schedule</h3>
                <p className="text-xs text-on-surface-variant">Set by Admin</p>
              </div>
            </div>

            {/* Available Days with Timing */}
            <div>
              <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Available Days</span>
              <div className="space-y-3 mt-3">
                {schedule.length > 0 ? (
                  schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-green-200/50 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-on-background">{item.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-on-background font-medium">
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant text-sm py-4 text-center">No schedule configured</p>
                )}
              </div>
            </div>

            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/50">
              <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
                To modify schedule, please submit a Schedule Request from the Schedule section.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}