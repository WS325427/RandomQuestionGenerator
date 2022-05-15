import './App.css';
import { useEffect, useState } from "react"
//App will allow inputs of names, questions, and how many questions per person
function App() {
  const [questionList, setQuestionList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(2);
  const [formComplete, setFormComplete] = useState(false);
  const [personQuestionObject, setPersonQuestionObject] = useState({});
  const [selectedPerson, setSelectedPerson] = useState("")
  const [questionsToShow, setQuestionsToShow] = useState([])
  const [fileChoice, setFileChoice] = useState("Default")

  const confirmForm = () => {

    if (fileChoice == "Custom") {
      if (!questionList.length || !nameList.length || isNaN(questionsPerPlayer)) {
        alert("Finish the form");
        return;
      }
    }

      generateQuestionsPerPerson();
      setSelectedPerson(nameList[0]);
      setFormComplete(true);

  }
  const fetchData =  (stateLocation,link) => {
    const setStateLocation = {
      "Question": setQuestionList,
      "Name": setNameList
    }
     fetch(link)
      .then(response => response.text())
      .then(data => {
        let list = []
        data.split("\r\n").forEach(item => {
          item = item.replace("\"", "")
          item = item.replace("\\", "")
          list.push(item)
        })
        setStateLocation[stateLocation](list.filter(x=>x))
      })
      .catch(error => { throw (error) })
    // console.log(questions)
  }
  const generateQuestionsPerPerson = (specificPerson = "") => {
    var questionsForPerson = specificPerson ? personQuestionObject : {}
    var numberArray = Array(questionList.length).fill().map((element, index) => index + 0)
    var arrayIndex = 0
    // console.log("New TEST")
    var listOfNames = specificPerson ? [specificPerson] : nameList
    // console.log(listOfNames)
    listOfNames.forEach(name => {
      questionsForPerson[name] = []
      for (var i = 0; i < questionsPerPlayer; i++) {
        if (!numberArray.length) {
          numberArray = Array(questionList.length).fill().map((element, index) => index + 0)
        }
        arrayIndex = Math.floor(Math.random() * (numberArray.length))

        questionsForPerson[name].push(questionList[numberArray[arrayIndex]])
        if (arrayIndex >= 0) {
          numberArray.splice(arrayIndex, 1)
        }
      }
    })

    setPersonQuestionObject(questionsForPerson)

  }
  const handleFileSelected = (e, stateLocation) => {
    const files = Array.from(e.target.files)
    const setStateLocation = {
      "Question": setQuestionList,
      "Name": setNameList
    }
    // console.log("files:", files)
    const reader = new FileReader();
    reader.onload = () => {
      // await console.log(reader.result)
      let list = []
      reader.result.split("\r\n").forEach(item => {
        item = item.replace("\"", "")
        item = item.replace("\\", "")
        list.push(item)
      })
      setStateLocation[stateLocation](list.filter(x=>x))
    }
    reader.readAsText(files[0])
  }

  const selectOptionList = () => {
    var nameOptionList = []
    nameList.forEach(name => {
      nameOptionList.push(<option key={name} value={name}>{name}</option>)
    })
    return nameOptionList
  }
  const getQuestions = (name, questions) => {
    if (!name||!Object.keys(questions).length) return
    var formattedQuestions = []
    questions[name].forEach((question, index) => {
      formattedQuestions.push(<div className="blurry-text" style={{fontSize:"18px","marginTop":"20px","marginBottom":"20px","width":"500px"}} key={String(index) + name} id={String(index) + name}>{String(index + 1)}) {question}</div>)
    })
    // setQuestionsToShow(formattedQuestions)
    return formattedQuestions
  }
  const changeQuestionForOne = () => {
    generateQuestionsPerPerson(selectedPerson)
    let questions = getQuestions(selectedPerson, personQuestionObject)
    setQuestionsToShow(questions)
  }
  const restart = ()=>{
    setFormComplete(false)
    initiateDefaultData()
  }
  const initiateDefaultData = ()=>{
    fetchData("Question","https://raw.githubusercontent.com/WS325427/ws325427.github.io/main/RandomQuestionsIcebreaker.csv")
    fetchData("Name","https://raw.githubusercontent.com/WS325427/ws325427.github.io/main/PlayerNames.csv")
  }
  useEffect(()=>{
    initiateDefaultData()
  },[])

  useEffect(() => {
    let questions = getQuestions(selectedPerson, personQuestionObject)
    setQuestionsToShow(questions)
  }, [selectedPerson,personQuestionObject,questionList,nameList])
  return (
    <div>
      {formComplete ?
        (
          <>
            <div style={{width:"100%"}}>
            <select style={{marginTop:"10px",marginLeft:"20px",width:"100px",height:"40px",fontSize:"20px"}}value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)}>
              {selectOptionList()}
            </select>
            </div>
            <div style={{textAlign: "-webkit-center"}}>
              {/* {getQuestions(selectedPerson,personQuestionObject)} */}
              {questionsToShow}
            </div>
            <div style={{"marginTop":"40px", textAlign: "-webkit-center"}}>
              <button onClick={() => changeQuestionForOne()}>ReRoll Questions</button>
              <button onClick={() => restart()}>Restart</button>
            </div>
          </>
        )
        :
        (
          <>
            <div>
              File Source
              <div className="flexDisplay">
                <input checked={fileChoice == "Default"} id="defaultRadioButton" onChange={() => { }} onClick={() => setFileChoice("Default")} name="fileType" type="radio" />
                <div>Default</div>
              </div>
              <div className="flexDisplay">
                <input checked={fileChoice == "Custom"} id="customRadioButton" onChange={() => { }} onClick={() => setFileChoice("Custom")} name="fileType" type="radio" />
                <div>Custom</div>
              </div>
            </div>
            <div>
              <div>Questions To Upload: </div>
              <input type="file" accept=".csv" onChange={(e) => handleFileSelected(e, "Question")}></input>
            </div>

            <div>
              <div>Names of Players: </div>
              <input type="file" accept=".csv" onChange={(e) => handleFileSelected(e, "Name")}></input>
            </div>

            <div>
              <div>Questions per player</div>
              <input type="number" value={questionsPerPlayer} onChange={(e) => setQuestionsPerPlayer(Number(e.target.value))}></input>
            </div>

            <button onClick={() => confirmForm()}>Begin!</button>
          </>
        )
      }

    </div>
  );
}

export default App;
