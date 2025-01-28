const express = require("express");
const app = express();
const PORT = 8080;
const { sequelize } = require("./models"); //db
const indexRouter = require("./routes");
const serverPerfix = "/api-server";
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // 클라이언트와 서버 다른 도메인 사용

// /api-server  (접두사)  원래 ("/", indexRouter);
app.use(serverPerfix, indexRouter);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("database 오류 ");
  });
