const { ethers } = require("ether");
const { deploy, log } = deployments;

//部署合约
async function main() {
  console.log(`start deploy ERC20 NFT contract `);

  //获取链信息
  const chainId = network.name;
  console.log(`network name是：${chainId}`);

  //设置部署者地址，将本地网络的第一个账户地址作为部署者
  const { deployer } = await getNamedAccounts();
  console.log(`deployer name是：${deployer}`);
  const tokenURI = "https://github.com/XUYU99/NFT/blob/main/WechatIMG670.jpg";
  const kokoNFT = await deploy("kokoNFT", {
    from: deployer,
    args: ["kokoNFT", "KONFT", tokenURI],
    log: true,
    waitConfirmations: 1,
  });
  console.log(`deploy contract address is: ${kokoNFT.address}`);
  console.log(`00 end deploy contract ===================`);
}
// 执行主函数
module.exports = main;
// main()
//   .then(() => process.exit(0)) // 成功时退出进程
//   .catch((error) => {
//     console.error(error); // 输出错误信息
//     process.exit(1); // 退出进程
//   });
