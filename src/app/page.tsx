'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FireIcon, HeartIcon, UserGroupIcon, SparklesIcon, DevicePhoneMobileIcon, CakeIcon, ArrowTrendingUpIcon, StarIcon, ChatBubbleLeftRightIcon, BoltIcon, ScaleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import Loader from '../components/Loader'
import Hero from '../components/Hero'
import FeatureCards from '../components/FeatureCards'
import Testimonials from '../components/Testimonials'
import SuccessStories from '../components/SuccessStories'

const slogans = [
  'Kilo vermek mi istiyorsun? 💪',
  'Kas yapmak mı? 🏋️‍♂️',
  'Sağlıklı kalmak mı? 🥗',
  'Hepsi burada, hepsi sana özel! 🤖',
  'Yapay Zeka ile Akıllı Sağlık!',
  'Kişisel Fitness Asistanın!',
  'Hayalindeki Vücuda Ulaş!',
]

const features = [
  {
    title: 'Yapay Zeka ile Kişiye Özel Planlar',
    description: 'Hedeflerine ve yaşam tarzına göre tamamen sana özel fitness ve beslenme planları oluştur.',
    icon: SparklesIcon,
    emoji: '🤖',
    color: 'from-blue-500 to-blue-400',
  },
  {
    title: 'Fitness Uzmanı Desteği',
    description: 'Uzman tavsiyeleriyle antrenmanlarını ve gelişimini en iyi şekilde yönet.',
    icon: FireIcon,
    emoji: '🏋️‍♂️',
    color: 'from-green-500 to-green-400',
  },
  {
    title: 'Akıllı Öğün Planlama',
    description: 'Yapay zeka ile günlük öğünlerini, kalori ve makro hedeflerine göre otomatik planla.',
    icon: CakeIcon,
    emoji: '🍽️',
    color: 'from-red-500 to-orange-400',
  },
  {
    title: 'Kilo Alma / Verme / Fit Kalma',
    description: 'Kilo almak, vermek veya fit kalmak için en uygun programı oluştur.',
    icon: ArrowTrendingUpIcon,
    emoji: '📈',
    color: 'from-yellow-500 to-red-500',
  },
  {
    title: '400+ Sağlıklı Tarif',
    description: 'Lezzetli, pratik ve sağlıklı tariflerle beslenmeni renklendir.',
    icon: HeartIcon,
    emoji: '🥗',
    color: 'from-pink-500 to-red-400',
  },
  {
    title: 'İstatistik ve İlerleme Takibi',
    description: 'Gelişimini detaylı grafiklerle takip et, motivasyonunu artır.',
    icon: ScaleIcon,
    emoji: '📊',
    color: 'from-blue-600 to-green-400',
  },
  {
    title: 'Motivasyon & Topluluk',
    description: 'Başarı hikayeleri, topluluk desteği ve motivasyon araçlarıyla yalnız değilsin.',
    icon: UserGroupIcon,
    emoji: '👥',
    color: 'from-green-600 to-blue-400',
  },
  {
    title: 'Mobil Uyumlu & Modern',
    description: 'Her cihazda harika görünen, kolay ve hızlı bir deneyim.',
    icon: DevicePhoneMobileIcon,
    emoji: '📱',
    color: 'from-purple-500 to-blue-400',
  },
]

const steps = [
  {
    title: '1. Hedefini Seç',
    desc: 'Kilo vermek, kas yapmak veya sağlıklı kalmak... Hedefini belirle!',
    icon: ArrowTrendingUpIcon,
    emoji: '🎯',
  },
  {
    title: '2. Planını Oluştur',
    desc: 'Yapay zeka ve uzman desteğiyle sana özel planını oluştur.',
    icon: SparklesIcon,
    emoji: '📝',
  },
  {
    title: '3. Takip Et & Motive Ol',
    desc: 'Gelişimini takip et, toplulukla motive ol, başarıya ulaş!',
    icon: BoltIcon,
    emoji: '🚀',
  },
]

const emojiVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, 15, -15, 0],
    scale: [1, 1.2, 1],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
  }
}

