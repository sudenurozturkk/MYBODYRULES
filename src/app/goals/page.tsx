'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Goal } from '@/models/Goal'
import Sidebar from '@/components/Sidebar'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'weight' | 'fitness' | 'nutrition' | 'lifestyle'>('weight')
  const [targetValue, setTargetValue] = useState(0)
  const [currentValue, setCurrentValue] = useState(0)
  const [unit, setUnit] = useState('')
  const [deadline, setDeadline] = useState('')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = 'user123' // Geçici olarak sabit bir kullanıcı ID'si kullanıyoruz

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/goals?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Hedefler getirilemedi')
      }

      const data = await response.json()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    try {
      setError(null)
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          title,
          description,
          type,
          targetValue,
          currentValue,
          unit,
          deadline,
          milestones: []
        })
      })

      if (!response.ok) {
        throw new Error('Hedef oluşturulamadı')
      }

      const newGoal = await response.json()
      setGoals([newGoal, ...goals])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleUpdateGoal = async (goal: Goal) => {
    try {
      setError(null)
      const response = await fetch(`/api/goals/${goal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          title,
          description,
          type,
          targetValue,
          currentValue,
          unit,
          deadline,
          milestones: goal.milestones
        })
      })

      if (!response.ok) {
        throw new Error('Hedef güncellenemedi')
      }

      const updatedGoal = await response.json()
      setGoals(goals.map(g => g._id === goal._id ? updatedGoal : g))
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/goals/${goalId}?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Hedef silinemedi')
      }

      setGoals(goals.filter(g => String(g._id) !== goalId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleAddMilestone = (goal: Goal) => {
    if (!milestoneTitle.trim()) return

    const newMilestone = {
      id: Date.now().toString(),
      title: milestoneTitle,
      completed: false
    }

    const updatedGoal = {
      ...goal,
      milestones: [...goal.milestones, newMilestone]
    }

    handleUpdateGoal(updatedGoal)
    setMilestoneTitle('')
  }

  const handleToggleMilestone = (goal: Goal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map(milestone =>
      milestone.id === milestoneId
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    )

    const updatedGoal = {
      ...goal,
      milestones: updatedMilestones
    }

    handleUpdateGoal(updatedGoal)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setType('weight')
    setTargetValue(0)
    setCurrentValue(0)
    setUnit('')
    setDeadline('')
    setIsCreating(false)
    setEditingGoal(null)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-red-50 dark:from-blue-900 dark:via-green-900 dark:to-red-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-red-500 bg-clip-text text-transparent mb-4">Hedefler</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Sağlık ve fitness hedeflerinizi takip edin
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Hedef Oluşturma/Düzenleme Formu */}
          <AnimatePresence>
            {(isCreating || editingGoal) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card mb-8"
              >
                <h2 className="text-xl font-heading font-semibold mb-4">
                  {editingGoal ? 'Hedefi Düzenle' : 'Yeni Hedef'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input w-full"
                      placeholder="Hedef başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input w-full"
                      rows={3}
                      placeholder="Hedef açıklaması"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hedef Tipi
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as Goal['type'])}
                        className="input w-full"
                      >
                        <option value="weight">Kilo</option>
                        <option value="fitness">Fitness</option>
                        <option value="nutrition">Beslenme</option>
                        <option value="lifestyle">Yaşam Tarzı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Birim
                      </label>
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="input w-full"
                        placeholder="kg, km, adet, vb."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hedef Değer
                      </label>
                      <input
                        type="number"
                        value={targetValue}
                        onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mevcut Değer
                      </label>
                      <input
                        type="number"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
                        className="input w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="input w-full"
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
                      onClick={() => editingGoal ? handleUpdateGoal(editingGoal) : handleCreateGoal()}
                      className="btn-primary"
                    >
                      {editingGoal ? 'Güncelle' : 'Oluştur'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hedef Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <motion.div
                key={String(goal._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {goal.type === 'weight' && 'Kilo'}
                      {goal.type === 'fitness' && 'Fitness'}
                      {goal.type === 'nutrition' && 'Beslenme'}
                      {goal.type === 'lifestyle' && 'Yaşam Tarzı'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal)
                        setTitle(goal.title)
                        setDescription(goal.description)
                        setType(goal.type)
                        setTargetValue(goal.targetValue)
                        setCurrentValue(goal.currentValue)
                        setUnit(goal.unit)
                        setDeadline(new Date(goal.deadline).toISOString().split('T')[0])
                      }}
                      className="p-2 text-gray-500 hover:text-primary"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(String(goal._id))}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {goal.description}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>İlerleme</span>
                    <span>{calculateProgress(goal.currentValue, goal.targetValue)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{goal.currentValue} {goal.unit}</span>
                    <span>{goal.targetValue} {goal.unit}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Kilometre Taşları</h4>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center space-x-2"
                      >
                        <button
                          onClick={() => handleToggleMilestone(goal, milestone.id)}
                          className={`p-1 rounded ${
                            milestone.completed
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    placeholder="Yeni kilometre taşı..."
                    className="input flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && milestoneTitle.trim()) {
                        handleAddMilestone(goal)
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddMilestone(goal)}
                    className="btn-secondary"
                  >
                    Ekle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Yeni Hedef Ekleme Butonu */}
          {!isCreating && !editingGoal && (
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