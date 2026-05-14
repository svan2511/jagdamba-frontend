import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, X, ArrowRight, Star } from 'lucide-react'

const doctor = {
  name: 'Dr. Julianne Voss',
  specialty: 'Cardiology Specialist',
  rating: 4.9,
  reviews: 120,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1S99-aDzWP0BdmXjdKzPPJoaivWlBPTYTG_f2z5enE66fKSFVm1Zhe3FefKBm6VvJuIG7r9Wum4lAWB2amKN0sZxD5Yc_Xbv2Hw2FWzrhhN502iOVXQTSifHeBr_U622V-CUgFUwmKDLtjluJu1BFSkPKObN4UB454WoVX4nr1DRgDe_FrZwLUszc2TOxcjq6fESgNSj0WoD_Anyb_IWdMCIDVFP2TJGFKTXJUgqTDSlgv6fDURDAjLk2tSxv0bnmCr9sdbVq0Sw',
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dates = Array.from({ length: 19 }, (_, i) => i + 1)
const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM']
const afternoonSlots = ['01:00 PM', '02:30 PM', '03:00 PM', '04:00 PM']

export default function Appointment() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(15)
  const [selectedTime, setSelectedTime] = useState('10:00 AM')

  return (
    <main className="pt-32 pb-margin-page px-margin-page max-w-container mx-auto min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_20px_50px_rgba(39,63,43,0.03)] h-20 flex justify-between items-center px-margin-page max-w-container mx-auto left-0 right-0">
        <div className="flex items-center gap-unit">
          <span className="font-h2-header text-h3-sub font-semibold text-primary">MAA JAGDAMBA</span>
        </div>
        <div className="flex items-center gap-gutter">
          <button
            onClick={() => navigate(-1)}
            className="text-on-surface-variant hover:text-secondary transition-colors duration-300 active:scale-95 transition-transform duration-200 flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="font-body-md text-body-md">Cancel Booking</span>
          </button>
        </div>
      </header>

      {/* Booking Header */}
      <div className="mb-stack-lg">
        <h1 className="font-h1-display text-h1-display text-primary mb-unit">Book an Appointment</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Complete the steps below to schedule your consultation with our premium medical specialists.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center mb-stack-lg max-w-3xl">
        {[
          { step: 1, label: 'Select Specialist', active: true },
          { step: 2, label: 'Date & Time', active: true },
          { step: 3, label: 'Patient Details', active: false },
        ].map((item, index) => (
          <div key={item.step} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-data-mono text-data-mono z-10 ${
                item.active ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {item.step}
            </div>
            <span className="font-label-caps text-label-caps text-primary mt-unit">{item.label}</span>
            {index < 2 && (
              <div className={`absolute top-5 left-1/2 w-full h-[2px] ${item.active ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-stack-lg">
          {/* Date Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl ambient-shadow p-stack-md"
          >
            <h2 className="font-h3-sub text-h3-sub text-primary mb-stack-sm flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </h2>

            {/* Calendar Widget */}
            <div className="border border-outline-variant/20 rounded-lg p-unit">
              <div className="flex justify-between items-center mb-unit px-unit">
                <button className="p-unit hover:bg-surface-container-low rounded-full transition-colors">‹</button>
                <span className="font-body-md text-body-md font-semibold">October 2024</span>
                <button className="p-unit hover:bg-surface-container-low rounded-full transition-colors">›</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-unit">
                {days.map((day) => (
                  <span key={day} className="font-label-caps text-label-caps text-on-surface-variant">{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-data-mono text-data-mono">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-full cursor-pointer transition-colors ${
                      date === selectedDate
                        ? 'bg-primary text-on-primary shadow-sm'
                        : date < 10
                        ? 'text-outline'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Time Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl ambient-shadow p-stack-md"
          >
            <h2 className="font-h3-sub text-h3-sub text-primary mb-stack-sm flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Time
            </h2>

            <div className="space-y-stack-sm">
              {/* Morning */}
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-unit flex items-center gap-1">
                  Morning
                </h3>
                <div className="flex flex-wrap gap-unit">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      disabled={slot === '09:30 AM'}
                      className={`px-4 py-2 rounded-full border font-data-mono text-data-mono transition-colors ${
                        slot === selectedTime
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
                          : slot === '09:30 AM'
                          ? 'border-outline-variant text-on-surface opacity-50 cursor-not-allowed'
                          : 'border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-unit mt-stack-sm flex items-center gap-1">
                  Afternoon
                </h3>
                <div className="flex flex-wrap gap-unit">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      disabled={slot === '04:00 PM'}
                      className={`px-4 py-2 rounded-full border font-data-mono text-data-mono transition-colors ${
                        slot === selectedTime
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
                          : slot === '04:00 PM'
                          ? 'border-outline-variant text-on-surface opacity-50 cursor-not-allowed'
                          : 'border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface-container border border-outline-variant/20 rounded-xl p-stack-md sticky top-32"
          >
            <h3 className="font-h3-sub text-h3-sub text-primary mb-stack-md">Booking Summary</h3>

            {/* Selected Doctor Profile Snippet */}
            <div className="flex items-start gap-unit mb-stack-md pb-stack-md border-b border-outline-variant/20">
              <img
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-surface"
                src={doctor.image}
              />
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-primary">{doctor.name}</h4>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">{doctor.specialty}</p>
                <p className="font-data-mono text-data-mono text-secondary mt-1 flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" /> {doctor.rating} ({doctor.reviews} reviews)
                </p>
              </div>
            </div>

            {/* Selected Details */}
            <div className="space-y-stack-sm mb-stack-lg">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  Date
                </span>
                <span className="font-body-md text-body-md font-medium">Oct {selectedDate}, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  Time
                </span>
                <span className="font-body-md text-body-md font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  Location
                </span>
                <span className="font-body-md text-body-md font-medium text-right">
                  Maa Jagdamba Main Clinic
                  <br />
                  <span className="text-sm font-normal text-on-surface-variant">Suite 400</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <button className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-body-md text-body-md py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
              Continue to Details
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="font-label-caps text-label-caps text-center text-on-surface-variant mt-unit mt-4">
              You will not be charged yet.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}