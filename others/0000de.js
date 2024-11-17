import "../App.css";
import { ethers } from "ethers";
import { PRIVATE_KEY0, HARDHAT_RPC_URL } from "../setting/accountSetting.js";
import kokoToken from "../artifacts/contracts/kokoToken.sol/kokoToken.json";
import TimeLock from "../artifacts/contracts/TimeLock.sol/TimeLock.json";
import xytGovernor from "../artifacts/contracts/xytGovernor.sol/xytGovernor.json";
import Box from "../artifacts/contracts/Box.sol/Box.json";

export var contractArray,
  testcontractAddress,
  kokoTokenContract,
  TimeLockContract,
  xytGovernorContract,
  BoxContract,
  BoxContract2,
  boxAddress22;

/**
 * 部署合约函数
 */
async function deploy() {
  // 初始化provider和signer
  const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY0, provider);
  const signerAddress = signer.address;
  console.log("signer 地址: ", signerAddress);
  console.log(`--------------01-deploy----------------`);

  // 定义要部署的合约
  const contracts = [kokoToken, TimeLock, xytGovernor];

  // 初始化合约信息存储数组
  contractArray = new Array(4).fill(null).map(() => new Array(4).fill(null));

  for (let i = 0; i < contracts.length; i++) {
    const { abi, bytecode } = contracts[i];
    const testfactory = new ethers.ContractFactory(abi, bytecode, signer);

    // 根据索引部署不同的合约
    switch (i) {
      case 0:
        // 部署 kokoToken 合约, 并挖了100个koko币
        kokoTokenContract = await testfactory.deploy("koko", "KO");
        await kokoTokenContract.deployTransaction.wait();
        testcontractAddress = kokoTokenContract.address;
        break;

      case 1:
        // 部署 TimeLock 合约
        TimeLockContract = await testfactory.deploy(
          3600, // 最小延迟时间（单位：秒），这里为1小时
          [], // 提案者地址列表
          [], // 执行者地址列表
          signerAddress // 管理员地址，赋予 signerAddress 管理权限
        );
        await TimeLockContract.deployTransaction.wait();
        testcontractAddress = TimeLockContract.address;
        break;

      case 2:
        // 部署 Governonr 治理 合约
        xytGovernorContract = await testfactory.deploy(
          contractArray[0][1], // kokoToken 合约地址
          contractArray[1][1], // TimeLock 合约地址
          1, // 最低投票延迟
          20, // 投票持续时间
          0 // 投票阈值
        );
        await xytGovernorContract.deployTransaction.wait();
        testcontractAddress = xytGovernorContract.address;
        break;

      default:
        console.log("无效的合约索引");
    }

    // 将合约信息存入 contractArray 数组
    contractArray[i][0] = contracts[i].contractName || "Unknown";
    contractArray[i][1] = testcontractAddress;
    contractArray[i][2] = abi;
    contractArray[i][3] = bytecode;

    console.log(`Deployed ${contractArray[i][0]} at ${contractArray[i][1]}`);
  }

  // 部署 提案执行的合约 ,Box Box2
  const boxFactory = new ethers.ContractFactory(Box.abi, Box.bytecode, signer);
  BoxContract = await boxFactory.deploy(signerAddress);
  await BoxContract.deployTransaction.wait();
  const boxAddress = BoxContract.address;
  console.log(`box 合约 部署在 ${boxAddress}`);

  BoxContract2 = await boxFactory.deploy(signerAddress);
  await BoxContract2.deployTransaction.wait();
  boxAddress22 = BoxContract2.address;
  console.log(`box2 合约 部署在 ${boxAddress22}`);

  // 设置 xytGovernor 的权限
  await xytGovernorInit();
}

async function xytGovernorInit() {
  const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY0, provider);
  const signerAddress = signer.address;
  // 将投票权委托给部署者
  await kokoTokenContract.delegate(signerAddress);
  console.log("投票权已委托给: ", signerAddress);

  // 设置 TimeLock 合约角色
  console.log("Setting up roles...");
  const proposerRole = await TimeLockContract.PROPOSER_ROLE();
  const executorRole = await TimeLockContract.EXECUTOR_ROLE();
  const cancellerRole = await TimeLockContract.CANCELLER_ROLE();

  // 授予 proposer 角色
  const xytGovernorAddress = contractArray[2][1];
  await TimeLockContract.grantRole(proposerRole, xytGovernorAddress).then(
    (tx) => tx.wait()
  );
  console.log(`已授权 proposer 角色给 ${xytGovernorAddress}`);

  // 授予 executor 和 canceller 角色
  await Promise.all([
    TimeLockContract.grantRole(executorRole, signerAddress).then((tx) =>
      tx.wait()
    ),
    TimeLockContract.grantRole(cancellerRole, signerAddress).then((tx) =>
      tx.wait()
    ),
  ]);
  console.log(`已授权 executor 和 canceller 角色给 ${signerAddress}`);
}
/**
 * 将区块链状态前进指定数量的区块
 * @param {number} amount - 要前进的区块数量
 */
export async function moveBlocks(amount) {
  const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
  for (let i = 0; i < amount; i++) {
    await provider.send("evm_mine", []); // 矿块请求
  }
  console.log(`Moved ${amount} blocks`);
}

export default deploy;
