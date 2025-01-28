const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

// GET /api-server
router.get("/", controller.getIndex);

// GET /api-server/user
router.get("/user", controller.getUser);

///////////
//전체 조회  GET /api-server/todos
router.get("/todos", controller.getTodos);

//추가 //하나추가  POST /api-server/todo
router.post("/todo", controller.addTodo);

//PATCH todo.done 값 변경 /api-server/todo/:todoId
router.patch("/todo/:todoId", controller.patchDoneState);

module.exports = router;
