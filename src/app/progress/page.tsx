'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Progress } from '@/models/Progress'

export default function ProgressPage() {
  const [progressRecords, setProgressRecords] = useState<Progress[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null)
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [measurements, setMeasurements] = useState<Progress['measurements']>({
    chest: undefined,
    waist: undefined,
    hips: undefined,
    biceps: undefined,
    thighs: undefined,
    calves: undefined
  })
  const [photos, setPhotos] = useState<Progress['photos']>({})
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = 'user123' // Geçici olarak sabit bir kullanıcı ID'si kullanıyoruz

  useEffect(() => {
    fetchProgressRecords()
  }, [])

  const fetchProgressRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/progress?userId=${userId}`)
      if (!response.ok) {
        throw new Error('İlerleme kayıtları getirilemedi')
      }

      const data = await response.json()
      setProgressRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProgress = async () => {
    try {
      setError(null)

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          date,
          weight: Number(weight),
          bodyFat: bodyFat ? Number(bodyFat) : undefined,
          measurements,
          photos,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('İlerleme kaydı oluşturulamadı')
      }

      const newProgress = await response.json()
      setProgressRecords([newProgress, ...progressRecords])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleUpdateProgress = async (progress: Progress) => {
    try {
      setError(null)

      const response = await fetch(`/api/progress/${progress._id?.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          date,
          weight: Number(weight),
          bodyFat: bodyFat ? Number(bodyFat) : undefined,
          measurements,
          photos,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('İlerleme kaydı güncellenemedi')
      }

      const updatedProgress = await response.json()
      setProgressRecords(progressRecords.map(p => p._id?.toString() === progress._id?.toString() ? updatedProgress : p))
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleDeleteProgress = async (progressId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/progress/${progressId}?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('İlerleme kaydı silinemedi')
      }

      setProgressRecords(progressRecords.filter(p => p._id?.toString() !== progressId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleMeasurementChange = (field: keyof Progress['measurements'], value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value ? Number(value) : undefined
    }))
  }

  const resetForm = () => {
    setDate('')
    setWeight('')
    setBodyFat('')
    setMeasurements({
      chest: undefined,
      waist: undefined,
      hips: undefined,
      biceps: undefined,
      thighs: undefined,
      calves: undefined
    })
    setPhotos({})
    setNotes('')
    setIsCreating(false)
    setEditingProgress(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark">
        <NavBar />
        <main className="md:ml-64 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark">
      <NavBar />
      
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold mb-4">İlerleme Takibi</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Vücut ölçülerinizi ve ilerlemenizi takip edin
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* İlerleme Kaydı Oluşturma/Düzenleme Formu */}
          <AnimatePresence>
            {(isCreating || editingProgress) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card mb-8"
              >
                <h2 className="text-xl font-heading font-semibold mb-4">
                  {editingProgress ? 'İlerleme Kaydını Düzenle' : 'Yeni İlerleme Kaydı'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tarih
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kilo (kg)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="input w-full"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vücut Yağ Oranı (%)
                      </label>
                      <input
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        className="input w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ölçüler (cm)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Göğüs
                        </label>
                        <input
                          type="number"
                          value={measurements.chest || ''}
                          onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bel
                        </label>
                        <input
                          type="number"
                          value={measurements.waist || ''}
                          onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Kalça
                        </label>
                        <input
                          type="number"
                          value={measurements.hips || ''}
                          onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Biceps
                        </label>
                        <input
                          type="number"
                          value={measurements.biceps || ''}
                          onChange={(e) => handleMeasurementChange('biceps', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bacak
                        </label>
                        <input
                          type="number"
                          value={measurements.thighs || ''}
                          onChange={(e) => handleMeasurementChange('thighs', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Baldır
                        </label>
                        <input
                          type="number"
                          value={measurements.calves || ''}
                          onChange={(e) => handleMeasurementChange('calves', e.target.value)}
                          className="input w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notlar
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input w-full"
                      rows={3}
                      placeholder="İlerleme notları"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => editingProgress ? handleUpdateProgress(editingProgress) : handleCreateProgress()}
                      className="btn-primary"
                    >
                      {editingProgress ? 'Güncelle' : 'Oluştur'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* İlerleme Kayıtları Listesi */}
          <div className="grid grid-cols-1 gap-6">
            {progressRecords.map((progress) => (
              <motion.div
                key={progress._id?.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {new Date(progress.date).toLocaleDateString('tr-TR')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Kilo: {progress.weight} kg
                      {progress.bodyFat && ` | Vücut Yağ Oranı: %${progress.bodyFat}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProgress(progress)
                        setDate(new Date(progress.date).toISOString().split('T')[0])
                        setWeight(progress.weight.toString())
                        setBodyFat(progress.bodyFat?.toString() || '')
                        setMeasurements(progress.measurements)
                        setPhotos(progress.photos || {})
                        setNotes(progress.notes || '')
                      }}
                      className="p-2 text-gray-500 hover:text-primary"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgress(progress._id?.toString() || '')}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ölçüler</h4>
                    <div className="space-y-2">
                      {progress.measurements.chest && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Göğüs: {progress.measurements.chest} cm
                        </p>
                      )}
                      {progress.measurements.waist && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Bel: {progress.measurements.waist} cm
                        </p>
                      )}
                      {progress.measurements.hips && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Kalça: {progress.measurements.hips} cm
                        </p>
                      )}
                      {progress.measurements.biceps && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Biceps: {progress.measurements.biceps} cm
                        </p>
                      )}
                      {progress.measurements.thighs && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Bacak: {progress.measurements.thighs} cm
                        </p>
                      )}
                      {progress.measurements.calves && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Baldır: {progress.measurements.calves} cm
                        </p>
                      )}
                    </div>
                  </div>

                  {progress.photos && Object.keys(progress.photos).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Fotoğraflar</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {progress.photos.front && (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={progress.photos.front}
                              alt="Ön görünüm"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {progress.photos.side && (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={progress.photos.side}
                              alt="Yan görünüm"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {progress.photos.back && (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={progress.photos.back}
                              alt="Arka görünüm"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {progress.notes && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {progress.notes}
                    </p>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Oluşturulma: {new Date(progress.createdAt).toLocaleDateString('tr-TR')}</p>
                  <p>Son Güncelleme: {new Date(progress.updatedAt).toLocaleDateString('tr-TR')}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Yeni İlerleme Kaydı Ekleme Butonu */}
          {!isCreating && !editingProgress && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsCreating(true)}
              className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
            >
              <PlusIcon className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </main>
    </div>
  )
} 