interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
  
}

export const calculateExercises  = (array: Array<number>, target: number):Result => {
  console.log(process.argv.length)
  if (process.argv.length > 5 && !isNaN(Number(process.argv[2]))) {
    target = Number(process.argv[2])
    array = []
    process.argv.slice(3).forEach(element => {
      array.push(Number(element))
    });
  }

  let rating = 0
  const average = array.reduce((a,b) => a +b)/array.length
  let ratingDescription = ""
  switch (true) {
    case((average/target)>=1):
      console.log((average/target))
      ratingDescription = "target met.";
      rating = 3
      break
    case((average/target)>0.80):
      ratingDescription = "not too bad but could be better";
      rating = 2
      break
    case((average/target)>0):
      ratingDescription = "bad";
      rating = 1
      break
  }
  //faster computing if all declaresd and done in one loop
  return {
    periodLength:array.length, 
    trainingDays:array.filter(arr => arr != 0).length,
    success: average>=target,
    rating:rating,
    ratingDescription: ratingDescription,
    target:target,
    average: average
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
