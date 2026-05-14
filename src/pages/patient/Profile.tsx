import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { User, Phone, Mail, Calendar, MapPin, Shield, Edit2, Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { patientApi, type PatientProfileResponse } from '../../api/patient'
import { setUser } from '../../store/slices/authSlice'
import { type RootState, type AppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import FullPageLoader from '../../components/FullPageLoader'

type PatientProfile = PatientProfileResponse & {
  medical_history?: string
  allergies?: string
}

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [patientInfo, setPatientInfo] = useState<PatientProfile | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await patientApi.getProfile()
      if (response.success) {
        setPatientInfo(response.data)
        setImagePreview(response.data.image || null)
      }
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

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
    if (!patientInfo) return

    try {
      setSaving(true)
      setError('')

      // Use FormData for image upload
      const formData = new FormData()
      formData.append('name', patientInfo.user.name)
      formData.append('phone', patientInfo.user.phone || '')
      formData.append('date_of_birth', patientInfo.date_of_birth || '')
      formData.append('gender', patientInfo.gender || '')
      formData.append('blood_type', patientInfo.blood_type || '')
      formData.append('address', patientInfo.address || '')
      formData.append('emergency_contact_name', patientInfo.emergency_contact_name || '')
      formData.append('emergency_contact_phone', patientInfo.emergency_contact_phone || '')
      formData.append('emergency_contact_relation', patientInfo.emergency_contact_relation || '')
      formData.append('medical_history', patientInfo.medical_history || '')
      formData.append('allergies', patientInfo.allergies || '')

      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await patientApi.updateProfileWithImage(formData)

      if (response.success) {
        setIsEditing(false)
        setSaved(true)
        setSelectedImage(null)

        // Update Redux state with new profile image
        if (response.data?.image) {
          dispatch(setUser({
            ...user,
            name: patientInfo.user.name,
            phone: patientInfo.user.phone,
            patient: {
              ...user?.patient,
              image: response.data.image,
            }
          }))
        }

        setPatientInfo(response.data)
        setImagePreview(response.data.image || null)

        toast.success('Profile updated successfully!')
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(response.message || 'Failed to save profile')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setPatientInfo({
      ...patientInfo!,
      user: {
        ...patientInfo!.user,
        name: patientInfo!.user.name,
        phone: patientInfo!.user.phone,
      }
    })
    setSelectedImage(null)
    setImagePreview(patientInfo?.image || null)
    setIsEditing(false)
  }

  function getInitials(name: string) {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return <FullPageLoader message="Loading profile..." />
  }

  if (!patientInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-on-background">My Profile</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your personal information</p>
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
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
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

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200"
        >
          {error}
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-xl border border-green-200 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Profile updated successfully!
        </motion.div>
      )}

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
                  <span className="text-5xl font-bold text-white/80">{getInitials(patientInfo.user?.name || '')}</span>
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
                  value={patientInfo.user.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, user: { ...patientInfo.user, name: e.target.value } })}
                  className="text-3xl font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 outline-none text-white w-full text-center md:text-left placeholder-white/50"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white">{patientInfo.user?.name}</h2>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                  <User className="w-4 h-4 text-white/80" />
                  <span className="text-sm text-white/90">Patient ID: P-{patientInfo.id.toString().padStart(5, '0')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-xl border border-green-400/30">
                  <span className="text-sm font-medium text-white">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Personal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-background">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Email</span>
                  <p className="text-on-background font-medium mt-1 truncate">{patientInfo.user?.email}</p>
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
                      value={patientInfo.user.phone || ''}
                      onChange={(e) => setPatientInfo({ ...patientInfo, user: { ...patientInfo.user, phone: e.target.value } })}
                      placeholder="Add phone number"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1">{patientInfo.user?.phone || 'Not added'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Date of Birth</span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={patientInfo.date_of_birth || ''}
                      onChange={(e) => setPatientInfo({ ...patientInfo, date_of_birth: e.target.value })}
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1">{patientInfo.date_of_birth || 'Not set'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Gender</span>
                  {isEditing ? (
                    <select
                      value={patientInfo.gender || ''}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-on-background font-medium mt-1 capitalize">{patientInfo.gender || 'Not set'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container/30 rounded-xl md:col-span-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Address</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientInfo.address || ''}
                      onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                      placeholder="Enter your address"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    />
                  ) : (
                    <p className="text-on-background font-medium mt-1">{patientInfo.address || 'Not set'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Blood Type</span>
                  {isEditing ? (
                    <select
                      value={patientInfo.blood_type || ''}
                      onChange={(e) => setPatientInfo({ ...patientInfo, blood_type: e.target.value })}
                      className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <p className="text-on-background font-medium mt-1">{patientInfo.blood_type || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medical Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-on-background">Medical Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 rounded-xl">
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Medical History</span>
                {isEditing ? (
                  <textarea
                    value={patientInfo.medical_history || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, medical_history: e.target.value })}
                    placeholder="Enter any past medical conditions, surgeries, etc."
                    className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-2 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-on-background font-medium mt-2">{patientInfo.medical_history || 'Not set'}</p>
                )}
              </div>

              <div className="p-4 bg-red-50 rounded-xl">
                <span className="text-xs font-medium text-red-700 uppercase tracking-wide">Allergies</span>
                {isEditing ? (
                  <textarea
                    value={patientInfo.allergies || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, allergies: e.target.value })}
                    placeholder="Enter any known allergies (medications, food, etc.)"
                    className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-2 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-on-background font-medium mt-2">{patientInfo.allergies || 'Not set'}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Emergency Contact */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-on-background">Emergency Contact</h3>
                <p className="text-xs text-on-surface-variant">For medical emergencies</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={patientInfo.emergency_contact_name || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, emergency_contact_name: e.target.value })}
                    placeholder="Contact name"
                    className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                  />
                ) : (
                  <p className="text-on-background font-medium mt-1">{patientInfo.emergency_contact_name || 'Not set'}</p>
                )}
              </div>

              <div>
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Relation</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={patientInfo.emergency_contact_relation || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, emergency_contact_relation: e.target.value })}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                  />
                ) : (
                  <p className="text-on-background font-medium mt-1">{patientInfo.emergency_contact_relation || 'Not set'}</p>
                )}
              </div>

              <div>
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Phone</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={patientInfo.emergency_contact_phone || ''}
                    onChange={(e) => setPatientInfo({ ...patientInfo, emergency_contact_phone: e.target.value })}
                    placeholder="Contact phone number"
                    className="w-full bg-white px-3 py-2 rounded-lg border border-outline/30 outline-none focus:border-primary mt-1"
                  />
                ) : (
                  <p className="text-on-background font-medium mt-1">{patientInfo.emergency_contact_phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}