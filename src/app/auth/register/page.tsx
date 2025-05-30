'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Burada gerçek API isteği yapılabilir
      // Simülasyon: Başarılı kayıt
      setTimeout(() => {
        setLoading(false);
        setSuccess('Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }, 1200);
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-neutral-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center"
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent mb-2">
          Kayıt Ol
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-300 text-center">
          Kişisel sağlık ve fitness yolculuğuna başlamak için kaydol.
        </p>
        {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-fitness-blue" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="input w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-fitness-blue focus:ring-2 focus:ring-fitness-blue/30 transition"
              required
            />
          </div>
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-fitness-blue" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className="input w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-fitness-blue focus:ring-2 focus:ring-fitness-blue/30 transition"
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-fitness-blue" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="input w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-fitness-blue focus:ring-2 focus:ring-fitness-blue/30 transition"
              required
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white font-bold text-lg shadow-lg transition-all duration-300 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
