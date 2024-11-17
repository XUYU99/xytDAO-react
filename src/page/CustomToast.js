import React, { useState, useEffect } from "react";

const CustomToast = ({ message, visible, type, onClose }) => {
  // 定义弹窗样式
  const toastStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    minWidth: "200px",
    padding: "15px",
    borderRadius: "5px",
    backgroundColor: type === "success" ? "#4CAF50" : "#f44336", // 成功为绿色，错误为红色
    color: "white",
    fontSize: "14px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
  };

  // 自动关闭弹窗
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3秒后关闭
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return visible ? <div style={toastStyle}>{message}</div> : null;
};

export default CustomToast;
