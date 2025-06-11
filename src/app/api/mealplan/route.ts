import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { MealPlan, MealPlanInput } from '@/models/MealPlan';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const weekStart = searchParams.get('weekStart');
    if (!userId || !weekStart) {
      return NextResponse.json(
        { error: 'Kullanıcı ID ve hafta başlangıcı gerekli' },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<MealPlan>('mealplans');
    const plans = await collection.find({ userId, weekStart }).toArray();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Öğün planları getirilirken hata:', error);
    return NextResponse.json({ error: 'Öğün planları getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input: MealPlanInput = await request.json();
    const { userId, weekStart, day, mealType, food, source, recipeId } = input;
    if (!userId || !weekStart || !day || !mealType || !food || !source) {
      return NextResponse.json({ error: 'Tüm alanlar zorunlu' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<MealPlan>('mealplans');
    const plan: MealPlan = {
      userId,
      weekStart,
      day,
      mealType,
      food,
      source,
      recipeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(plan);
    return NextResponse.json({ ...plan, _id: result.insertedId });
  } catch (error) {
    console.error('Öğün planı eklenirken hata:', error);
    return NextResponse.json({ error: 'Öğün planı eklenemedi' }, { status: 500 });
  }
}
