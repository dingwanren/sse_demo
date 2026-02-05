const msgList = document.querySelector(".msg-list");
const input = document.querySelector(".msg-input");
const sendBtn = document.querySelector(".send-btn");
const esUrl = "http://localhost:3000/api/chat-stream";
let currentEventSource = null;

function sendMessage(question) {
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
  currentEventSource = new EventSource(
    `${esUrl}?question=${encodeURIComponent(question)}`,
  );

  currentEventSource.addEventListener("message", (event) => {
    console.log("收到数据块:", event.data);
  });

  currentEventSource.addEventListener("close", () => {
    console.log("回答结束，连接将被后端关闭。");
    currentEventSource.close();// 不关闭会自动重连,还报错
    currentEventSource = null;
  });

  currentEventSource.onerror = (error) => {
    console.error("连接错误:", error);
    console.log("readyState:", currentEventSource.readyState);

    // readyState值说明：
    // 0 = CONNECTING (连接中)
    // 1 = OPEN (已打开)
    // 2 = CLOSED (已关闭)

    // 如果是连接关闭导致的错误（正常结束）
    if (currentEventSource.readyState === EventSource.CLOSED) {
      console.log("连接正常关闭");
    } else {
      console.error("非正常错误");
    }

    // 清理引用
    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }
  };
}

sendBtn.addEventListener("click", () => {
  sendMessage("你好?  mk");
});
