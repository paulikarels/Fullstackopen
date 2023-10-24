import express from 'express';
import { calculateBmi} from './calculateBmi';
import { calculateExercises} from './exerciseCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const {weight, height} = req.query;

  
  if (isNaN(Number(weight)) || isNaN(Number(height))) {
    res.send({ error: 'malformatted parameters' }).status(400)
  } 


  const bmi = calculateBmi(Number(height), Number(weight))
  const datapack = {
    weight: weight,
    height: height,
    bmi: bmi
  }

  res.send(datapack).status(200);
});

app.get('/exercises', (_req, res) => {
  
  const input = {
    "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
    "target": 2.5
  }
  const dailyWeeklyExercise = calculateExercises(input.daily_exercises, input.target)
  
  res.send(dailyWeeklyExercise).status(200);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.listen(3002);