import { useSelector } from "react-redux";

export default function DoneList() {
  // false 와 다르게 한줄에 filter 까지  (todoList와 비교해보3)
  const doneList = useSelector((state) => state.todo.list).filter(
    (el) => el.done === true
  );

  return (
    <section className="doneSection">
      <h3>완료목록 🏅</h3>
      <ul>
        {doneList.map((el) => {
          return <li key={el.id}>{el.text}</li>;
        })}
      </ul>
    </section>
  );
}
