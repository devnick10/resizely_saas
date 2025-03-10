# 📸 Resizely - Media Processing SaaS 🚀

Resizely is a **credit-based** SaaS application designed to make media processing easy and efficient. Users can **resize images**, **compress videos**, and **remove backgrounds**, with a **credit system** that provides free credits and a seamless **Razorpay integration** for purchasing more.

##### The app will be live at **http://localhost:3000** 🚀  
---

## 🌟 Features  

✅ **Image Resizing** – Optimize images for social media & web  
✅ **Video Compression** – Reduce video sizes without quality loss  
✅ **Background Removal** – AI-powered background remover  
✅ **Credit-Based System** – Users get **2 free credits**, then can buy more  
✅ **Payment Integration** – Razorpay for secure transactions  
✅ **Authentication** – Secure login with Clerk  
✅ **Optimized Performance** – Cloudinary for fast media processing  

---

## 🛠️ Tech Stack  

- **Frontend & Backend:** Next.js (App Router)  
- **Database:** Prisma + NeonDB  
- **Media Processing:** Cloudinary  
- **Authentication:** Clerk  
- **Payments:** Razorpay  
- **UI Framework:** DaisyUI + TailwindCSS  
- **State Management:** React Context  

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/yourusername/resizely.git
cd resizely
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
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_SECRET_KEY=your_clerk_secret_key

RAZOR_PAY_KEY_ID=your_razorpay_key_id
RAZOR_PAY_KEY_SECRET=your_razorpay_key_secret

DATABASE_URL=your_neondb_prisma_connection_url
```

### 4️⃣ Migrate Database  

```sh
npx prisma migrate dev --name init
```

### 5️⃣ Run the Application  

```sh
npm run dev
# or
yarn dev
```


---

## 📸 How It Works  

1️⃣ **Sign Up/Login** via Clerk  
2️⃣ Get **2 free credits** (or buy more via Razorpay)  
3️⃣ Upload an image/video  
4️⃣ Choose resizing/compression options  
5️⃣ Process & download the optimized media  

---

## 📌 Roadmap  

🚀 **Upcoming Improvements:**  
- ✅ Implement AI-based smart compression  
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

🐦 [Twitter/X](https://x.com/Nikhil10_02)  
🔗 [LinkedIn](https://www.linkedin.com/in/nikhil-bhoyar-nb1010)  

---

Give it a ⭐ if you like this project! 🚀

