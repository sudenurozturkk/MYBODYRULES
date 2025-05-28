'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline'
import { Note } from '@/models/Note'
import Sidebar from '@/components/Sidebar'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = 'user123' // Geçici olarak sabit bir kullanıcı ID'si kullanıyoruz

  useEffect(() => {
    fetchNotes()
  }, [searchQuery, activeTags])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let url = `/api/notes?userId=${userId}`
      if (searchQuery) {
        url += `&search=${searchQuery}`
      }
      if (activeTags.length > 0) {
        url += `&tag=${activeTags[0]}` // Şimdilik tek etiket ile filtreleme yapıyoruz
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Notlar getirilemedi')
      }

      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    try {
      setError(null)
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          title,
          content,
          tags
        })
      })

      if (!response.ok) {
        throw new Error('Not oluşturulamadı')
      }

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleUpdateNote = async (note: Note) => {
    try {
      setError(null)
      const response = await fetch(`/api/notes/${note._id?.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          title,
          content,
          tags
        })
      })

      if (!response.ok) {
        throw new Error('Not güncellenemedi')
      }

      const updatedNote = await response.json()
      setNotes(notes.map(n => n._id?.toString() === note._id?.toString() ? updatedNote : n))
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/notes/${noteId}?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Not silinemedi')
      }

      setNotes(notes.filter(n => n._id?.toString() !== noteId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return
    setTags([...tags, tagInput.trim()])
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleToggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setTags([])
    setTagInput('')
    setIsCreating(false)
    setEditingNote(null)
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
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-red-500 bg-clip-text text-transparent mb-4">Notlar</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Sağlık ve fitness notlarınızı yönetin
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Arama ve Filtreleme */}
          <div className="mb-8">
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Notlarda ara..."
                className="input flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(notes.flatMap(note => note.tags))).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                    activeTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <TagIcon className="w-4 h-4" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Not Oluşturma/Düzenleme Formu */}
          <AnimatePresence>
            {(isCreating || editingNote) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card mb-8"
              >
                <h2 className="text-xl font-heading font-semibold mb-4">
                  {editingNote ? 'Notu Düzenle' : 'Yeni Not'}
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
                      placeholder="Not başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      İçerik
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="input w-full"
                      rows={5}
                      placeholder="Not içeriği"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Etiketler
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Etiket ekle..."
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            handleAddTag()
                          }
                        }}
                      />
                      <button
                        onClick={handleAddTag}
                        className="btn-secondary"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => editingNote ? handleUpdateNote(editingNote) : handleCreateNote()}
                      className="btn-primary"
                    >
                      {editingNote ? 'Güncelle' : 'Oluştur'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <motion.div
                key={note._id?.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingNote(note)
                        setTitle(note.title)
                        setContent(note.content)
                        setTags(note.tags)
                      }}
                      className="p-2 text-gray-500 hover:text-primary"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id?.toString() || '')}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {note.content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center"
                    >
                      <TagIcon className="w-4 h-4 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Oluşturulma: {new Date(note.createdAt).toLocaleDateString('tr-TR')}</p>
                  <p>Son Güncelleme: {new Date(note.updatedAt).toLocaleDateString('tr-TR')}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Yeni Not Ekleme Butonu */}
          {!isCreating && !editingNote && (
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