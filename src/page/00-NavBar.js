"use client";
import React from "react";
import {
  ChakraBaseProvider,
  Box,
  Button,
  Flex,
  Spacer,
  // Image,
} from "../setting/component";
import { useNavigate } from "react-router-dom";
import addressLogo from "../picture/星之卡比头像04.jpeg";
/**
 * 导航栏
 */
const NavBar = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);
  const navigate = useNavigate();
  const homeClick = () => {
    navigate("/"); // 跳转到 /home 页面
  };
  async function connectMetaMask() {
    // 检查窗口对象是否包含 ethereum 对象（MetaMask 注入的对象）
    if (typeof window.ethereum !== "undefined") {
      // 请求连接 MetaMask 钱包
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      console.log("Connected address:", accounts);
    } else {
      alert("MetaMask is not installed. Please install MetaMask !!!!");
      console.log("MetaMask is not installed.");
    }
  }
  return (
    <div>
      <ChakraBaseProvider>
        <Flex justify="space-between" align="center" padding="0px">
          <Flex
            justify="space-around"
            align="center"
            width="40%"
            padding="30px"
          >
            <Box margin="0 15px">Facebook</Box> <Spacer />
            <Box margin="0 15px">Twitter</Box> <Spacer />
            <Box margin="0 15px">Email</Box>
            <Spacer />
          </Flex>
          <Flex
            justify="space-around"
            align="center"
            width="40%"
            padding="0 40px"
          >
            <button margin="0 15px" onClick={homeClick}>
              Home
            </button>
            {isConnected ? (
              <Flex align="center">
                <Box margin="0 5px">
                  <img
                    src={addressLogo}
                    alt="logo"
                    style={{ width: "40px", height: "40px" }}
                  />
                </Box>
                <Box margin="0 5px">{accounts[0].slice(0, 7) + ".."}</Box>
              </Flex>
            ) : (
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                width="240px"
                height="43px"
                fontSize="15"
                boxShadow="0px 2px 2px 1px #OFOFOF"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="0 15px"
                onClick={connectMetaMask}
              >
                Connect Wallet
              </Button>
            )}
          </Flex>
        </Flex>
      </ChakraBaseProvider>
    </div>
  );
};

export default NavBar;
