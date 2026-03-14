// Login Form
const loginForm = document.querySelector("#loginForm");
if(loginForm) {
  const validator = new JustValidate('#loginForm');

  validator
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const rememberPassword = event.target.rememberPassword.checked;

      const dataFinal = {
        email: email,
        password: password,
        rememberPassword: rememberPassword 
      };

      fetch(`/${pathAdmin}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }
          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/dashboard`;
          }
        })
    })
}
// End Login Form

// Register Form
const registerForm = document.querySelector("#registerForm");
if(registerForm) {
  const validator = new JustValidate('#registerForm');

  validator
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!"
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: "Vui lòng nhập ít nhất 5 ký tự!"
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: "Vui lòng nhập tối đa 50 ký tự!"
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Mật khẩu phải có ít nhất 8 ký tự!"
      },
      {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage: "Mật khẩu phải chứa ký tự thường!"
      },
      {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage: "Mật khẩu phải chứa ký tự hoa!"
      },
      {
        rule: 'customRegexp',
        value: /\d/,
        errorMessage: "Mật khẩu phải chứa chữ số!"
      },
      {
        rule: 'customRegexp',
        value: /[^A-Za-z0-9]/,
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!"
      },
    ])
    .addField("#agree", [
      {
        rule: "required",
        errorMessage: "Vui lòng chấp nhận để đăng ký tài khoản!"
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const password = event.target.password.value;

      const dataFinal = {
        fullName: fullName,
        email: email,
        password: password
      };

      fetch(`/${pathAdmin}/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }
          console.log(data);
          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/register-initial`;
          }
        })
    })
}
// End Register Form

// Forgot Password Form
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
if(forgotPasswordForm) {
  const validator = new JustValidate('#forgotPasswordForm');

  validator
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;

      const dataFinal = {
        email: email
      };

      fetch(`/${pathAdmin}/account/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/otp-password?email=${email}`;
          }
        })
    })
}
// End Forgot Password Form

// OTP Password Form
const otpPasswordForm = document.querySelector("#otpPasswordForm");
if(otpPasswordForm) {
  const validator = new JustValidate('#otpPasswordForm');

  validator
    .addField("#otp", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã OTP!"
      },
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value;

      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      const dataFinal = {
        email: email,
        otp: otp,
      };

      fetch(`/${pathAdmin}/account/otp-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/reset-password`;
          }
        })
    })
}
// End OTP Password Form

// Reset Password Form
const resetPasswordForm = document.querySelector("#resetPasswordForm");
if(resetPasswordForm) {
  const validator = new JustValidate('#resetPasswordForm');

  validator
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Mật khẩu phải có ít nhất 8 ký tự!"
      },
      {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage: "Mật khẩu phải chứa ký tự thường!"
      },
      {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage: "Mật khẩu phải chứa ký tự hoa!"
      },
      {
        rule: 'customRegexp',
        value: /\d/,
        errorMessage: "Mật khẩu phải chứa chữ số!"
      },
      {
        rule: 'customRegexp',
        value: /[^A-Za-z0-9]/,
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!"
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập xác nhận mật khẩu!"
      },
      {
        validator: (value, context) => {
          const password = context["#password"].elem.value;
          return value === password ? true : false;
        },
        errorMessage: "Mật khẩu xác nhận không trùng khớp!"
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;

      const dataFinal = {
        password: password,
      };

      fetch(`/${pathAdmin}/account/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/dashboard`;
          }
        })
    })
}
// End Reset Password Form