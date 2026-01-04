# Backend API

Express.js server for NimbusVault - handles file uploads, user authentication, and file management.

## Project Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js
│   ├── File.js
│   └── Folder.js
├── routes/           # API endpoints
│   ├── auth.js        # Authentication routes
│   ├── files.js       # File management routes
│   └── folders.js     # Folder management routes
├── middleware/       # Custom middleware
│   ├── auth.js        # JWT authentication
│   └── errorHandler.js
├── uploads/         # User uploaded files directory
├── index.js         # Server entry point
├── .env.example     # Environment variables template
├── package.json     # Dependencies
└── README.md        # This file
```

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Configure `.env` file with your settings:
```
MONGO_URI=mongodb://username:password@host:port/database
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Running the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGO_URI | MongoDB connection string | Yes |
| PORT | Server port (default: 5000) | No |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| NODE_ENV | Environment (development/production) | No |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Files
- `GET /api/files` - Get all user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Download file

### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create new folder
- `DELETE /api/folders/:id` - Delete folder

## Middleware

### Authentication Middleware
Protects routes that require authentication:
```javascript
const { authenticateToken } = require('./middleware/auth');
router.get('/protected-route', authenticateToken, controller);
```

### Error Handler
Global error handling middleware for consistent error responses.

## Key Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **multer** - File upload handling
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **nodemon** (dev) - Auto-restart on file changes

## Database Models

### User
- id
- email
- password (hashed)
- createdAt

### File
- id
- userId
- filename
- originalName
- size
- mimeType
- uploadedAt
- folderId (optional)

### Folder
- id
- userId
- name
- parentFolderId (optional)
- createdAt

## Security Notes

1. **Never commit `.env` files** - Use `.env.example` instead
2. **JWT Secret** - Use a strong, random string in production
3. **CORS** - Configure allowed origins in production
4. **File Upload** - Validate file types and sizes
5. **Database** - Use MongoDB authentication and secure connections
6. **Password Hashing** - Passwords are hashed using bcryptjs

## Deployment

### Docker
```bash
docker build -t nimbusvault-backend .
docker run -p 5000:5000 --env-file .env nimbusvault-backend
```

### Render
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables in Render dashboard
4. Deploy

## Debugging

Server logs important startup information including:
- MongoDB connection status
- Server port
- Environment (development/production)
- Global error handler setup

## Troubleshooting

**MongoDB Connection Error:**
- Check `MONGO_URI` is correct
- Ensure MongoDB is running
- Verify database credentials

**Port Already in Use:**
- Change `PORT` in `.env`
- Kill existing process on that port

**CORS Errors:**
- Verify CORS configuration in `index.js`
- Check frontend URL matches allowed origins

## Contributing

When contributing to the backend:
1. Follow existing code structure
2. Add error handling
3. Document API changes
4. Test authentication flows
5. Validate file uploads

## License

MIT License - See root LICENSE file
