import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

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
            Secure verification. Enter the 6-digit code sent to your registered email address.
          </p>
        </div>
      </div>

      {/* Right Side: OTP Verification Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 sm:px-8 xl:px-[64px] bg-surface overflow-y-auto relative shadow-[-12px_0_32px_rgba(79,55,138,0.05)] z-20">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="font-headline-lg-mobile font-bold text-primary">Maa Jagdamba</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1">Super Speciality</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="font-headline-lg text-[32px] text-on-background mb-2">Verify OTP</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">We've sent a 6-digit code to your email</p>
            <p className="font-body-md text-[16px] text-primary mt-2">clinician@maajagdamba.com</p>
          </div>

          <form className="space-5">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center font-headline-lg text-headline-lg bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all rounded-lg"
                />
              ))}
            </div>

            {/* Resend Code */}
            <div className="text-center pt-4">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Didn't receive the code?{' '}
                <button type="button" className="text-primary hover:text-primary-container font-label-md">
                  Resend
                </button>
              </p>
            </div>

            {/* Primary CTA */}
            <button
              className="w-full bg-primary text-on-primary rounded-lg py-4 px-6 font-label-md text-label-md shadow-md shadow-primary/20 hover:bg-primary-container hover:shadow-lg transition-all duration-300 mt-6"
              type="submit"
            >
              Verify & Continue
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Having trouble? </span>
              <Link to="/login" className="text-primary hover:text-primary-container font-label-md">Contact Support</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}