import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { del } from "../store/modules/todo";

export default function DoneList() {
  // false 와 다르게 한줄에 filter 까지  (todoList와 비교해보3)
  const doneList = useSelector((state: ReduxState) => state.todo.list).filter(
    (el) => el.done === true
  );

  //삭제 위한 dispatch
  const dispatch = useDispatch();
  //--- 삭제 todo 삭제 DELETE /api-server/todo/:todoId
  const deleteTodo = async (todoId: number) => {
    console.log(todoId);
    //db 삭제
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/todo/${todoId}`);
    //화면
    // 리듀서 함수 import
    dispatch(del(todoId));
  };

  return (
    <section className="doneSection">
      <h3>완료목록 🏅</h3>
      <ul>
        {doneList.map((el) => {
          return (
            <li key={el.id}>
              {el.text}{" "}
              <button
                onClick={() => {
                  deleteTodo(el.id);
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
