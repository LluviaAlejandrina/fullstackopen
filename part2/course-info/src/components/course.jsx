

const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part =><Part key ={part.id} part={part}/>)}

  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>Number of exercises {props.total}</p>


const Course = ({course}) => {

 const totalExercises = course.parts.reduce((acc,currentPart) => {
  console.log('que paso aqui', acc, currentPart)
  return acc + currentPart.exercises
},0)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises}/>
    </div>
  )
}

export default Course
