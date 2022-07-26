import React from "react"

const Weather = ({weathers, countries }) => {

    if (countries.length === 1) {
        return(
            <div>
                <h2> Weather in {weathers?.location.name}</h2>
                <p>temparature {weathers?.current.temperature} Celcius</p>
                <img src={weathers?.current.weather_icons} alt="weather_icon" width={'50'} heigth={'50'}/>
                <p> wind {weathers?.current.wind_speed} m/s</p>
            </div>
        )
    } else {
        return <>  </>
    }

}

export default Weather