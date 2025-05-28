import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { UserProfile, UserProfileInput } from '@/models/User'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<UserProfile>('profiles')

    const profile = await collection.findOne({ userId })
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profil getirilirken hata:', error)
    return NextResponse.json({ error: 'Profil getirilemedi' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const profileInput: UserProfileInput = await request.json()
    const { userId, personalInfo, healthInfo, preferences } = profileInput

    if (!userId || !personalInfo || !healthInfo || !preferences) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<UserProfile>('profiles')

    const profile: UserProfile = {
      userId,
      personalInfo,
      healthInfo,
      preferences,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(profile)
    return NextResponse.json({ ...profile, _id: result.insertedId })
  } catch (error) {
    console.error('Profil oluşturulurken hata:', error)
    return NextResponse.json({ error: 'Profil oluşturulamadı' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const profileInput: UserProfileInput = await request.json()
    const { userId, personalInfo, healthInfo, preferences } = profileInput

    if (!userId || !personalInfo || !healthInfo || !preferences) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<UserProfile>('profiles')

    const result = await collection.findOneAndUpdate(
      { userId },
      {
        $set: {
          personalInfo,
          healthInfo,
          preferences,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after', upsert: true }
    )

    const value = (result as any)?.value;
    if (!value) {
      return NextResponse.json({ error: 'Profil bulunamadı' }, { status: 404 })
    }
    return NextResponse.json(value)
  } catch (error) {
    console.error('Profil güncellenirken hata:', error)
    return NextResponse.json({ error: 'Profil güncellenemedi' }, { status: 500 })
  }
} 