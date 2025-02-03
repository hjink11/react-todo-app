export interface Todo {
  // 객체{}
  id: number;
  text: string;
  done: boolean;
}

export interface TodoState {
  list: Todo[]; // Todo객체 배열
  nextID?: number;
}

//redux의 state의 type (useSelector로 상태 가져올때)
export interface ReduxState {
  todo: TodoState;
}
