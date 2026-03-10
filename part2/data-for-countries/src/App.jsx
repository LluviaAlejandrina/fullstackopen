import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/countries'


const App = () => {
  const [value, setValue] = useState('') //  input value
  const [ countries, setCountries] = useState([]) // lis of all countries
  const [selectedCountry, setSelectedCountry] = useState(null) // this state was introduced  to rerender
  // when  a  country is selected

  useEffect(() => {
      console.log('fetching countriess...')
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          setCountries(response.data)
        })


  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null) // reset selection when typing
  }


const matches = countries.filter( country =>
  country.name.common.toLowerCase().includes(value.toLowerCase())
)

  return (
    <div>
      <div >
        find countries:
        <input value={value} onChange={handleChange} />
        <Countries matches={selectedCountry ? [selectedCountry] : matches}
        setSelectedCountry={setSelectedCountry} />
      </div>

    </div>
  )
}

export default App
