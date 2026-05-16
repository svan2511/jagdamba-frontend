import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Bell,
  Menu,
  X,
  Award,
  Heart,
  Lightbulb,
  ShieldCheck,
  Target,
  Eye,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  Globe,
  Share2,
  Tv,
  MapPin,
  Mail
} from 'lucide-react'

const coreHighlights = [
  {
    icon: Award,
    title: 'Excellence',
    desc: 'Uncompromising commitment to the highest standards of medical precision and patient outcomes across all specialties.',
  },
  {
    icon: Heart,
    title: 'Compassion',
    desc: 'Empathetic care that respects the dignity, fears, and unique needs of every individual who walks through our doors.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'Transparent, ethical practices that build profound trust between our clinicians and the communities we serve.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Relentless pursuit of advanced technologies and cutting-edge protocols to redefine modern medical care.',
  },
]

const detailedValues = [
  {
    icon: Award,
    title: 'Excellence',
    desc: 'We pursue the highest standards in every aspect of our operations, from clinical outcomes to patient experience. Our team continuously upgrades skills and adopts best practices to ensure nothing less than exceptional care.',
  },
  {
    icon: Heart,
    title: 'Compassion',
    desc: 'Every patient is treated like family. We listen, understand, and respond with warmth to create a healing environment where emotional support complements medical treatment.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'Honesty and transparency form the foundation of our patient relationships. We believe in clear communication, ethical practices, and earning trust through consistent actions.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'From adopting the latest medical technologies to pioneering new treatment protocols, we stay at the forefront of healthcare innovation to deliver better outcomes for our patients.',
  },
]

const teamMembers = [
  {
    name: 'Dr. Rajesh Kumar',
    specialization: 'Chief Medical Officer',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&auto=format&fit=crop',
  },
  {
    name: 'Dr. Priya Sharma',
    specialization: 'Head of Cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&auto=format&fit=crop',
  },
  {
    name: 'Dr. Amit Patel',
    specialization: 'Head of Neurology',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop&auto=format&fit=crop',
  },
  {
    name: 'Dr. Sunita Reddy',
    specialization: 'Head of Pediatrics',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop&auto=format&fit=crop',
  },
]

