# Nexus Blog V2

A modern, responsive blog built with React (Vite) and FastAPI (Python).

## Features

- **Public Blog**: Responsive list and detailed view with Markdown support.
- **Admin Dashboard**: Secure management of blog posts (CRUD).
- **Authentication**: JWT-based admin login.
- **Modern UI**: Built with Tailwind CSS, Lucide icons, and Inter/JetBrains Mono fonts.

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide Icons, React Router 7, React Markdown.
- **Backend**: FastAPI, MongoDB (Motor), JWT (jose), Pydantic.

## Getting Started

### Backend Setup

1. Navigate to `Nexus_blog_backend`.
2. Ensure you have a `.env` file with MongoDB and JWT settings.
3. Install dependencies: `pip install -r requirements.txt`.
4. Run the server: `python -m app.main`.

### Frontend Setup

1. Navigate to `Nexus-Blog-V2`.
2. Install dependencies: `npm install`.
3. Create a `.env` file (optional, defaults to http://localhost:8000):
   ```
   VITE_API_URL=http://localhost:8000
   ```
4. Run the development server: `npm run dev`.

## Management

To create the initial admin user, use the provided script in the backend:
`python scripts/create_admin.py`
