# Realtime Chat App - Backend

## Proje Açıklaması
Bu, **Realtime Chat App** uygulamasının backend tarafıdır. Kullanıcıların gerçek zamanlı mesajlaşma deneyimi yaşayabilmesi için gerekli olan tüm sunucu tarafı işlemleri burada yönetilmektedir. Backend; kullanıcı kimlik doğrulama, veri tabanı işlemleri, güvenlik ve gerçek zamanlı iletişim özelliklerini destekler.

## Kullanılan Teknolojiler
- **Node.js**: Sunucu tarafında çalıştırmak için.
- **Express.js**: API oluşturmak ve middleware kullanmak için.
- **Mongoose**: MongoDB ile çalışmak için bir ODM (Object Data Modeling) kütüphanesi.
- **Cookie-Parser**: Çerezleri işlemek için.
- **CORS**: Farklı kökenlerden gelen isteklerin yönetimi için.
- **dotenv**: Ortam değişkenlerini yönetmek için.
- **jsonwebtoken (JWT)**: Kullanıcı kimlik doğrulaması için.
- **bcrypt**: Şifrelerin güvenli bir şekilde hashlenmesi için.

## Proje Kurulumu

### Gereksinimler
- Node.js (v18 veya daha yenisi)
- MongoDB

### Backend Kurulumu
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/ismailkskn98/realtime-chat-app-server
   cd realtime-chat-app-server
