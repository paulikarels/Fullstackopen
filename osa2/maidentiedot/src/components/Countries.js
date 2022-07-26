import React from 'react'

const Countries = ({countries, newSearch}) => {



    if (countries.length > 10) {
        return (
            <div> 
                Too many matches, specify another filter 
            </div>
        )
    } else if (countries.length === 1) {
        return (
            <div>
                {countries.map(country =>
                    <div key={country.name.common} >
                        <h1>{country.name.common}</h1>
                        <p>capital {country.capital}</p>
                        <p>area {country.area}</p>
                        <strong> languages </strong>
                        <ul>
                        {Object.values(country.languages).map(language =>
                            <li key={language}> 
                                {language}
                            </li>
                        )}
                        </ul>
                        <img src={country.flags.png} alt="flag" width={'200px'} heigth={'120px'}/>
                    </div> 
                )}

            </div>
        )
    } else {
        return (
            <div> 
            {countries.map(country =>
                <div key={country.name.common}> 
                    {country.name.common} <button onClick={() => newSearch(country.name["common"])}>show</button>
                </div> 
            )}
         </div>
        )
    } 
    

}

export default Countries