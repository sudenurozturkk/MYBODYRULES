'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { motion } from 'framer-motion'
import { UserIcon, HeartIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'
import { UserProfile } from '@/models/User'
// import Sidebar from '@/components/Sidebar'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    userId: 'user123', // Geçici olarak sabit bir kullanıcı ID'si kullanıyoruz
    personalInfo: {
      name: '',
      age: 0,
      gender: undefined,
      height: 0,
      weight: 0,
      activityLevel: 'moderate'
    },
    healthInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      bloodType: ''
    },
    preferences: {
      dietaryRestrictions: [],
      fitnessGoals: [],
      mealPreferences: [],
      workoutPreferences: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'health' | 'preferences'>('personal')
  const [newItem, setNewItem] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/profile?userId=${profile.userId}`)
      if (!response.ok) {
        throw new Error('Profil getirilemedi')
      }

      const data = await response.json()
      if (data) {
        setProfile(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async (updatedProfile: UserProfile) => {
    try {
      setError(null)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      })

      if (!response.ok) {
        throw new Error('Profil güncellenemedi')
      }

      const data = await response.json()
      setProfile(data)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleInputChange = (section: keyof UserProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section: keyof UserProfile, field: string, action: 'add' | 'remove', value: string) => {
    setProfile(prev => {
      const currentArray = prev[section][field as keyof typeof prev[typeof section]] as string[]
      const updatedArray = action === 'add'
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value)

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: updatedArray
        }
      }
    })
  }

  const calculateBMI = () => {
    const { height, weight } = profile.personalInfo
    if (height && weight) {
      const heightInMeters = height / 100
      return (weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return '0'
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Zayıf'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Fazla Kilolu'
    return 'Obez'
  }

  const calculateBMR = () => {
    const { age, gender, height, weight } = profile.personalInfo
    if (age && height && weight) {
      // Mifflin-St Jeor Denklemi
      let bmr = 10 * weight + 6.25 * height - 5 * age
      bmr = gender === 'male' ? bmr + 5 : bmr - 161
      return Math.round(bmr)
    }
    return 0
  }

  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    return Math.round(bmr * activityMultipliers[profile.personalInfo.activityLevel as keyof typeof activityMultipliers])
  }

  return (
    <div className="flex min-h-screen bg-neutral-light dark:bg-neutral-dark">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold mb-4">Profil</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kişisel bilgilerinizi ve tercihlerinizi yönetin
            </p>
          </motion.div>

          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vücut Kitle İndeksi
                  </h3>
                  <p className="text-2xl font-bold">
                    {calculateBMI()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getBMICategory(parseFloat(calculateBMI()))}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bazal Metabolizma
                  </h3>
                  <p className="text-2xl font-bold">
                    {calculateBMR()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    kcal/gün
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FireIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Günlük Enerji İhtiyacı
                  </h3>
                  <p className="text-2xl font-bold">
                    {calculateTDEE()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    kcal/gün
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BeakerIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Aktivite Seviyesi
                  </h3>
                  <p className="text-2xl font-bold">
                    {profile.personalInfo.activityLevel === 'sedentary' && 'Hareketsiz'}
                    {profile.personalInfo.activityLevel === 'light' && 'Hafif Aktif'}
                    {profile.personalInfo.activityLevel === 'moderate' && 'Orta Aktif'}
                    {profile.personalInfo.activityLevel === 'active' && 'Aktif'}
                    {profile.personalInfo.activityLevel === 'veryActive' && 'Çok Aktif'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profil Düzenleme */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-semibold">Profil Bilgileri</h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    saveProfile(profile)
                  }
                  setIsEditing(!isEditing)
                }}
                className="btn-primary"
              >
                {isEditing ? 'Kaydet' : 'Düzenle'}
              </button>
            </div>

            {/* Sekmeler */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'personal'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Kişisel Bilgiler
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'health'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Sağlık Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'preferences'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Tercihler
                </button>
              </nav>
            </div>

            {/* Kişisel Bilgiler */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      disabled={!isEditing}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Yaş
                    </label>
                    <input
                      type="number"
                      value={profile.personalInfo.age}
                      onChange={(e) => handleInputChange('personalInfo', 'age', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cinsiyet
                    </label>
                    <select
                      value={profile.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      disabled={!isEditing}
                      className="input w-full"
                    >
                      <option value="">Seçiniz</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aktivite Seviyesi
                    </label>
                    <select
                      value={profile.personalInfo.activityLevel}
                      onChange={(e) => handleInputChange('personalInfo', 'activityLevel', e.target.value)}
                      disabled={!isEditing}
                      className="input w-full"
                    >
                      <option value="sedentary">Hareketsiz</option>
                      <option value="light">Hafif Aktif</option>
                      <option value="moderate">Orta Aktif</option>
                      <option value="active">Aktif</option>
                      <option value="veryActive">Çok Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Boy (cm)
                    </label>
                    <input
                      type="number"
                      value={profile.personalInfo.height}
                      onChange={(e) => handleInputChange('personalInfo', 'height', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kilo (kg)
                    </label>
                    <input
                      type="number"
                      value={profile.personalInfo.weight}
                      onChange={(e) => handleInputChange('personalInfo', 'weight', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sağlık Bilgileri */}
            {activeTab === 'health' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kan Grubu
                  </label>
                  <select
                    value={profile.healthInfo.bloodType}
                    onChange={(e) => handleInputChange('healthInfo', 'bloodType', e.target.value)}
                    disabled={!isEditing}
                    className="input w-full"
                  >
                    <option value="">Seçiniz</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="0+">0+</option>
                    <option value="0-">0-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alerjiler
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.healthInfo.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {allergy}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('healthInfo', 'allergies', 'remove', allergy)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Alerji ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('healthInfo', 'allergies', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('healthInfo', 'allergies', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sağlık Durumları
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.healthInfo.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {condition}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('healthInfo', 'conditions', 'remove', condition)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Sağlık durumu ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('healthInfo', 'conditions', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('healthInfo', 'conditions', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kullandığı İlaçlar
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.healthInfo.medications.map((medication, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {medication}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('healthInfo', 'medications', 'remove', medication)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="İlaç ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('healthInfo', 'medications', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('healthInfo', 'medications', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tercihler */}
            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beslenme Kısıtlamaları
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.preferences.dietaryRestrictions.map((restriction, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {restriction}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('preferences', 'dietaryRestrictions', 'remove', restriction)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Kısıtlama ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('preferences', 'dietaryRestrictions', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('preferences', 'dietaryRestrictions', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fitness Hedefleri
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.preferences.fitnessGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {goal}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('preferences', 'fitnessGoals', 'remove', goal)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Hedef ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('preferences', 'fitnessGoals', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('preferences', 'fitnessGoals', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yemek Tercihleri
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.preferences.mealPreferences.map((preference, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {preference}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('preferences', 'mealPreferences', 'remove', preference)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Tercih ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('preferences', 'mealPreferences', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('preferences', 'mealPreferences', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Egzersiz Tercihleri
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.preferences.workoutPreferences.map((preference, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                      >
                        {preference}
                        {isEditing && (
                          <button
                            onClick={() => handleArrayChange('preferences', 'workoutPreferences', 'remove', preference)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Tercih ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            handleArrayChange('preferences', 'workoutPreferences', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newItem.trim()) {
                            handleArrayChange('preferences', 'workoutPreferences', 'add', newItem.trim())
                            setNewItem('')
                          }
                        }}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 