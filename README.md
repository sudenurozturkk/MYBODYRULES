# MyBodyRules - Kişisel Sağlık ve Fitness Takip Uygulaması

![MyBodyRules Logo](logo.png) <!-- Eğer bir logonuz varsa -->

## Proje Hakkında

MyBodyRules, kullanıcıların sağlık ve fitness hedeflerini takip etmelerine, kişiselleştirilmiş öneriler almalarına ve ilerlemelerini görselleştirmelerine olanak tanıyan modern bir web uygulamasıdır. Kullanıcılar, günlük aktivitelerini, beslenme alışkanlıklarını ve fitness hedeflerini kaydedebilir, ilerlemelerini takip edebilir ve toplulukla etkileşimde bulunabilirler.

## ✨ Özellikler

- **Kullanıcı Kimlik Doğrulama:** Güvenli giriş ve kayıt sistemi.
- **Kişiselleştirilmiş Profil:** Kullanıcıların sağlık ve fitness hedeflerini belirleyebilecekleri özelleştirilebilir profiller.
- **Aktivite Takibi:** Günlük aktivitelerin ve egzersizlerin kaydedilmesi ve takibi.
- **Beslenme Takibi:** Günlük beslenme alışkanlıklarının kaydedilmesi ve analizi.
- **İlerleme Görselleştirme:** Kullanıcıların ilerlemelerini grafikler ve istatistiklerle görselleştirme.
- **Topluluk Etkileşimi:** Kullanıcıların birbirleriyle etkileşimde bulunabilecekleri bir topluluk platformu.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Veritabanı:** MongoDB
- **Kimlik Doğrulama:** JWT (JSON Web Token)
- **Diğer Araçlar:** Git, GitHub, VS Code

## 🚀 Kurulum

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/kullaniciadi/mybodyrules.git
   cd mybodyrules
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **.env Dosyasını Oluşturun:**
   Projenin kök dizininde `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
   ```
   MONGODB_URI=mongodb://<username>:<password>@<host>:<port>/<database>
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Uygulamayı Başlatın:**
```bash
npm run dev
   ```

5. **Tarayıcıda Açın:**
   Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 👥 Katkıda Bulunma

1. Bu depoyu fork edin.
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`).
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`).
4. Dalınıza push edin (`git push origin feature/amazing-feature`).
5. Bir Pull Request açın.

## 📞 İletişim

Eğer sorularınız veya önerileriniz varsa, lütfen [GitHub Issues](https://github.com/kullaniciadi/mybodyrules/issues) üzerinden bize ulaşın.

## 🙏 Teşekkürler

Bu projeye katkıda bulunan herkese teşekkür ederiz!
