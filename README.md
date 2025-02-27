
# BS-FSE-2025-Team-14

# Petpath Backend Project

## Description:
PetPath is a backend service designed to help pet owners, veterinarians, and dog walkers connect in a way that ensures the health and well-being of the pets. Users can sign in using their unique username and password, and each type of user (pet owner, veterinarian, or dog walker) has access to different functionalities tailored to their role. The platform enables managing pet-related data such as profiles and additional services. The primary goal is to keep the pets safe and healthy by providing convenient access to the necessary services.  
The application uses MongoDB as its database to store user profiles, pet data, and other related information.
the platform integrates **temperature sensors** that monitor the ground temperature in real-time. Users receive immediate alerts if the temperature becomes too high, helping them ensure their pets' safety during outdoor activities.
---

## Available Scripts

### `npm start`
- Runs the server in development mode.
- Make sure MongoDB is running locally or connected to a cloud instance.
- Open `http://localhost:3000` (or your configured port) to view in your browser.
- The server will reload when you make changes to the code.


---

### `npm test`
- Launches the test runner in interactive watch mode.
- Use this to verify the API functionalities using unit and integration tests.

---

## Top Features:
- **Login and Registration**: Allows users to sign in and create accounts using their username and password.  
- **Navigation Menu**: Users can easily navigate through the application.  
- **Interactive Map**:  Displays points with safety information about different areas for trips, using sensors that transmit temperature data to indicate the safety of specific locations.
- **Alerts**: Sends notifications when the ground temperature gets too high, based on real-time sensor data, ensuring the safety of dogs.  
- **MongoDB Integration**: Manages and stores user and pet data securely.

---

## Installation:

### Prerequisites:
1. Install [Node.js](https://nodejs.org).  
2. Set up [MongoDB](https://www.mongodb.com).  

---

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/BS-FSE-2025/BS-FSE-2025-Team-14.git

2. Navigate to the project directory:
   cd BS-FSE-2025-Team-14

4. Install dependencies:
    npm install

5. Start the server:
   cd backend (backend)
   npm start
7. start the FrontEnd:
   cd pet-path (frontend)
   npm start




## Running Tests:

### Backend Tests:
To run backend tests, use:
```bash
cd backend
npx jest

### FrontEnd Tests:
To run frontend tests, use:
cd front
npm test

### Dependencies:
The project uses the following npm packages:

```bash
bcrypt: ^5.1.1 - For secure password hashing.
bcryptjs: ^2.4.3 - Alternative library for bcrypt.
cors: ^2.8.5 - Enables Cross-Origin Resource Sharing (CORS).
dotenv: ^16.4.5 - Loads environment variables from a .env file.
express: ^4.21.1 - Framework for building web applications.
mongodb: ^6.11.0 - Driver for connecting and interacting with MongoDB.
mongoose: ^8.8.3 - An Object Data Modeling (ODM) library for MongoDB.
nodemon: ^2.0.22 - Automatically restarts the server on file changes.
jsonwebtoken: ^9.0.0 - Library to generate and verify JSON Web Tokens (JWT).
cross-env: ^7.0.3 - Enables setting environment variables across different environments.
express-validator: ^6.14.2 - Middleware for validating and sanitizing request data.

### DevDependencies:
@babel/preset-env: ^7.26.0 - Babel preset for compiling modern JavaScript.
jest: ^29.7.0 - Testing framework for JavaScript.
supertest: ^7.0.0 - Library for testing HTTP endpoints.
babel-jest: ^29.7.0 - Babel integration for Jest.
eslint: ^8.46.0 - A tool for identifying and fixing problems in JavaScript code.
eslint-config-airbnb-base: ^15.0.0 - Airbnb's ESLint config for JavaScript.
eslint-plugin-import: ^2.27.5 - ESLint plugin for managing imports.
