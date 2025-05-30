import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { Note, NoteInput } from '@/models/Note';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Note>('notes');

    const query: any = { userId };
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await collection.find(query).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notlar getirilirken hata:', error);
    return NextResponse.json({ error: 'Notlar getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const noteInput: NoteInput = await request.json();
    const { userId, title, content, tags } = noteInput;

    if (!userId || !title || !content) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Note>('notes');

    const note: Note = {
      userId,
      title,
      content,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(note);
    return NextResponse.json({ ...note, _id: result.insertedId });
  } catch (error) {
    console.error('Not oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Not oluşturulamadı' }, { status: 500 });
  }
}
