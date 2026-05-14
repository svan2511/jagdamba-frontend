import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, Bell, User, LogIn, UserPlus } from 'lucide-react'

const navLinks = [
  { name: 'Find Care', path: '/doctors' },
  { name: 'Specialties', path: '/#specialties' },
  { name: 'Patients', path: '/#patients' },
  { name: 'Locations', path: '/#locations' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_20px_50px_rgba(39,63,43,0.03)]">
      <div className="flex justify-between items-center h-20 px-margin-page max-w-container mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-gutter">
          <Link to="/" className="font-h2-header text-h3-sub font-semibold text-primary">
            MAA JAGDAMBA
          </Link>
          {!isHomePage && (
            <div className="relative ml-gutter hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-transparent w-64 transition-all duration-300"
                placeholder="Search..."
                type="text"
              />
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-gutter font-body-md text-body-md tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-secondary transition-colors duration-300 active:scale-95 transition-transform duration-200 ${
                location.pathname === link.path
                  ? 'text-primary font-bold border-b-2 border-secondary'
                  : 'text-on-surface-variant'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="font-body-md text-body-md font-medium text-error hover:text-error-container transition-colors duration-300 active:scale-95">
            Emergency
          </button>
          <div className="flex items-center gap-2 hidden md:flex">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-primary font-medium hover:text-secondary transition-colors duration-300"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-body-md font-medium hover:bg-primary-dark transition-colors duration-300 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
          <div className="flex items-center gap-unit text-primary">
            <button className="hover:text-secondary transition-colors duration-300 active:scale-95 p-2">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-secondary transition-colors duration-300 active:scale-95 p-2">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:text-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/20 py-4 px-margin-page">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-on-surface-variant hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/20">
              <button className="text-error font-medium py-2">Emergency</button>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-primary font-medium border border-primary rounded-lg justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg justify-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}