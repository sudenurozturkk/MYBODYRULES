import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { Recipe, RecipeInput } from '@/models/Recipe'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Recipe>('recipes')

    const query: any = {}
    if (category) {
      query.category = category
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const recipes = await collection.find(query).toArray()
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Tarifler getirilirken hata:', error)
    return NextResponse.json({ error: 'Tarifler getirilemedi' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const recipeInput: RecipeInput = await request.json()
    const { title, description, prepTime, calories, macros, category, ingredients, instructions, imageUrl } = recipeInput

    if (!title || !description || !prepTime || !calories || !macros || !category || !ingredients || !instructions || !imageUrl) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Recipe>('recipes')

    const recipe: Recipe = {
      title,
      description,
      prepTime,
      calories,
      macros,
      category,
      ingredients,
      instructions,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(recipe)
    return NextResponse.json({ ...recipe, _id: result.insertedId })
  } catch (error) {
    console.error('Tarif oluşturulurken hata:', error)
    return NextResponse.json({ error: 'Tarif oluşturulamadı' }, { status: 500 })
  }
} 