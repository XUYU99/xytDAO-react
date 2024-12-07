import { ethers } from "ethers"; // 导入 ethers 库，用于与以太坊区块链交互
import {
  contractArray,
  kokoTokenContract,
  TimeLockContract,
  xytGovernorContract,
  BoxContract,
  moveBlocks,
} from "./01-deploy.js";
// import { proposalId } from "./02-propose.js";
import {
  PRIVATE_KEY0,
  PRIVATE_KEY1,
  PRIVATE_KEY2,
  PRIVATE_KEY3,
  HARDHAT_RPC_URL,
} from "../../setting/accountSetting.js";

// 定义投票日志
export var voteLog = [];

/**
 * 创建多个 signer 实例
 */
function createSigner(rpcUrl, privateKey) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  return signer;
}

/**
 * 发送投票
 * @param {string} proposalidInput - 提案 ID
 * @param {number} supportInput - 支持类型 (0: 反对, 1: 支持, 2: 弃权)
 * @param {number} accountNumberInput - 投票账户地址索引 (从 0 开始)
 */
async function vote(proposalidInput, supportInput, accountNumberInput) {
  // 所有私钥数组
  const privateKeys = [PRIVATE_KEY0, PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3];

  // 创建 signer 数组
  const signers = privateKeys.map((key) => createSigner(HARDHAT_RPC_URL, key));
  const signerAddresses = signers.map((signer) => signer.address);

  console.log("开始投票...");

  // 验证账户索引是否有效
  if (accountNumberInput < 0 || accountNumberInput >= signers.length) {
    throw new Error("Invalid accountNumberInput, out of range!");
  }

  const selectedSigner = signers[accountNumberInput]; // 根据索引选择对应签名者
  const voteReason = `VOTE_REASON${accountNumberInput + 1}`; // 生成投票理由

  // 获取投票前提案状态: 0 Pending,1 Active,2 Canceled,3 Defeated,4 Succeeded,5 Queued,6 Expired,Executed

  let proposalState = await xytGovernorContract.state(proposalidInput);
  console.log("投票前提案状态: ", proposalState);

  // 执行投票
  const voteWight = await xytGovernorContract
    .connect(selectedSigner)
    .castVoteWithReason(proposalidInput, supportInput, voteReason);
  await voteWight.wait(1);

  // 记录投票日志
  const timestamp = new Date().toISOString();
  const voteArray = {
    timestamp,
    proposalId: proposalidInput,
    support: supportInput,
    voteReason,
  };
  voteLog.push(voteArray);
  // await moveBlocks(3);

  // 获取投票后提案状态
  proposalState = await xytGovernorContract.state(proposalidInput);
  console.log(`投票完成后提案状态: ${proposalState}`);
  console.log("---------------- 投票完成 ---------------");
}

export default vote;
