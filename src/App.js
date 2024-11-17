"use client";
import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import Mint from "./page/Mint";
import Kokoworld from "./page/01-kokoWorld";
import ProposalDetail from "./page/proposalDetail";

function App() {
  // 使用 React 的 useState 钩子来存储和更新用户账户信息
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="overlay">
      <div className="App">
        {/* 配置 React 路由 */}
        <Router>
          <Routes>
            {/* 定义根路径 "/" 对应的组件为 Home */}
            <Route
              path="/"
              element={<Home accounts={accounts} setAccounts={setAccounts} />}
            />
            {/* 定义路径 "/Mint" 对应的组件为 Mint */}
            <Route
              path="/Mint"
              element={<Mint accounts={accounts} setAccounts={setAccounts} />}
            />
            {/* 定义路径 "/Koko" 对应的组件为 Kokoworld */}
            <Route
              path="/Koko"
              element={
                <Kokoworld accounts={accounts} setAccounts={setAccounts} />
              }
            />
            {/* 定义路径 "/ProposalDetail" 对应的组件为 ProposalDetail */}
            <Route
              path="/ProposalDetail"
              element={
                <ProposalDetail accounts={accounts} setAccounts={setAccounts} />
              }
            />
          </Routes>
        </Router>
        {/* 背景动画效果 */}
        <div className="moving-background"></div>
      </div>
    </div>
  );
}

export default App; // 导出 App 组件
