import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'
import Weather from './components/Weather'

const App = () => {
  const[countries,setCountry] = useState([])
  const[newSearch, setNewSearch] = useState('')
  const[weathers, setNewWeather] = useState(undefined)
 
  const countryData = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        const filtered = response.data.filter(test =>
          test.name.common.toLowerCase().includes(newSearch.toString().toLowerCase())
        )
        setCountry(filtered)
      })
  }

  const api_key = process.env.REACT_APP_API_KEY

  const weatherData = () => {
    if (countries.length === 1) {
      const capital = countries[0].capital
      console.log("test")
      axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
        .then(response => {
          setNewWeather(response.data)
        })
    }
  }

  useEffect(countryData, [newSearch])
  useEffect(weatherData, [countries])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }



  return (
    <div>
      <Filter search={newSearch} eventHandler={handleSearchChange} />
      <Countries countries={countries} newSearch={setNewSearch} />
      <Weather weathers={weathers} countries={countries}/>
    </div>
  )
}



export default App