import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import kokoToken from "../src/artifacts/contracts/kokoToken.sol/kokoToken.json";

//部署自己的 token 合约
const MintCoin = async ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  async function handleMint() {
    if (window.ethereum) {
      console.log("mintCoin-initMint()-start");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // 获取当前签名者的地址
      const signerAddress = await signer.getAddress();
      console.log("Connected address:", signerAddress);
      try {
        //部署自己的 token 合约
        const factory = new ethers.ContractFactory(
          kokoToken.abi,
          kokoToken.bytecode,
          signer
        );
        const kokoTokenContract = await factory.deploy("acToken", "AC");
        const mintResponce = await kokoTokenContract.mint(
          BigNumber.from(mintAmount)
        );
        const balance = kokoTokenContract.balanceOf(signerAddress);
        console.log("user balance: ", balance);
      } catch (err) {
        console.log("initMint error", err);
      }
    } else {
      alert("MetaMask is not connect !!!!");
    }
  }

  //增加和减少 按钮
  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <div>
      <h1>RoboPunks</h1>
      <p>It's 2077, bala bala ...</p>
      {isConnected ? (
        <div>
          <div>
            <button onClick={handleDecrement}>-</button>
            <input type="number" value={mintAmount} />
            <button onClick={handleIncrement}>+</button>
          </div>
          <button onClick={handleMint}>Mint!</button>
        </div>
      ) : (
        <p>You must be connected to Mint</p>
      )}
    </div>
  );
};

export default MintCoin;
