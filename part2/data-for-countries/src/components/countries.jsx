import Weather from "./Weather"

const CountryDetail = ({country}) => {

    const languages = Object.values(country.languages)

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital : {country.capital}</p>
            <p>Area : {country.area}</p>

            <h3>Languages</h3>
            <ul>
            {languages.map(lang =><li key={lang}>{lang}</li>)}
            </ul>

            <img src={country.flags.png} width="200" />
            <Weather capital={country.capital}/>
        </div>
    )

}

const Countries = ({matches, setSelectedCountry}) => {

    if ( matches.length > 10){
        return <p>Too many matches, be more specific</p>
    }

    if (matches.length > 1 ){
        return (
            <ul>
               { matches.map( country =>
                <li key={country.cca3}>
                    {country.name.common} <button onClick={() => setSelectedCountry(country)}>Show</button>
                </li>

               )}
            </ul>
        )
    }
    // onClick={() => setSelectedCountry(country)}> => React, remember THIS country as selected.

if ( matches.length === 1) {
    return <CountryDetail  country = {matches[0]}/>
}

return null

}


export default Countries
