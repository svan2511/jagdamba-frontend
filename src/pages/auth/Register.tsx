import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Home } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-background text-on-background h-screen flex overflow-hidden antialiased">
      {/* Left Side: Visual Showcase */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-surface-container">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDt8A90uke_be8JGnw44yWFO2FMflbCT_X4RJao1m5oJjx8ux96ZK21Bvbel5SqdcN6vMbsLgCAjKydSzY7Mcd-O7-MJT3ySZSTI9AJef8ZS1zL7lneKVX7Bi3HMoZ--FyZwotsyGWqBEApMVuGOfyuqZeY6wg3V34wmmRMQR-264d7TOCXRmsWqCCRh885Y5MJCzHlRjEbY_XweqqRjvA6-01heeWronxB2fllIUZ6WJppbSzTJS7ifsVkX_WbE0Ln7NrOU8nIfAE')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/20 to-surface/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>

        <div className="absolute bottom-[64px] left-[64px] max-w-xl z-10">
          <h1 className="font-display-lg text-[48px] text-primary mb-4">Maa Jagdamba Super Speciality</h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant opacity-90 max-w-md">
            Join our premium healthcare platform. Create your account to access world-class medical services.
          </p>
        </div>
      </div>

      {/* Right Side: Premium Register Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 sm:px-8 xl:px-[64px] bg-surface overflow-y-auto relative shadow-[-12px_0_32px_rgba(79,55,138,0.05)] z-20">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-headline-lg-mobile font-bold text-primary">Maa Jagdamba</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1">Super Speciality</p>
          </div>

          {/* Home Link */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-label-md"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="font-headline-lg text-[32px] text-on-background mb-2">Create Account</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">Start your healthcare journey with us.</p>
          </div>

          <form className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col relative group">
                <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">First Name</label>
                <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm" placeholder="Sarah" required type="text"/>
              </div>
              <div className="flex flex-col relative group">
                <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">Last Name</label>
                <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm" placeholder="Johnson" required type="text"/>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col relative group">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">Email Address</label>
              <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm" placeholder="sarah.johnson@example.com" required type="email"/>
            </div>

            {/* Phone */}
            <div className="flex flex-col relative group">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">Phone Number</label>
              <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm" placeholder="+91 98765 43210" required type="tel"/>
            </div>

            {/* Password Field */}
            <div className="flex flex-col relative group">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">Password</label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm pr-12"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-primary transition-colors flex items-center justify-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input className="mt-1 w-4 h-4 rounded border-2 border-outline-variant checked:bg-primary checked:border-primary transition-colors cursor-pointer" type="checkbox" required />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </div>

            {/* Primary CTA */}
            <button
              className="w-full bg-primary text-on-primary rounded-lg py-4 px-6 font-label-md text-label-md shadow-md shadow-primary/20 hover:bg-primary-container hover:shadow-lg transition-all duration-300 mt-6 flex items-center justify-center gap-2 group relative overflow-hidden"
              type="submit"
            >
              <span className="relative z-10">Create Account</span>
              <ArrowRight className="relative z-10 text-[18px] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Already have an account? </span>
              <Link to="/login" className="text-primary hover:text-primary-container font-label-md">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}