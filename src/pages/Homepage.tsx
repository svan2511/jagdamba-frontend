import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Phone,
  Bell,
  Menu,
  X,
  Heart,
  Brain,
  Bone,
  Pill,
  Stethoscope,
  Activity,
  Check,
  ArrowRight,
  Star,
  Share2,
  Globe,
  MapPin,
  Mail,
  Quote,
  Tv,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trophy
} from 'lucide-react'
import { reviewsApi, type Review } from '../api/reviews'
import { doctorsApi, type DoctorsResponse } from '../api/doctors'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop',
    title: 'Your Health, Our Global Standard Of Excellence.',
    subtitle: 'Experience world-class healthcare with the region\'s leading specialists.',
  },
  {
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&h=1080&fit=crop',
    title: 'Advanced Cardiac Care for a Healthy Heart.',
    subtitle: 'World-class cardiology services with cutting-edge technology.',
  },
  {
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1920&h=1080&fit=crop',
    title: 'Comprehensive Cancer Treatment & Care.',
    subtitle: 'Holistic oncology services with personalized treatment plans.',
  },
]

const services = [
  { icon: Heart, title: 'Cardiology', desc: 'Expert care for your heart with advanced diagnostics and surgical interventions.' },
  { icon: Brain, title: 'Neurology', desc: 'Comprehensive treatment for disorders of the nervous system and brain health.' },
  { icon: Bone, title: 'Orthopedics', desc: 'Precision orthopedic surgery and advanced rehabilitation for mobility.' },
  { icon: Activity, title: 'Oncology', desc: 'Holistic cancer care combining modern medicine with personalized support.' },
  { icon: Stethoscope, title: 'Pediatrics', desc: 'Specialized healthcare for children, ensuring a bright and healthy future.' },
  { icon: Phone, title: '24/7 Trauma', desc: 'Rapid response emergency services and trauma care available round the clock.' },
  { icon: Activity, title: 'Diagnostics', desc: 'Ultra-modern laboratory and imaging services for accurate clinical insights.' },
  { icon: Pill, title: 'Gastroenterology', desc: 'Specialized treatments for digestive health and advanced endoscopic procedures.' },
]

