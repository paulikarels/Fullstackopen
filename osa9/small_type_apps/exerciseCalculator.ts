interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
  
}




const calculateExercises  = (array: Array<number>, target: number):Result => {
  
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
  //faster computing if all declared and done in one loop
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

const exerciseArray:Array<number> = []
const target = Number(process.argv[2])

//console.log(process.argv.slice(3))
process.argv.slice(3).forEach(element => {
  exerciseArray.push(Number(element))
});

console.log(calculateExercises(exerciseArray, target))