const stats = [
  { number: '15+', label: 'Specialties' },
  { number: '50+', label: 'Expert Doctors' },
  { number: '1L+', label: 'Patients Served' },
  { number: '24/7', label: 'Emergency Care' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function About() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleAboutClick = (value: string) => {
  navigate('/', {
    state: { scrollTo: value },
  });
};

  return (
    <div className="min-h-screen bg-[#fdf7ff]">
     {/* Header - Same as Homepage */}
      {/* Header - Same as Homepage */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdf7ff]/90 backdrop-blur-md border-b border-[#cbc4d2]/30 shadow-sm">
        <nav className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-[#9333ea]">Maa Jagdamba SSH</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-[#9333ea] font-bold border-b-2 border-[#9333ea] pb-1">Home</a>
           
            <a href="/about" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">About</a>
             <button
              onClick={() => handleAboutClick('services')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Departments
            </button>
            <a href="/doctors" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Doctors</a>

             <button
              onClick={() => handleAboutClick('reviews')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Reviews
            </button>

            <button
              onClick={() => handleAboutClick('blog')}
              className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Blog
            </button>
            <a href="/contact" className="text-[#494551] font-medium hover:bg-[#e9ddff]/50 px-3 py-1 rounded transition-colors">Contact</a>
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
            <a href="/" className="block text-[#9333ea] font-bold py-2">Home</a>
            <a href="/about" className="block text-[#494551] py-2">About</a>
            <a href="/#services" className="block text-[#494551] py-2">Departments</a>
            <a href="/doctors" className="block text-[#494551] py-2">Doctors</a>
            <a href="/#reviews" className="block text-[#494551] py-2">Reviews</a>
            <a href="/#blog" className="block text-[#494551] py-2">Blog</a>
            <a href="/contact" className="block text-[#494551] py-2">Contact</a>
            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className="block text-[#494551] py-2">Login</button>
          </div>
        )}
      </header>

      <main className="pt-12">
        {/* 1. Hero About Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-container mx-auto px-margin-page py-stack-lg lg:py-[100px] relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-6"
              >
                <motion.span
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full"
                >
                  <Building2 className="w-4 h-4" />
                  About Our Hospital
                </motion.span>

                <motion.h1
                  variants={fadeInUp}
                  className="font-h1-display text-[2rem] md:text-[2.5rem] lg:text-[3rem] text-slate-800 leading-tight"
                >
                  About <span className="text-purple-600">MAA JAGDAMBA</span>
                  <br />
                  SUPER SPECIALITY HOSPITAL
                </motion.h1>

                <motion.div variants={fadeInUp} className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Established with a vision to bring world-class healthcare to our community, <strong>MAA JAGDAMBA SUPER SPECIALITY HOSPITAL</strong> has been a beacon of hope and healing for thousands of families. Our journey began with a simple belief: every patient deserves access to exceptional medical care with compassion and dignity.
                  </p>
                  <p>
                    Over the years, we have grown from a modest healthcare center to a renowned multi-specialty hospital, continuously expanding our services and capabilities to meet the evolving needs of our patients. Our commitment to excellence has made us a trusted name in healthcare across the region.
                  </p>
                  <p>
                    With a team of highly skilled doctors, state-of-the-art technology, and a patient-first philosophy, we strive to deliver comprehensive medical solutions that not only treat illnesses but also enhance the quality of life for every individual who trusts us with their care.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 pt-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stat.number}</div>
                      <div className="text-sm text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    alt="MAA JAGDAMBA SUPER SPECIALITY HOSPITAL - Modern Building"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=1000&fit=crop&auto=format&fit=crop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">24/7 Emergency Services</p>
                        <p className="text-sm text-slate-500">Always ready to serve you</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-400 rounded-2xl -z-10 shadow-xl"></div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-2xl -z-10 shadow-xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Core Highlights / Values Cards Section */}
        <section className="py-stack-lg lg:py-[100px] bg-slate-50">
          <div className="max-w-container mx-auto px-margin-page">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                What Sets Us Apart
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800">
                Our Core Values
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-4 text-slate-600 max-w-2xl mx-auto">
                These values guide everything we do and define our approach to healthcare
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreHighlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Our Origins / Founder Story Section */}
        <section className="py-stack-lg lg:py-[100px] bg-white">
          <div className="max-w-container mx-auto px-margin-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    alt="Founder - Chairman"
                    className="w-full h-[450px] object-cover"
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&auto=format&fit=crop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-white/90 text-lg font-medium">"Healthcare is not just a service, it's a mission of compassion."</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full -z-10"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6 order-1 lg:order-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                  <Sparkles className="w-4 h-4" />
                  Our Journey
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Our Origins
                </h2>

                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    <strong>MAA JAGDAMBA SUPER SPECIALITY HOSPITAL</strong> was born out of a deep commitment to serve society. Our founders, a group of dedicated medical professionals and philanthropists, recognized the gap in quality healthcare accessible to common people in our region.
                  </p>
                  <p>
                    The vision was clear: create a healthcare institution that combines medical excellence with affordability, ensuring that no one is denied quality treatment due to financial constraints. This patient-first philosophy remains the cornerstone of our hospital even today.
                  </p>
                  <p>
                    What started as a small clinic has now transformed into a multi-specialty hospital equipped with cutting-edge technology and a team of renowned specialists. We take pride in our emergency services that have saved countless lives and our commitment to making advanced healthcare accessible to all.
                  </p>
                  <p>
                    Our journey has been marked by continuous growth, learning, and an unwavering dedication to our patients. Every milestone achieved reaffirms our commitment to the community that has placed their trust in us.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. About Hospital Overview Section - Mission & Vision */}
        <section className="py-stack-lg lg:py-[100px] bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
          <div className="max-w-container mx-auto px-margin-page">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Who We Are
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800">
                About MAA JAGDAMBA SUPER SPECIALITY HOSPITAL
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To provide exceptional, accessible, and compassionate healthcare to all, regardless of their background. We are committed to delivering personalized medical care using advanced technology while maintaining the highest standards of clinical excellence, ethics, and patient safety. Our mission is to heal with compassion, innovate with purpose, and serve with dedication to improve the health and well-being of our community.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                  To be the most trusted and preferred healthcare provider in the region, recognized for clinical excellence, innovative treatments, and compassionate patient care. We aspire to set new benchmarks in healthcare delivery, making MAA JAGDAMBA SUPER SPECIALITY HOSPITAL synonymous with quality, trust, and healing. Our vision is to create a healthier future where every individual has access to world-class medical care.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. Core Values Detailed Section */}
        <section className="py-stack-lg lg:py-[100px] bg-white">
          <div className="max-w-container mx-auto px-margin-page">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-4">
                Our Principles
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800">
                Core Values That Define Us
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {detailedValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 p-8 bg-slate-50 rounded-2xl hover:bg-purple-50/50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Our Team Section */}
        <section className="py-stack-lg lg:py-[100px] bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-container mx-auto px-margin-page">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Meet The Experts
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800">
                Our Team
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-4 text-slate-600 max-w-2xl mx-auto">
                A dedicated team of experienced specialists working together to provide you with the best healthcare
              </motion.p>
            </motion.div>

            {/* Team Banner Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl"
            >
              <img
                alt="Our Medical Team"
                className="w-full h-[300px] md:h-[400px] object-cover"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-purple-900/30 flex items-center">
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Excellence in Every Detail</h3>
                  <p className="text-white/80 max-w-lg">
                    Our team of dedicated healthcare professionals works around the clock to ensure you receive the best possible care.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      src={member.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h3>
                    <p className="text-purple-600 font-medium">{member.specialization}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="/doctors"
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View All Doctors
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-stack-lg bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="max-w-container mx-auto px-margin-page text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience Healthcare Excellence
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Schedule an appointment today and discover why thousands trust MAA JAGDAMBA SUPER SPECIALITY HOSPITAL for their healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-slate-100 transition-colors duration-300 shadow-lg"
              >
                Contact Us
              </a>
              <a
                href="/emergency"
                className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg"
              >
                Emergency: 24/7
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Same as Homepage */}
      <footer id="contact" className="bg-[#e6e0e9] py-16 border-t border-[#cbc4d2]/30">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-black text-xl text-[#9333ea] mb-4">Maa Jagdamba Super Speciality</div>
              <p className="text-sm text-[#494551] mb-6">A premier medical institution dedicated to high-end surgical procedures and specialized patient care. Accredited by world-leading healthcare bodies.</p>
              <div className="flex gap-4">
                <span className="text-[#9333ea] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-[#9333ea] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </span>
                <span className="text-[#9333ea] p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Tv className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Quick Links</h4>
              <ul className="space-y-2">
                <li><a className="text-sm text-[#494551] hover:text-[#9333ea] transition-colors" href="/about">About the Hospital</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#9333ea] transition-colors" href="/doctors">Our Doctors</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#9333ea] transition-colors" href="/gallery">Gallery</a></li>
                <li><a className="text-sm text-[#494551] hover:text-[#9333ea] transition-colors" href="/contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1b20] mb-6">Contact Details</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-5 h-5 text-[#9333ea]" />
                  <p className="text-sm text-[#494551]">WGVV+55F, Vasant Vihar,<br />Saharanpur, Uttar Pradesh 247001</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone className="w-5 h-5 text-[#9333ea]" />
                  <p className="text-sm text-[#494551]">08954660008</p>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-5 h-5 text-[#9333ea]" />
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
                    <MapPin className="w-5 h-5 text-[#9333ea]" />
                    <span className="font-medium text-[#9333ea]">View Location on Map</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="pt-12 border-t border-[#cbc4d2]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#494551]">© 2024 Maa Jagdamba Super Speciality Hospital. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-[#494551]">
              <a className="hover:text-[#9333ea]" href="#">Privacy Policy</a>
              <a className="hover:text-[#9333ea]" href="#">Terms of Service</a>
              <a className="hover:text-[#9333ea]" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}