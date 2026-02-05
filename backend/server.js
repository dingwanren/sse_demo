const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/chat-stream", (req, res) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(": 连接已建立\n\n");
  console.log('已连接')
  // 从查询参数中获取问题
  const question = req.query.question;
  console.log("question", question);

  // 然后开始你的SSE流式响应逻辑...
  let count = 0;
  let timeId = setInterval(() => {
    count++;

    res.write(`data:第${count}次数据\n\n`);
    console.log('发送数据')
    if (count > 5) {
      clearInterval(timeId);
      // res.write("event: close\n\n"); 错误,必须有data:
      res.write("event: close\ndata: 流已结束\n\n");
      res.end();
    }
  }, 500);

  req.on("close", () => {
    clearInterval(timeId);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
