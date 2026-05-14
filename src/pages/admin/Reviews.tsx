import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, ChevronLeft, ChevronRight, MessageSquare, ThumbsUp, CheckCircle, Hourglass, Check, X } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const statuses = ['All Status', 'Published', 'Pending']

interface Review {
  id: number
  patient_name: string
  doctor_name: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  helpful_count: number
}

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllReviews({
        page: currentPage,
        status: selectedStatus !== 'All Status' ? selectedStatus : undefined,
      })

      if (response.success && response.data) {
        const reviewsData = response.data.data || response.data
        const transformed = reviewsData.map((review: any) => ({
          id: review.id,
          patient_name: review.patient?.user?.name || 'Patient',
          doctor_name: review.doctor?.user?.name || 'Doctor',
          rating: review.rating || 0,
          comment: review.comment || '',
          is_approved: review.is_approved !== false,
          created_at: review.created_at || '',
          helpful_count: review.helpful_count || 0,
        }))
        setReviews(transformed)

        const paginationData = response.data
        if (paginationData && typeof paginationData === 'object') {
          setTotalItems(paginationData.total || reviewsData.length)
          setTotalPages(paginationData.last_page || Math.ceil((paginationData.total || reviewsData.length) / itemsPerPage) || 1)
        } else {
          setTotalItems(reviewsData.length)
          setTotalPages(Math.ceil(reviewsData.length / itemsPerPage) || 1)
        }
      } else {
        setReviews([])
        setError(response.message || 'Failed to load reviews')
      }
    } catch {
      setReviews([])
      setError('Failed to load reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedStatus])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchReviews()
  }, [currentPage, selectedStatus, debouncedSearch])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handleApprove = async (id: number) => {
    const result = await Swal.fire({
      title: 'Approve Review',
      html: 'Are you sure you want to publish this review?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return

    try {
      await adminApi.updateReviewStatus(id, 'Published')
      toast.success('Review approved successfully!')
      fetchReviews()
    } catch {
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (id: number) => {
    const result = await Swal.fire({
      title: 'Reject Review',
      html: 'Are you sure you want to reject this review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return

    try {
      await adminApi.updateReviewStatus(id, 'Rejected')
      toast.success('Review rejected successfully!')
      fetchReviews()
    } catch {
      toast.error('Failed to reject review')
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  const getStatusBadge = (is_approved: boolean) => {
    if (is_approved) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" /> Published
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
        <Hourglass className="w-3 h-3" /> Pending
      </span>
    )
  }

  // Filter locally for search (since API doesn't have text search)
  const filteredReviews = reviews.filter(review =>
    review.patient_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    review.comment.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    review.doctor_name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Reviews Management</h1>
          <p className="text-gray-500 text-sm">View all patient reviews (Read-only)</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: totalItems.toLocaleString() || '0', icon: MessageSquare, color: 'bg-[#3e5641]' },
          { label: 'Published', value: reviews.filter(r => r.is_approved).length.toString() || '0', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Pending', value: reviews.filter(r => !r.is_approved).length.toString() || '0', icon: Hourglass, color: 'bg-yellow-500' },
          { label: 'Helpful', value: reviews.reduce((a, b) => a + b.helpful_count, 0).toString() || '0', icon: ThumbsUp, color: 'bg-[#d36135]' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500 block">{stat.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20" />
          </div>
          <div className="flex gap-3">
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      {loading ? (
        <FullPageLoader message="Loading reviews..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchReviews} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Try Again</button>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">
              {debouncedSearch || selectedStatus !== 'All Status' ? 'No reviews match your filters.' : 'No reviews yet.'}
            </p>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50/50"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-[#3e5641]">{review.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{review.patient_name}</span>
                        <span className="text-sm text-gray-500 block">for {review.doctor_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      {getStatusBadge(review.is_approved)}
                      {!review.is_approved && (
                        <div className="flex items-center gap-2 ml-2">
                          <button onClick={() => handleApprove(review.id)} className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReject(review.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.helpful_count} found helpful</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalItems > 0 && filteredReviews.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} reviews</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}