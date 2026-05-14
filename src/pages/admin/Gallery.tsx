import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Image, Film, FolderOpen, Trash2, Eye, Upload, X, Check, ChevronLeft, ChevronRight, Play, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/admin'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

const categories = ['All Categories', 'Facility', 'Medical', 'Events', 'Team', 'Infrastructure']
const types = ['All Types', 'image', 'video']
const statuses = ['All Status', 'Active', 'Inactive']

interface GalleryItem {
  id: number
  title: string
  type: string
  category: string
  url: string
  thumbnail: string
  is_active: boolean
  created_at: string
}

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [viewItem, setViewItem] = useState<GalleryItem | null>(null)
  const itemsPerPage = 12

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'image',
    category: 'Facility',
    file: null as File | null,
  })
  const [uploading, setUploading] = useState(false)

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllGallery({
        page: currentPage,
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        is_active: selectedStatus !== 'All Status' ? (selectedStatus === 'Active' ? 'true' : 'false') : undefined,
      })

      if (response.success && response.data) {
        const galleryData = response.data.data || response.data
        const transformed = galleryData.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          type: item.type || 'image',
          category: item.category || 'Uncategorized',
          url: item.url || '',
          thumbnail: item.thumbnail || item.url || '',
          is_active: item.is_active !== false,
          created_at: item.created_at || '',
        }))
        setGalleryItems(transformed)

        const paginationData = response.data
        if (paginationData && typeof paginationData === 'object') {
          setTotalItems(paginationData.total || galleryData.length)
          setTotalPages(paginationData.last_page || Math.ceil((paginationData.total || galleryData.length) / itemsPerPage) || 1)
        } else {
          setTotalItems(galleryData.length)
          setTotalPages(Math.ceil(galleryData.length / itemsPerPage) || 1)
        }
      } else {
        setGalleryItems([])
        setError(response.message || 'Failed to load gallery')
      }
    } catch {
      setGalleryItems([])
      setError('Failed to load gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory, selectedStatus])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchGallery()
  }, [currentPage, selectedCategory, selectedStatus, selectedType, debouncedSearch])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === galleryItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(galleryItems.map(item => item.id))
    }
  }

  const deleteSelected = async () => {
    if (selectedItems.length === 0) return

    const result = await Swal.fire({
      title: 'Delete Items',
      html: `Are you sure you want to delete ${selectedItems.length} items?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      for (const id of selectedItems) {
        await adminApi.deleteGallery(id)
      }
      toast.success(`${selectedItems.length} items deleted successfully`)
      setSelectedItems([])
      fetchGallery()
    } catch {
      toast.error('Failed to delete items')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setUploadForm({ ...uploadForm, type: 'image', file })
      } else if (file.type.startsWith('video/')) {
        setUploadForm({ ...uploadForm, type: 'video', file })
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.file) {
      toast.error('Please fill all fields and select a file')
      return
    }

    try {
      setUploading(true)

      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
      })
      reader.readAsDataURL(uploadForm.file)
      const base64Image = await base64Promise

      await adminApi.createGallery({
        title: uploadForm.title,
        image: base64Image,
        category: uploadForm.category,
        is_active: true,
      })

      toast.success('Media uploaded successfully!')
      setIsUploadModalOpen(false)
      setUploadForm({ title: '', type: 'image', category: 'Facility', file: null })
      fetchGallery()
    } catch {
      toast.error('Failed to upload media')
    } finally {
      setUploading(false)
    }
  }

  // Local filter for search and type
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesType = selectedType === 'All Types' || item.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    if (type === 'video') return <Film className="w-5 h-5" />
    return <Image className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Gallery Management</h1>
          <p className="text-gray-500 text-sm">Manage hospital images and videos</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: totalItems.toString() || '0', icon: FolderOpen, color: 'bg-[#3e5641]' },
          { label: 'Images', value: galleryItems.filter(i => i.type === 'image').length.toString() || '0', icon: Image, color: 'bg-[#d36135]' },
          { label: 'Videos', value: galleryItems.filter(i => i.type === 'video').length.toString() || '0', icon: Film, color: 'bg-[#83bca9]' },
          { label: 'Active', value: galleryItems.filter(i => i.is_active).length.toString() || '0', icon: Check, color: 'bg-green-500' },
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

      {/* Filters & Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20" />
            </div>
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {types.map(t => <option key={t} value={t}>{t === 'All Types' ? t : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {selectedItems.length > 0 && (
            <button onClick={deleteSelected} className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete ({selectedItems.length})
            </button>
          )}
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {loading ? (
        <FullPageLoader message="Loading gallery..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchGallery} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Try Again</button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Gallery Items Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearch || selectedCategory !== 'All Categories' || selectedType !== 'All Types' || selectedStatus !== 'All Status' ? 'No items match your filters.' : 'No gallery items yet. Upload your first!'}
            </p>
            {(debouncedSearch || selectedCategory !== 'All Categories' || selectedType !== 'All Types' || selectedStatus !== 'All Status') && (
              <button onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setSelectedCategory('All Categories'); setSelectedType('All Types'); setSelectedStatus('All Status'); setCurrentPage(1); }} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Select All */}
          <div
            onClick={toggleSelectAll}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#3e5641] hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${selectedItems.length === galleryItems.length ? 'bg-[#3e5641]' : 'bg-gray-100'}`}>
                {selectedItems.length === galleryItems.length ? <Check className="w-5 h-5 text-white" /> : <span className="text-gray-500">All</span>}
              </div>
              <span className="text-sm text-gray-500">Select All</span>
            </div>
          </div>

          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${selectedItems.includes(item.id) ? 'ring-4 ring-[#3e5641]' : ''}`}
              onClick={() => toggleSelectItem(item.id)}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-50" />
                </div>
              ) : (
                <img src={item.url || item.thumbnail} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement && (e.currentTarget.parentElement.innerHTML = '<div class=\'w-full h-full bg-gray-100 flex items-center justify-center text-gray-400\">No Image</div>') }} />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setViewItem(item) }} className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Type badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded-full flex items-center gap-1">
                {getTypeIcon(item.type)}
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
              </div>

              {/* Active badge */}
              {!item.is_active && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 rounded-full">
                  <span className="text-white text-xs">Inactive</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalItems > 0 && filteredItems.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Upload Media</h2>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    placeholder="Media title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    >
                      {categories.filter(c => c !== 'All Categories').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  />
                  {uploadForm.file && (
                    <p className="mt-2 text-sm text-green-600">Selected: {uploadForm.file.name}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-4 py-2.5 bg-[#3e5641] text-white rounded-lg hover:bg-[#2d4030] disabled:opacity-50 flex items-center gap-2">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setViewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setViewItem(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300">
                <X className="w-8 h-8" />
              </button>
              {viewItem.type === 'video' ? (
                <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
                  <Play className="w-20 h-20 text-white opacity-50" />
                </div>
              ) : (
                <img src={viewItem.url || viewItem.thumbnail} alt={viewItem.title} className="w-full max-h-[80vh] object-contain rounded-xl" />
              )}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">{viewItem.title}</h3>
                <p className="text-gray-400">{viewItem.category} • {viewItem.type}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}