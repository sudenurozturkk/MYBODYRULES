import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Boş alan kontrolü
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-posta ve şifre alanları boş bırakılamaz',
        },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Geçerli bir e-posta adresi giriniz',
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı',
        },
        { status: 401 }
      );
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: 'Şifre hatalı',
        },
        { status: 401 }
      );
    }
    // Giriş başarılı
    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Giriş yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      },
      { status: 500 }
    );
  }
}
