import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Tüm alanlar zorunlu.' },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    // Email benzersiz mi?
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Bu e-posta ile zaten kayıtlı bir kullanıcı var.' },
        { status: 409 }
      );
    }
    // Şifreyi hashle
    const hashedPassword = await hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await users.insertOne(user);
    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı!',
      userId: result.insertedId,
    });
  } catch (error) {
    console.error('Kayıt API hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Kayıt sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
