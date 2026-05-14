import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Eye, MoreVertical, User, Calendar, Phone, Mail } from 'lucide-react'

const patients = [
  { id: 1, name: 'John Smith', age: 58, gender: 'Male', dob: 'Mar 15, 1966', phone: '+1 (555) 123-4567', email: 'john.smith@email.com', bloodType: 'O+', lastVisit: 'Oct 12, 2024', status: 'Active', condition: 'Hypertension' },
  { id: 2, name: 'Emily Davis', age: 45, gender: 'Female', dob: 'Jun 22, 1979', phone: '+1 (555) 234-5678', email: 'emily.davis@email.com', bloodType: 'A+', lastVisit: 'Oct 10, 2024', status: 'Active', condition: 'Diabetes Type 2' },
  { id: 3, name: 'Michael Brown', age: 62, gender: 'Male', dob: 'Sep 10, 1962', phone: '+1 (555) 345-6789', email: 'michael.b@email.com', bloodType: 'B+', lastVisit: 'Oct 08, 2024', status: 'Critical', condition: 'Heart Disease' },
  { id: 4, name: 'Sarah Wilson', age: 39, gender: 'Female', dob: 'Dec 05, 1985', phone: '+1 (555) 456-7890', email: 'sarah.w@email.com', bloodType: 'O-', lastVisit: 'Oct 05, 2024', status: 'Healthy', condition: 'General Checkup' },
  { id: 5, name: 'Robert Chen', age: 55, gender: 'Male', dob: 'Apr 18, 1969', phone: '+1 (555) 567-8901', email: 'robert.c@email.com', bloodType: 'AB+', lastVisit: 'Oct 01, 2024', status: 'Recovering', condition: 'Post-Surgery' },
]

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null)

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-h2-header text-h2-header text-primary">Patient Records</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage and view patient medical records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/50 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '156', color: 'text-primary' },
          { label: 'Active', value: '42', color: 'text-green-600' },
          { label: 'Critical', value: '3', color: 'text-secondary' },
          { label: 'Recovered', value: '111', color: 'text-blue-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-bright rounded-xl p-4 border border-outline-variant/30"
          >
            <span className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</span>
            <span className={`block font-h2-header text-h2-header ${stat.color}`}>{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Patient List */}
      <div className="bg-surface-bright rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Patient</th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Age/Gender</th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Condition</th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Last Visit</th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-outline-variant/30 hover:bg-surface-container-low cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-body-md text-on-surface block">{patient.name}</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">{patient.bloodType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body-md text-on-surface">{patient.age} / {patient.gender}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-body-md text-on-surface">{patient.condition}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-body-md text-on-surface-variant">{patient.lastVisit}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                      patient.status === 'Critical' ? 'bg-red-100 text-red-700' :
                      patient.status === 'Healthy' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors">
                        <Eye className="w-4 h-4 text-on-surface-variant" />
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors">
                        <Download className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Sidebar */}
      {selectedPatient && (
        <div className="fixed inset-y-0 right-0 w-96 bg-surface-bright border-l border-outline-variant/30 shadow-lg z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-h3-sub text-h3-sub text-primary">Patient Details</h3>
              <button onClick={() => setSelectedPatient(null)} className="text-on-surface-variant hover:text-primary">
                <MoreVertical className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center mb-3">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h4 className="font-h3-sub text-h3-sub text-primary">{selectedPatient.name}</h4>
              <p className="font-body-md text-on-surface-variant">{selectedPatient.condition}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Calendar className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">Date of Birth</span>
                  <span className="font-body-md text-on-surface">{selectedPatient.dob}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Phone className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">Phone</span>
                  <span className="font-body-md text-on-surface">{selectedPatient.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Mail className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">Email</span>
                  <span className="font-body-md text-on-surface">{selectedPatient.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-body-md font-medium hover:bg-primary/90 transition-colors">
                View Full Record
              </button>
              <button className="w-full bg-primary-container text-on-primary-container px-4 py-3 rounded-lg font-body-md font-medium hover:bg-primary-container/80 transition-colors">
                Write Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}