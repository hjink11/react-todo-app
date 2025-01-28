import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { create, done } from "../store/modules/todo";
import { useRef } from "react";
import axios from "axios";

//cmd + i  = import 목록 보여줌
export default function TodoList() {
  //useSelector 통해 store의 state 가져옴
  let todoList = useSelector((state) => state.todo.list); //객체 안에 배열 사용해야 하니 .list

  const nextID = useSelector((state) => state.todo.nextID); // list의

  //   console.log(todoList);

  //done:false 인것만
  todoList = todoList.filter((todo) => todo.done === false);

  // useDispatch를 통해 dispatch 함수 생성
  const dispatch = useDispatch();

  //
  const inputRef = useRef();

  console.log("nextId", nextID);

  //할 일 추가  //하나추가  POST /api-server/todo
  const createTodo = async () => {
    if (inputRef.current.value.trim() === "") return;

    // id: todoList.length + 1 (다음id니까) 이건 오류 전이고
    //reducer의 state를 변경해서 화면 바꾸는 것
    dispatch(create({ id: nextID, text: inputRef.current.value }));

    //db 정보를 바꾸기 위해서 axios 요청
    await axios.post(`${process.env.REACT_APP_API_SERVER}/todo`, {
      text: inputRef.current.value,
    });
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  // PATCH todo 상태 값 변경 /api-server/todo/:todoId
  const toDone = async (id) => {
    //state를 변경해서 화면을 바꾸는 것
    dispatch(done(id));

    //db 정보를 바꾸기 위해 axios 요청
    await axios.patch(`${process.env.REACT_APP_API_SERVER}/todo/${id}`);
  };

  const enterTodo = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") createTodo();
  };

  return (
    <section className="todoSection">
      <h3>할 일 목록 ✍️</h3>
      <div className="search">
        <input type="text" ref={inputRef} onKeyDown={enterTodo} />
        <button onClick={createTodo}>추가</button>
      </div>
      {/* map((todo)는 배열 안에 객체 */}
      <ul>
        {todoList.map((todo) => {
          return (
            <li key={todo.id}>
              <button onClick={() => toDone(todo.id)}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <span>{todo.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
