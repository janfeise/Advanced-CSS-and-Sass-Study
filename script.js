"use strict";

// 获取DOM元素
const navItemEl = document.querySelectorAll(".navigation__item");
const navToggleEl = document.getElementById("nav-toggle");
const popEl = document.querySelectorAll(".popup__cover");
const popCloseEl = document.querySelectorAll(".popup__close");
const btnModal = document.querySelectorAll(".btn-modal");

/**
 * 初始化
 */
const init = function () {
  document.body.classList.remove("fixed");
};
init();

/**
 * 遍历所有元素，并执行对应的操作
 */
const loopEl = (Els, fuc, passIndex = true) => {
  const elCount = Els.length;
  for (let i = 0; i < elCount; i++) {
    if (passIndex) {
      fuc(i);
    } else {
      fuc();
    }
  }
};

// 用于保存和恢复滚动位置的变量
let scrollPosition = 0;

// 禁用滚动并保存当前位置
const prohibitScroll = function () {
  // 保存当前滚动位置
  scrollPosition = window.scrollY;

  // 禁用滚动，设置 body 为固定定位
  document.body.classList.add("fixed");

  // 强制设置页面的位置为之前保存的位置
  document.body.style.top = `-${scrollPosition}px`;
};

// body启用滑动功能
const reuseScroll = function () {
  document.body.classList.remove("fixed");
};

/**
 * 点击导航栏item后关闭导航栏
 */
const closeNav = (i) => {
  navItemEl[i].addEventListener("click", function () {
    // 点击导航栏item后关闭导航栏
    navToggleEl.click();
    reuseScroll();
  });
};

// 遍历所有navItem
loopEl(navItemEl, closeNav);

/**
 * 点击弹窗的关闭按钮
 */
const closePop = (i) => {
  popEl[i].addEventListener("click", function () {
    popCloseEl[i].click();
    reuseScroll();
  });
};

// 遍历所有弹窗
loopEl(popEl, closePop);

// 点击出现弹窗的按钮时，禁用body的scroll
const btnModalProhitScroll = function (i) {
  btnModal[i].addEventListener("click", () => {
    prohibitScroll();
  });
};

// 遍历所有出现modal即弹窗的按钮，当点击时body禁用滑动功能
loopEl(btnModal, btnModalProhitScroll);

// 点击弹窗的关闭按钮时，恢复body的scroll
const popCloseReuseScroll = function (i) {
  popCloseEl[i].addEventListener("click", () => {
    reuseScroll();
  });
};

loopEl(popCloseEl, popCloseReuseScroll);
