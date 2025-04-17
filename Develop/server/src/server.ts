import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use(routes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the client dist folder
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Serve the index.html file for any other routes
// This is a catch-all route that serves the index.html file for any other routes
app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });


// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
