# ABC Company Web Portal

This is a full-stack web application for **ABC Company**, developed using the **MERN stack** (MongoDB, Express, React, Node.js). The system includes authentication, role-based access, profile management, document uploads, and admin functionalities.

## 📦 Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **File Storage:** Multer with Express API
- **Styling:** Tailwind CSS
- **Deployment:** Render (Backend), Vercel/Netlify (Frontend)

---

## 🚀 Features

- 🧑 User registration and login
- 🔐 JWT-based authentication
- 📄 Upload and view personal documents
- 🖼️ Upload and update profile photo
- 📝 Edit name, email, and about info
- 👤 Role-based rendering (Admin/User)
- 🛠️ Admin panel for managing lab/group info (in extended use cases)

---

## 🔗 Live Deployment

**Frontend URL:** [https://abc-frontend-iota.vercel.app/](https://your-frontend-url.vercel.app)  
**Backend API URL:** Set in `.env` as `VITE_API_URL=https://drdo-project.onrender.com`

> ⚠️ **Note:** The **Profile** page doesn't work on local due to API restrictions. It requires access to deployed API endpoints with proper authentication headers.

---

## ⚙️ Setup Instructions (Local Development)

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Vite (optional, installed with frontend deps)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/abc-company.git
cd abc-company
