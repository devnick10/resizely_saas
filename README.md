# 📸 Resizely - Media Processing SaaS 🚀

Resizely is a **credit-based** SaaS application designed to make media processing easy and efficient. Users can **resize images**, **compress videos**, and **remove backgrounds**, with a **credit system** that provides free credits and a seamless **Razorpay integration** for purchasing more.

##### The app will be live at **http://localhost:3000**  
---

## 🌟 Features  

✅ **Image Resizing** – Optimize images for social media & web  
✅ **Video Compression** – Reduce video sizes without quality loss  
✅ **Background Removal** – AI-powered background remover  
✅ **Credit-Based System** – Users get **2 free credits**, then can buy more  
✅ **Payment Integration** – Razorpay for secure transactions  
✅ **Authentication** – Secure login with **NextAuth** (Google + Credentials)  
✅ **Optimized Performance** – Cloudinary for fast media processing  
✅ **Containerized Deployment** – Docker support for easy setup  

---

## 🛠️ Tech Stack  

- **Frontend & Backend:** Next.js (App Router)  
- **Database:** Prisma + NeonDB  
- **Media Processing:** Cloudinary  
- **Authentication:** NextAuth (Google & Credentials)  
- **Payments:** Razorpay  
- **Email (OTP, transactional):** Nodemailer (Mailtrap for dev)  
- **UI Framework:** DaisyUI + TailwindCSS  
- **State Management:** React Context  
- **Containerization:** Docker + Docker Compose  

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
# or
yarn install
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
docker-compose -f docker-compose.yml -f Dockerfile.dev up --build
```

- Auto-reloads on code changes
- Binds source code for live development
- Exposes app at [http://localhost:3000](http://localhost:3000)

#### 🚀 Production

To build and run a production-ready container:

```bash
docker-compose -f docker-compose.yml -f Dockerfile.prod up --build
```

This uses `Dockerfile.prod` to create a minimal image optimized for deployment.

#### 🔁 Running Prisma Migrations

After containers start, apply database migrations:

```bash
docker-compose exec app npx prisma migrate dev --name init
```

---

## 📸 How It Works  

1️⃣ **Sign Up/Login** via NextAuth (Google or Email/Password)  
2️⃣ Get **2 free credits** (or buy more via Razorpay)  
3️⃣ Upload an image or video  
4️⃣ Choose resizing/compression options  
5️⃣ Process & download the optimized media  

---

## 📌 Roadmap  

🚀 **Upcoming Improvements:**  
- ✅ Add bulk upload support  
- ✅ Improve UX & loading speeds  
- ✅ More social media export options  

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

