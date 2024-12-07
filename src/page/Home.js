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
import deployNFT, {
  metadataArrary,
  tokenIdArrary,
} from "../scripts/CatNFT/deployNFT";
import NFTDetail from "./catNFT-detail";

function Home({ accounts, setAccounts }) {
  const navigate = useNavigate(); // 初始化 useNavigate，用于页面跳转
  const [catNFTContract, sercatNFTContract] = useState(null);
  const [catNFTproperties, setcatNFTproperties] = useState([]);
  const [property, setSelectedProperty] = useState({});
  const [toggle, setToggle] = useState(false); // catNFT Property detail 窗口

  // 点击 Mint 按钮时跳转到 /Mint 页面
  const mintClick = () => {
    navigate("/Mint");
  };

  // 点击 koko 按钮时跳转到 /Koko 页面
  const joinClick = () => {
    navigate("/Koko");
  };
  async function mintCatNFT_Onclick() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const catNFTContract = await deployNFT(); // 调用部署函数
        sercatNFTContract(catNFTContract);
        console.log("部署成功～～");
        // alert("NFT 部署成功！"); // 部署成功提示
      } catch (error) {
        console.error("部署失败：", error);
        alert("部署失败，请检查控制台日志！");
      }
    } else {
      alert("MetaMask 未安装，请先安装 MetaMask！");
    }
  }

  // 切换弹出框的状态，并设置当前选中的房产信息
  const togglePop = (property) => {
    setSelectedProperty(property); // 设置选中的房产信息
    setToggle(!toggle); // 切换弹出框状态（显示/隐藏）
  };

  // 点击按钮时手动调用加载区块链数据函数
  function loadBlockchainDataOnclick() {
    loadBlockchainData(); // 调用主加载函数
  }

  const loadBlockchainData = async () => {
    const catNFTproperties = [];
    const totalSupply = await catNFTContract.getTotalMintSupply();
    console.log("totalSupply", totalSupply.toString());
    for (let i = 0; i < totalSupply; i++) {
      // 请求 URI 获取猫猫元数据
      const tokenUrljson = await catNFTContract.tokenURI(tokenIdArrary[i]);
      const response = await fetch(tokenUrljson);
      const metadata = metadataArrary[i];
      const tokenid = tokenIdArrary[i];
      const name = metadata.name;
      const image = metadata.image;
      catNFTproperties.push({
        tokenId: tokenid,
        name: name,
        image: image,
        attributes: metadata.attributes,
      });
    }
    setcatNFTproperties(catNFTproperties);
    console.log("catNFTproperties", catNFTproperties);
  };
  // name: catNFTproperty.name,
  // chipId: catNFTproperty.chipId,
  // birthDate: catNFTproperty.birthDate,
  // age: catNFTproperty.age,
  // sex: catNFTproperty.sex,
  // breed: catNFTproperty.breed,
  return (
    <div>
      {/* 导航栏组件，显示账户相关信息 */}
      <NavBar accounts={accounts} setAccounts={setAccounts} />

      <ChakraBaseProvider>
        <div className="home">
          <Flex
            justify="center" // 水平居中
            align="center" // 垂直居中
            // height="80vh" // 设定容器高度为视口的 80%
            // paddingBottom="100px" // 下方留白
          >
            <Box width="520px">
              {/* 欢迎标题 */}
              <Box id="welcome title" margin="20px">
                <Text fontSize="48px" textShadow="0 5px #000000">
                  koko World
                </Text>
              </Box>

              {/* 按钮部分 */}
              <div id="init">
                <Flex
                  id="init-input"
                  align="center" // 垂直居中
                  justify="center" // 水平居中
                  padding="10px"
                  margin="20px"
                >
                  {/* <button onClick={mintClick}>Mint</button>

                  <button onClick={joinClick}>Join</button> */}
                  <button onClick={mintCatNFT_Onclick}>Deploy NFT</button>
                  <button onClick={loadBlockchainDataOnclick}>Reflesh</button>
                </Flex>
              </div>
            </Box>
          </Flex>
          {/* <Text>NFT list</Text>

          <Box padding="20px">nft1</Box> */}
          <h3 className="title">Properties For Donation</h3> <hr />
          <div className="properties-container">
            <div className="cards-container">
              {catNFTproperties.map((property) => (
                <Box
                  key={property.tokenId}
                  className="card-wrapper"
                  onClick={() => togglePop(property)}
                >
                  <div className="card">
                    <div className="card-title">
                      <h4>{property.name}</h4>
                    </div>{" "}
                    <div className="card-image">
                      <img src={property.image} />
                    </div>
                  </div>{" "}
                  <div className="card-detail">
                    <p>
                      <strong>Chip ID: {property.attributes[0]?.value}</strong>
                    </p>
                    <p>
                      Age:{property.attributes[2]?.value}
                      {/* sex:<strong>{property.attributes[3]?.value} </strong>
                      Breed:<strong>{property.attributes[4]?.value} </strong> */}
                    </p>
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </div>
        {toggle && (
          <NFTDetail
            property={property}
            togglePop={togglePop}
            loadBlockchainData={loadBlockchainData}
          />
        )}
      </ChakraBaseProvider>
    </div>
  );
}

export default Home;
