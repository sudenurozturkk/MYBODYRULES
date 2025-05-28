export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-dark">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h1>
        <form className="space-y-4">
          <input type="text" placeholder="Ad Soyad" className="input w-full" />
          <input type="email" placeholder="E-posta" className="input w-full" />
          <input type="password" placeholder="Şifre" className="input w-full" />
          <button type="submit" className="btn-primary w-full">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
} 