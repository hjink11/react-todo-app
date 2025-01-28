import { combineReducers } from "redux";
import { todoReducer } from "./modules/todo";

// reducer 합치기
//export default combineReducers ({}) 처럼 해도 된다

const rootReducer = combineReducers({
  todo: todoReducer,
});

export default rootReducer;
