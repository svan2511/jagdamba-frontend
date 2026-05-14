import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, X, ArrowRight, ArrowLeft, User, CheckCircle, Loader2, AlertCircle, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { doctorsApi } from '../../api/doctors'
import { appointmentsApi } from '../../api/appointments'
import type { TimeSlot } from '../../api/types'

interface Doctor {
  id: number
  specialty: string
  qualification?: string
  experience_years: number
  image?: string | null
  consultation_fee: number
  available_days: string[] | null
  start_time: string
  end_time: string
  is_available: boolean
  user: {
    id: number
    name: string
  }
}

// Generate next 30 days for date selection
const generateDateOptions = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }
  return dates
}

const dateOptions = generateDateOptions()

// Format time for display
const formatTimeDisplay = (time24: string): string => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [booking, setBooking] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [validatingSlot, setValidatingSlot] = useState(false)

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].date)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [slotsMessage, setSlotsMessage] = useState<string>('')
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telehealth'>('in-person')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const fetchDoctors = useCallback(async () => {
    try {
      setLoadingDoctors(true)
      const response = await doctorsApi.getDoctors()
      if (response.success && response.data) {
        // Filter to only show available doctors
        const availableDoctors = response.data.filter((d: Doctor) => d.is_available)
        setDoctors(availableDoctors)
      }
    } catch (err) {
      console.error('Failed to load doctors:', err)
      toast.error('Failed to load doctors')
    } finally {
      setLoadingDoctors(false)
    }
  }, [])

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDoctor || !selectedDate) return

    try {
      setLoadingSlots(true)
      setError('')
      setAvailableSlots([])
      setSelectedTime('')

      const response = await appointmentsApi.getAvailableSlots(selectedDoctor.id, selectedDate)

      if (response.success && response.data) {
        setAvailableSlots(response.data.slots || [])
        setSlotsMessage(response.data.message || '')

        if (!response.data.has_schedule) {
          setError(response.data.message || 'Doctor not available on this day')
        } else if (response.data.slots?.length === 0) {
          setError(response.data.message || 'No available slots for this date')
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch slots:', err)
      setError(err.response?.data?.message || 'Failed to load time slots')
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [selectedDoctor, selectedDate])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  useEffect(() => {
    if (step === 2 && selectedDoctor) {
      fetchAvailableSlots()
    }
  }, [step, selectedDoctor, selectedDate, fetchAvailableSlots])

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select all required fields')
      return
    }

    try {
      setBooking(true)
      setError('')

      // Validate slot one more time before booking
      setValidatingSlot(true)
      const validationResponse = await appointmentsApi.validateSlot(
        selectedDoctor.id,
        selectedDate,
        selectedTime
      )
      setValidatingSlot(false)

      if (!validationResponse.success || !validationResponse.data?.valid) {
        toast.error(validationResponse.data?.message || 'This slot is no longer available')
        // Refresh slots
        await fetchAvailableSlots()
        setSelectedTime('')
        return
      }

      // Book the appointment
      const response = await appointmentsApi.bookAppointment({
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        type: appointmentType,
        reason: reason,
      })

      if (response.success) {
        toast.success('Appointment booked successfully!')
        setStep(4)
      } else {
        toast.error(response.message || 'Failed to book appointment')
        if (response.error_code === 'SLOT_JUST_BOOKED' || response.error_code === 'ALREADY_BOOKED') {
          await fetchAvailableSlots()
          setSelectedTime('')
        }
      }
    } catch (err: any) {
      console.error('Booking failed:', err)
      const errorMessage = err.response?.data?.message || 'Failed to book appointment'
      toast.error(errorMessage)
      setError(errorMessage)

      if (err.response?.data?.error_code === 'SLOT_JUST_BOOKED') {
        await fetchAvailableSlots()
        setSelectedTime('')
      }
    } finally {
      setBooking(false)
      setValidatingSlot(false)
    }
  }

  const handleBackToDashboard = () => {
    navigate('/patient/appointments')
  }

  // Group slots by morning/afternoon
  const groupedSlots = useMemo(() => {
    const morning: TimeSlot[] = []
    const afternoon: TimeSlot[] = []

    availableSlots.forEach((slot) => {
      const hour = parseInt(slot.start.split(':')[0])
      if (hour < 12) {
        morning.push(slot)
      } else {
        afternoon.push(slot)
      }
    })

    return { morning, afternoon }
  }, [availableSlots])

  // Get selected date info
  const selectedDateInfo = useMemo(() => {
    return dateOptions.find((d) => d.date === selectedDate) || dateOptions[0]
  }, [selectedDate])

  // Step 4: Confirmation
  if (step === 4) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container rounded-xl p-8 text-center border border-outline-variant/30"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-headline-md text-headline-md text-on-background mb-2">Appointment Requested!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Your appointment request has been submitted. The doctor will confirm shortly.
          </p>

          <div className="bg-surface-container-lowest rounded-lg p-6 text-left max-w-md mx-auto mb-6 border border-outline-variant/30">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Doctor</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDoctor?.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Specialty</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDoctor?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Date</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDateInfo.fullDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Time</span>
                <span className="font-body-md text-body-md text-on-background">{formatTimeDisplay(selectedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Type</span>
                <span className="font-body-md text-body-md text-on-background">
                  {appointmentType === 'telehealth' ? 'Telehealth' : 'In-Person'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Status</span>
                <span className="font-body-md text-body-md text-yellow-600">Pending Confirmation</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBackToDashboard}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors"
          >
            View My Appointments
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
          )}
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Book Appointment</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Complete the steps below to schedule your consultation.
            </p>
          </div>
        </div>
        <button
          onClick={handleBackToDashboard}
          className="p-2 hover:bg-surface-container rounded-lg transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5 text-on-surface-variant" />
          <span className="font-body-md text-body-md text-on-surface-variant">Cancel</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 border border-red-200"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-body-sm text-body-sm">{error}</span>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { step: 1, label: 'Select Doctor', active: step >= 1 },
          { step: 2, label: 'Date & Time', active: step >= 2 },
          { step: 3, label: 'Confirm', active: step >= 3 },
        ].map((item, index) => (
          <div key={item.step} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md ${
                item.active ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {item.step}
            </div>
            <span className={`font-label-md text-label-md ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}>
              {item.label}
            </span>
            {index < 2 && <div className={`flex-1 h-0.5 ${step > item.step ? 'bg-primary' : 'bg-surface-container'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container rounded-xl p-6 border border-outline-variant/30"
        >
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Select a Doctor</h3>

          {loadingDoctors ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-on-surface-variant font-body-md">No doctors currently available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-primary bg-primary-container/20'
                      : 'border-outline-variant hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-container/30 flex items-center justify-center">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.user?.name || 'Doctor'}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="text-primary w-7 h-7" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-label-md text-on-background truncate">
                        {doctor.user?.name || 'Doctor'}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body-sm text-body-sm text-primary">₹{doctor.consultation_fee}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          • {doctor.experience_years} yrs
                        </span>
                      </div>
                    </div>
                    {selectedDoctor?.id === doctor.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-on-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => selectedDoctor && setStep(2)}
            disabled={!selectedDoctor}
            className="w-full mt-6 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Date Selection */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Select Date
            </h3>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                  {dateOptions.slice(0, 14).map((dateOpt) => (
                    <button
                      key={dateOpt.date}
                      onClick={() => setSelectedDate(dateOpt.date)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all min-w-[60px] ${
                        selectedDate === dateOpt.date
                          ? 'border-primary bg-primary-container/20 text-primary'
                          : 'border-outline-variant hover:border-primary/50 text-on-surface'
                      }`}
                    >
                      <span className="font-label-caps text-label-caps text-xs">{dateOpt.day}</span>
                      <span className="font-headline-sm text-headline-sm">{dateOpt.dayNum}</span>
                      <span className="font-body-xs text-body-xs text-on-surface-variant">{dateOpt.month}</span>
                      {dateOpt.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-on-surface-variant">
              Selected: <span className="text-on-background font-medium">{selectedDateInfo.fullDate}</span>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Select Time
            </h3>

            {loadingSlots ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-50" />
                <p className="text-on-surface-variant font-body-md">
                  {slotsMessage || 'No available slots for this date'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupedSlots.morning.length > 0 && (
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Morning
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupedSlots.morning.map((slot) => (
                        <button
                          key={slot.start}
                          onClick={() => setSelectedTime(slot.start)}
                          className={`px-4 py-2.5 rounded-full border font-data-mono text-data-mono transition-all ${
                            selectedTime === slot.start
                              ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
                              : 'border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low'
                          }`}
                        >
                          {formatTimeDisplay(slot.start)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedSlots.afternoon.length > 0 && (
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-2 mt-4">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Afternoon
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupedSlots.afternoon.map((slot) => (
                        <button
                          key={slot.start}
                          onClick={() => setSelectedTime(slot.start)}
                          className={`px-4 py-2.5 rounded-full border font-data-mono text-data-mono transition-all ${
                            selectedTime === slot.start
                              ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
                              : 'border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low'
                          }`}
                        >
                          {formatTimeDisplay(slot.start)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-outline-variant/30">
                  <p className="text-sm text-on-surface-variant">
                    {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => selectedTime && setStep(3)}
            disabled={!selectedTime}
            className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 3: Confirm Details */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Appointment Type */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Appointment Type</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setAppointmentType('in-person')}
                className={`flex-1 p-4 rounded-lg border font-label-md text-label-md transition-all ${
                  appointmentType === 'in-person'
                    ? 'border-primary bg-primary-container/20 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <Calendar className="w-5 h-5 mx-auto mb-2" /> In-Person
              </button>
              <button
                onClick={() => setAppointmentType('telehealth')}
                className={`flex-1 p-4 rounded-lg border font-label-md text-label-md transition-all ${
                  appointmentType === 'telehealth'
                    ? 'border-primary bg-primary-container/20 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Telehealth
              </button>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Reason for Visit</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              className="w-full p-4 bg-surface-container-lowest rounded-lg border border-outline-variant focus:border-primary outline-none font-body-md text-body-md resize-none h-24"
            />
          </div>

          {/* Summary */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Doctor</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDoctor?.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Specialty</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDoctor?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Date</span>
                <span className="font-body-md text-body-md text-on-background">{selectedDateInfo.fullDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Time</span>
                <span className="font-body-md text-body-md text-on-background">{formatTimeDisplay(selectedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Type</span>
                <span className="font-body-md text-body-md text-on-background">
                  {appointmentType === 'telehealth' ? 'Telehealth' : 'In-Person'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Consultation Fee</span>
                <span className="font-body-md text-body-md text-primary">₹{selectedDoctor?.consultation_fee}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={booking || validatingSlot}
            className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {booking || validatingSlot ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {validatingSlot ? 'Validating...' : 'Booking...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Confirm Booking
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}