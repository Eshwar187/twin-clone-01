# Digital Doppelgänger Backend

🤖 **AI-Powered Backend for Your Virtual Twin**

A comprehensive Node.js backend that powers the Digital Doppelgänger application - your AI-powered personal assistant that manages lifestyle, health, and finances through an adaptive digital avatar.

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Email verification and password reset
- Rate limiting and security headers
- Role-based access control

### 🤖 Avatar Intelligence System
- Real-time avatar state calculation based on user data
- AI-powered insights and recommendations
- Mood tracking and behavioral analysis
- Personalized coaching suggestions

### 🏥 Health & Habits Tracking
- Water intake, sleep, and exercise monitoring
- Custom habit creation and streak tracking
- Health analytics and trend analysis
- Mood and vitals logging

### 💰 Budget & Finance Management
- Expense categorization and tracking
- Budget monitoring with alerts
- AI-powered spending insights
- Financial goal setting and progress tracking

### 🧾 Bill Splitting & Group Management
- Create and manage expense groups
- Smart bill splitting algorithms
- Settlement tracking and payment processing
- QR code generation for payments

### 📝 Notes & Journal System
- Rich text notes with markdown support
- Daily journal entries with mood tracking
- Tag-based organization and search
- File attachments and sharing

### 📅 Calendar & Productivity
- Event scheduling with smart reminders
- Task management with subtasks
- Productivity analytics and time tracking
- Recurring events and tasks

### 🔄 Real-time Features
- WebSocket connections for live updates
- Real-time avatar state changes
- Live collaboration on notes
- Instant notifications

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: Joi schema validation
- **File Upload**: Multer with Sharp for image processing
- **Real-time**: Socket.IO
- **AI Integration**: OpenAI GPT-4
- **Payments**: Stripe integration
- **Email**: Nodemailer
- **Testing**: Jest with Supertest
- **Documentation**: Auto-generated with Swagger

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   # The app will connect automatically on startup
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/digital-doppelganger` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Required for AI |
| `STRIPE_SECRET_KEY` | Stripe secret key | Required for payments |
| `SMTP_*` | Email configuration | Required for emails |

### Database Configuration

The application uses MongoDB with the following collections:
- `users` - User accounts and preferences
- `avatardata` - Avatar states and insights
- `healthdata` - Health metrics and habits
- `budgetcategories` - Budget categories
- `expenses` - Expense records
- `billgroups` - Bill splitting groups
- `bills` - Individual bills
- `settlements` - Payment settlements
- `notes` - Notes and journal entries
- `calendarevents` - Calendar events
- `tasks` - Task management

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/forgot-password` - Password reset request
- `PATCH /api/v1/auth/reset-password/:token` - Reset password

### User Management
- `GET /api/v1/user/profile` - Get user profile
- `PATCH /api/v1/user/profile` - Update profile
- `PATCH /api/v1/user/avatar` - Upload avatar image
- `GET /api/v1/user/preferences` - Get preferences
- `PATCH /api/v1/user/preferences` - Update preferences

### Health & Habits
- `GET /api/v1/health/dashboard` - Health dashboard
- `POST /api/v1/health/water` - Log water intake
- `POST /api/v1/health/sleep` - Log sleep data
- `GET /api/v1/health/habits` - Get habits
- `POST /api/v1/health/habits` - Create habit
- `GET /api/v1/health/analytics` - Health analytics

### Budget & Finance
- `GET /api/v1/budget/dashboard` - Budget overview
- `GET /api/v1/budget/categories` - Get categories
- `POST /api/v1/budget/expenses` - Add expense
- `GET /api/v1/budget/insights` - AI insights

### Bill Splitting
- `GET /api/v1/bills/dashboard` - Bills dashboard
- `POST /api/v1/bills/groups` - Create group
- `POST /api/v1/bills/bills` - Create bill
- `GET /api/v1/bills/settlements` - Get settlements

### Notes & Journal
- `GET /api/v1/notes` - Get notes
- `POST /api/v1/notes` - Create note
- `GET /api/v1/notes/search/:query` - Search notes
- `POST /api/v1/notes/journal/entry` - Create journal entry

### Calendar & Tasks
- `GET /api/v1/calendar/events` - Get events
- `POST /api/v1/calendar/events` - Create event
- `GET /api/v1/calendar/tasks` - Get tasks
- `POST /api/v1/calendar/tasks` - Create task

### Avatar Intelligence
- `GET /api/v1/avatar/state` - Get current avatar state
- `GET /api/v1/avatar/insights` - Get AI insights
- `GET /api/v1/avatar/analytics` - Avatar analytics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🔄 Real-time Events

The application supports real-time updates via WebSocket:

```javascript
// Client-side example
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});

// Listen for avatar updates
socket.on('avatar:updated', (data) => {
  console.log('Avatar state changed:', data);
});

// Send health update
socket.emit('health:update', { water: 8, sleep: 7.5 });
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build image
docker build -t digital-doppelganger-backend .

# Run container
docker run -p 5000:5000 --env-file .env digital-doppelganger-backend
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secrets
- Configure email service
- Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the test files for usage examples

---

**Built with ❤️ for the Digital Doppelgänger ecosystem**
