import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle, MessageSquare, Send, Loader2, X } from 'lucide-react'
import { appointmentsApi, type Appointment } from '../../api/appointments'
import { reviewsApi } from '../../api/reviews'
import toast from 'react-hot-toast'
import FullPageLoader from '../../components/FullPageLoader'

interface ReviewableAppointment extends Appointment {
  has_reviewed?: boolean
}

export default function MyReviews() {
  const [appointments, setAppointments] = useState<ReviewableAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<ReviewableAppointment | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await appointmentsApi.getMyAppointments()
      if (response.success && response.data) {
        setAppointments(response.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

  const handleOpenReview = (appointment: ReviewableAppointment) => {
    setSelectedAppointment(appointment)
    setRating(0)
    setComment('')
    setShowModal(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedAppointment || rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      const response = await reviewsApi.submitReview({
        doctor_id: selectedAppointment.doctor?.id || 0,
        appointment_id: selectedAppointment.id,
        rating,
        comment,
      })

      if (response.success) {
        toast.success('Review submitted successfully! It will be visible after approval.')
        setShowModal(false)
        // Mark as reviewed locally
        setAppointments(prev => prev.map(apt =>
          apt.id === selectedAppointment.id ? { ...apt, has_reviewed: true } : apt
        ))
      } else {
        toast.error(response.message || 'Failed to submit review')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (interactive = false, currentRating = 0) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`w-8 h-8 ${
              star <= (interactive ? rating : currentRating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )

  if (loading) {
    return <FullPageLoader message="Loading your appointments..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Share your experience after your appointments</p>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-emerald-800">How it works</h3>
          <p className="text-sm text-emerald-700 mt-1">
            After your appointment is completed, you can rate your doctor and share your experience.
            Your review will be visible after admin approval.
          </p>
        </div>
      </div>

      {/* Completed Appointments */}
      {completedAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-2">No Completed Appointments</h3>
          <p className="text-slate-500 text-sm">You don't have any completed appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">
                    Dr. {apt.doctor?.user?.name || 'Doctor'}
                  </h3>
                  <p className="text-slate-500 text-sm">{apt.doctor?.specialty || 'Specialist'}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {apt.has_reviewed ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Reviewed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenReview(apt)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Review
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Write a Review</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-500">Reviewing</p>
              <p className="font-semibold text-slate-800">
                Dr. {selectedAppointment.doctor?.user?.name || 'Doctor'}
              </p>
              <p className="text-sm text-slate-500">{selectedAppointment.doctor?.specialty}</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                How was your experience?
              </label>
              <div className="flex justify-center">
                {renderStars(true)}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-slate-500 mt-2">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your feedback (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this doctor..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{comment.length}/1000</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}