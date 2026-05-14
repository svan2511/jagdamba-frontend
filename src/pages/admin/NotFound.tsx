import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#3e5641] to-[#2d4030] rounded-full flex items-center justify-center">
            <span className="text-7xl font-bold text-white">404</span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-[#273f2b] mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Search Icon decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <Search className="w-12 h-12 text-gray-300" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { to: '/admin/doctors', label: 'Doctors' },
              { to: '/admin/patients', label: 'Patients' },
              { to: '/admin/appointments', label: 'Appointments' },
              { to: '/admin/reviews', label: 'Reviews' },
              { to: '/admin/gallery', label: 'Gallery' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm text-gray-600 hover:text-[#3e5641] hover:border-[#3e5641] transition-colors shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}