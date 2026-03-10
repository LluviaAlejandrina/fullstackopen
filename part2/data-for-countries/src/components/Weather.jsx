import { useState, useEffect} from 'react'
import axios from 'axios'

const Weather =({capital}) => {

    const api_key = import.meta.env.VITE_SOME_KEY
    const [ weather, setWeather] = useState(null)

    useEffect(() => {
        if(!capital)return

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

        axios
        .get(url)
        .then( response => {
            setWeather(response.data)
        })
        .catch ( error => console.log("Error fetching weather!!"))

    },[capital,api_key])

    // once it fetched the weather...
     if (!weather) return <div>loading weather.....wait please</div>

    console.log(weather)
    console.log(weather.weather[0].icon)
      const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

 return (
    <div>
        <h3>Weather in {capital}</h3>
        <p> Temperature : {weather.main.temp} celsius</p>
        <img src={iconUrl} width="100px"/>
        <p>Winds: {weather.wind.speed} m/s</p>

    </div>
 )


}



export default Weather