const centers = [
  { title: 'Institute of Cardiac Sciences', desc: 'Leader in non-invasive and complex cardiac surgeries.', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=800&fit=crop' },
  { title: 'Neuro & Spine Excellence', desc: 'Pioneers in brain tumor surgery and spinal health.', image: 'https://plus.unsplash.com/premium_photo-1744836282298-7e7f7199686a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=800&fit=crop' },
  { title: 'Jagdamba Cancer Care', desc: 'Targeted therapies and comprehensive rehabilitation programs.', image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&h=800&fit=crop' },
]

const testimonials = [
  { text: '"The level of care I received for my bypass surgery was exceptional. The cardiologists are truly world-class, and the support staff made me feel at home."', name: 'Rajesh Varma', role: 'Cardiac Patient', color: 'bg-purple-100' },
  { text: '"The neuro-rehabilitation program is outstanding. After my spine injury, I wasn\'t sure if I could walk properly again, but the team here made it possible."', name: 'Anita Singh', role: 'Neurology Patient', color: 'bg-indigo-100' },
  { text: '"Best pediatric department in the city. The doctors are so gentle with kids, and the facilities are modern and very clean. Highly recommended for families."', name: 'Priya Kapur', role: 'Parent', color: 'bg-amber-100' },
]

const blogs = [
  { category: 'WELLNESS', title: '10 Habits for a Stronger Heart', desc: 'Small lifestyle changes can lead to big improvements in your cardiovascular health.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=300&fit=crop' },
  { category: 'HOSPITAL UPDATE', title: 'Inaugurating Robotic Surgery Wing', desc: 'Maa Jagdamba SSH introduces the latest Da Vinci surgical robotic system.', image: 'https://plus.unsplash.com/premium_photo-1664304347697-0b4e0633244c?q=80&w=1179&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=300&fit=crop' },
  { category: 'PATIENT CARE', title: 'Managing Stress for Better Immunity', desc: 'Expert advice on mental wellbeing and its direct impact on physical health.', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=300&fit=crop' },
  { category: 'NUTRITION', title: 'Healthy Eating for Faster Recovery', desc: 'Nutritional guidelines for patients recovering from surgery.', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=300&fit=crop' },
]

export default function Homepage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [doctors, setDoctors] = useState<DoctorsResponse[]>([])
  const [doctorsLoading, setDoctorsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const reviewsResponse = await reviewsApi.getPublicReviews(6)
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data)
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      } finally {
        setReviewsLoading(false)
      }

      try {
        // Fetch doctors
        const doctorsResponse = await doctorsApi.getDoctors()
        if (doctorsResponse.success && doctorsResponse.data) {
          // Get verified doctors, limit to 4
          const verifiedDoctors = doctorsResponse.data
            .filter((d: DoctorsResponse) => d.is_verified)
            .slice(0, 4)
          setDoctors(verifiedDoctors)
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err)
      } finally {
        setDoctorsLoading(false)
      }
    }
    fetchData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-[#fdf7ff]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdf7ff]/90 backdrop-blur-md border-b border-[#cbc4d2]/30 shadow-sm">
        <nav className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-[#4f378a]">Maa Jagdamba SSH</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-[#4f378a] font-bold border-b-2 border-[#4f378a] pb-1">Home</a>
            <a href="#about" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">About</a>
            <a href="#services" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Departments</a>
            <a href="#doctors" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Doctors</a>
            <a href="#reviews" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Reviews</a>
            <a href="#blog" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Blog</a>
            <a href="#contact" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Contact</a>
            <button onClick={() => navigate('/login')} className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Login</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[#ba1a1a] font-bold px-4 py-2 border-2 border-[#ba1a1a] rounded-lg hover:bg-[#ba1a1a]/5 transition-all cursor-pointer">
              <Phone className="w-4 h-4" />
              <span>Emergency Call</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-[#e9ddff]/50 transition-colors">
                <Bell className="w-5 h-5 text-[#494551]" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#e9ddff]/50 transition-colors lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#494551]" /> : <Menu className="w-5 h-5 text-[#494551]" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fdf7ff] border-b border-[#cbc4d2]/30 px-6 py-4 space-y-2">
            <a href="#" className="block text-[#4f378a] font-bold py-2">Home</a>
            <a href="#about" className="block text-[#494551] py-2">About</a>
            <a href="#services" className="block text-[#494551] py-2">Departments</a>
            <a href="#doctors" className="block text-[#494551] py-2">Doctors</a>
            <a href="#reviews" className="block text-[#494551] py-2">Reviews</a>
            <a href="#blog" className="block text-[#494551] py-2">Blog</a>
            <a href="#contact" className="block text-[#494551] py-2">Contact</a>
            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className="block text-[#494551] py-2">Login</button>
          </div>
        )}
      </header>

      <main className="pt-12">
        {/* Hero Section with Slider */}
        <section className="relative h-[700px] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6750A4]/80 to-transparent z-10"></div>
              <img
                alt="Hospital Hero"
                className="absolute inset-0 w-full h-full object-cover"
                src={heroSlides[currentSlide].image}
              />
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>

          <div className="relative z-20 max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-center">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white space-y-6"
            >
              <span className="inline-block px-4 py-2 bg-[#c9a74d] text-[#241a00] rounded-full text-sm font-semibold uppercase tracking-wider">Compassionate Care, Advanced Science</span>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">{heroSlides[currentSlide].title}</h1>
              <p className="text-lg text-[#e6e0e9]/90 max-w-xl">{heroSlides[currentSlide].subtitle}</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate('/appointment')}
                  className="bg-[#765b00] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-[1.02] transition-all shadow-lg"
                >
                  Book Appointment
                </button>
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all">
                  View Departments
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="bg-[#4f378a] text-white py-10 relative z-30 -mt-8 mx-auto max-w-[1200px] rounded-2xl shadow-2xl px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold text-[#ffdf93]">25+</div>
              <div className="text-sm opacity-80 uppercase tracking-widest mt-2">Years of Trust</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-[#ffdf93]">50k+</div>
              <div className="text-sm opacity-80 uppercase tracking-widest mt-2">Happy Patients</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-[#ffdf93]">100+</div>
              <div className="text-sm opacity-80 uppercase tracking-widest mt-2">Specialists</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-[#ffdf93]">24/7</div>
              <div className="text-sm opacity-80 uppercase tracking-widest mt-2">Emergency Care</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 max-w-[1440px] mx-auto px-6 mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Our Medical Excellence</h2>
            <p className="text-[#494551] max-w-2xl mx-auto">Providing a comprehensive range of healthcare services with cutting-edge diagnostics and personalized treatment plans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#f8f2fa] p-6 rounded-xl border border-[#cbc4d2]/30 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 bg-[#e9ddff]/50 rounded-lg flex items-center justify-center text-[#4f378a] mb-4 group-hover:bg-[#4f378a] group-hover:text-white transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-[#1d1b20] mb-2">{service.title}</h3>
                <p className="text-sm text-[#494551]">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="about" className="py-16 bg-[#e6e0e9]/30">
          <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#765b00]/20 rounded-full blur-3xl z-0"></div>
              <img
                alt="Modern Medical Tech"
                className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-[#4f378a]">Why Maa Jagdamba SSH stands out?</h2>
              <p className="text-[#494551]">We bridge the gap between traditional clinical excellence and modern healthcare technology, providing a seamless patient journey focused on recovery and comfort.</p>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="p-2 bg-[#e9ddff]/50 rounded-full text-[#4f378a]">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1d1b20]">Advanced Robotics & Tech</h4>
                    <p className="text-sm text-[#494551]">Utilizing the latest AI-driven diagnostic tools and robotic surgical systems for precision.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="p-2 bg-[#e9ddff]/50 rounded-full text-[#4f378a]">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1d1b20]">Renowned Specialist Panel</h4>
                    <p className="text-sm text-[#494551]">Our team includes internationally trained surgeons and physicians with decades of experience.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="p-2 bg-[#e9ddff]/50 rounded-full text-[#4f378a]">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1d1b20]">24/7 Tertiary Support</h4>
                    <p className="text-sm text-[#494551]">A dedicated emergency and critical care department that never sleeps, ensuring safety at all times.</p>
                  </div>
                </li>
              </ul>
              <button className="bg-[#4f378a] text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#4f378a]/90 transition-all shadow-md">
                Learn More About Us
              </button>
            </div>
          </div>
        </section>

        {/* Centers of Excellence */}
        <section className="py-16 max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Centers of Excellence</h2>
              <p className="text-[#494551]">Specialized institutes within our hospital providing dedicated, world-class treatment for specific health disciplines.</p>
            </div>
            <button className="hidden md:block text-[#4f378a] font-bold border-b-2 border-[#4f378a] pb-1">View All Departments</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center, index) => (
              <motion.div
                key={center.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group"
              >
                <img
                  alt={center.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={center.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{center.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{center.desc}</p>
                  <button className="text-[#ffdf93] font-bold flex items-center gap-1">
                    Explore Department <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className="py-16 bg-[#f2ecf4]">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Meet Our Leading Specialists</h2>
              <p className="text-[#494551] max-w-2xl mx-auto">Headed by world-renowned medical professionals who bring decades of global expertise to Maa Jagdamba.</p>
            </div>

            {doctorsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#4f378a] animate-spin" />
                <span className="ml-3 text-[#494551]">Loading doctors...</span>
              </div>
            ) : doctors.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Dr. Arpita Sharma', specialty: 'Senior Cardiologist (MD, FACC)', exp: '20+ Yrs', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop' },
                  { name: 'Dr. Vikram Mehra', specialty: 'Neurosurgeon (MS, MCh)', exp: '15+ Yrs', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop' },
                  { name: 'Dr. Sarah Jenkins', specialty: 'Lead Oncologist (PhD, FRCP)', exp: '18+ Yrs', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop' },
                  { name: 'Dr. Rohan Gupta', specialty: 'Orthopedic Surgeon (MS, Ortho)', exp: '22+ Yrs', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop' },
                ].map((doctor, index) => (
                  <motion.div
                    key={doctor.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#fdf7ff] rounded-2xl overflow-hidden shadow-lg border border-[#cbc4d2]/30 group cursor-pointer"
                    onClick={() => navigate('/doctors')}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={doctor.image}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#1d1b20]">{doctor.name}</h3>
                      <p className="text-[#4f378a] font-bold text-sm mb-4">{doctor.specialty}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#494551]">{doctor.exp}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/patient/appointment') }}
                          className="p-2 rounded-full bg-[#e1d4fd] text-[#645a7d] hover:bg-[#4f378a] hover:text-white transition-all"
                        >
                          <Stethoscope className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#fdf7ff] rounded-2xl overflow-hidden shadow-lg border border-[#cbc4d2]/30 group cursor-pointer"
                    onClick={() => navigate('/doctors')}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        alt={doctor.user?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#1d1b20]">Dr. {doctor.user?.name || 'Doctor'}</h3>
                      <p className="text-[#4f378a] font-bold text-sm mb-4">{doctor.specialty}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#494551]">{doctor.experience_years}+ Yrs</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/appointment') }}
                          className="p-2 rounded-full bg-[#e1d4fd] text-[#645a7d] hover:bg-[#4f378a] hover:text-white transition-all"
                        >
                          <Stethoscope className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials / Reviews */}
        <section id="reviews" className="py-16 max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Patient Success Stories</h2>
            <div className="flex justify-center gap-1 text-[#765b00]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>

          {reviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#4f378a] animate-spin" />
              <span className="ml-3 text-[#494551]">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${testimonial.color} p-8 rounded-2xl border border-[#cbc4d2]/30 relative`}
                >
                  <Quote className="text-[#4f378a]/10 text-6xl absolute top-6 right-6" />
                  <p className="text-[#494551] italic mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${testimonial.color}`}></div>
                    <div>
                      <h4 className="font-semibold text-[#1d1b20]">{testimonial.name}</h4>
                      <p className="text-xs text-[#494551]">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#e9ddff] p-8 rounded-2xl border border-[#cbc4d2]/30 relative"
                >
                  <Quote className="text-[#4f378a]/10 text-6xl absolute top-6 right-6" />
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[#494551] italic mb-6">
                    {review.comment || 'Excellent experience! Highly recommended.'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#4f378a] flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {review.patient?.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1d1b20]">{review.patient?.user?.name || 'Patient'}</h4>
                      <p className="text-xs text-[#494551]">
                        {review.doctor ? `for Dr. ${review.doctor.user?.name}` : 'Verified Patient'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-16 bg-[#e6e0e9]/20">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold text-[#4f378a]">Health Tips & News</h2>
              <button className="text-[#4f378a] font-bold">See All Articles</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#fdf7ff] rounded-2xl overflow-hidden shadow-md group border border-[#cbc4d2]/30"
                >
                  <img
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-all"
                    src={blog.image}
                  />
                  <div className="p-6">
                    <span className="text-xs font-bold text-[#4f378a] mb-2 block"> {blog.category}</span>
                    <h3 className="text-xl font-semibold text-[#1d1b20] mb-3">{blog.title}</h3>
                    <p className="text-sm text-[#494551] mb-3">{blog.desc}</p>
                    <a className="text-[#4f378a] font-bold text-sm" href="#">Read More →</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Hospital Facilities */}
        <section className="py-16 max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4f378a] mb-4">World-Class Facilities </h2>
            <p className="text-[#494551] max-w-2xl mx-auto">State-of-the-art medical infrastructure ensuring the highest quality of patient care</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: '24/7 Emergency', desc: 'Round-the-clock emergency services', gradient: 'from-red-500 to-red-700' },
              { icon: Heart, title: 'Cardiac Care', desc: 'Advanced heart care unit', gradient: 'from-pink-500 to-rose-600' },
              { icon: Brain, title: 'Neuro Surgery', desc: 'Precision brain & spine surgeries', gradient: 'from-purple-500 to-violet-600' },
              { icon: Stethoscope, title: 'ICU & Critical Care', desc: 'Advanced life support systems', gradient: 'from-blue-500 to-indigo-600' },
              { icon: Activity, title: 'Operation Theatres', desc: 'Modular OT with advanced equipment', gradient: 'from-cyan-500 to-teal-600' },
              { icon: Pill, title: 'Pharmacy', desc: '24/7 in-house pharmacy', gradient: 'from-emerald-500 to-green-600' },
              { icon: Activity, title: 'Diagnostic Lab', desc: 'Full spectrum diagnostics', gradient: 'from-amber-500 to-orange-600' },
              { icon: Heart, title: 'Ambulance', desc: 'Fleet of advanced ambulances', gradient: 'from-rose-500 to-red-600' },
            ].map((facility, index) => (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br ${facility.gradient} min-h-[200px] flex flex-col justify-end p-6`}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-xl"></div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <facility.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{facility.title}</h3>
                  <p className="text-white/80 text-sm">{facility.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Accreditations */}
        <section className="py-16 bg-[#e6e0e9]/30">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Accreditations & Certifications</h2>
              <p className="text-[#494551] max-w-2xl mx-auto">Internationally recognized standards ensuring quality and safety</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { name: 'NABH', desc: 'National Accreditation Board for Hospitals', color: 'from-blue-500 to-blue-700', logo: 'NABH' },
                { name: 'JCI', desc: 'Joint Commission International', color: 'from-amber-500 to-amber-700', logo: 'JCI' },
                { name: 'ISO 9001', desc: 'Quality Management System', color: 'from-green-500 to-green-700', logo: 'ISO' },
                { name: 'ISO 14001', desc: 'Environmental Management', color: 'from-emerald-500 to-emerald-700', logo: 'ISO' },
                { name: 'NABL', desc: 'Laboratory Accreditation', color: 'from-purple-500 to-purple-700', logo: 'NABL' },
                { name: 'AHA', desc: 'American Heart Association', color: 'from-red-500 to-red-700', logo: 'AHA' },
              ].map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-[#cbc4d2]/30 hover:shadow-xl hover:-translate-y-1 transition-all text-center w-48"
                >
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg mb-4`}>
                    <span className="text-white font-bold text-xl">{cert.logo}</span>
                  </div>
                  <h3 className="font-bold text-[#1d1b20] text-lg">{cert.name}</h3>
                  <p className="text-[#494551] text-sm mt-1">{cert.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4f378a] mb-4">Awards & Recognition</h2>
            <p className="text-[#494551] max-w-2xl mx-auto">Excellence in healthcare recognized by leading institutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { year: '2024', title: 'Best Super Speciality Hospital', org: 'Healthcare Excellence Awards', gradient: 'from-[#4f378a] to-[#6750a4]' },
              { year: '2023', title: 'Outstanding Patient Care', org: 'National Quality Forum', gradient: 'from-[#765b00] to-[#c9a74d]' },
              { year: '2023', title: 'Best Emergency Services', org: 'City Healthcare Awards', gradient: 'from-red-500 to-rose-600' },
            ].map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#cbc4d2] group hover:shadow-xl transition-all"
              >
                <div className={`relative h-48 bg-gradient-to-br ${award.gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 right-6 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/30 rounded-full blur-xl"></div>
                  </div>
                  <Trophy className="w-16 h-16 text-white/30" />
                  <div className="absolute top-4 right-4 bg-white text-[#4f378a] px-4 py-1 rounded-full text-sm font-semibold">
                    {award.year}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-[#765b00] fill-current" />
                    <Star className="w-5 h-5 text-[#765b00] fill-current" />
                    <Star className="w-5 h-5 text-[#765b00] fill-current" />
                    <Star className="w-5 h-5 text-[#765b00] fill-current" />
                    <Star className="w-5 h-5 text-[#765b00] fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1d1b20] mb-2">{award.title}</h3>
                  <p className="text-[#494551]">{award.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[#e6e0e9] py-16 border-t border-[#cbc4d2]/30">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-black text-xl text-[#4f378a] mb-4">Maa Jagdamba Super Speciality</div>
              <p className="text-sm text-[#494551] mb-6">A premier medical institution dedicated to high-end surgical procedures and specialized patient care. Accredited by world-leading healthcare bodies.</p>
              <div className="flex gap-4">
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </span>
                <span className="text-[#4f378a] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Tv className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Quick Links</h4>
              <ul className="space-y-2">
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="#">About the Hospital</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="#">Patient Portal Login</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="#">Diagnostic Center</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="#">Pharmacy Services</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#4f378a] transition-colors" href="#">Medical Records</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Contact Details</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">WGVV+55F, Vasant Vihar,<br />Saharanpur, Uttar Pradesh 247001</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">08954660008</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-5 h-5 text-[#4f378a]" />
                  <p className="text-sm text-[#494551]">contact@maajagdamba.com</p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Location</h4>
          
              <a
                href="https://maps.app.goo.gl/AkWA4GRc6eLftbhQ6"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-[#cbc4d2] hover:opacity-90 transition-opacity"
              >
                <div className="w-full h-40 bg-[#e6e0e9] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop')] bg-cover bg-center opacity-50"></div>
                  <div className="relative z-10 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#4f378a]" />
                    <span className="font-medium text-[#4f378a]">View Location on Map</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="pt-12 border-t border-[#cbc4d2]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#494551]">© 2024 Maa Jagdamba Super Speciality Hospital. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-[#494551]">
              <a className="hover:text-[#4f378a]" href="#">Privacy Policy</a>
              <a className="hover:text-[#4f378a]" href="#">Terms of Service</a>
              <a className="hover:text-[#4f378a]" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}