'use client'

import { useState } from 'react'
import NavBar from '@/components/NavBar'
import RecipeCard from '@/components/RecipeCard'
import CategoryFilter from '@/components/CategoryFilter'
import { motion } from 'framer-motion'

// Örnek tarif verileri
const sampleRecipes = [
  {
    id: 1,
    title: 'Protein Smoothie Bowl',
    description: 'Yüksek proteinli, besleyici ve lezzetli bir smoothie bowl tarifi.',
    image: '/images/recipes/smoothie-bowl.jpg',
    prepTime: 10,
    calories: 350,
    macros: {
      protein: 25,
      carbs: 45,
      fat: 8
    },
    category: 'Kahvaltı'
  },
  {
    id: 2,
    title: 'Izgara Somon',
    description: 'Omega-3 açısından zengin, sağlıklı bir akşam yemeği.',
    image: '/images/recipes/grilled-salmon.jpg',
    prepTime: 25,
    calories: 450,
    macros: {
      protein: 35,
      carbs: 15,
      fat: 28
    },
    category: 'Akşam Yemeği'
  },
  // Daha fazla örnek tarif eklenebilir
]

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')

  const filteredRecipes = selectedCategory === 'Tümü'
    ? sampleRecipes
    : sampleRecipes.filter(recipe => recipe.category === selectedCategory)

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
            <h1 className="text-3xl font-heading font-bold mb-4">Tarifler</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sağlıklı ve lezzetli tarifler keşfedin
            </p>
          </motion.div>

          <div className="mb-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                onClick={() => {
                  // Tarif detay sayfasına yönlendirme
                  console.log('Tarif detayı:', recipe.id)
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 