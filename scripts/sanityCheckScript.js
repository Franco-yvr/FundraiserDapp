const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx ++;
    }
}

// Logs the memos stored on-chain from donations
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const donor = memo.name;
        const donorAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${donor} (${donorAddress}) said: "${message}"`);
    }
}

async function main() {
    // Get the example accounts we'll be working with.
    const [owner, donor, donor2, donor3] = await hre.ethers.getSigners();
    // We get the contract to deploy.
    const Fundraise = await hre.ethers.getContractFactory("Fundraise");
    const fundraise = await Fundraise.deploy();

    // Deploy the contract.
    await fundraise.deployed();
    console.log("Fundraise contract deployed to:", fundraise.address);

    // Check balances before the donation.
    const addresses = [owner.address, donor.address, fundraise.address];
    console.log("== start ==");
    await printBalances(addresses);

    // make donations
    const donation = {value: hre.ethers.utils.parseEther("1")};
    await fundraise.connect(donor).sendFunds("Amelia", "Good luck!", donation);
    await fundraise.connect(donor2).sendFunds("Vitalik", "Amazing campaign", donation);
    await fundraise.connect(donor3).sendFunds("Robert", "Call me next year", donation);

    // Check balances after the donations.
    console.log("== Make Donations ==");
    await printBalances(addresses);

    // Withdraw.
    await fundraise.connect(owner).withdrawFunds();

    // Check balances after withdrawal.
    console.log("== Withdraw Donations ==");
    await printBalances(addresses);

    // Check out the memos.
    console.log("== Memos ==");
    const memos = await fundraise.getMemos();
    printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
