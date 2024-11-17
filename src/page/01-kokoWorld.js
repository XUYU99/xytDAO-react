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
import deploy from "../kokoDao/01-deploy";
import propose from "../kokoDao/02-propose";
import vote from "../kokoDao/03-vote";
import execute from "../kokoDao/04-execute";
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
          // align="center" // 垂直居中
          // height="80vh"
          // paddingBottom="120px"
        >
          {/* 提案数据展示组件 */}
          <ProposalData />
          <Box width="900px" margin="50px 0px">
            <Box id="DAO_title" margin="auto">
              <Text fontSize="30px" textShadow="0 5px #000000">
                kokoWorld DAO!!
              </Text>
            </Box>
            {/* deploy 按钮 */}
            <Button
              id="deploy-button"
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #OFOFOF"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="8px"
              margin="30px"
              onClick={deployOnclick}
            >
              deploy
            </Button>
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
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="text"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                  placeholder={"proposal exe"}
                ></Input>
                {/* 提案值输入框 */}
                <Input
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="5px"
                  margin="0 15px"
                  type="text"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                  placeholder={"proposal value"}
                ></Input>
                {/* 提案描述输入框 */}
                <Input
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="text"
                  defaultValue={inputValue3}
                  onChange={(e) => setInputValue3(e.target.value)}
                ></Input>
              </Flex>
              {/* 提案按钮 */}
              <Button
                id="propose-button"
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #OFOFOF"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="8px"
                marginBottom="30px"
                onClick={proposeOnclick}
              >
                propose
              </Button>
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
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="text"
                  defaultValue={proposalidInput}
                  onChange={(e) => setproposalidInput(e.target.value)}
                  placeholder={"proposal Id"}
                ></Input>
                {/* 支持选项输入框 */}
                <Input
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="number"
                  defaultValue={supportInput}
                  onChange={(e) => setsupportInput(e.target.value)}
                  placeholder={"support"}
                ></Input>
                {/* 投票账户编号输入框 */}
                <Input
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="number"
                  defaultValue={accountNumberInput}
                  onChange={(e) => setaccountNumberInput(e.target.value)}
                  placeholder={"0"}
                ></Input>
              </Flex>
              {/* 投票按钮 */}
              <Button
                id="vote-button"
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #OFOFOF"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="8px"
                marginBottom="30px"
                onClick={voteOnclick}
              >
                vote
              </Button>
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
                  fontFamily="inherit"
                  width="190px"
                  height="43px"
                  fontSize="13"
                  textAlign="center"
                  padding="10px"
                  margin="0 15px"
                  type="text"
                  defaultValue={executeProposalIdInput}
                  onChange={(e) => setexecuteProposalIdInput(e.target.value)}
                  placeholder={"execute ProposalId"}
                ></Input>
              </Flex>
              {/* 执行按钮 */}
              <Button
                id="execute-button"
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #OFOFOF"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="8px"
                marginBottom="30px"
                onClick={executeOnclick}
              >
                execute
              </Button>
            </div>
          </Box>
        </Flex>
      </ChakraBaseProvider>
    </div>
  );
}

export default Kokoworld;
