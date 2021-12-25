import React, {useState} from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}> {text}</button>


const Statistics = ({title, good, neutral, bad}) => {

  const all = good+neutral+bad
  const average = (good-bad)/all
  const positive = good/all *100

if (all === 0) {
  return (
    <div> 
      <h1>{title}</h1>
      <p>No feedback given</p>
    </div>

  )
}

  return (
    <div>
      <h1>{title}</h1>
      <table > 
             
          <StatisticLine text={"good"} value={good} />
   
          <StatisticLine text={"neutral"} value={neutral} />
   
          <StatisticLine text={"bad"} value={bad} />

          <StatisticLine text={"all"} value={all} />

          <StatisticLine text={"average"} value={average} />

          <StatisticLine text={"positive"} value={positive + " %"} />
        
      </table>
    </div>
  )
}



const StatisticLine  = ({text, value}) => (
  <tbody>
    <tr>
      <td> {text} </td>
      <td> {value} </td>
    </tr>
  </tbody>
)

const App = () => {

  const feedback = "give feedback"

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = (newGood) => {
    setGood(newGood)
  }
  
  const setToNeutral= (newNeutral) => {
    setNeutral(newNeutral)
  }
  
  const setToBad = (newBad) => {
    setBad(newBad)
  }

  return(
    <div>
      <Header header={feedback} />
      <Button handleClick={() => setToGood(good+1)} text={"good"}/>
      <Button handleClick={() => setToNeutral(neutral+1)} text={"neutral"}/>
      <Button handleClick={() => setToBad(bad+1)} text={"bad"}/>
      <Statistics title={"statistics"} good={good} neutral={neutral} bad={bad} />
    </div>
  

  )

}

export default App