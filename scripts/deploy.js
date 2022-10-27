const hre = require("hardhat");
// Fundraise contract deployed to: 0xeA5c14cf57594cA521893EFCc0Af524Bbe350716
async function main() {
  // We get the contract to deploy.
  const Fundraise = await hre.ethers.getContractFactory("Fundraise");
  const fundraise = await Fundraise.deploy();

  // Deploy the contract.
  await fundraise.deployed();
  console.log("Fundraise contract deployed to:", fundraise.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
