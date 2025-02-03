// 1. reducer 만들기
import { Todo, TodoState } from "../../types/types";

//객체로 초기화
const initialState: TodoState = {
  list: [],
};

//마지막에 추가
const count = initialState.list.length; //3
initialState["nextID"] = count; //initialState에 추가/[키]

//----action type의 상수 설정  + ts에서 as const로 todo/CREATE
const CREATE = "todo/CREATE" as const;
const DONE = "todo/DONE" as const;
const INIT = "todo/INIT" as const;
const DELETE = "todo/DELETE" as const;
const UPDATE = "todo/UPDATE" as const;

//---- components에서 사용될 액션반환 함수 (컴포넌트에서 사용하는것이니 export) 액션 받아오는
//onclick으로
// todo 생성 액션 반환함수
export function create(payload: { id?: number; text: string }) {
  return {
    type: CREATE,
    payload: payload, // {id:number, text:string} 객체 받아오는
  };
}

// done 변경 액션 반환함수
export function done(id: number) {
  return {
    type: DONE,
    id: id, //위에처럼 객체가 아니라 id:number 값만 받아서 구분한다.
  };
}

//전체목록 조회 액션반환함수(ListContainer에서 사용)
// data:{id, text, done}[]
export function init(data: Todo[]) {
  return {
    type: INIT,
    data: data,
  };
}

// 삭제 액션반환함수
export function del(id: number) {
  return { type: DELETE, id: id };
}

// 업데이트 액션반환함수
export function update(id: number, text: string) {
  return {
    type: UPDATE,
    id: id,
    text,
  };
}

//------ action의 type에 interface
interface Init {
  type: typeof INIT; //원래 string이였지만 위에 as const로 상수로 만들어 사용
  data: Todo[];
}

interface Done {
  type: typeof DONE;
  id: number;
}

interface Create {
  type: typeof CREATE;
  payload: { id: number; text: string };
}

interface Delete {
  type: typeof DELETE;
  id: number;
}

interface Update {
  type: typeof UPDATE;
  id: number;
  text: string;
}

//------ action의 type을 유니온을 사용해 위에서 만든 interface로 지정
type Action = Create | Done | Init | Delete | Update;

// 위에서 initialState tyep TodoState 였으니 state도
export function todoReducer(state: TodoState = initialState, action: Action) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        list: action.data,
        nextID:
          action.data.length === 0
            ? 1
            : action.data[action.data.length - 1].id + 1, // 마지막 -1 아이디에 +1
      };
    case CREATE:
      if (action.payload.text.trim() === "") return state; //trim 스페이스 여러개일때도(공백만 들어올때)
      console.log("CREATE호출됨", action);
      return {
        ...state, //전개 연산자로 기존에 있던 list의 객체들(상태값들도) 그대로 두고(같은 값은 덮어쓰고)
        // list는 배열 형태로 반환되어야 한다. state.list = 기존 배열(initialState)에 concat으로 뒤에 추가
        list: state.list.concat({
          id: action.payload.id,
          text: action.payload.text,
          done: false,
        }),
        nextID: action.payload.id + 1, // 추가시 id 값을 전역적으로 관리
      };
    case DONE:
      console.log("DONE호출됨", action);
      return {
        ...state, //이전 state 배열 두고
        list: state.list.map((todo) => {
          console.log("in map", todo); // 기존 state 배열 다 보여줌

          //바꾸고자 하는 조건 (기존값===들어오는 id)
          if (todo.id === action.id) {
            return {
              ...todo, // 기존 객체의 id, text 값은 그대로 두고 done만 true로 바꾸기 위해 전개연산
              done: true, // done 값을 덮어쓰기
            };
          } else return todo;
        }),
      };
    case DELETE:
      //[{id:1},{id:2},{id:3},] >>  [{id:1},{id:2}]  삭제시
      return {
        ...state,
        list: state.list.filter((todo: Todo) => todo.id !== action.id),
      };
    case UPDATE:
      return {
        ...state,
        // 특정한 것만 수정
        list: state.list.map((li: Todo) => {
          if (li.id === action.id) {
            return {
              ...li,
              text: action.text, // text만 수정
            };
          }
          return li;
        }),
      };
    default:
      return state;
  }
}
