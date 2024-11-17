import React, { useState } from "react";
import { ethers } from "ethers";
import * as XLSX from "xlsx";
import * as fs from "fs";
import {
  contractArray,
  kokoTokenContract,
  TimeLockContract,
  xytGovernorContract,
  BoxContract,
  moveBlocks,
} from "./01-deploy.js";

export var proposeLog = []; // 存储所有提案信息
export var proposalId, description, calldata;
/**
 * 提出提案
 */
async function propose(targetAddress, proposalDescription) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  console.log(`--------------02-propose----------------`);

  // 设置提案参数
  calldata = BoxContract.connect(signer).interface.encodeFunctionData("store", [
    488,
  ]);
  console.log("目标合约地址: ", targetAddress, "calldata: ", calldata);

  const targets = [targetAddress];
  const values = [0]; // 交易价值，设置为 0
  const calldatas = [calldata];
  description = proposalDescription.toString();

  console.log("xytGovernorContract 地址: ", xytGovernorContract.address);

  try {
    // 提案交易
    const proposeTx = await xytGovernorContract.propose(
      targets,
      values,
      calldatas,
      description
    );

    // 等待交易完成并获取提案 ID
    const proposeReceipt = await proposeTx.wait();
    const plog = xytGovernorContract.interface.parseLog(proposeReceipt.logs[0]);
    proposalId = plog.args.proposalId.toString();

    const timestamp = new Date().toISOString();

    // 构造提案数据并存储到日志中
    const proposeArray = {
      timestamp,
      description,
      proposalId,
      transactionHash: proposeTx.hash,
      targets,
      values,
      calldatas,
    };
    proposeLog.push(proposeArray);

    console.log(`提案 proposalId: ${proposalId}`);

    // 加快区块进度
    await moveBlocks(2);

    // 获取提案状态:  0 Pending,1 Active,2 Canceled,3 Defeated,4 Succeeded,5 Queued,6 Expired,Executed
    const proposalState = await xytGovernorContract.state(proposalId);
    console.log(`提案状态: ${proposalState}`);
    if (proposalState) {
      console.log(`提案创建成功！提案内容: ${description}`);
    } else {
      console.error(`提案创建失败！`);
    }
  } catch (error) {
    console.error("提案过程中出现错误: ", error);
  }
}

export default propose;
