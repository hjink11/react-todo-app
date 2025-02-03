import ListContainer from "./components/ListContainer";
import "../src/style/common.scss";

function App() {
  console.log(process.env.REACT_APP_API_SERVER);
  return (
    <div className="App">
      <div className="header">
        <h2>📝 Todo App</h2>
      </div>
      <ListContainer />
    </div>
  );
}

export default App;
