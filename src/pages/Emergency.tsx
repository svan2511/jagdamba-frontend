import { motion } from 'framer-motion'
import { AlertCircle, Phone, Ambulance, HeartPulse, Stethoscope } from 'lucide-react'

export default function EmergencyPage() {
  return (
    <main className="flex-grow pt-[120px] pb-stack-lg px-margin-page max-w-container mx-auto w-full flex flex-col gap-stack-lg">
      {/* Emergency Header Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-error-container text-on-error-container rounded-xl p-stack-lg flex flex-col md:flex-row items-center justify-between gap-gutter shadow-sm border border-error/20"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-unit mb-stack-sm">
            <AlertCircle className="text-error text-4xl" />
            <h1 className="font-h1-display text-h1-display text-error">Critical Access Emergency</h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-error-container/80 mb-stack-md">
            Immediate, precision-driven trauma care and ambulance dispatch. We are standing by 24/7 to provide life-saving intervention with unparalleled clinical excellence.
          </p>
          <div className="bg-surface rounded-lg p-stack-sm border border-error/30 flex items-center gap-stack-md inline-flex shadow-sm">
            <div className="bg-error/10 p-unit rounded-full">
              <Phone className="text-error text-3xl" />
            </div>
            <div>
              <div className="font-label-caps text-label-caps text-error/80 uppercase tracking-widest mb-1">
                Emergency Hotline
              </div>
              <div className="font-h1-display text-[40px] leading-none font-bold text-error tracking-tight">
                08954660008
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[400px] h-[300px] rounded-lg overflow-hidden border-2 border-error/20 shadow-sm relative">
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="text-on-surface-variant">Emergency Entrance</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-stack-sm">
            <span className="font-label-caps text-label-caps text-white uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span> Main Campus Trauma Center
            </span>
          </div>
        </div>
      </motion.section>

      {/* Services Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {[
          {
            icon: Ambulance,
            title: '24/7 Ambulance Fleet',
            desc: 'Advanced Life Support (ALS) equipped vehicles with real-time telemetry connected directly to our ER specialists.',
            statLabel: 'Average Dispatch',
            statValue: '< 3 mins',
            bgColor: 'bg-surface-container',
            iconColor: 'text-primary',
          },
          {
            icon: HeartPulse,
            title: 'Level 1 Trauma Unit',
            desc: 'Comprehensive care for the most severe injuries, staffed continuously by board-certified trauma surgeons and specialists.',
            statLabel: 'Surgeon Availability',
            statValue: 'Immediate',
            bgColor: 'bg-error-container',
            iconColor: 'text-error',
          },
          {
            icon: Stethoscope,
            title: 'Critical Care Support',
            desc: 'State-of-the-art ICU facilities designed for profound stabilization and recovery with dedicated nursing ratios.',
            statLabel: 'ICU Capacity',
            statValue: 'High Alert',
            bgColor: 'bg-primary-container',
            iconColor: 'text-on-primary-container',
          },
        ].map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 shadow-[0_20px_50px_rgba(39,63,43,0.03)] flex flex-col hover:shadow-[0_20px_60px_rgba(39,63,43,0.06)] transition-shadow duration-300"
          >
            <div className={`${service.bgColor} p-unit rounded-lg w-fit mb-stack-sm`}>
              <service.icon className={`${service.iconColor} text-2xl`} />
            </div>
            <h3 className="font-h3-sub text-h3-sub text-primary mb-unit">{service.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-stack-md">{service.desc}</p>
            <div className="font-data-mono text-data-mono text-primary flex justify-between border-t border-outline-variant/20 pt-unit">
              <span>{service.statLabel}</span>
              <span className="font-semibold">{service.statValue}</span>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  )
}