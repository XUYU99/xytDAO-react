// Koko.js
import React, { useState } from "react";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
} from "../setting/component"; // 导入 Chakra UI 组件
import NavBar from "./00-NavBar";
import deploy from "../scripts/kokoDao/01-deploy";
import propose from "../scripts/kokoDao/02-propose";
import vote from "../scripts/kokoDao/03-vote";
import execute from "../scripts/kokoDao/04-execute";
import ProposalData from "./proposalData";

/**
 * kokoWorld DAO 页面
 */
function Kokoworld({ accounts, setAccounts }) {
  // 定义状态变量，用于存储输入框的值
  const [inputValue1, setInputValue1] = useState(""); // 提案的执行地址
  const [inputValue2, setInputValue2] = useState("0"); // 提案的值
  const [inputValue3, setInputValue3] = useState("set proposal description"); // 提案描述

  const [proposalidInput, setproposalidInput] = useState(""); // 提案 ID 输入框值
  const [supportInput, setsupportInput] = useState("1"); // 投票支持选项
  const [accountNumberInput, setaccountNumberInput] = useState("0"); // 投票账户编号

  const [executeProposalIdInput, setexecuteProposalIdInput] = useState(""); // 执行提案 ID 输入框值

  // 部署合约 的按钮点击事件
  async function deployOnclick() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await deploy(); // 调用部署函数
        alert("部署成功！"); // 部署成功提示
      } catch (error) {
        console.error("部署失败：", error);
        alert("部署失败，请检查控制台日志！");
      }
    } else {
      alert("MetaMask 未安装，请先安装 MetaMask！");
    }
  }

  async function proposeOnclick() {
    if (!inputValue1 || !inputValue3) {
      alert("提案的目标地址和描述不能为空！"); // 检查必填项
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      try {
        await propose(inputValue1, inputValue3); // 提案成功调用
        alert("提案成功！"); // 提案成功提示
      } catch (error) {
        console.error("提案失败：", error);
        alert("提案失败，请检查控制台日志！");
      }
    } else {
      alert("MetaMask 未安装，请先安装 MetaMask！");
    }
  }
  // 投票 的按钮点击事件
  async function voteOnclick() {
    if (!proposalidInput || !supportInput || !accountNumberInput) {
      alert("提案 ID、支持选项和账户编号不能为空！"); // 显示警告
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      try {
        await vote(proposalidInput, supportInput, accountNumberInput); // 调用投票函数
        alert("投票成功！"); // 投票成功提示
      } catch (error) {
        console.error("投票失败：", error);
        alert("投票失败，请检查控制台日志！");
      }
    } else {
      alert("MetaMask 未安装，请先安装 MetaMask！");
    }
  }

  // 执行提案 的按钮点击事件
  async function executeOnclick() {
    if (!executeProposalIdInput) {
      alert("执行提案 ID 不能为空！"); // 显示警告
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      try {
        await execute(executeProposalIdInput); // 调用执行函数
        alert("提案执行成功！"); // 执行成功提示
      } catch (error) {
        console.error("提案执行失败：", error);
        alert("提案执行失败，请检查控制台日志！");
      }
    } else {
      alert("MetaMask 未安装，请先安装 MetaMask！");
    }
  }

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      {/* 导航栏组件 */}
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <ChakraBaseProvider>
        {/* 页面布局 */}
        <Flex
          justify="center" // 居中对齐
        >
          {/* 提案数据展示组件 */}
          <ProposalData />
          <div className="run-Dao">
            <Box width="900px" margin="50px 0px">
              <Box id="DAO_title" margin="auto">
                <Text fontSize="40px">kokoWorld DAO!!</Text>
                <Text
                  fontSize="33px"
                  letterSpacing="-5.5%" // 字间距
                  fontFamily="VT323" // 字体
                  textShadow="0 2px 2px #000000"
                >
                  It's 2077, bala bala ...
                </Text>
              </Box>
              {/* deploy 按钮 */}
              <button onClick={deployOnclick}>deploy</button>
              {/* 提案部分 */}
              <div id="propose">
                <Flex
                  id="propose-input"
                  align="center"
                  justify="center"
                  padding="20px 30px"
                  textColor="black"
                >
                  {/* 提案目标地址输入框 */}
                  <Input
                    type="text"
                    value={inputValue1}
                    onChange={(e) => setInputValue1(e.target.value)}
                    placeholder={"proposal exe"}
                  ></Input>
                  {/* 提案值输入框 */}
                  <Input
                    type="text"
                    value={inputValue2}
                    onChange={(e) => setInputValue2(e.target.value)}
                    placeholder={"proposal value"}
                  ></Input>
                  {/* 提案描述输入框 */}
                  <Input
                    type="text"
                    defaultValue={inputValue3}
                    onChange={(e) => setInputValue3(e.target.value)}
                  ></Input>
                </Flex>
                {/* 提案按钮 */}
                <button id="propose-button" onClick={proposeOnclick}>
                  propose
                </button>
              </div>
              {/* 投票部分 */}
              <div id="vote">
                <Flex
                  id="propose-input"
                  align="center"
                  justify="center"
                  padding="20px 30px"
                  textColor="black"
                >
                  {/* 提案 ID 输入框 */}
                  <Input
                    type="text"
                    defaultValue={proposalidInput}
                    onChange={(e) => setproposalidInput(e.target.value)}
                    placeholder={"proposal Id"}
                  ></Input>
                  {/* 支持选项输入框 */}
                  <Input
                    type="number"
                    defaultValue={supportInput}
                    onChange={(e) => setsupportInput(e.target.value)}
                    placeholder={"support"}
                  ></Input>
                  {/* 投票账户编号输入框 */}
                  <Input
                    type="number"
                    defaultValue={accountNumberInput}
                    onChange={(e) => setaccountNumberInput(e.target.value)}
                    placeholder={"0"}
                  ></Input>
                </Flex>
                {/* 投票按钮 */}
                <button id="vote-button" onClick={voteOnclick}>
                  vote
                </button>
              </div>
              {/* 提案执行部分 */}
              <div id="execute">
                <Flex
                  id="propose-input"
                  align="center"
                  justify="center"
                  padding="20px 30px"
                  textColor="black"
                >
                  {/* 提案执行 ID 输入框 */}
                  <Input
                    type="text"
                    defaultValue={executeProposalIdInput}
                    onChange={(e) => setexecuteProposalIdInput(e.target.value)}
                    placeholder={"execute ProposalId"}
                  ></Input>
                </Flex>
                {/* 执行按钮 */}
                <button id="execute-button" onClick={executeOnclick}>
                  execute
                </button>
              </div>
            </Box>
          </div>
        </Flex>
      </ChakraBaseProvider>
    </div>
  );
}

export default Kokoworld;
