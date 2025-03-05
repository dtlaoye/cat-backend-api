# **🐱 Cat Pics API - Backend API Project**

## Submission by David Olaoye

## **📌 Overview**

The **Cat Pics API** allows users to **upload, manage, and retrieve cat pictures**.  
This API supports **user authentication (JWT)** and **secure file uploads using Multer**.

### **🚀 Features**

✅ **User Registration & Login** (JWT-based authentication)  
✅ **Upload, Update, Delete, and Fetch Cat Pictures**  
✅ **Authentication required for protected actions**  
✅ **Multer for handling file uploads**  
✅ **MongoDB with Mongoose for storage**
✅ **Swagger API Documentation available at `/api-docs`**

---

## **🛠️ Tech Stack**

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Multer** for file uploads
- **JWT Authentication**

---

## **📦 Installation & Setup**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/cat-pics-api.git
cd cat-pics-api
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Setup Environment Variables**

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/catpics
JWT_SECRET=your_jwt_secret
```

### **4️⃣ Run the Server**

```sh
npm start
```

or in **development mode**:

```sh
npm run dev
```

---

# **📖 API Endpoints**

## **🔐 Authentication**

### **1️⃣ Register a New User**

**`POST /api/auth/register`**

- **Description:** Registers a new user and returns a JWT token.
- **Body Parameters:**
  ```json
  {
    "username": "john",
    "password": "securepassword"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "65abc123def456",
    "username": "john",
    "token": "your_generated_jwt_token"
  }
  ```

---

### **2️⃣ Login User**

**`POST /api/auth/login`**

- **Description:** Authenticates a user and returns a JWT token.
- **Body Parameters:**
  ```json
  {
    "username": "john",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "_id": "65abc123def456",
    "username": "john",
    "token": "your_generated_jwt_token"
  }
  ```

---

## **🐱 Cat Picture Management**

### **3️⃣ Upload a Cat Picture** (🔒 Protected)

**`POST /api/cats`**

- **Authentication:** `Bearer Token` (JWT)
- **Body (Form-Data):**
  - `catPic` (File) → Upload an image file.
- **Example Request (cURL):**
  ```sh
  curl -X POST http://localhost:5001/api/cats \
       -H "Authorization: Bearer your_jwt_token" \
       -F "catPic=@/path/to/cat.jpg"
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "65abc123def456",
    "filename": "1708901234567-cat.jpg",
    "path": "uploads/1708901234567-cat.jpg",
    "uploadedAt": "2025-01-19T10:30:45.123Z"
  }
  ```

---

### **4️⃣ Get All Uploaded Cat Pictures (Only the User's) **

**`GET /api/cats`**

- **Response (200 OK):**
  ```json
  [
    {
      "_id": "65abc123def456",
      "filename": "1708901234567-cat.jpg",
      "path": "uploads/1708901234567-cat.jpg",
      "uploadedAt": "2025-01-19T10:30:45.123Z"
    }
  ]
  ```

---

#### **Modify the `Get a Specific Cat Picture` section**

````md
### **5️⃣ Fetch a Specific Cat Picture**

**`GET /api/cats/{id}`**

- **Authentication:** `Bearer Token` (JWT)
- **Path Parameter:** `id` → The ID of the cat picture.
- **Response (200 OK):** The requested image file.

📌 **Users can only fetch pictures they uploaded.**

---

# **🔒 Authentication & Security**

- **JWT Tokens** must be sent in the `Authorization` header as:
  ```sh
  Authorization: Bearer your_jwt_token
  ```
````

- **Protected Routes** require authentication (`POST`, `PUT`, `DELETE`).
- **File Uploads** are restricted to image files only.

---

# **📖 Error Handling**

| Status Code | Meaning               | Example Response                          |
| ----------- | --------------------- | ----------------------------------------- |
| `400`       | Bad Request           | `{ "error": "Invalid input" }`            |
| `401`       | Unauthorized Access   | `{ "error": "Not authorized, no token" }` |
| `404`       | Not Found             | `{ "error": "Cat picture not found" }`    |
| `500`       | Internal Server Error | `{ "error": "Something went wrong" }`     |

---

# **🛠️ Running Tests**

### **Run all tests:**

```sh
npm test
```

### **Run tests with detailed logs:**

```sh
npm test -- --verbose
```

---

📄 **Additional API documentation is available at** `http://localhost:5001/api-docs` **via Swagger UI.**
