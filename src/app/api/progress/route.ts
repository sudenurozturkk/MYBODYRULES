import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { Progress, ProgressInput } from '@/models/Progress'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Progress>('progress')

    const query: any = { userId }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const progress = await collection.find(query).sort({ date: -1 }).toArray()
    return NextResponse.json(progress)
  } catch (error) {
    console.error('İlerleme kayıtları getirilirken hata:', error)
    return NextResponse.json({ error: 'İlerleme kayıtları getirilemedi' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const progressInput: ProgressInput = await request.json()
    const { userId, date, weight, bodyFat, measurements, photos, notes } = progressInput

    if (!userId || !date || !weight) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Progress>('progress')

    const progress: Progress = {
      userId,
      date: new Date(date),
      weight,
      bodyFat,
      measurements,
      photos,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(progress)
    return NextResponse.json({ ...progress, _id: result.insertedId })
  } catch (error) {
    console.error('İlerleme kaydı oluşturulurken hata:', error)
    return NextResponse.json({ error: 'İlerleme kaydı oluşturulamadı' }, { status: 500 })
  }
} 