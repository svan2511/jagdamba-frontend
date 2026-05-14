import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, ArrowRight, Home, AlertCircle, Loader2 } from 'lucide-react'
import { login, type AppDispatch, type RootState } from '../../store'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check for deactivation message on mount
    const msg = sessionStorage.getItem('deactivation_message')
    if (msg) {
      setError(msg)
      sessionStorage.removeItem('deactivation_message')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setError('')

    // Basic validation
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    try {
      const result = await dispatch(login({ email, password }))

      if (login.fulfilled.match(result)) {
        // Login succeeded - redirect
        const user = result.payload.user
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (user.role === 'doctor') {
          navigate('/doctor/dashboard')
        } else {
          navigate('/patient/dashboard')
        }
      } else {
        // Login failed in Redux (rejected)
        const errorMsg = (result.payload as string) || 'Invalid email or password'
        setError(errorMsg)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="bg-background text-on-background h-screen flex overflow-hidden antialiased">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-surface-container">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDt8A90uke_be8JGnw44yWFO2FMflbCT_X4RJao1m5oJjx8ux96ZK21Bvbel5SqdcN6vMbsLgCAjKydSzY7Mcd-O7-MJT3ySZSTI9AJef8ZS1zL7lneKVX7Bi3HMoZ--FyZwotsyGWqBEApMVuGOfyuqZeY6wg3V34wmmRMQR-264d7TOCXRmsWqCCRh885Y5MJCzHlRjEbY_XweqqRjvA6-01heeWronxB2fllIUZ6WJppbSzTJS7ifsVkX_WbE0Ln7NrOU8nIfAE')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/20 to-surface/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute bottom-[64px] left-[64px] max-w-xl z-10">
          <h1 className="font-display-lg text-[48px] text-primary mb-4">Maa Jagdamba Super Speciality</h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant opacity-90 max-w-md">Join our premium healthcare platform. Create your account to access world-class medical services.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 sm:px-8 xl:px-[64px] bg-surface overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-headline-lg-mobile font-bold text-primary">Maa Jagdamba</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1">Super Speciality</p>
          </div>

          {/* Home Link */}
          <div className="mb-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary hover:text-primary-container font-label-md">
              <Home className="w-4 h-4" /> Back to Home
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="font-headline-lg text-[32px] text-on-background mb-2">Welcome back</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">Log in to your secure portal.</p>
          </div>

          {/* Error Message - Always visible if error exists */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Email Address</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="clinician@maajagdamba.com"
                required
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-12"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white rounded-lg py-4 font-medium hover:bg-primary/90 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Secure Log In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link className="text-primary hover:underline font-medium" to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}