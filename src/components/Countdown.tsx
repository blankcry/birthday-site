import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function getTimeLeft(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  const totalSeconds = Math.max(0, Math.floor(diff / 1000))
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

export default function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center gap-2 md:gap-10 my-8 font-sans"
    >
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="bg-white/60 rounded-3xl min-w-[90px] md:min-w-[120px] p-2 md:px-2 md:py-6 shadow-lg flex flex-col items-center"
        >
          <span className="text-xl md:text-4xl font-bold text-[#2d1a2d] tracking-wider">{String(value).padStart(2, '0')}</span>
          <span className="text-base md:text-lg mt-2 text-[#6e4a7e] font-medium">{label}</span>
        </div>
      ))}
    </motion.div>
  )
} 