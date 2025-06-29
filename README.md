# 🧠 Your Workspace

**Your Workspace** is a productivity web application designed to help users stay focused and motivated. Users can register, submit motivational quotes, maintain a to-do list, stream ambient videos, and use a visual timer to structure work and break sessions.

---

## 📁 Project Structure

```
your_workspace/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── cartoon/         # Cartoon images for quotes
│   │   ├── components/      # Pages like Register.js, Login.js, Main.js, Workspace.js
│   │   └── cartoonImages.js
│   ├── package.json
│   └── ...
├── server/                  # Flask backend
│   ├── app.py               # Main Flask app
│   ├── users.py             # User routes
│   ├── quotes.py            # Quote routes
│   ├── db.py                # MySQL DB connection
│   └── requirements.txt     # Backend dependencies
├── README.md
└── .gitignore
```

---

## 🚀 Features

- 🔐 User registration & login
- 💬 Submit motivational quotes
- 📋 Interactive to-do list
- ⏰ Analog visual timer with alarms
- 📺 YouTube stream selection (Office, Café, Library, etc)
- 🎨 Clean, cartoon-themed responsive UI

---

## ⚙️ Tech Stack

### 🔧 Frontend
- React.js
- React Router
- CSS

### 🖥️ Backend
- Python (Flask)
- Flask-CORS
- PyMySQL (MySQL connector)

### 🗃️ Database
- MySQL

---

## 🔧 Setup Instructions

### 🔁 Backend Setup

```bash
cd server
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

- Server runs at `http://localhost:5000`

---

### 🌐 Frontend Setup

```bash
cd client
npm install
npm start
```

- React app runs at `http://localhost:3000`

---

## 🛠️ Deployment Instructions

### 📌 Backend (Render, Railway, etc.)

1. Create `requirements.txt` and `Procfile` in `/server`:

**Procfile**
```
web: gunicorn app:app
```

2. Deploy backend with environment variables set (DB credentials, etc.)

3. Use public MySQL or host your own database (e.g., Railway MySQL)

---

### 🌍 Frontend (Netlify or Vercel)

```bash
cd client
npm run build
```

- Deploy the `build/` folder
- Set your backend API URL to the deployed Flask server URL

---

## 📄 Environment Variables (Optional)

Create a `.env` in `/server` for sensitive config:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=your_workspace
```

---

## ✅ API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/register`               | Register a new user         |
| POST   | `/login`                  | Log in existing user        |
| POST   | `/quote`                  | Submit quote for user       |
| POST   | `/get-user-id` (optional) | Fetch user ID by email      |
| POST   | `/delete_account`         | Delete a user by email      |
| POST   | `/upload-profile-image`   | Upload profile image        |
| GET    | `/profile-images/<file>`  | Serve uploaded image        |

---


## 👨‍💻 Author

Built with 💚 by **Disha Gode**

---

## 📜 License

This project is licensed under the MIT License.