// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if(buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");
  const overlay = menu.querySelector(".inner-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  })

  overlay.addEventListener("click", () => {
    menu.classList.remove("active");
  })

  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach(button => {
    button.addEventListener("click", () => {
      const li = button.closest("li");
      li.classList.toggle("active");
    })
  })
}
// End Menu Mobile

// Box Address Section 1
const boxAddressSection1 = document.querySelector(".section-1 .inner-form .inner-address");
if(boxAddressSection1) {
  // Ẩn/hiện box suggest
  const input = boxAddressSection1.querySelector(".inner-input-group .inner-input");
  
  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  })

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  })

  // Bắt sự kiện cho từng item
  const listItem = boxAddressSection1.querySelectorAll(".inner-suggest .inner-item");
  listItem.forEach(item => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      input.value = title;
    })
  })
}
// End Box Address Section 1

// Box User Section 1
const boxUserSection1 = document.querySelector(".section-1 .inner-form .inner-user");
if(boxUserSection1) {
  // Hiện box
  const input = boxUserSection1.querySelector(".inner-input-group .inner-input");
  
  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  })

  // Ẩn box
  document.addEventListener("click", (event) => {
    if(!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove("active");
    }
  })

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(".inner-quantity .inner-number");
    const listNumber = [];
    listBoxNumber.forEach(boxNumber => {
      const number = parseInt(boxNumber.innerHTML);
      listNumber.push(number);
    })
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  }

  // Bắt sự kiện click nút up
  const listButtonUp = boxUserSection1.querySelectorAll(".inner-quantity .inner-up");
  listButtonUp.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML);
      boxNumber.innerHTML = number + 1;
      updateQuantityInput();
    })
  })

  // Bắt sự kiện click nút down
  const listButtonDown = boxUserSection1.querySelectorAll(".inner-quantity .inner-down");
  listButtonDown.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML);
      if(number > 0) {
        boxNumber.innerHTML = number - 1;
        updateQuantityInput();
      }
    })
  })
}
// End Box User Section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if(clockExpire) {
  const listBoxNumber = clockExpire.querySelectorAll(".inner-number");
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");
  const expireDateTime = new Date(expireDateTimeString);

  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now;
    if(remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      const hours = Math.floor(remainingTime / (60 * 60 * 1000) % 24);
      const minutes = Math.floor(remainingTime / (60 * 1000) % 60);
      const seconds = Math.floor(remainingTime / (1000) % 60);
      listBoxNumber[0].innerHTML = days < 10 ? `0${days}` : days;
      listBoxNumber[1].innerHTML = hours < 10 ? `0${hours}` : hours;
      listBoxNumber[2].innerHTML = minutes < 10 ? `0${minutes}` : minutes;
      listBoxNumber[3].innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    } else {
      clearInterval(intervalClock);
    }
  };

  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Box Filter
const buttonFilterMobile = document.querySelector(".section-9 .inner-button-filter");
if(buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");
  const overlay = boxLeft.querySelector(".inner-overlay");

  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  })

  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  })
}
// End Box Filter

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if(boxTourInfo) {
  // Nút xem tất cả
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    if(boxTourInfo.classList.contains("active")) {
      boxTourInfo.classList.remove("active");
      buttonReadMore.innerHTML = "Xem tất cả";
    } else {
      boxTourInfo.classList.add("active");
      buttonReadMore.innerHTML = "Ẩn bớt";
    }
  })

  // Zoom ảnh
  new Viewer(boxTourInfo);
}
// End Box Tour Info

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiperSection2");
if(swiperSection2) {
  new Swiper(".swiperSection2", {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
    loop: true,
    autoplay: {
      delay: 4000,
    },
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiperSection3");
if(swiperSection3) {
  new Swiper(".swiperSection3", {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
    loop: true,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}
// End Swiper Section 3

// Box Images
const boxImages = document.querySelector(".box-images");
if(boxImages) {
  const swiperImagesThumb = new Swiper(".swiperImagesThumb", {
    loop: true,
    spaceBetween: 5,
    slidesPerView: 4,
    freeMode: true,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });

  const swiperImagesMain = new Swiper(".swiperImagesMain", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: swiperImagesThumb,
    },
  });

  // Khởi tạo zoom ảnh cho inner-image-main
  const innerImageMain = boxImages.querySelector(".inner-image-main");
  new Viewer(innerImageMain);
}
// End Box Images

// Box Tour Schedule
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if(boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Box Tour Schedule

// Email Form
const emailForm = document.querySelector("#email-form");
if(emailForm) {
  const validator = new JustValidate("#email-form");

  validator
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      }
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      console.log(email);
    });
}
// End Email Form

// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if(couponForm) {
  const validator = new JustValidate("#coupon-form");

  validator
    .addField("#coupon-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã giảm giá!"
      }
    ])
    .onSuccess((event) => {
      const coupon = event.target.coupon.value;
      console.log(coupon);
    });
}
// End Coupon Form

