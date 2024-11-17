// Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
} from "../setting/component";
import NavBar from "./00-NavBar";

function Home({ accounts, setAccounts }) {
  const navigate = useNavigate(); // 初始化 useNavigate，用于页面跳转

  // 点击 Mint 按钮时跳转到 /Mint 页面
  const mintClick = () => {
    navigate("/Mint");
  };

  // 点击 Join 按钮时跳转到 /Koko 页面
  const joinClick = () => {
    navigate("/Koko");
  };

  return (
    <div>
      {/* 导航栏组件，显示账户相关信息 */}
      <NavBar accounts={accounts} setAccounts={setAccounts} />

      <ChakraBaseProvider>
        <Flex
          justify="center" // 水平居中
          align="center" // 垂直居中
          height="80vh" // 设定容器高度为视口的 80%
          paddingBottom="100px" // 下方留白
        >
          <Box width="520px">
            {/* 欢迎标题 */}
            <Box id="welcome title" margin="20px">
              <Text fontSize="48px" textShadow="0 5px #000000">
                koko World
              </Text>
              <Text
                fontSize="33px"
                letterSpacing="-5.5%" // 字间距
                fontFamily="VT323" // 字体
                textShadow="0 2px 2px #000000"
              >
                It's 2077, bala bala ...
              </Text>
            </Box>

            {/* 按钮部分 */}
            <div id="init">
              <Flex
                id="init-input"
                align="center" // 垂直居中
                justify="center" // 水平居中
                padding="15px"
              >
                {/* Mint 按钮 */}
                <Button
                  backgroundColor="#D6517D" // 背景颜色
                  borderRadius="5px" // 圆角
                  boxShadow="0px 2px 2px 1px #OFOFOF" // 按钮阴影
                  color="white" // 按钮文字颜色
                  cursor="pointer" // 鼠标样式
                  fontFamily="inherit" // 字体
                  padding="15px" // 内边距
                  margin="0 15px" // 按钮间距
                  onClick={mintClick} // 点击时调用 mintClick 函数
                >
                  Mint
                </Button>
                {/* Join 按钮 */}
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #OFOFOF"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  margin="0 15px"
                  onClick={joinClick} // 点击时调用 joinClick 函数
                >
                  Join
                </Button>
              </Flex>
            </div>
          </Box>
        </Flex>
      </ChakraBaseProvider>
    </div>
  );
}

export default Home; // 导出 Home 组件
