const { ethers } = require("hardhat");

// 主部署函数。
async function deployGovernance() {
  //从 ethers 提供的 signers 中获取签名者。
  const [deployer01, account02] = await ethers.getSigners();
  const deployer = deployer01.address;
  const account2 = account02.address;
  console.log(`palyer 地址: ${deployer}`);
  console.log(`account2 地址: ${account2}`);

  //部署 token 合约
  const tokenFactory = await ethers.getContractFactory("kokoToken");
  const kokoToken = await tokenFactory.deploy();
  const kokoTokenAddress = await kokoToken.getAddress();
  console.log(`01-token 合约 部署在 ${kokoTokenAddress}`);

  // 将投票权委托给部署者
  await kokoToken.delegate(deployer);
  //部署 timelock 合约
  const minDelay = 3600;
  const proposers = [];
  const executors = [];
  const admin = deployer;
  // 使用 deploy 函数部署时间锁合约
  const timeLockFactory = await ethers.getContractFactory("TimeLock");
  const timeLock = await timeLockFactory.deploy(
    minDelay,
    proposers,
    executors,
    admin
  );
  const timeLockAddress = await timeLock.getAddress();
  console.log(`02-timelock 合约 部署在 ${timeLockAddress}`);

  //部署 xytgovernor 合约
  const xytGovernorFactory = await ethers.getContractFactory("xytGovernor");
  const xytGovernor = await xytGovernorFactory.deploy(
    kokoTokenAddress,
    timeLockAddress,
    1,
    4,
    10
  );
  const xytGovernorAddress = await xytGovernor.getAddress();
  console.log(`03-xytGovernor 合约 部署在  ${xytGovernorAddress} `);
  console.log("-----------------------------");
  const testFactory = await ethers.getContractFactory("testContract");
  const test = await testFactory.deploy();
  const testAddress = await test.getAddress();
  console.log(`test 合约 部署在  ${testAddress} `);

  // 将投票权委托给部署者
  const signerAddress = deployer;
  await kokoToken.delegate(signerAddress);
  console.log("投票权已委托给:", signerAddress);

  // 获取 timelock 合约，并设置角色
  console.log("Setting up roles...");

  // 获取所需的角色
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const cancellerRole = await timeLock.CANCELLER_ROLE();

  // 授予 proposer 角色给 `contractArray[1][1]`
  const proposerTx = await timeLock.grantRole(proposerRole, xytGovernorAddress);
  await proposerTx.wait();
  console.log(`已授权 proposer 角色给 ${xytGovernorAddress}`);

  // 授予 executor 角色给自己 (signerAddress)
  const executorTx = await timeLock.grantRole(executorRole, signerAddress);
  await executorTx.wait();
  console.log(`已授权 executor 角色给 ${signerAddress}`);

  // 授予 canceller 角色给自己 (signerAddress)
  const cancellerTx = await timeLock.grantRole(cancellerRole, signerAddress);
  await cancellerTx.wait();
  console.log(`已授权 canceller 角色给 ${signerAddress}`);
}
// 执行主函数并处理可能的结果。
deployGovernance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
