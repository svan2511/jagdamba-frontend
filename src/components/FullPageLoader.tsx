
interface FullPageLoaderProps {
  message?: string
}

export default function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-6c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-slate-600 font-medium">{message}</p>
        <p className="text-slate-400 text-sm mt-1">Maa Jagdamba Hospital</p>
      </div>
    </div>
  )
}