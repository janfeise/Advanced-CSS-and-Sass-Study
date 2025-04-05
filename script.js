"use strict";

// 获取DOM元素
const navItemEl = document.querySelectorAll(".navigation__item");
const navToggleEl = document.getElementById("nav-toggle");
const popEl = document.querySelectorAll(".popup");

// 遍历所有navItem
const navItemCount = navItemEl.length;
for (let i = 0; i < navItemCount; i++) {
  navItemEl[i].addEventListener("click", function () {
    // 点击导航栏item后关闭导航栏
    navToggleEl.click();
  });
}

// // 遍历所有弹窗
// const popCount = popEl.length; // 获取弹窗数量
// for (let i = 0; i < popCount; i++) {
//   popEl[i].addEventListener("click", function () {
//     popEl[i].style.opcity = 0;
//     popEl[i].style.visibility = "hidden";
//   });
// }