const starVariants = {
  initial: { scale: 1, color: '#FFD700' },
  animate: { scale: [1, 1.2, 1], color: ['#FFD700', '#FFFACD', '#FFD700'], transition: { repeat: Infinity, duration: 1.5 } }
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [sloganIndex, setSloganIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <Loader />

  // Modern Yorumlar
  const testimonials = [
    {
      name: 'Ayşe K.',
      comment: '3 ayda 12 kilo verdim, tarifler ve planlar harika! Artık kendimi çok daha enerjik hissediyorum. 💚',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      stars: 5,
    },
    {
      name: 'Mehmet T.',
      comment: 'Kas yapmak için denemediğim şey kalmamıştı, MyBodyRules ile hedefime ulaştım! 🏋️‍♂️',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      stars: 5,
    },
    {
      name: 'Elif D.',
      comment: 'Yapay zeka ile hazırlanan öğünler ve uzman desteği sayesinde fit kaldım. Topluluk çok motive edici! 👏',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      stars: 5,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-fitness-dark relative overflow-x-hidden">
      {/* Hareketli arka plan daireleri */}
      <motion.div className="absolute top-0 left-0 w-96 h-96 bg-fitness-blue opacity-20 rounded-full blur-3xl z-0" animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-0 right-0 w-80 h-80 bg-fitness-green opacity-20 rounded-full blur-3xl z-0" animate={{ x: [0, -40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }} />

      {/* Hero + Slogan */}
      <section className="relative z-10 flex flex-col items-center justify-center py-20">
        <motion.h1 className="text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent drop-shadow-lg mb-4" initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:1}}>
          MyBodyRules
        </motion.h1>
        <motion.div className="text-xl md:text-2xl font-semibold text-center mb-6 min-h-[2.5rem]" key={sloganIndex} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.7}}>
          {slogans[sloganIndex]}
        </motion.div>
        <p className="max-w-2xl text-center text-gray-700 dark:text-gray-200 mb-8 text-lg">Yapay zeka destekli kişisel sağlık ve fitness asistanı ile hedeflerine ulaş. Akıllı planlama, beslenme takibi, topluluk ve daha fazlası burada!</p>
        <motion.button
          className="px-8 py-3 rounded-full bg-fitness-blue text-white font-bold text-lg shadow-lg transition-all duration-300 hover:bg-fitness-green scale-100 hover:scale-105"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth/register')}
        >
          Hemen Başla
        </motion.button>
      </section>

      {/* Avantajlar */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <motion.h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Neden MyBodyRules?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {emoji: '🤖', title: 'Kişiselleştirilmiş Planlar', desc: 'Yapay zeka ve uzman desteğiyle tamamen sana özel beslenme ve antrenman programları.'},
            {emoji: '🥗', title: 'Sağlıklı Tarifler', desc: '400+ sağlıklı ve lezzetli tarif ile beslenmeni renklendir, hedeflerine ulaş.'},
            {emoji: '👥', title: 'Topluluk & Motivasyon', desc: 'Başarı hikâyeleri, topluluk desteği ve motivasyon araçlarıyla yalnız değilsin.'},
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-transform"
              initial={{opacity:0, y:40}}
              whileInView={{opacity:1, y:0}}
              whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(30,144,255,0.15)' }}
              transition={{duration:0.7, delay:0.1 * i}}
              viewport={{once:true}}
            >
              <motion.span variants={emojiVariants} initial="initial" animate="animate" className="text-4xl mb-2 select-none">{item.emoji}</motion.span>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Adım Adım Rehber */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Başlamak Çok Kolay!
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {[
            {emoji: '🎯', title: '1. Hedefini Seç', desc: 'Kilo vermek, kas yapmak veya sağlıklı kalmak... Hedefini belirle!'},
            {emoji: '📝', title: '2. Planını Oluştur', desc: 'Yapay zeka ve uzman desteğiyle sana özel planını oluştur.'},
            {emoji: '🚀', title: '3. Takip Et & Motive Ol', desc: 'Gelişimini takip et, toplulukla motive ol, başarıya ulaş!'},
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="flex-1 flex flex-col items-center text-center cursor-pointer transition-transform"
              initial={{opacity:0, y:40}}
              whileInView={{opacity:1, y:0}}
              whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(50,205,50,0.15)' }}
              transition={{duration:0.7, delay:0.1 * i}}
              viewport={{once:true}}
            >
              <motion.span variants={emojiVariants} initial="initial" animate="animate" className="text-4xl mb-2 select-none">{item.emoji}</motion.span>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Özellik Kartları */}
      <FeatureCards />

      {/* Kullanıcı Yorumları */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <motion.h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Kullanıcı Yorumları
        </motion.h2>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-fitness-blue/30">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="min-w-[320px] max-w-xs bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center mx-auto transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              initial={{opacity:0, y:40}}
              whileInView={{opacity:1, y:0}}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 8px 32px 0 rgba(255,79,129,0.15)' }}
              transition={{duration:0.7, delay:0.1 * i}}
              viewport={{once:true}}
            >
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-4 border-fitness-green mb-3 shadow" />
              <div className="flex mb-2 justify-center">
                {[...Array(t.stars)].map((_, idx) => (
                  <motion.span key={idx} variants={starVariants} initial="initial" animate="animate" className="text-2xl mx-0.5">★</motion.span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-2">{t.comment}</p>
              <span className="font-semibold text-fitness-pink dark:text-fitness-orange">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Başarı Hikâyeleri */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <motion.h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Gerçek Başarılar
        </motion.h2>
        <SuccessStories />
      </section>

      {/* SSS ve Sıkça Sorulan Sorular */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Sıkça Sorulan Sorular
        </motion.h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">MyBodyRules ücretsiz mi?</h3>
            <p>Evet! Temel özelliklerin tamamı ücretsizdir. İsterseniz premium özelliklere de geçiş yapabilirsiniz.</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">Planlarımı nasıl kişiselleştirebilirim?</h3>
            <p>Profilinizi doldurduktan sonra hedeflerinize ve tercihinize göre size özel planlar oluşturulur.</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">Topluluk nedir?</h3>
            <p>Başarı hikâyelerini paylaşabilir, diğer kullanıcılarla iletişim kurabilir ve motivasyon bulabilirsiniz.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <motion.h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-fitness-blue dark:text-fitness-green" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}>
          Hemen Başla, Hayalindeki Vücuda Ulaş!
        </motion.h2>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">Kişisel sağlık ve fitness yolculuğunda sana özel destek almak için hemen kaydol.</p>
        <motion.button
          className="px-8 py-3 rounded-full bg-fitness-blue text-white font-bold text-lg shadow-lg transition-all duration-300 hover:bg-fitness-green scale-100 hover:scale-105"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth/register')}
        >
          Ücretsiz Kayıt Ol
        </motion.button>
      </section>
    </div>
  )
}
