export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-fitness-blue via-fitness-green to-fitness-orange/30">
      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-2xl p-10 w-full max-w-2xl flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent mb-4">
          Dashboard&apos;a Hoş Geldin!
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-200 text-center text-lg max-w-xl">
          Sağlık ve fitness yolculuğunda buradan tüm verilerine, hedeflerine ve topluluğa
          ulaşabilirsin. Sol menüden istediğin bölüme geçiş yapabilirsin.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mt-4">
          <div className="bg-gradient-to-br from-fitness-blue/80 to-fitness-green/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">💪</span>
            <div className="font-bold mt-2">İlerleme Takibi</div>
            <div className="text-sm mt-1">Gelişimini grafiklerle takip et.</div>
          </div>
          <div className="bg-gradient-to-br from-fitness-orange/80 to-fitness-green/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">📝</span>
            <div className="font-bold mt-2">Notlar &amp; Hedefler</div>
            <div className="text-sm mt-1">Kişisel notlarını ve hedeflerini kaydet.</div>
          </div>
          <div className="bg-gradient-to-br from-fitness-blue/80 to-fitness-orange/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">🍲</span>
            <div className="font-bold mt-2">Tarifler</div>
            <div className="text-sm mt-1">Sağlıklı tarif önerilerini keşfet.</div>
          </div>
          <div className="bg-gradient-to-br from-fitness-green/80 to-fitness-blue/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">💬</span>
            <div className="font-bold mt-2">Topluluk Sohbeti</div>
            <div className="text-sm mt-1">Diğer kullanıcılarla iletişim kur.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
