import "../../App.css";
import { ethers } from "ethers";
import { PRIVATE_KEY0, HARDHAT_RPC_URL } from "../../setting/accountSetting";
import kokoCatNFT from "../../artifacts/contracts/catNFT/kokoCatNFT.sol/kokoCatNFT.json";

export var catNFTContract, metadataArrary, tokenIdArrary;
metadataArrary = [];
tokenIdArrary = [];
/**
 * 部署合约函数
 */
async function deployNFT() {
  const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY0, provider);
  const signerAddress = signer.address;
  console.log("signer", signerAddress);
  console.log(`------------deploy-catNFT--------------`);
  // 部署 kokoCatNFT 合约, 并授权
  const testfactory = new ethers.ContractFactory(
    kokoCatNFT.abi,
    kokoCatNFT.bytecode,
    signer
  );
  catNFTContract = await testfactory.deploy(signerAddress, signerAddress);
  await catNFTContract.deployTransaction.wait();
  console.log("deploy catNFT end ~~");

  for (let i = 1; i <= 8; i++) {
    // mint NFT 并设置 tokenURI
    const tokenUrljson = `https://maroon-elegant-mongoose-836.mypinata.cloud/ipfs/bafybeibm3mopca6zekzbtje4io2qhb4mi335sovcghhjfwr2ecdxcsjhtu/${i}.json`;
    const mintTx = await catNFTContract.safeMint(signerAddress, tokenUrljson);
    await mintTx.wait();
    const tokenId = await catNFTContract.getTokenId();
    console.log("Mint successful, tokenId: ", tokenId.toString());
    const response = await fetch(tokenUrljson);
    const metadata = await response.json();
    console.log("metadata: ", metadata);

    // 从 metadata 中提取租金和押金信息
    const DonationPrice = metadata.attributes.find(
      (attr) => attr.trait_type === "Minimum Donation Fee"
    ).value;
    const DonationPriceInWei = ethers.utils.parseUnits(
      DonationPrice.toString(),
      18
    );
    // console.log("DonationPrice: ", DonationPrice);
    metadataArrary.push(metadata);
    tokenIdArrary.push(tokenId);
  }
  // console.log("metadataArrary: ", metadataArrary);
  console.log("tokenIdArrary: ", tokenIdArrary);
  return catNFTContract;
  // 设置 猫猫信息
  // uint256 tokenId,string memory _name,uint256 _chipId,uint256 _birthDate,uint256 _age,bool _sex,string memory _breed
  // const _name = "neow";
  // const _chipId = "2763";
  // const _birthDate = 20190109;
  // const _age = 6;
  // const _sex = 1;
  // const _breed = "British shorthair";
  // const addCatTx = await catNFTContract.addCat(
  //   tokenId,
  //   _name,
  //   _chipId,
  //   _birthDate,
  //   _age,
  //   _sex,
  //   _breed
  // );
  // const response = await addCatTx.wait();
  // console.log("addCat successful, response: ", response);

  // const getCatTx = await catNFTContract.getCat(tokenId);
  // console.log("addCat successful, response: ", getCatTx.toString());
  // return getCatTx;
}

export default deployNFT;
