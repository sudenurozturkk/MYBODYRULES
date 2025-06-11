'use client';

import { useState, useEffect } from 'react';
// import NavBar from '@/components/NavBar'
import RecipeCard from '@/components/RecipeCard';
import CategoryFilter from '@/components/CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Tümü',
  'Tatlı',
  'Ana Yemek',
  'Atıştırmalık',
  'Meyve',
  'Vejetaryen',
  'Kendi Tariflerim',
];

const userId = 'user123'; // Geçici kullanıcı

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [image, setImage] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('recipes');
    let parsed: any[] = [];
    try {
      parsed = stored ? JSON.parse(stored) : [];
    } catch {
      parsed = [];
    }
    if (!stored || (Array.isArray(parsed) && parsed.length === 0)) {
      import('../../data/recipes.json').then((mod) => {
        setRecipes(mod.default);
        localStorage.setItem('recipes', JSON.stringify(mod.default));
      });
    } else {
      setRecipes(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory === 'Kendi Tariflerim') {
      matchesCategory = r.userId === userId;
    } else if (selectedCategory !== 'Tümü') {
      matchesCategory = (r.category || [])
        .map((c: string) => c.toLowerCase())
        .includes(selectedCategory.toLowerCase());
    }
    return matchesSearch && matchesCategory;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const handleCreateRecipe = () => {
    const newRecipe = {
      _id: Date.now().toString(),
      userId,
      title,
      description,
      category,
      image,
      ingredients,
      steps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRecipes([newRecipe, ...recipes]);
    setTitle('');
    setDescription('');
    setCategory([]);
    setImage('');
    setIngredients([]);
    setSteps([]);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark">
      {/* <NavBar /> */}

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold mb-4">Tarifler</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sağlıklı ve lezzetli tarifler keşfedin veya kendi tarifinizi ekleyin!
            </p>
          </motion.div>

          <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tariflerde ara..."
              className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue"
            />
            <button className="btn-primary rounded-xl" onClick={() => setIsCreating(true)}>
              + Tarif Ekle
            </button>
          </div>

          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card mb-8 bg-white/95 dark:bg-neutral-900/90 rounded-2xl shadow-2xl p-8 border border-fitness-blue/30"
              >
                <h2 className="text-2xl font-heading font-bold mb-4 text-fitness-blue dark:text-fitness-green">
                  Yeni Tarif
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
                      className="input w-full rounded-xl shadow focus:ring-2 focus:ring-fitness-blue"
                      placeholder="Tarif başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input w-full rounded-xl shadow focus:ring-2 focus:ring-fitness-blue"
                      rows={3}
                      placeholder="Tarif açıklaması"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategoriler
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c !== 'Tümü' && c !== 'Kendi Tariflerim').map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all duration-200 ${category.includes(cat) ? 'bg-fitness-blue text-white border-fitness-blue' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                            onClick={() =>
                              setCategory((prev) =>
                                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                              )
                            }
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resim
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {image && (
                      <img
                        src={image}
                        alt="Tarif görseli"
                        className="mt-2 w-32 h-32 object-cover rounded-xl border"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Malzemeler
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Malzeme ekle..."
                        className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddIngredient();
                        }}
                      />
                      <button onClick={handleAddIngredient} className="btn-secondary rounded-xl">
                        Ekle
                      </button>
                    </div>
                    <ul className="list-disc pl-5">
                      {ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adımlar
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        placeholder="Adım ekle..."
                        className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddStep();
                        }}
                      />
                      <button onClick={handleAddStep} className="btn-secondary rounded-xl">
                        Ekle
                      </button>
                    </div>
                    <ol className="list-decimal pl-5">
                      {steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="btn-secondary rounded-xl"
                    >
                      İptal
                    </button>
                    <button onClick={handleCreateRecipe} className="btn-primary rounded-xl">
                      Oluştur
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-80">
                <img
                  src="/empty-recipes-modern.svg"
                  alt="Boş Tarifler"
                  className="w-40 h-40 mb-6 animate-bounce"
                />
                <p className="text-2xl font-bold text-fitness-blue mb-2">Henüz hiç tarif yok!</p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Sağlıklı ve lezzetli tarifler ekleyerek topluluğa ilham ol!
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-primary rounded-xl px-6 py-3 text-lg shadow-lg hover:scale-105 transition"
                >
                  + İlk Tarifini Ekle
                </button>
              </div>
            )}
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                title={recipe.title}
                image={recipe.image}
                description={recipe.description}
                category={
                  Array.isArray(recipe.category) ? recipe.category.join(', ') : recipe.category
                }
                onClick={() => {
                  // Tarif detay sayfasına yönlendirme veya modal açma
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
