import { useEffect } from "react";
import DoneList from "./DoneList";
import TodoList from "./TodoList";
import axios from "axios";
import { useDispatch } from "react-redux";
import { init } from "../store/modules/todo";

export default function ListContainer() {
  const dispatch = useDispatch();
  async function getTodos() {
    const todos = await axios.get(`${process.env.REACT_APP_API_SERVER}/todos`);
    //http://127.0.0.1:8080/api-server/todos에서 전체목록 조회에서 목록 가져옴
    console.log(todos.data);

    if (todos.data) dispatch(init(todos.data));
  }

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <main>
      <TodoList />
      <DoneList />
    </main>
  );
}
