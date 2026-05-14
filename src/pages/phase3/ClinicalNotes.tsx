import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, FileText, User, Calendar, Clock, Edit2, Download, MoreVertical } from 'lucide-react'

const notes = [
  { id: 1, patient: 'John Smith', type: 'Progress Note', date: 'Oct 12, 2024', time: '10:30 AM', status: 'Completed', summary: 'Follow-up consultation for hypertension management. Blood pressure stable at 130/85.' },
  { id: 2, patient: 'Emily Davis', type: 'Procedure Note', date: 'Oct 12, 2024', time: '09:15 AM', status: 'Completed', summary: 'Minor procedure completed successfully. Patient stable throughout.' },
  { id: 3, patient: 'Michael Brown', type: 'Admission Note', date: 'Oct 11, 2024', time: '02:45 PM', status: 'Pending', summary: 'Emergency admission. Initial assessment completed. Awaiting diagnostic results.' },
  { id: 4, patient: 'Sarah Wilson', type: 'Discharge Note', date: 'Oct 10, 2024', time: '11:00 AM', status: 'Completed', summary: 'Patient discharged in stable condition. Follow-up scheduled in 2 weeks.' },
  { id: 5, patient: 'Robert Chen', type: 'Progress Note', date: 'Oct 09, 2024', time: '03:30 PM', status: 'Completed', summary: 'Post-surgery recovery progressing well. No complications observed.' },
]

export default function ClinicalNotes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState<typeof notes[0] | null>(null)

  const filteredNotes = notes.filter(n =>
    n.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-h2-header text-h2-header text-primary">Clinical Notes</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage and create clinical documentation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-body-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search notes by patient or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface-bright border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/50"
        />
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedNote(note)}
              className={`bg-surface-bright rounded-xl p-5 border cursor-pointer transition-all hover:border-primary/50 ${
                selectedNote?.id === note.id ? 'border-primary' : 'border-outline-variant/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-body-md font-medium text-on-surface">{note.patient}</h4>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{note.type}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps ${
                  note.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {note.status}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{note.summary}</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-outline-variant/20">
                <span className="flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant">
                  <Calendar className="w-3 h-3" /> {note.date}
                </span>
                <span className="flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant">
                  <Clock className="w-3 h-3" /> {note.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note Detail Panel */}
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-bright rounded-xl p-6 border border-outline-variant/30 h-fit sticky top-6"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-h3-sub text-h3-sub text-primary">Note Details</h3>
              <button className="text-on-surface-variant hover:text-primary">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/30">
              <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h4 className="font-h3-sub text-h3-sub text-primary">{selectedNote.patient}</h4>
                <span className="font-body-md text-body-md text-on-surface-variant">{selectedNote.type}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="font-body-md text-on-surface-variant">Date</span>
                <span className="font-body-md text-on-surface">{selectedNote.date}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="font-body-md text-on-surface-variant">Time</span>
                <span className="font-body-md text-on-surface">{selectedNote.time}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="font-body-md text-on-surface-variant">Status</span>
                <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps ${
                  selectedNote.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedNote.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-label-caps text-label-caps text-on-surface-variant mb-2">Summary</h5>
              <p className="font-body-md text-body-md text-on-surface">{selectedNote.summary}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-body-md font-medium hover:bg-primary/90 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Note
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-lg font-body-md font-medium hover:bg-surface-container-high transition-colors">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}