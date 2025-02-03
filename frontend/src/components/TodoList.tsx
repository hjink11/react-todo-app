import {
  faCheck,
  faTrashCan,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { create, del, done, update } from "../store/modules/todo";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ReduxState, Todo } from "../types/types";
// import { idText } from "typescript";

//cmd + i  = import 목록 보여줌
//-------------- function
export default function TodoList() {
  //useSelector 통해 store의 state 가져옴
  let todoList = useSelector((state: ReduxState) => state.todo.list); //객체 안에 배열 사용해야 하니 .list

  //console.log(todoList);

  //done:false 인것만
  todoList = todoList.filter((todo: Todo) => todo.done === false);

  const nextID = useSelector((state: ReduxState) => state.todo.nextID); // list의

  // useDispatch를 통해 dispatch 함수 생성
  const dispatch = useDispatch();

  // ts에서는 꼭 null이라도 써야 한다.
  const inputRef = useRef<HTMLInputElement>(null);

  console.log("nextId", nextID);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  //-------- 할 일 추가  //하나추가  POST /api-server/todo
  const createTodo = async () => {
    // inputRef이 존재하고 값이 빈칸이 아니라면
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      // id: todoList.length + 1 (다음id니까) 이건 오류 전이고
      //reducer의 state를 변경해서 화면 바꾸는 것

      // 화면 변경 action 반환 함수 (todo.ts)
      dispatch(create({ id: nextID, text: inputRef.current.value }));
    }

    //db 정보를 바꾸기 위해서 axios 요청
    await axios.post(`${process.env.REACT_APP_API_SERVER}/todo`, {
      // body로 inputRef의 value 전달
      text: inputRef.current?.value, //current? 없을 때는 undefined 반환
    });

    //빈문자로 하는 것은 if문으로
    clearInput();
  };

  // ---- PATCH todo 상태 값 변경 done /api-server/todo/:todoId
  const toDone = async (id: number) => {
    //state를 변경해서 화면을 바꾸는 것
    dispatch(done(id));

    //db 정보를 바꾸기 위해 axios 요청
    await axios.patch(`${process.env.REACT_APP_API_SERVER}/todo/${id}`);
  };

  // 엔터로 추가  (e에도 type 설정 )
  const enterTodo = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") createTodo();
  };

  // ts변경 전에 빠져있었다. 렌더링시 input 포커스(if문 사용!)
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // -------  todo 삭제 DELETE /api-server/todo/:todoId
  const deleteTodo = async (todoId: number) => {
    //db 삭제
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/todo/${todoId}`);

    //화면에 보이는것
    dispatch(del(todoId));
  };

  //----- todo 수정
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateId, setUpdateId] = useState(0);

  // 수정(팬슬) 버튼 onclick
  const getTodo = (todoId: number) => {
    // 1 수정모드로 변경하여 버튼 모양 변경 (수정, 취소)
    // 2 수정하고 싶은 text 값 input value로 넣어주기

    setIsUpdateMode(true); //수정버튼 클릭시 수정모드로 변경 (수정,취소버튼)
    //수정하려는 todd만
    const [todo] = todoList.filter((to) => to.id === todoId); // {id, text, done}
    console.log("todo", todo);

    //if문 쓰지 않으면 오류 inputRef.current 있다면 text 변경
    // input창에 수정하려는 text 보이게 한다.
    if (inputRef.current) inputRef.current.value = todo.text;
    setUpdateId(todoId);
  };

  // 수정 취소 버튼 onclick
  const cancelUpdate = () => {
    setIsUpdateMode(false);
    clearInput();
  };

  // 수정 버튼 onclick
  const updateTodo = async () => {
    /* as string 안하면 string|undefuned라 확실히 string으로 
     아니면 if(inputRef.current)로 해야 오류 나지 않는다. 
    */
    const inputValue = inputRef.current?.value as string;
    //db 데이터 변경
    const res = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/content`,
      {
        id: updateId,
        text: inputValue,
      }
    );
    console.log(res.data); // isSuccess
    if (res.data.isSuccess) {
      cancelUpdate();
    }
    // 수정 프론트 반영  update import!!!!!!!!
    dispatch(update(updateId, inputValue));
  };

  return (
    <section className="todoSection">
      <h3>할 일 목록 ✍️</h3>
      <div className="search">
        <input type="text" ref={inputRef} onKeyDown={enterTodo} />
        {/* 수정모드에 따라 보이는 버튼 다르게  */}
        {isUpdateMode ? (
          <>
            <button onClick={updateTodo}>수정</button>
            <button onClick={cancelUpdate}>취소</button>
          </>
        ) : (
          <button onClick={createTodo}>추가</button>
        )}
        {/* <button onClick={createTodo}>추가</button> */}
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
              <button onClick={() => getTodo(todo.id)}>
                <FontAwesomeIcon icon={faPencil} />
              </button>
              <button onClick={() => deleteTodo(todo.id)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
