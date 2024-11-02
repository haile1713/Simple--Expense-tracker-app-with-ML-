
# Expense Tracker App

A simple and intuitive Expense Tracker application built with **React** and **Firebase** that allows users to add, view, and delete transactions. The app features an integrated **Machine Learning** model using **TensorFlow.js** to predict future expenses based on past spending habits.

## Features
- **User Authentication**: Sign in and sign out functionality using Firebase authentication.
- **Add Transactions**: Users can add deposits and expenses with a transaction name, type, and amount.
- **Transaction History**: View the latest transactions in an organized list.
- **Machine Learning Predictions**: Predicts expenses for the next 14 days using a trained Linear Regression model.
- **Data Storage**: Transactions are saved in Firebase Realtime Database.
- **Expense Visualization**: Displays future expense predictions in a color-coded format to easily identify low, medium, and high expenses.

## Technologies Used
- **React**: Front-end library for building user interfaces.
- **Firebase**: Authentication and Realtime Database for user management and data storage.
- **TensorFlow.js**: JavaScript library for training and running Machine Learning models in the browser.
- **CSS**: For styling the app.

## Getting Started

### Prerequisites
- Node.js and npm installed on your computer.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/haile1713/Simple--Expense-tracker-app-with-ML-.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd expense-tracker-app
   cd updated--version
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start the App**:
   ```bash
   npm start
   ```
   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and **Realtime Database**.
3. Add your Firebase configuration to `src/config/Fire.js`:
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getDatabase } from "firebase/database";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     databaseURL: "YOUR_DATABASE_URL"
   };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const database = getDatabase(app);

   export { auth, database };
   ```

## Usage
1. **Sign In/Sign Up**: Use the authentication feature to log in or create a new account.
2. **Add Transactions**: Enter the transaction name, select the type (expense or deposit), and specify the amount.
3. **View Predictions**: Check the color-coded expense predictions for the next 14 days to manage your budget efficiently.

## Expense Prediction
- The app uses a **Linear Regression** model to predict future expenses. The model is trained using **TensorFlow.js** based on the user's past expense data.
- **Color Coding**:
  - **Green (Low)**: Expenses below $20.
  - **Yellow (Medium)**: Expenses between $20 and $50.
  - **Red (High)**: Expenses above $50.

## Screenshots
![Screenshot 2024-11-02 125403](https://github.com/user-attachments/assets/efae2d58-1db6-4b66-a673-46ab4eec28b7)
![Screenshot 2024-11-02 125416](https://github.com/user-attachments/assets/20d95c04-36ba-4003-a36c-1c5f29337339)

## Live Demo
https://expense-tracker-update-pi.vercel.app/


## Future Enhancements
- **Graphical Visualization**: Add charts to better visualize expense trends.
- **Advanced Models**: Use more sophisticated machine learning models for improved accuracy.
- **Budget Management**: Introduce features to set and track budgets for different categories.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or feedback, feel free to reach out to:
- **Haileleul F. Mezgebe**: [haileleulfiseha@gmail.com](mailto:haileleulfiseha@gmail.com)
- **GitHub**: [https://github.com/haile1713](https://github.com/haile1713)
