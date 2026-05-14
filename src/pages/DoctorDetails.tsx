import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Briefcase, GraduationCap, BookOpen, Video, Building2, ArrowRight } from 'lucide-react'

interface DoctorData {
  name: string
  specialty: string
  degree: string
  rating: number
  reviews: number
  experience: string
  acceptingPatients: boolean
  image: string
  about: string
  specialties: string[]
  education: { degree: string; detail: string }[]
  publications: { journal: string; title: string }[]
}

const doctors: Record<number, DoctorData> = {
  1: {
    name: 'Dr. Julianne Voss',
    specialty: 'Interventional Cardiology',
    degree: 'MD, FACC',
    rating: 4.9,
    reviews: 128,
    experience: '18+ Years',
    acceptingPatients: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfmxRFCBPBCET867RWYi-OyPTzHYjQRU5kz3MZ3fCEVrw4B4Hg1UZKNXQpAQc-beakDlByIX0rgZA1jEShrkIz3dNeiCXMPBmEzcdUCrxs3AZqeYvMu0DAhx4ftaCcL6-c4Be5iXqjzv-Rh0vgBpUDwNLhDQMDwidLLiMTLI83QPl0FwIPFFra_CtxEd2rWxTJ9M6Mx-X64pAtpXjj5ILJ9docRvJkRcoeBqp-fhqsMw5Eyri4OiSIA1UfkjztEgKn6EKZkhTUIrw',
    about: `Dr. Julianne Voss is a board-certified Interventional Cardiologist renowned for her pioneering work in minimally invasive structural heart interventions. With over 18 years of clinical excellence, she combines cutting-edge technical precision with a deeply empathetic approach to patient care.

Her philosophy centers on "Serenity in Precision," ensuring that every patient understands their diagnosis and treatment options in a calm, supportive environment. Dr. Voss regularly consults on complex high-risk cases and leads the structural heart program at Serenity Health.`,
    specialties: ['Coronary Interventions', 'Structural Heart Disease', 'Preventive Cardiology'],
    education: [
      { degree: 'MD, Harvard Medical School', detail: 'Cum Laude' },
      { degree: 'Residency, Johns Hopkins', detail: 'Internal Medicine' },
      { degree: 'Fellowship, Cleveland Clinic', detail: 'Interventional Cardiology' },
    ],
    publications: [
      { journal: 'JACC (2022)', title: 'Advancements in Transcatheter Aortic Valve Replacement.' },
      { journal: 'NEJM (2019)', title: 'Long-term outcomes of complex PCI in high-risk patients.' },
    ],
  },
}

export default function DoctorDetails() {
  const { id } = useParams()
  const doctorId = id ? parseInt(id) : 1
  const doctor = doctors[doctorId] || doctors[1]

  return (
    <main className="max-w-container mx-auto px-margin-page py-stack-lg pt-24 relative">
      {/* Hero Section / Sticky Booking */}
      <div className="flex flex-col lg:flex-row gap-gutter mb-stack-lg">
        {/* Left Profile Area */}
        <div className="lg:w-2/3">
          <div className="flex flex-col md:flex-row gap-gutter items-start">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              alt={doctor.name}
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-[0_20px_50px_rgba(39,63,43,0.05)] border border-outline-variant/30"
              src={doctor.image}
            />
            <div className="flex flex-col gap-unit">
              {doctor.acceptingPatients && (
                <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full w-max mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Accepting New Patients</span>
                </div>
              )}
              <h1 className="font-h1-display text-h1-display text-primary">{doctor.name}</h1>
              <p className="font-h3-sub text-h3-sub text-secondary">{doctor.specialty}</p>
              <div className="flex items-center gap-4 mt-stack-sm text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-secondary filled-icon" fill="currentColor" />
                  <span className="font-data-mono text-data-mono font-bold">{doctor.rating}</span>
                  <span className="font-body-md text-body-md opacity-70">({doctor.reviews} Reviews)</span>
                </div>
                <div className="w-px h-4 bg-outline-variant"></div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-primary-container" />
                  <span className="font-data-mono text-data-mono">{doctor.experience}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-stack-md">
                {doctor.specialties.map((spec: string) => (
                  <span
                    key={spec}
                    className="px-4 py-2 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-full font-label-caps text-label-caps border border-primary-fixed"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-stack-lg">
            <h2 className="font-h2-header text-h2-header text-primary mb-stack-sm">About the Doctor</h2>
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 shadow-[0_20px_50px_rgba(39,63,43,0.02)]">
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                {doctor.about.split('\n\n')[0]}
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {doctor.about.split('\n\n')[1]}
              </p>
            </div>
          </div>

          {/* Academic & Expertise Grid */}
          <div className="mt-stack-lg grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Academic */}
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 shadow-[0_20px_50px_rgba(39,63,43,0.02)]">
              <div className="flex items-center gap-2 mb-stack-sm">
                <GraduationCap className="text-primary-container w-5 h-5" />
                <h3 className="font-h3-sub text-h3-sub text-primary">Academic Background</h3>
              </div>
              <ul className="flex flex-col gap-stack-sm">
                {doctor.education.map((edu: { degree: string; detail: string }, index: number) => (
                  <li key={index} className="flex flex-col border-b border-outline-variant/20 pb-2">
                    <span className="font-data-mono text-data-mono text-primary-container font-semibold">{edu.degree}</span>
                    <span className="font-body-md text-body-md text-on-surface-variant opacity-80">{edu.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Research */}
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 shadow-[0_20px_50px_rgba(39,63,43,0.02)]">
              <div className="flex items-center gap-2 mb-stack-sm">
                <BookOpen className="text-primary-container w-5 h-5" />
                <h3 className="font-h3-sub text-h3-sub text-primary">Publications & Research</h3>
              </div>
              <ul className="flex flex-col gap-stack-sm">
                {doctor.publications.map((pub: { journal: string; title: string }, index: number) => (
                  <li key={index} className="flex gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm mt-1">article</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      <span className="font-semibold text-primary">{pub.journal}:</span> {pub.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking CTA */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-28 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 shadow-[0_40px_80px_rgba(39,63,43,0.08)]"
          >
            <h3 className="font-h3-sub text-h3-sub text-primary mb-stack-sm">Book an Appointment</h3>
            <div className="flex flex-col gap-stack-sm mb-stack-md">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-primary-fixed/50 bg-primary-fixed/10 hover:bg-primary-fixed/20 transition-colors cursor-pointer">
                <Video className="text-primary mt-1 w-5 h-5" />
                <div>
                  <span className="block font-data-mono text-data-mono font-semibold text-primary">Video Consultation</span>
                  <span className="block font-label-caps text-label-caps text-on-surface-variant mt-1">Next available: Tomorrow, 2:00 PM</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer">
                <Building2 className="text-on-surface-variant mt-1 w-5 h-5" />
                <div>
                  <span className="block font-data-mono text-data-mono font-semibold text-on-surface-variant">In-Person Visit</span>
                  <span className="block font-label-caps text-label-caps text-on-surface-variant mt-1">Next available: Nov 12, 9:00 AM</span>
                  <span className="block font-body-md text-body-md text-on-surface-variant opacity-70 text-sm mt-1">Maa Jagdamba Main Campus</span>
                </div>
              </div>
            </div>
            <Link
              to={`/appointment?doctor=${id}`}
              className="w-full py-4 bg-gradient-to-r from-primary-container to-primary text-on-primary rounded-lg font-h3-sub text-h3-sub hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Continue to Booking
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-4 opacity-70">
              Requires Maa Jagdamba Patient Account
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}