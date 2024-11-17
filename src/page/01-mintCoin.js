"use client";
import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
} from "../setting/component";
import kokoToken from "../artifacts/contracts/kokoToken.sol/kokoToken.json";

// 声明全局变量以存储合约实例
var tokenContract;

const MintCoin = () => {
  // 使用 React 的状态钩子存储用户输入值
  const [mintAmount, setMintAmount] = useState(50); // 默认铸造数量
  const [name, setName] = useState("name"); // 默认 Token 名称
  const [symbol, setSymbol] = useState("symbol"); // 默认 Token 符号

  // 部署 Token 合约
  async function deployToken() {
    if (window.ethereum) {
      // 检查是否连接了 MetaMask，并初始化 ethers 的 provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("mintCoin-initMint()-start");

      try {
        // 使用合约工厂创建和部署合约
        const tokenFactory = new ethers.ContractFactory(
          kokoToken.abi,
          kokoToken.bytecode,
          signer
        );
        tokenContract = await tokenFactory.deploy(name, symbol);
        await tokenContract.deployed();
        console.log("tokenContract address:", tokenContract.address);
      } catch (err) {
        console.log("initMint error", err); // 捕获和输出错误
      }
    } else {
      alert("MetaMask 未连接 !!!!"); // 提示用户连接 MetaMask
    }
  }

  // 铸造币的函数
  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      // 调用合约 铸造币
      const mintResponce = await tokenContract
        .connect(signer)
        .mint(BigNumber.from(mintAmount));
      const receipt = await mintResponce.wait();
      console.log("handleMint()-receipt", receipt);
      // 查询余额
      const balance = await tokenContract.balanceOf(signerAddress);
      console.log("user balance change to: ", balance.toString());
    } else {
      alert("MetaMask 未连接 !!!!");
    }
  }

  // 验证合约部署和铸造情况
  async function verifyContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await tokenContract.balanceOf(
      signerAddress // 测试地址
    );
    const name = await tokenContract.name(); // 查询 Token 名称
    console.log(`token name:${name} ,user balance : ${balance}`); // 打印结果
  }

  // 减少铸造数量 的按钮点击事件
  const decreaseOnclick = () => {
    if (mintAmount <= 1) return; // 限制最小值为 1
    setMintAmount(mintAmount - 1); // 更新状态
  };

  // 增加铸造数量 的按钮点击事件
  const increaseOnclick = () => {
    if (mintAmount >= 200) return; // 限制最大值为 200
    setMintAmount(mintAmount + 1); // 更新状态
  };

  return (
    <div>
      <ChakraBaseProvider>
        <Flex
          justify="center" // 居中对齐
          align="center" // 垂直居中
          height="100vh" // 占满整个视口高度
          paddingBottom="120px"
        >
          <Box width="520px">
            {/* 初始化合约部分 */}
            <div id="init-and-mint">
              <div id="init">
                <Flex
                  id="init-input"
                  align="center"
                  justify="center"
                  padding="15px"
                  textColor="black"
                >
                  {/* 输入 Token 名称 */}
                  <Input
                    fontFamily="inherit"
                    width="230px"
                    height="30px"
                    textAlign="center"
                    padding="18px"
                    margin="10px"
                    type="text"
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Token Name"
                  />

                  {/* 输入 Token 符号 */}
                  <Input
                    fontFamily="inherit"
                    width="230px"
                    height="30px"
                    textAlign="center"
                    padding="18px"
                    margin="10px"
                    type="text"
                    defaultValue={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Token Symbol"
                  />
                </Flex>
                {/* 部署按钮 */}
                <Button
                  id="init-deploy-button"
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #OFOFOF"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="10px"
                  onClick={deployToken}
                >
                  Init deploy token Contract
                </Button>
              </div>
              {/* 铸造币部分 */}
              <div id="mint">
                <Flex
                  id="mint-setAmount"
                  align="center"
                  justify="center"
                  padding="30px"
                  textColor="black"
                >
                  {/* 减少数量按钮 */}
                  <Button
                    backgroundColor="#D6517D"
                    borderRadius="5px"
                    boxShadow="0px 2px 2px 1px #OFOFOF"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"
                    padding="12px"
                    onClick={decreaseOnclick}
                  >
                    -
                  </Button>
                  {/* 铸造数量输入框 */}
                  <Input
                    fontFamily="inherit"
                    width="150px"
                    height="43px"
                    textAlign="center"
                    padding="10px"
                    margin="0 15px"
                    type="number"
                    value={mintAmount} // 动态绑定
                    onChange={(e) => setMintAmount(e.target.value)}
                  />
                  {/* 增加数量按钮 */}
                  <Button
                    backgroundColor="#D6517D"
                    borderRadius="5px"
                    boxShadow="0px 2px 2px 1px #OFOFOF"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"
                    padding="12px"
                    onClick={increaseOnclick}
                  >
                    +
                  </Button>
                </Flex>
                {/* 铸造按钮 */}
                <Button
                  id="mint-button"
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #OFOFOF"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  margin="0px 15px"
                  onClick={handleMint}
                >
                  Mint
                </Button>
                {/* 验证按钮 */}
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #OFOFOF"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  margin="0 15px"
                  onClick={verifyContract}
                >
                  verify!
                </Button>
              </div>
            </div>
          </Box>
        </Flex>
      </ChakraBaseProvider>
    </div>
  );
};

export default MintCoin;
