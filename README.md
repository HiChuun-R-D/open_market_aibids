# Open Market AIBids

This project is a simplified proof of concept for an AI model bidding platform. It provides basic REST endpoints for user registration, login, model listing, and bidding. Payments and compliance modules are placeholders.

## Requirements
- Node.js 18+

## Installation
```bash
npm install
```

## Running
```bash
npm start
```

The server listens on port `3000` by default.

## Testing
```bash
npm test
```

## Docker
A simple Dockerfile is provided to run the application in a container.

## Frontend (Next.js)
A minimal Next.js app is provided in the `frontend` folder.

### Running in development
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on [http://localhost:3001](http://localhost:3001) and connects to the backend API on port 3000.
