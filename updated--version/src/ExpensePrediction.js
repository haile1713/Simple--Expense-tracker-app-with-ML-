// src/ExpensePrediction.js
import * as tf from '@tensorflow/tfjs';

// Function to prepare the data using the first few expenses
function prepareData(expenses, numExpenses) {
  const limitedExpenses = expenses.slice(0, numExpenses);
  const days = limitedExpenses.map((_, index) => index + 1); // Day numbers
  const expensesTensor = tf.tensor2d(limitedExpenses, [limitedExpenses.length, 1]);
  const daysTensor = tf.tensor2d(days, [days.length, 1]);
  return { daysTensor, expensesTensor };
}

// Function to train the Linear Regression model
async function trainModel(expenses, numExpenses = 2) {
  const { daysTensor, expensesTensor } = prepareData(expenses, numExpenses);

  // Create a Linear Regression model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] })); // Simple linear model

  // Compile the model
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

  // Train the model
  await model.fit(daysTensor, expensesTensor, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch: ${epoch}, Loss: ${logs.loss}`);
      },
    },
  });

  return model;
}

// Function to predict future expenses
async function predictExpense(model, futureDay) {
  const futureDayTensor = tf.tensor2d([futureDay], [1, 1]);
  const prediction = model.predict(futureDayTensor);
  const predictedExpense = (await prediction.data())[0];
  return predictedExpense;
}

export { trainModel, predictExpense };
