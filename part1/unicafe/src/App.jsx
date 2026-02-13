import { useState } from 'react'

const Counter = ({text, count}) => {
  return (

      <tr>
      <td>{text}</td>
      <td>{count}</td>
     </tr>


  )
}
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

 const Statistics = ({good,neutral,bad,countAll,sumOfAll}) => {

 const positive = (good/countAll) * 100 + '%'

  if (countAll === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <div>No feedback given </div>
      </div>

    )
  }
  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
      <Counter text= 'Good: ' count = {good}/>
      <Counter text= 'Neutral: ' count = {neutral}/>
      <Counter text= 'Bad: ' count = {bad}/>
      <Counter text= 'All: ' count = {countAll}/>
      <Counter text= 'Average: ' count = {sumOfAll/countAll}/>
      <Counter text= 'Positive: ' count = {positive}/>
        </tbody>
      </table>
    </div>
   )
 }

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const countAll = good + neutral + bad
  const sumOfAll = good - bad

  const handleClicks = (setter, value) => {
  setter(value + 1)
 }


  return (
    <div>
      <h2>Give feedback</h2>
      <Button onClick={() => handleClicks(setGood,good)} text='good'/>
      <Button onClick={() => handleClicks(setNeutral,neutral)} text='neutral'/>
      <Button onClick={() => handleClicks(setBad,bad)} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} countAll={countAll} sumOfAll={sumOfAll}/>

    </div>
  )
}

export default App
