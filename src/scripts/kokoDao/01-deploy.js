import "../../App.css";
import { ethers } from "ethers";
import { PRIVATE_KEY0, HARDHAT_RPC_URL } from "../../setting/accountSetting";
import kokoToken from "../../artifacts/contracts/kokoDao/kokoToken.sol/kokoToken.json";
import TimeLock from "../../artifacts/contracts/kokoDao/TimeLock.sol/TimeLock.json";
import xytGovernor from "../../artifacts/contracts/kokoDao/xytGovernor.sol/xytGovernor.json";
import Box from "../../artifacts/contracts/kokoDao/Box.sol/Box.json";

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
  const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY0, provider);
  const signerAddress = signer.address;
  console.log("signer", signerAddress);
  console.log(`--------------01-deploy----------------`);

  // 根据索引部署 kokoToken TimeLock xytGovernor 合约
  const contracts = [kokoToken, TimeLock, xytGovernor];
  contractArray = new Array(4)
    .fill(null)
    .map((_, i) => new Array(4).fill(null).map((_, j) => i * 4 + j + 1));
  let abi, bytecode;

  for (let i = 0; i < contracts.length; i++) {
    abi = contracts[i].abi;
    bytecode = contracts[i].bytecode;
    const testfactory = new ethers.ContractFactory(abi, bytecode, signer);

    if (i === 0) {
      // 部署 kokoToken 合约, 并挖了100个koko币
      kokoTokenContract = await testfactory.deploy("koko", "KO");
      await kokoTokenContract.deployTransaction.wait();
      testcontractAddress = await kokoTokenContract.address;
    } else if (i === 1) {
      // 部署 TimeLock 合约
      TimeLockContract = await testfactory.deploy(
        3600, // 最小延迟时间（单位：秒），这里为1小时
        [], // 提案者地址列表
        [], // 执行者地址列表
        signerAddress // 管理员地址，赋予 signerAddress 管理权限
      );
      await TimeLockContract.deployTransaction.wait();
      testcontractAddress = await TimeLockContract.address;
    } else if (i === 2) {
      // 部署 Governonr 治理 合约
      xytGovernorContract = await testfactory.deploy(
        contractArray[0][1], // kokoToken 合约地址
        contractArray[1][1], // TimeLock 合约地址
        1, // 最低投票延迟
        5, // 投票持续时间
        0 // 投票阈值
      );
      await xytGovernorContract.deployTransaction.wait();
      testcontractAddress = await xytGovernorContract.address;
    } else {
      console.log("deploy end");
    }
    // 将合约信息存入 contractArray 数组
    contractArray[i][0] = contracts[i].contractName;
    contractArray[i][1] = testcontractAddress;
    contractArray[i][2] = [abi];
    contractArray[i][3] = bytecode;

    console.log(`Deployed ${contractArray[i][0]} at ${contractArray[i][1]}`);
  }
  // 部署 提案执行的合约 ,Box Box2
  abi = Box.abi;
  bytecode = Box.bytecode;
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
  await kokoTokenContract.delegate(signerAddress); // 将投票权委托给部署者
  console.log("Setting up roles...");

  // 获取所需的角色
  const proposerRole = await TimeLockContract.PROPOSER_ROLE();
  const executorRole = await TimeLockContract.EXECUTOR_ROLE();
  const cancellerRole = await TimeLockContract.CANCELLER_ROLE();

  // 授予 TimeLock不同 角色给 不同地址
  const xytGovernor_Address = contractArray[2][1];
  const proposerTx1 = await TimeLockContract.grantRole(
    proposerRole,
    xytGovernor_Address
  );
  await proposerTx1.wait(1);

  const executorTx = await TimeLockContract.grantRole(
    executorRole,
    signerAddress
  );
  await executorTx.wait();

  const cancellerTx = await TimeLockContract.grantRole(
    cancellerRole,
    signerAddress
  );
  await cancellerTx.wait();
}

/**
 * 将区块链状态前进指定数量的区块
 * @param {number} amount - 要前进的区块数量
 */
export async function moveBlocks(amount) {
  for (let i = 0; i < amount; i++) {
    const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);

    await provider.send("evm_mine", []); // 使用 provider.send 发送矿块请求
  }
  console.log(`Moved ${amount} blocks`);
}
export default deploy;
