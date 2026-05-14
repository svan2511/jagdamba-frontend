import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full py-stack-lg border-t border-outline-variant/50 bg-surface-container-highest mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-page max-w-container mx-auto">
        <div className="md:col-span-2 space-y-stack-md">
          <span className="font-h1-display text-h2-header text-primary">MAA JAGDAMBA</span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Providing precision medical care with a focus on holistic healing and patient serenity.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <Mail className="w-5 h-5" />
            </Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <Phone className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-unit">
          <h4 className="font-label-caps text-label-caps text-primary mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 font-body-md text-body-md">
            <Link to="/doctors" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Find Care
            </Link>
            <Link to="/#specialties" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Specialties
            </Link>
            <Link to="/emergency" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Emergency
            </Link>
            <Link to="/gallery" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Gallery
            </Link>
          </div>
        </div>

        <div className="space-y-unit">
          <h4 className="font-label-caps text-label-caps text-primary mb-4">Legal</h4>
          <div className="flex flex-col gap-2 font-body-md text-body-md">
            <Link to="#" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </Link>
            <Link to="#" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Terms of Service
            </Link>
            <Link to="#" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              HIPAA Compliance
            </Link>
            <Link to="#" className="text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer">
              Accessibility
            </Link>
          </div>
        </div>

        <div className="md:col-span-4 mt-stack-md pt-unit border-t border-outline-variant/30">
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            © 2024 Maa Jagdamba Super Speciality Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}