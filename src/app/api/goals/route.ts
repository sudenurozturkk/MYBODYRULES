import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { Goal, GoalInput } from '@/models/Goal';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Goal>('goals');

    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const goals = await collection.find(query).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Hedefler getirilirken hata:', error);
    return NextResponse.json({ error: 'Hedefler getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const goalInput: GoalInput = await request.json();
    const {
      userId,
      title,
      description,
      type,
      targetValue,
      currentValue,
      unit,
      deadline,
      milestones,
    } = goalInput;

    if (!userId || !title || !type || !targetValue || !currentValue || !unit || !deadline) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Goal>('goals');

    const goal: Goal = {
      userId,
      title,
      description,
      type,
      targetValue,
      currentValue,
      unit,
      deadline: new Date(deadline),
      milestones: milestones || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(goal);
    return NextResponse.json({ ...goal, _id: result.insertedId });
  } catch (error) {
    console.error('Hedef oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Hedef oluşturulamadı' }, { status: 500 });
  }
}
