import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'

export default function ForgotPassword() {
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
            Secure password recovery. We'll help you regain access to your account safely.
          </p>
        </div>
      </div>

      {/* Right Side: Forgot Password Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 sm:px-8 xl:px-[64px] bg-surface overflow-y-auto relative shadow-[-12px_0_32px_rgba(79,55,138,0.05)] z-20">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="font-headline-lg-mobile font-bold text-primary">Maa Jagdamba</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1">Super Speciality</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-headline-lg text-[32px] text-on-background mb-2">Forgot Password?</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form className="space-y-5">
            {/* Email Field */}
            <div className="flex flex-col relative group">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 transition-colors group-focus-within:text-primary">Email Address</label>
              <input className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 shadow-sm" placeholder="clinician@maajagdamba.com" required type="email"/>
            </div>

            {/* Primary CTA */}
            <button
              className="w-full bg-primary text-on-primary rounded-lg py-4 px-6 font-label-md text-label-md shadow-md shadow-primary/20 hover:bg-primary-container hover:shadow-lg transition-all duration-300 mt-6 flex items-center justify-center gap-2 group relative overflow-hidden"
              type="submit"
            >
              <span className="relative z-10">Send Reset Link</span>
              <ArrowRight className="relative z-10 text-[18px] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Remember your password? </span>
              <Link to="/login" className="text-primary hover:text-primary-container font-label-md">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}