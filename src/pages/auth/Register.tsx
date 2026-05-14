import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, ArrowRight, Home, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { register, type AppDispatch, type RootState } from '../../store'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required'
        if (value.trim().length < 2) return 'First name must be at least 2 characters'
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'First name can only contain letters'
        return undefined

      case 'lastName':
        if (!value.trim()) return 'Last name is required'
        if (value.trim().length < 2) return 'Last name must be at least 2 characters'
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Last name can only contain letters'
        return undefined

      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined

      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (value.length !== 10) return 'Phone number must be exactly 10 digits'
        if (!/^\d{10}$/.test(value)) return 'Phone number must contain only digits'
        return undefined

      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
        return undefined

      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return undefined

      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For phone field, only allow digits and limit to 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: digitsOnly }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    // Clear API error
    if (apiError) {
      setApiError('')
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.firstName = validateField('firstName', formData.firstName)
    newErrors.lastName = validateField('lastName', formData.lastName)
    newErrors.email = validateField('email', formData.email)
    newErrors.phone = validateField('phone', formData.phone)
    newErrors.password = validateField('password', formData.password)
    newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword)

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy'
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    try {
      const result = await dispatch(register({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword
      }))

      if (register.fulfilled.match(result)) {
        // Don't auto-login - just show success message and redirect to login
        setSuccessMessage('Registration successful! Please login with your credentials.')
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        })
        setAgreedToTerms(false)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2500)
      } else {
        const errorMsg = (result.payload as string) || 'Registration failed. Please try again.'

        // Check if error is field-specific and show inline
        const lowerError = errorMsg.toLowerCase()
        if (lowerError.includes('email') || lowerError.includes('already registered')) {
          setErrors(prev => ({ ...prev, email: errorMsg }))
        } else if (lowerError.includes('phone')) {
          setErrors(prev => ({ ...prev, phone: errorMsg }))
        } else {
          setApiError(errorMsg)
        }
      }
    } catch (err) {
      console.error('Registration error:', err)
      setApiError('Something went wrong. Please try again.')
    }
  }

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'One number', met: /[0-9]/.test(formData.password) }
  ]

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
          <div className="mb-6">
            <h2 className="font-headline-lg text-[32px] text-on-background mb-2">Create Patient Account</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">Register as a patient to access our healthcare services.</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{apiError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-success text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="font-label-md text-label-md text-on-surface-variant mb-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 ${errors.firstName ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                  placeholder="Sarah"
                  required
                  type="text"
                />
                {errors.firstName && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-label-md text-on-surface-variant mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 ${errors.lastName ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                  placeholder="Johnson"
                  required
                  type="text"
                />
                {errors.lastName && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 ${errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                placeholder="sarah.johnson@example.com"
                required
                type="email"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Phone Number (10 digits)</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 ${errors.phone ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                placeholder="9876543210"
                required
                type="tel"
                inputMode="numeric"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 pr-12 ${errors.password ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                  placeholder="Create a strong password"
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
              {errors.password && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className={`flex items-center gap-2 text-xs ${req.met ? 'text-success' : 'text-outline'}`}>
                      {req.met ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-surface-container-low border-b-2 focus:outline-none transition-all px-1 py-2 font-body-md text-body-md text-on-background placeholder:text-outline/40 pr-12 ${errors.confirmPassword ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                  placeholder="Re-enter your password"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-primary transition-colors flex items-center justify-center"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-success text-xs mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input
                className="mt-1 w-4 h-4 rounded border-2 border-outline-variant checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked)
                  if (e.target.checked && errors.terms) {
                    setErrors(prev => ({ ...prev, terms: undefined }))
                  }
                }}
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </div>
            {errors.terms && (
              <p className="text-error text-xs flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.terms}
              </p>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary rounded-lg py-4 px-6 font-label-md text-label-md shadow-md shadow-primary/20 hover:bg-primary-container hover:shadow-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="relative z-10">Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Create Account</span>
                  <ArrowRight className="relative z-10 text-[18px] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Already have an account? </span>
              <Link to="/login" className="text-primary hover:text-primary-container font-label-md">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}