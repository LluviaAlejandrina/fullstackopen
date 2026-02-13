import { useState } from 'react'
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

 const Votes = ({count}) => <div>has {count} votes</div>

 const Anecdote =({title,anecdote,count}) => {
   return (
    <div>
    <h2>{title}</h2>
    <p>{anecdote}</p>
    <Votes count={count} />
    </div>
   )
 }
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const [selected, setSelected] = useState(0)
  const [allVotes, setAll] = useState(Array(anecdotes.length).fill(0))

  console.log( 'after render: ', allVotes)
  const max = Math.max(...allVotes)
  const  maxIndex = allVotes.indexOf(max)

  const randomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length )
    setSelected(randomIndex) // this is asyncronous,  state value will change in the next render
    console.log(allVotes)

  }

   const handleVotes = () => {
    // create a copy of the  array all votes
     const copy = [...allVotes]
    // update  the  array  in the selected index
    copy[selected] += 1
    // call  setAll with the copy
    setAll (copy) //this is asyncronous,  state value will change in the next render
    console.log(copy)
    console.log( 'before render : ',allVotes)

   }

  return (
    <div>
      <Anecdote title='Anecdote of the day' anecdote={anecdotes[selected]} count={allVotes[selected]}/>
      <div>
        <Button onClick={handleVotes} text = 'vote' />
        <Button onClick={randomAnecdote} text = 'next anecdote' />
      </div>
      <Anecdote title='Anecdote with most votes' anecdote={anecdotes[maxIndex]} count={allVotes[maxIndex]}/>
    </div>
  )
}



export default App
