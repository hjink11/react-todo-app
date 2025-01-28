const { where } = require("sequelize");
const { Todo, sequelize } = require("../models");

// /api-server
exports.getIndex = (req, res) => {
  res.send("response from api-server: [GET /api-server]");
};

///api-server/user
exports.getUser = (req, res) => {
  res.send("response from api-server: [GET /api-server/user]");
};

///// todo API 작성 /////
//전체 조회  GET /api-server/todos
exports.getTodos = async (req, res) => {
  try {
    const todoAll = await Todo.findAll();
    console.log(todoAll);
    res.send(todoAll);
  } catch (err) {
    console.log("sever err", err);
    res.status(500).send("서버에러..관리자에게 문의하세요!");
  }
};

//하나추가  POST /api-server/todo
// req.body로 text 받을 예정
exports.addTodo = async (req, res) => {
  try {
    // 어떤 키로 받는지 알아야 한다
    const { text } = req.body;
    await Todo.create({
      text,
    });
    res.send({ isSuccess: true });
  } catch (err) {
    console.log("sever err", err);
    res.status(500).send("서버에러..관리자에게 문의하세요!");
  }
};

//todo.done 값 변경
// req.params 로 id 받을 예정
exports.patchDoneState = async (req, res) => {
  try {
    // 라우터에 작성한 /:todoId 에서 오는 것 (params니까)
    const { todoId } = req.params;
    const [isUpdated] = await Todo.update(
      // NOT 은 sql 명령문임
      { done: sequelize.literal("NOT done") }, //바꿀값
      { where: { id: todoId } } // 찾을 조건
    );

    //isUpdated는 [0] or [1] 반환
    Boolean(isUpdated)
      ? res.send({ isSuccess: true })
      : res.send({ isSuccess: false });
    //없는 아이디 같이 잘못된 todoId 보내면 [0]으로 false임
  } catch (err) {
    console.log("sever err", err);
    res.status(500).send("서버에러..관리자에게 문의하세요!");
  }
};

// 수정 삭제에 대한 api