// Order Form
const orderForm = document.querySelector("#orderForm");
if (orderForm) {
  const validator = new JustValidate("#orderForm");

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
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!"
      },
      {
        rule: "customRegexp",
        value: /^(0|\+84)(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])[0-9]{7}$/,
        errorMessage: "Số điện thoại không đúng định dạng!"
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.method.value;

      console.log(fullName);
      console.log(phone);
      console.log(note);
      console.log(paymentMethod);

      // Lấy giỏ hàng từ localStorage và chỉ lọc những tour đã được tích chọn
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(item => item.checked && (item.quantityAdult + item.quantityChildren + item.quantityBaby > 0));

      if (cart.length == 0) {
        notify.error("Vui lòng chọn sản phẩm trong giỏ hàng!");
        return;
      }

      const dataFinal = {
        fullName: fullName,
        phone: phone,
        note: note,
        paymentMethod: paymentMethod,
        items: cart
      };

      fetch(`/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
//            notify.error(data.message);
            alert(data.message); // Dùng alert mặc định
          }

          if (data.code == "success") {
//            notify.success(data.message);
            alert(data.message); // Dùng alert mặc định
            // Xóa những tour đã đặt thành công khỏi localStorage
            let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
            const remainingCart = currentCart.filter(item => {
              return !(item.checked && (item.quantityAdult + item.quantityChildren + item.quantityBaby > 0));
            });
            localStorage.setItem("cart", JSON.stringify(remainingCart));

            // Chuyển hướng sang trang thành công (Sửa window.rental thành window.location)
//            window.location.href = `/order/success?orderId=${data.orderId}&phone=${phone}`;
            switch (paymentMethod) {
                case "money":
                case "bank":
                    // Chuyển hướng sang trang thành công cho tiền mặt/chuyển khoản
                    window.location.href = `/order/success?orderCode=${data.orderCode}&phone=${phone}`;
                    break;

                case "zalopay":
                    // Chuyển hướng sang trang thanh toán ZaloPay
                    window.location.href = `/order/payment-zalopay?orderCode=${data.orderCode}&phone=${phone}`;
                    break;

                default:
                    // Xử lý mặc định nếu không khớp phương thức nào
                    window.location.href = `/order/success?orderCode=${data.orderCode}&phone=${phone}`;
                    break;
            }
          }
        });
    });

  // Hiển thị thông tin ngân hàng khi chọn "Chuyển khoản"
  const listInputMethod = orderForm.querySelectorAll(`input[name='method']`);
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");

  if (listInputMethod.length > 0 && elementInfoBank) {
    listInputMethod.forEach(input => {
      input.addEventListener("change", () => {
        if (input.value == "bank") {
          elementInfoBank.classList.add("active");
        } else {
          elementInfoBank.classList.remove("active");
        }
      });
    });
  }
}
// End Order Form

// Filter Box
const boxFilter = document.querySelector(".box-filter");

if (boxFilter) {
    const url = new URL(`${window.location.origin}/search`);
    const buttonApply = boxFilter.querySelector(".inner-button");

    buttonApply.addEventListener("click", () => {
        const filterList = [
            "locationFrom",
            "locationTo",
            "departureDate",
            "stockAdult",
            "stockChildren",
            "stockBaby",
            "price",
        ];

        filterList.forEach(item => {
            const inputElement = boxFilter.querySelector(`[name="${item}"]`);
            if (inputElement) {
                const value = inputElement.value;
                if (value) {
                    url.searchParams.set(item, value);
                } else {
                    url.searchParams.delete(item);
                }
            }
        });

        // Sửa lỗi window.rental thành window.location
        window.location.href = url.href;
    });
}
// End Box Filter

// form-search
const formSearch = document.querySelector("[form-search]");

if (formSearch) {
  // Define the base search URL
  const url = new URL(`${window.location.origin}/search`);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    // 1. Destination (Location To)
    const locationTo = formSearch.locationTo.value;
    if (locationTo) {
      url.searchParams.set("locationTo", locationTo);
    } else {
      url.searchParams.delete("locationTo");
    }

    // 2. Quantity (Adults, Children, Babies)
    // Using a helper to dry up the code for stock counts
    const updateStockParam = (selector, paramName) => {
      const element = formSearch.querySelector(selector);
      if (element) {
        const value = element.innerHTML.trim();
        if (value && value !== "0") { // Optional: don't add if count is 0
          url.searchParams.set(paramName, value);
        } else {
          url.searchParams.delete(paramName);
        }
      }
    };

    updateStockParam("[stock-adult]", "stockAdult");
    updateStockParam("[stock-children]", "stockChildren");
    updateStockParam("[stock-baby]", "stockBaby");

    // 3. Departure Date
    const departureDate = formSearch.departureDate.value;
    if (departureDate) {
      url.searchParams.set("departureDate", departureDate);
    } else {
      url.searchParams.delete("departureDate");
    }

    // 4. Execution (The fix for window.location)
    window.location.href = url.href; 
  });
}
// End form-search

// Tạo giỏ hàng trống trong localStorage nếu chưa có
const cart = localStorage.getItem("cart");
if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
}
// Hết Tạo giỏ hàng trống

// Hiển thị số lượng vào mini-cart
const drawMiniCart = () => {
    const miniCart = document.querySelector("[mini-cart]");
    if (miniCart) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        // Kiểm tra nếu giỏ hàng tồn tại thì lấy độ dài mảng, ngược lại là 0
        miniCart.innerHTML = cart ? cart.length : 0;
    }
};

drawMiniCart();
// Hết Hiển thị số lượng vào mini-cart
// box-tour-detail
const boxTourDetail = document.querySelector(".box-tour-detail");
if (boxTourDetail) {
    const inputStockAdult = boxTourDetail.querySelector("[input-stock-adult]");
    const inputStockChildren = boxTourDetail.querySelector("[input-stock-children]");
    const inputStockBaby = boxTourDetail.querySelector("[input-stock-baby]");

    // Hàm tính toán và hiển thị lại giá trị/tổng tiền
    const drawBoxDetail = () => {
        const quantityAdult = parseInt(inputStockAdult.value) || 0;
        const quantityChildren = parseInt(inputStockChildren.value) || 0;
        const quantityBaby = parseInt(inputStockBaby.value) || 0;

        const spanStockAdult = boxTourDetail.querySelector("span[stock-adult]");
        const spanStockChildren = boxTourDetail.querySelector("span[stock-children]");
        const spanStockBaby = boxTourDetail.querySelector("span[stock-baby]");

        if (spanStockAdult) {
            spanStockAdult.innerHTML = quantityAdult;
        }
        if (spanStockChildren) {
            spanStockChildren.innerHTML = quantityChildren;
        }
        if (spanStockBaby) {
            spanStockBaby.innerHTML = quantityBaby;
        }

        // Lấy giá tiền từ thuộc tính tự định nghĩa (price)
        const priceAdult = parseInt(inputStockAdult.getAttribute("price")) || 0;
        const priceChildren = parseInt(inputStockChildren.getAttribute("price")) || 0;
        const priceBaby = parseInt(inputStockBaby.getAttribute("price")) || 0;

        const totalPrice = (quantityAdult * priceAdult) + (quantityChildren * priceChildren) + (quantityBaby * priceBaby);
        
        const spanTotalPrice = boxTourDetail.querySelector("span[total-price]");
        if (spanTotalPrice) {
            spanTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");
        }
    };

    // Lắng nghe sự kiện thay đổi số lượng khách
    inputStockAdult.addEventListener("change", drawBoxDetail);
    inputStockChildren.addEventListener("change", drawBoxDetail);
    inputStockBaby.addEventListener("change", drawBoxDetail);

    // Nút thêm vào giỏ hàng
    const buttonAddCart = boxTourDetail.querySelector(".inner-button-add-cart");
    if (buttonAddCart) {
        buttonAddCart.addEventListener("click", () => {
            const tourId = buttonAddCart.getAttribute("tour-id");
            const quantityAdult = parseInt(inputStockAdult.value) || 0;
            const quantityChildren = parseInt(inputStockChildren.value) || 0;
            const quantityBaby = parseInt(inputStockBaby.value) || 0;
            const locationFrom = boxTourDetail.querySelector("[location-from]").value;

            // Kiểm tra nếu chưa chọn khách nào
            if (quantityAdult + quantityChildren + quantityBaby == 0) {
                notify.error("Vui lòng chọn số lượng khách!");
                return;
            }

            const cartItem = {
                tourId: tourId,
                locationFrom: locationFrom,
                quantityAdult: quantityAdult,
                quantityChildren: quantityChildren,
                quantityBaby: quantityBaby,
                checked :  true                
            };

            const currentCart = JSON.parse(localStorage.getItem("cart"));
            
            // Kiểm tra xem tour này với cùng điểm khởi hành đã có trong giỏ chưa
            const indexExistingItem = currentCart.findIndex(item => 
                item.tourId == tourId && item.locationFrom == locationFrom
            );

            if (indexExistingItem != -1) {
                // Nếu đã có thì cộng dồn số lượng
                currentCart[indexExistingItem].quantityAdult += quantityAdult;
                currentCart[indexExistingItem].quantityChildren += quantityChildren;
                currentCart[indexExistingItem].quantityBaby += quantityBaby;
            } else {
                // Nếu chưa có thì thêm mới vào đầu mảng
                currentCart.unshift(cartItem);
            }

            // Lưu lại vào localStorage
            localStorage.setItem("cart", JSON.stringify(currentCart));
            notify.success("Thêm vào giỏ hàng thành công!");
            alert("Thêm vào giỏ hàng thành công!"); // Dùng alert mặc định
            drawMiniCart(); // Cập nhật lại số lượng trên mini-cart
        });
    }
}
// End box-tour-detail

// Page Cart
// Page Cart
const drawCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Gửi mảng cart từ localStorage lên backend để lấy thông tin chi tiết
  fetch(`/cart/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cart })
  })
  .then(response => response.json())
  .then(data => {
    if (data.code == "success") {
      const cartDetails = data.cart;
      
      // 1. Hiển thị danh sách item ra giao diện
      const htmlCartItems = cartDetails.map(item => {
        const tourInfo = `${item.tourId}-${item.locationFrom}`;
        
        // Kiểm tra trạng thái check (mặc định là true nếu chưa có biến này)
        const isChecked = item.checked !== false;

        return `
          <div class="inner-tour-item">
            <div class="inner-actions">
              <button class="inner-delete" button-delete="${tourInfo}" style="cursor: pointer;">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <input type="checkbox" class="inner-check" input-check tour-info="${tourInfo}" ${isChecked ? "checked" : ""}>
            </div>
            <div class="inner-product">
              <div class="inner-image">
                <a href="/tours/detail/${item.slug}">
                  <img src="${item.avatar}" alt="${item.name}">
                </a>
              </div>
              <div class="inner-content">
                <div class="inner-title">
                  <a href="/tours/detail/${item.slug}">${item.name}</a>
                </div>
                <div class="inner-meta">
                  <div>Ngày Khởi Hành: <b>${item.departureDate}</b></div>
                  <div>Khởi Hành Tại: <b>${item.locationFromName}</b></div>
                </div>
              </div>
            </div>
            <div class="inner-quantity">
              <div class="inner-label">Số Lượng Hành Khách</div>
              <div class="inner-list">
                <div class="inner-item">
                  <div class="inner-item-label">Người lớn:</div>
                  <input type="number" class="inner-item-input" 
                    value="${item.quantityAdult}" min="0" max="${item.stockAdult}" 
                    name="quantityAdult" input-quantity tour-info="${tourInfo}">
                  <div class="inner-item-price">
                    <span>${item.quantityAdult}</span> x 
                    <span class="inner-highlight">${item.priceNewAdult.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
                <div class="inner-item">
                  <div class="inner-item-label">Trẻ em:</div>
                  <input type="number" class="inner-item-input" 
                    value="${item.quantityChildren}" min="0" max="${item.stockChildren}" 
                    name="quantityChildren" input-quantity tour-info="${tourInfo}">
                  <div class="inner-item-price">
                    <span>${item.quantityChildren}</span> x 
                    <span class="inner-highlight">${item.priceNewChildren.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
                <div class="inner-item">
                  <div class="inner-item-label">Em bé:</div>
                  <input type="number" class="inner-item-input" 
                    value="${item.quantityBaby}" min="0" max="${item.stockBaby}" 
                    name="quantityBaby" input-quantity tour-info="${tourInfo}">
                  <div class="inner-item-price">
                    <span>${item.quantityBaby}</span> x 
                    <span class="inner-highlight">${item.priceNewBaby.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      const elementCartList = pageCart.querySelector("[cart-list]");
      if (elementCartList) {
        elementCartList.innerHTML = htmlCartItems.join("");
      }

      // --- LOGIC: Bắt sự kiện check/uncheck và lưu trạng thái ---
      const listInputCheck = pageCart.querySelectorAll("input[input-check]");
      listInputCheck.forEach(input => {
        input.addEventListener("change", () => {
          const tourInfo = input.getAttribute("tour-info");
          const [tourId, locationFrom] = tourInfo.split("-");
          const checked = input.checked;

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const indexItem = cart.findIndex(item => item.tourId == tourId && item.locationFrom == locationFrom);

          if (indexItem != -1) {
            cart[indexItem].checked = checked;
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart(); // Vẽ lại để cập nhật tiền ngay lập tức
          }
        });
      });

      // --- 2. Bắt sự kiện Xóa Tour ---
      const listButtonDelete = pageCart.querySelectorAll("[button-delete]");
      listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
          const tourInfo = button.getAttribute("button-delete");
          const [tourId, locationFrom] = tourInfo.split("-");

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const newCart = cart.filter(item => 
            !(item.tourId == tourId && item.locationFrom == locationFrom)
          );

          localStorage.setItem("cart", JSON.stringify(newCart));
          
          drawCart(); 
          if (typeof drawMiniCart === "function") {
            drawMiniCart();
          }
        });
      });

      // --- 3. Tính toán tổng tiền (Chỉ tính những item đã check) ---
      const subTotal = cartDetails.reduce((total, item) => {
        // Nếu item chưa được check thì bỏ qua không cộng tiền
        if (item.checked === false) return total;

        return total + 
          (item.quantityAdult * item.priceNewAdult) + 
          (item.quantityChildren * item.priceNewChildren) + 
          (item.quantityBaby * item.priceNewBaby);
      }, 0);

      const discount = 0; 
      const total = subTotal - discount;

      const elementSubTotal = pageCart.querySelector("[cart-sub-total]");
      const elementDiscount = pageCart.querySelector("[cart-discount]");
      const elementTotal = pageCart.querySelector("[cart-total]");

      if (elementSubTotal) elementSubTotal.innerHTML = subTotal.toLocaleString("vi-VN");
      if (elementDiscount) elementDiscount.innerHTML = discount.toLocaleString("vi-VN");
      if (elementTotal) elementTotal.innerHTML = total.toLocaleString("vi-VN");

      // 4. Bắt sự kiện thay đổi số lượng
      const listInputQuantity = pageCart.querySelectorAll("input[input-quantity]");
      listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
          const tourInfo = input.getAttribute("tour-info");
          const [tourId, locationFrom] = tourInfo.split("-");
          const name = input.getAttribute("name"); 
          let value = parseInt(input.value) || 0;
          const max = parseInt(input.getAttribute("max")) || 0;

          if (value < 0) value = 0;
          if (value > max) value = max;
          input.value = value;

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const indexItem = cart.findIndex(item => item.tourId == tourId && item.locationFrom == locationFrom);
          
          if (indexItem != -1) {
            cart[indexItem][name] = value;
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart(); 
          }
        });
      });
    }
  })
  .catch(error => {
    console.error("Lỗi khi render giỏ hàng:", error);
  });
};

const pageCart = document.querySelector("[page-cart]");
if (pageCart) {
  drawCart();
}
// End Page Cart