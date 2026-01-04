# NimbusVault

A personal file storage website that feels like having a private Google Drive - no one can see your files on your computer. Store, organize, and access your files securely from anywhere.

## Features

- **Secure File Storage**: Upload and store files privately
- **Organize Files**: Create folders and manage your file structure
- **File Sharing**: Share specific files with others (coming soon)
- **Full-Stack MERN**: Built with MongoDB, Express, React, and Node.js
- **Docker Support**: Easy deployment with Docker
- **Cloud Ready**: Deploy to Render or other cloud platforms

## Tech Stack

### Frontend
- **React** - UI framework
- **Node.js** - Runtime environment
- **Vite** (optional) - Build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Multer** - File upload middleware

### Deployment
- **Docker** - Containerization
- **Render** - Cloud hosting platform

## Project Structure

```
NimbusVault/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express server
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Custom middleware
│   ├── uploads/       # User uploaded files
│   ├── index.js       # Server entry point
│   ├── .env.example   # Environment variables template
│   └── package.json
├── Dockerfile         # Docker configuration
├── render.yaml        # Render deployment config
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas cloud)
- npm or yarn package manager

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/ChanduAllada438/NimbusVault.git
cd NimbusVault
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```
MONGO_URI=mongodb://your_username:your_password@host:port/database_name
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### Running Locally

#### Start Backend Server

```bash
cd backend
npm start
```

Server will run on `http://localhost:5000`

#### Start Frontend (in another terminal)

```bash
cd frontend
npm run dev
```

Application will be available at `http://localhost:5173` (or the port Vite assigns)

### Docker Deployment

Build and run using Docker:

```bash
docker build -t nimbusvault .
docker run -p 3000:3000 -p 5000:5000 nimbusvault
```

## Environment Variables

Sensitive configuration is managed through environment variables. Never commit `.env` files to version control.

Use `.env.example` as a template. Required variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Security Notes

- Always use strong JWT secrets in production
- Enable MongoDB authentication and use strong passwords
- Use environment-specific configurations (dev, staging, production)
- Keep dependencies updated: `npm audit`
- Never commit `.env` files - use `.env.example` instead

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Files
- `GET /api/files` - List user's files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file

## Deployment

### Deploy to Render

1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy

See `render.yaml` for deployment configuration.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Author

**ChanduAllada438** - [GitHub Profile](https://github.com/ChanduAllada438)

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
