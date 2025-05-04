"use strict";

// 获取DOM元素
const navItemEl = document.querySelectorAll(".navigation__item");
const navToggleEl = document.getElementById("nav-toggle");
const popEl = document.querySelectorAll(".popup__cover");
const popCloseEl = document.querySelectorAll(".popup__close");
const btnModal = document.querySelectorAll(".btn-modal");
const images = document.querySelectorAll("img");
const videos = document.querySelectorAll("video");

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

// 评论数据结构
class Comment {
  constructor(name, content, rating, timestamp) {
    this.name = name;
    this.content = content;
    this.rating = rating;
    this.timestamp = timestamp;
  }
}

// 评论管理类
class CommentManager {
  constructor() {
    this.comments = [];
    this.GITHUB_REPO = "janfeise/frontDevTuiTui";
    this.ISSUE_NUMBER = 3;
    this.PROXY_BASE_URL = "https://www.tilex233.me/";
    this.setupEventListeners();
    this.loadComments();
  }

  // 从代理服务器加载评论
  async loadComments() {
    try {
      const response = await fetch(
        `${this.PROXY_BASE_URL}/?path=/repos/${this.GITHUB_REPO}/issues/${this.ISSUE_NUMBER}/comments`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      const comments = await response.json();

      this.comments = comments
        .map((comment) => {
          try {
            const data = JSON.parse(comment.body);
            return new Comment(
              data.name,
              data.content,
              data.rating,
              data.timestamp
            );
          } catch (e) {
            console.error("Failed to parse comment:", e);
            return null;
          }
        })
        .filter((comment) => comment !== null);

      this.renderComments();
    } catch (error) {
      console.error("Failed to load comments:", error);
      this.loadFromLocalStorage();
    }
  }

  // 从localStorage加载评论（备用方案）
  loadFromLocalStorage() {
    const savedComments = localStorage.getItem("comments");
    this.comments = savedComments ? JSON.parse(savedComments) : [];
    this.renderComments();
  }

  // 通过代理保存评论
  async saveComment(comment) {
    try {
      console.log("Attempting to save comment through proxy...");
      const url = `${this.PROXY_BASE_URL}/?path=/repos/${this.GITHUB_REPO}/issues/${this.ISSUE_NUMBER}/comments`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify(comment),
        }),
      });

      const responseData = await response.json();
      console.log("Proxy API Response:", responseData);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${
            responseData.message || "Unknown error"
          }`
        );
      }

      console.log("Comment saved successfully");
      // 同时保存到localStorage作为备份
      this.saveToLocalStorage();
    } catch (error) {
      console.error("Detailed save error:", error);
      // 如果API保存失败，只保存到localStorage
      this.saveToLocalStorage();
      // 显示更详细的错误提示
      alert(`评论保存失败：${error.message}\n已暂存在本地。请稍后再试！`);
    }
  }

  // 保存到localStorage（备用方案）
  saveToLocalStorage() {
    localStorage.setItem("comments", JSON.stringify(this.comments));
  }

  // 添加新评论
  async addComment(name, content, rating) {
    const comment = new Comment(
      name,
      content,
      rating,
      new Date().toISOString()
    );

    // 先添加到本地列表并渲染
    this.comments.unshift(comment);
    this.renderComments();

    // 异步保存到GitHub
    try {
      await this.saveComment(comment);
    } catch (error) {
      console.error("Failed to sync comment:", error);
    }
  }

  // 设置事件监听器
  setupEventListeners() {
    const form = document.getElementById("commentForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const content = document.getElementById("comment").value;
        const rating = document.querySelector(
          'input[name="rating"]:checked'
        ).value;

        if (name && content) {
          // 显示提交中的状态
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = "发布中...";
          submitBtn.disabled = true;

          try {
            await this.addComment(name, content, rating);
            form.reset();
          } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }
      });
    }

    // 添加自动刷新功能
    setInterval(() => this.loadComments(), 30000); // 每30秒刷新一次评论
  }

  // 获取评分星星HTML
  getStarRating(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  // 格式化时间
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // 渲染评论列表
  renderComments() {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    commentsList.innerHTML = this.comments
      .map(
        (comment) => `
        <div class="comment-item">
          <div class="comment-header">
            <span class="comment-author">${comment.name}</span>
            <span class="comment-rating">${this.getStarRating(
              comment.rating
            )}</span>
          </div>
          <div class="comment-content">${comment.content}</div>
          <div class="comment-footer">
            <span class="comment-time">${this.formatDate(
              comment.timestamp
            )}</span>
          </div>
        </div>
      `
      )
      .join("");
  }
}

// 初始化评论管理器
document.addEventListener("DOMContentLoaded", () => {
  new CommentManager();
});

// 加载项
// 正确处理加载动画和禁用滚轮
window.addEventListener("load", function () {
  const loader = document.querySelector(".load-wrap");
  loader.classList.add("fade-out");

  // 可选：完全移除 DOM
  setTimeout(() => {
    loader.remove();
  }, 600);
});

// 图片懒加载
const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const image = entry.target;
      const data_src = image.getAttribute("data-src");
      image.setAttribute("src", data_src);
      observer.unobserve(image);
    }
  });
};

const observer = new IntersectionObserver(callback);

images.forEach((image) => {
  observer.observe(image);
});

// 视频懒加载
videos.forEach((video) => {
  observer.observe(video);
});
