import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('chats');
    const messages = await collection.find({ userId }).sort({ createdAt: 1 }).toArray();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Sohbet geçmişi getirilirken hata:', error);
    return NextResponse.json({ error: 'Sohbet geçmişi getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, message, role } = await request.json();
    if (!userId || !message || !role) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('chats');
    const chatMessage = {
      userId,
      message,
      role, // 'user' veya 'assistant'
      createdAt: new Date(),
    };
    const result = await collection.insertOne(chatMessage);
    return NextResponse.json({ ...chatMessage, _id: result.insertedId });
  } catch (error) {
    console.error('Sohbet mesajı kaydedilirken hata:', error);
    return NextResponse.json({ error: 'Sohbet mesajı kaydedilemedi' }, { status: 500 });
  }
}
