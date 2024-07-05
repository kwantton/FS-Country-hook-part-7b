import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {                                      // the input parameter "name" is updated on submit of the form
  const [country, setCountry] = useState(null)                      // "country" is used here, and the RETURN VALUE of useCountry is used directly by the Country component

    useEffect(() => {
      if (name) {                                                   // on submit, useCountry(name) is called. If it's empty, don't search anything
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry({ data:response.data, found:true })                // so; since country.found is checked in Country, it always needs to have the .found added on top. Moreover, we need to set the .data as response.data.
      })
      .catch(() => {
        setCountry({found:false})
      })
    }
    }, [name])
  
console.log("country (i.e., the return value from useCountry):", {...country, found:true}) // since the country.found is checked in Country
return country
}

const Country = ({ country }) => {
  console.log("hello from Country!")
  
  if (!country) {
    console.log("  !country, returning null from Country")
    return null
  }

  console.log("  country.data.capital[0]:", country.data.capital[0])    // ok
  console.log("  country.data.population:", country.data.population)    // ok
  console.log("  country.data.name.common:", country.data.name.common)  // ok
  console.log("  country.data.flag:", country.data.flags.svg)
  if (!country.found) {     // for this, you need a .found for the country,
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3> {/** THIS WAS country.data.name ORIGINALLY! That's a list*/}
      <div>capital {country.data.capital[0]} </div> {/** THIS DIDN'T HAVE "[0]" ORIGINALLY! */}
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.svg} height='100' alt={`flag of ${country.data.name.common}`}/>  {/** THIS WAS country.data.name ORIGINALLY! That's a list*/}
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)      // i.e. useCountry has to RETURN a value here

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App