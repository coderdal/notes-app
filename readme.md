# Notes App

A modern, full-stack note-taking application that enables users to create, manage, and share notes efficiently using MDX format. Built with Next.js, Node.js, and PostgreSQL.

## 🚀 Live Demo

[Live Application](https://notes.erdal.net.tr/)

## ✨ Features

- **📝 Rich MDX Editing**: Create and edit notes with full Markdown syntax and embedded React components
- **🔒 Secure Authentication**: JWT-based authentication with refresh token rotation
- **🤝 Note Sharing**: Share notes with specific users or make them public
- **💫 Auto-save**: Never lose your work with automatic saving
- **👥 Multi-device Support**: Access your notes from any device with session management

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh Tokens)
- **Content**: MDX (Markdown + JSX)

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/coderdal/notes-app
cd notes-app
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

3. Start the application using Docker Compose:
```bash
docker compose up
```

This will start all services:
- Frontend: http://localhost:[FRONTEND_PORT]
- Backend API: http://localhost:[API_PORT]
- PostgreSQL Database
- pgAdmin: http://localhost:[PGADMIN_PORT]

To stop the application:
```bash
docker compose down
```

To rebuild the containers after making changes:
```bash
docker compose up --build
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# PostgreSQL
PGUSER=            # PostgreSQL username
PGPASSWORD=        # PostgreSQL password
PGDATABASE=        # PostgreSQL database name
PGHOST=            # PostgreSQL host
PGPORT=            # PostgreSQL port

# pgAdmin
PGADMIN_USER=      # pgAdmin email address
PGADMIN_PASSWORD=  # pgAdmin password
PGADMIN_PORT=      # pgAdmin port (e.g., 5050)

# API
API_PORT=          # API server port
FRONTEND_URL=      # Frontend URL for CORS
ACCESS_TOKEN_SECRET=    # JWT access token secret
REFRESH_TOKEN_SECRET=   # JWT refresh token secret
HASH_SECRET_KEY=       # Password hashing secret

# Frontend
NEXT_PUBLIC_API_URL=   # Backend API URL
FRONTEND_PORT=         # Frontend port
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For support, email [contact@erdal.net.tr](mailto:contact@erdal.net.tr) or open an issue in the GitHub repository.
