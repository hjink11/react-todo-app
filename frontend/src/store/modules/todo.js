// 1. reducer 만들기

//객체로 초기화
const initialState = {
  list: [
    {
      id: 0,
      text: "리액트 공부하기",
      done: false, // false는 할 일 목록
    },
    {
      id: 1,
      text: "척추의 요정이 말합니다! 척추 펴기!",
      done: true, // done:true는 완료 목록
    },
    {
      id: 2,
      text: "운동하기",
      done: false,
    },
  ],
};

//마지막에 추가
const count = initialState.list.length; //3
initialState["nextID"] = count; //initialState에 추가

// action type의 상수 설정
const CREATE = "todo/CREATE";
const DONE = "todo/DONE";
// 추가
const INIT = "todo/INIT";

//components에서 사용될 액션반환 함수 (컴포넌트에서 사용하는것이니 export) 액션 받아오는
export function create(payload) {
  return {
    type: CREATE,
    payload: payload, // {id:number, text:string} 객체 받아오는
  };
}
export function done(id) {
  return {
    type: DONE,
    id: id, //위에처럼 객체가 아니라 id:number 값만 받아서 구분한다.
  };
}

// data:{id, text, done}[]
export function init(data) {
  return {
    type: INIT,
    data: data,
  };
}

export function todoReducer(state = initialState, action) {
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
    default:
      return state;
  }
}
