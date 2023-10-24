

export const calculateBmi = (a: number, b: number):string => {    
  if(!isNaN(Number(process.argv[2])) && !isNaN(Number(process.argv[3]))){
    a = Number(process.argv[2]);
    b = Number(process.argv[3]);
  } 

  const calculateBmi = (b/((a/100)**2))
  //console.log(a, b)
  switch (true) {
    case (calculateBmi < 18.5):
      return "Underweight (might be unhealthy)";
    case (calculateBmi <= 24.9):
      return "Normal (healthy weight)";
    case (calculateBmi <= 29.9):
      return "Overweight (might be unhealthy)";
    case (calculateBmi >= 30):
        return "Obese (unhealthy weight)";
    default:
      throw new Error('Operation input error! Check your weight and height, and use metric.');
  }

};


//console.log(calculateBmi(180,74))

