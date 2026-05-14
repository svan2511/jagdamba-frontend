import { useState } from 'react'
import { motion } from 'framer-motion'

const categories = ['All', 'Infrastructure', 'Technology', 'Patient Care']

const galleryItems = [
  {
    id: 1,
    title: 'Advanced Robotic Surgery Suite',
    category: 'Technology',
    size: 'large',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    title: 'Premium Recovery Suites',
    category: 'Infrastructure',
    size: 'standard',
  },
  {
    id: 3,
    title: 'Precision Diagnostics Lab',
    category: 'Technology',
    size: 'standard',
  },
  {
    id: 4,
    title: 'Maa Jagdamba Campus Exterior',
    category: 'Infrastructure',
    size: 'large-vertical',
    span: 'md:col-span-1 md:row-span-2',
  },
  {
    id: 5,
    title: 'Private Consultation Lounges',
    category: 'Patient Care',
    size: 'wide',
    span: 'md:col-span-2',
  },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  return (
    <main className="flex-grow pt-[120px] pb-margin-page px-margin-page max-w-container mx-auto w-full">
      {/* Header Section */}
      <div className="mb-stack-lg text-center max-w-3xl mx-auto">
        <h1 className="font-h1-display text-h1-display text-primary mb-stack-sm">Facilities Gallery</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Explore our world-class infrastructure designed for precision medical care and premium patient experiences.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-stack-sm mb-margin-page">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-colors ${
              activeCategory === category
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant transition-colors border border-outline-variant/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Bento Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[300px]">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-xl overflow-hidden group bg-surface-container-lowest border border-primary/5 shadow-[0_20px_40px_rgba(39,63,43,0.03)] ${item.span || ''}`}
          >
            <div className="absolute inset-0 bg-surface-variant flex items-center justify-center">
              <span className="text-on-surface-variant">{item.title}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-stack-md w-full">
              {item.category !== 'Infrastructure' && (
                <span className="inline-block px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-on-primary font-label-caps text-label-caps mb-2">
                  {item.category}
                </span>
              )}
              <h3 className="font-h3-sub text-h3-sub text-on-primary">{item.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}