import { motion } from 'framer-motion'
import {
  Award,
  Heart,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react'

const coreValues = [
  {
    icon: Award,
    title: 'Excellence',
    desc: 'Uncompromising commitment to the highest standards of medical precision and patient outcomes.',
    bgColor: 'bg-primary-fixed',
    iconColor: 'text-primary-container',
  },
  {
    icon: Heart,
    title: 'Compassion',
    desc: 'Empathetic care that respects the dignity, fears, and unique needs of every individual patient.',
    bgColor: 'bg-secondary-fixed',
    iconColor: 'text-secondary',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Relentless pursuit of advanced technologies and protocols to redefine modern medical care.',
    bgColor: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary-container',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'Transparent, ethical practices that build profound trust between our clinicians and patients.',
    bgColor: 'bg-surface-container-highest',
    iconColor: 'text-on-surface-variant',
  },
]

const leadership = [
  {
    name: 'Dr. Eleanor Vance',
    role: 'Chief Medical Officer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR9rQCFJu_zysTXvYegGquc-UCqJEOnIFfEDytObO3VLfbCXRZH58e36m7G8ZcGkEl1JXP9-kV7kKRfE9LkZOZUnoNnFZ7scV6ecNjVZ9_sOBTFVWdtqFlqhd89XoCAJwj_xB_gvlov-pQ4rb6dDF95lXDiIz1YFTJtcnBxXzEAdAOnM7wczeTjJaZlLpCpqwpq42_JoKWJt4mPdTQ4uHLFJjqC57COuHVYVW7lGaRwcw5CPJ8XwWQ3avMEshIS0_HeBVK53ABE7c',
  },
  {
    name: 'Arthur Pendelton',
    role: 'Chief Executive Officer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD65sDOKhE-rHwGxnmRQ1NTOyvC_Myrf8Q220Lac8JueW_tOHDMZJWnfemfHsnnMwTrsGDIcUvWpIFKb2wh_FUfDV9bh-XNNMYJZIPcPd0AHKnR7ZAekrEAAZ5FZ8g50qf23-MeUOJ8-BdLM1O91MVcCRKXgvgagzYsn7YbJSYZDgLT2iqRZTi4vLtwKoq9Cy0CyUn_ZolhYD_R0-LBwQLOXcry7He5_q-X7TOgzvuCUuzE2BcU7az267trSzbVJWjmMAU5ly-tNm0',
  },
  {
    name: 'Dr. Marcus Lin',
    role: 'Head of Surgery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD66Tu95j9I-KmaJcchZIGA0f6-W_FyJRL37j0fXUjvOfMfIIaCRW0APbjYn0nwS6Wf0ifczi7CE1rMi5wELzT4StoOJgdm_bT5Kk9hR415tQGGBnjOfCw9bi56-M5K8g2bEdLu8GdVoa7k6X1Hb7K7mpJ1erGKQ90kxt_Zumht1NxeNRfoZT8mslFe_EXpZModiS-5NUqi3Lx8EInWQnFTj00Rsr8Yg1J6RrvaQvqcdT8577bnHUE761hwo-lRPdaNkjoAjclz7pk',
  },
]

export default function About() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="px-margin-page max-w-container mx-auto py-stack-lg lg:py-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 flex flex-col gap-stack-md z-10">
            <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Our Mission</span>
            <h1 className="font-h1-display text-h1-display text-primary">Clinical Excellence through Serenity.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm max-w-md">
              We bridge the gap between high-end hospitality and precision medical care, providing authoritative yet empathetic treatment in an environment designed for healing.
            </p>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative shadow-[0_40px_80px_rgba(39,63,43,0.08)] bg-surface-container-high">
              <img
                alt="Hospital Architecture"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATEScIZ04dg6qcJ8lLTh0ljAZHabNuAJDGugn_XPfrw3M9xUG6QCqwFdZYlOi7dDYJkHpJr620SW7VUwmYvVvvH9UlO3Im3X7MM9lO6Q7BxdAHmYDipt8tJlPObuLcuQGr-CpCx-iwepjTzWBNtsWYwUQbb-tTWpmKLQHKnv4JV28aP_uCMLRVwBunp1zqK7gb8as9mwVq5j3qu5RpnKVooiy0b_ytbM7s4BKQ2MDJSAbgguEg7iOQz8ihy7F5eXm4sOGLFmE6lhM"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <section className="bg-surface-container-low py-stack-lg lg:py-[120px] px-margin-page border-y border-outline-variant/30">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-stack-lg max-w-2xl mx-auto">
            <span className="font-label-caps text-label-caps text-primary-container uppercase">Foundations</span>
            <h2 className="font-h2-header text-h2-header text-primary mt-unit">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-surface border border-outline-variant/20 rounded-xl p-stack-md shadow-[0_20px_50px_rgba(39,63,43,0.03)] hover:shadow-[0_30px_60px_rgba(39,63,43,0.06)] transition-shadow duration-300 ${
                  index === 1 || index === 3 ? 'lg:-translate-y-4' : ''
                }`}
              >
                <div className={`w-12 h-12 ${value.bgColor} rounded-full flex items-center justify-center mb-stack-sm`}>
                  <value.icon className={`${value.iconColor}`} />
                </div>
                <h3 className="font-h3-sub text-h3-sub text-primary mb-unit">{value.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-stack-lg lg:py-[120px] px-margin-page max-w-container mx-auto">
        <div className="mb-stack-lg">
          <span className="font-label-caps text-label-caps text-primary-container uppercase">Executive Profiles</span>
          <h2 className="font-h2-header text-h2-header text-primary mt-unit">Leadership</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {leadership.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-high mb-stack-sm relative shadow-sm border border-outline-variant/10">
                <img
                  alt={leader.role}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  src={leader.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-h3-sub text-h3-sub text-primary">{leader.name}</h3>
              <p className="font-label-caps text-label-caps text-secondary mt-unit">{leader.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}