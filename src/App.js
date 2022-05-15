import logo from './logo.svg';
import './App.css';
import {useState} from "react"
//App will allow inputs of names, questions, and how many questions per person
function App() {
  const [questions,setQuestions] = useState([]);
  const [named,setNames] = useState([]);
  const [questionsPerPlayer,setQuestionsPerPlayer] = useState(0);

  return (
    <div>
      <div>
      <div>Questions To Upload: </div>
      <input type="file"></input>
      </div>

      <div>
        <div>Names of Players: </div>
      <input type="file"></input>
      </div>
      
      <div>
        <div>Questions per player</div>
        <input type="number"></input>
      </div>
      
      <button>Begin!</button>
    </div>
  );
}

export default App;
