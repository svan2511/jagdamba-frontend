import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Star, X, ArrowLeft,
  Grid3X3, List, SlidersHorizontal, Check
} from 'lucide-react'
import { doctorsApi, type DoctorsResponse } from '../api/doctors'
import FullPageLoader from '../components/FullPageLoader'

interface Doctor extends DoctorsResponse {}

const specialties = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'General Medicine', 'Ophthalmology', 'Gastroenterology'
]

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

export default function Doctors() {
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [filtering, setFiltering] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [minExperience, setMinExperience] = useState<number>(0)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<string>('all')

  // View
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [gridView, setGridView] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorsApi.getDoctors()
      if (response.success) {
        setDoctors(response.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Search handler with loading state
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim() !== '') {
      setSearching(true)
      setTimeout(() => setSearching(false), 300)
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = searchTerm === '' ||
        doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSpecialty = selectedSpecialties.length === 0 ||
        selectedSpecialties.includes(doctor.specialty)

      const matchesRating = doctor.average_rating >= minRating
      const matchesExperience = doctor.experience_years >= minExperience
      const matchesAvailability = !availableOnly || doctor.is_available

      let matchesPrice = true
      if (priceRange === 'under500') matchesPrice = doctor.consultation_fee < 500
      else if (priceRange === '500to1000') matchesPrice = doctor.consultation_fee >= 500 && doctor.consultation_fee <= 1000
      else if (priceRange === '1000to2000') matchesPrice = doctor.consultation_fee > 1000 && doctor.consultation_fee <= 2000
      else if (priceRange === 'over2000') matchesPrice = doctor.consultation_fee > 2000

      return matchesSearch && matchesSpecialty && matchesRating && matchesExperience && matchesAvailability && matchesPrice
    })
  }, [doctors, searchTerm, selectedSpecialties, minRating, minExperience, availableOnly, priceRange])

  const toggleSpecialty = (specialty: string) => {
    setFiltering(true)
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
    setTimeout(() => setFiltering(false), 200)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedSpecialties([])
    setMinRating(0)
    setMinExperience(0)
    setAvailableOnly(false)
    setPriceRange('all')
  }

  const activeFilters = selectedSpecialties.length + (minRating > 0 ? 1 : 0) + (minExperience > 0 ? 1 : 0) + (availableOnly ? 1 : 0) + (priceRange !== 'all' ? 1 : 0)

  const getSpecialtyColor = (specialty: string) => {
    return specialtyColors[specialty] || { bg: '#f3f4f6', text: '#6b7280' }
  }

  const showSearching = searching && searchTerm.trim() !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-center"
              placeholder="Search doctors by name, specialty..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilters > 0 && (
              <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs font-medium rounded">{activeFilters}</span>
            )}
          </button>
        </div>
      </div>

      {/* Full Page Loading when searching or loading */}
      {showSearching && <FullPageLoader message="Searching doctors..." />}
      {!showSearching && loading && <FullPageLoader message="Loading doctors..." />}

      {!showSearching && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  {activeFilters > 0 && (
                    <button onClick={clearAllFilters} className="text-sky-600 text-sm hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-5">
                  {/* Specialty Filter */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Specialty</h3>
                    <div className="space-y-2">
                      {specialties.map((specialty) => (
                        <div
                          key={specialty}
                          onClick={() => toggleSpecialty(specialty)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedSpecialties.includes(specialty) ? 'bg-sky-600 border-sky-600' : 'border-gray-300 group-hover:border-sky-400'}`}>
                            {selectedSpecialties.includes(specialty) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2].map((rating) => (
                        <div
                          key={rating}
                          onClick={() => { setFiltering(true); setMinRating(minRating === rating ? 0 : rating); setTimeout(() => setFiltering(false), 200) }}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${minRating === rating ? 'border-amber-500' : 'border-gray-300 group-hover:border-amber-400'}`}>
                            {minRating === rating && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-sm text-gray-500">& above</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Experience</h3>
                    <select
                      value={minExperience}
                      onChange={(e) => { setFiltering(true); setMinExperience(Number(e.target.value)); setTimeout(() => setFiltering(false), 200) }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                    >
                      <option value={0}>Any Experience</option>
                      <option value={5}>5+ Years</option>
                      <option value={10}>10+ Years</option>
                      <option value={15}>15+ Years</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Price</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Prices' },
                        { value: 'under500', label: 'Under ₹500' },
                        { value: '500to1000', label: '₹500 - ₹1000' },
                        { value: '1000to2000', label: '₹1000 - ₹2000' },
                        { value: 'over2000', label: '₹2000 & Above' },
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => { setFiltering(true); setPriceRange(option.value); setTimeout(() => setFiltering(false), 200) }}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${priceRange === option.value ? 'border-sky-600' : 'border-gray-300 group-hover:border-sky-400'}`}>
                            {priceRange === option.value && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="pt-2 border-t border-gray-100">
                    <div
                      onClick={() => { setFiltering(true); setAvailableOnly(!availableOnly); setTimeout(() => setFiltering(false), 200) }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className={`w-11 h-6 rounded-full transition-colors ${availableOnly ? 'bg-sky-600' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {/* Loading when filtering */}
              {filtering && <FullPageLoader message="Applying filters..." />}

              {/* Results Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctors found
                </p>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setGridView(true)}
                    className={`p-2 rounded-md transition-colors ${gridView ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridView(false)}
                    className={`p-2 rounded-md transition-colors ${!gridView ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* No Results */}
              {filteredDoctors.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">No doctors found</h3>
                  <p className="text-gray-500 mb-6">Try changing or removing some filters</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Doctor Grid */}
              {filteredDoctors.length > 0 && (
                <div className={gridView ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                  {filteredDoctors.map((doctor, index) => {
                    const specColor = getSpecialtyColor(doctor.specialty)

                    return (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group ${!gridView ? 'flex items-center gap-4 p-4' : ''}`}
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                      >
                        {!gridView ? (
                          <div className="flex w-full gap-4">
                            <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#e9ddff] flex items-center justify-center">
                              {doctor.image ? (
                                <img src={doctor.image} alt={doctor.user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl font-bold text-[#4f378a]">
                                  {doctor.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              )}
                              {doctor.is_available && (
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">Available</span>
                              )}
                            </div>
                            <div className="flex-1 py-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{doctor.user.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{doctor.specialty} • {doctor.experience_years} yrs</p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {doctor.average_rating > 0 ? doctor.average_rating.toFixed(1) : 'New'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">₹{doctor.consultation_fee}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate('/patient/appointments') }}
                                  disabled={!doctor.is_available}
                                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${doctor.is_available ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                  {doctor.is_available ? 'Book Now' : 'Unavailable'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#e9ddff] flex items-center justify-center mb-4">
                              {doctor.image ? (
                                <img src={doctor.image} alt={doctor.user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-4xl font-bold text-[#4f378a]">
                                  {doctor.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              )}
                              {doctor.is_available && (
                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">Available</span>
                              )}
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-sky-600 transition-colors">{doctor.user.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{doctor.specialty} • {doctor.experience_years} yrs exp</p>

                            <div className="flex items-center gap-2 mb-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                {doctor.average_rating > 0 ? doctor.average_rating.toFixed(1) : 'New'}
                              </span>
                              <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: specColor.bg, color: specColor.text }}>
                                {doctor.specialty.split(' ')[0]}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div>
                                <span className="text-xs text-gray-500">Consultation</span>
                                <p className="text-xl font-bold text-gray-900">₹{doctor.consultation_fee}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate('/patient/appointments') }}
                                disabled={!doctor.is_available}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${doctor.is_available ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                              >
                                {doctor.is_available ? 'Book' : 'Busy'}
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-5 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Specialty</h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSpecialties.includes(specialty) ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                <div className="flex gap-2">
                  {[5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => { setFiltering(true); setMinRating(minRating === rating ? 0 : rating); setTimeout(() => setFiltering(false), 200) }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${minRating === rating ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {rating}+ ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'under500', label: 'Under 500' },
                    { value: '500to1000', label: '500-1000' },
                    { value: 'over1000', label: '1000+' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setFiltering(true); setPriceRange(option.value); setTimeout(() => setFiltering(false), 200) }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${priceRange === option.value ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${availableOnly ? 'bg-sky-600' : 'bg-gray-200'}`}
                  onClick={() => { setFiltering(true); setAvailableOnly(!availableOnly); setTimeout(() => setFiltering(false), 200) }}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
                <span className="text-gray-700">Available only</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-white p-5 border-t flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}