// Khởi tạo Notyf
var notify = new Notyf({
  duration: 3000,
  position: {
    x:'right',
    y:'top'
  },
  dismissible: true
});

// Hiển thị thông báo trong sessionStorage
let notifySession = sessionStorage.getItem("notify");
if(notifySession) {
  notifySession = JSON.parse(notifySession);
  if(notifySession.code == "error") {
    notify.error(notifySession.message);
  }
  if(notifySession.code == "success") {
    notify.success(notifySession.message);
  }
  sessionStorage.removeItem("notify");
}

// Vẽ thông báo
const drawNotify = (code, message) => {
  const data = {
    code: code,
    message: message
  };
  sessionStorage.setItem("notify", JSON.stringify(data));
}
// End Khởi tạo Notyf