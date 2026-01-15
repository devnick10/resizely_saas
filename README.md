# 📸 Resizely – Media Processing SaaS 🚀

Resizely is a **credit-based SaaS platform** for modern media processing.  
Users can **resize images**, **compress videos**, and **remove backgrounds**, while admins get full **platform control & analytics** via a dedicated **Admin Dashboard**.

🌐 **Live:** https://resizely.devnikhil.xyz

---

## 🌟 Features

### 👤 User Features
✅ **Image Resizing** – Optimize images for web & social platforms  
✅ **Video Compression** – Reduce size without noticeable quality loss  
✅ **Background Removal** – AI-powered subject extraction  
✅ **Credit-Based System** – 2 free credits, pay-as-you-go after  
✅ **Secure Payments** – Razorpay integration  
✅ **Authentication** – NextAuth (Google + Credentials)  
✅ **Fast Media Delivery** – Powered by Cloudinary  
✅ **Modern UI** – ShadCN UI + TailwindCSS  

---

### 🛡️ Admin Dashboard

Accessible **only to ADMIN users** with role-based protection.

✅ **User Management**
- View all users
- Block / Unblock users
- Permanently delete users

✅ **Role Management**
- Promote / Demote users (USER ↔ ADMIN)

✅ **Media Management**
- View all images & videos across users
- Delete media assets from DB & Cloudinary

✅ **Analytics**
- Cloudinary storage & bandwidth usage
- Platform media statistics
- Activity & admin action logs

✅ **Security**
- Protected admin routes
- Destructive action confirmations
- Server-side authorization checks

---

## 🛠️ Tech Stack

**Frontend & Backend**
- Next.js (App Router)
- TypeScript

**Database**
- Prisma ORM
- NeonDB (PostgreSQL)

**Media Processing**
- Cloudinary

**Authentication**
- NextAuth (Google & Credentials)

**Payments**
- Razorpay

**Email**
- Nodemailer (Mailtrap for development)

**UI / Styling**
- ShadCN UI
- TailwindCSS

**State Management**
- React Context / Zustand

**Deployment**
- Docker
- Docker Compose

---

## 🚀 Getting Started
### 1️⃣ Clone the Repository

```sh
git clone https://github.com/devnick10/resizely_saas.git
cd resizely_saas
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a **.env.local** file in the root directory and add the following:

```env
# Database
DATABASE_URL="postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZOR_PAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_RAZOR_PAY_KEY_ID=your_razorpay_key_id
RAZOR_KEY_SECRET=your_razorpay_secret

# NextAuth
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google Auth (for NextAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP (Mailtrap for development/testing)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORTS=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
```

---

### 🐳 Docker Setup

#### 🪪 Development

Use Docker Compose to run the app in development mode:

```bash
docker compose --env-file ./.env -f docker/docker-compose.yml up -d
```

- Auto-reloads on code changes
- Binds source code for live development
- Exposes app at [http://localhost:3000](http://localhost:3000)

🛑 Stopping Services
To stop all running services, run the following command in a terminal:

```bash
docker compose --env-file ./.env -f docker/docker-compose.yml down -v
```

## 📸 How It Works

1️⃣ **Sign Up/Login** via NextAuth (Google or Email/Password)  
2️⃣ Get **2 free credits** (or buy more via Razorpay)  
3️⃣ Upload an image or video  
4️⃣ Choose resizing/compression options  
5️⃣ Process & download the optimized media

---

## 🛠 Contributing

🔹 Fork the repo & create a new branch  
🔹 Make your changes & push to your branch  
🔹 Open a Pull Request 🎉

---

## 📝 License

This project is **open-source** under the [MIT License](LICENSE).

---

## 📬 Contact

Have feedback or suggestions? Connect with me!

✖️ [Twitter/X](https://x.com/Nikhil10_02)  
🔗 [LinkedIn](https://www.linkedin.com/in/nikhil-bhoyar-nb1010)

---

Give it a ⭐ if you like this project! 🚀
