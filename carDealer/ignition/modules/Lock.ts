// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("CarDealerModule", (m) => {
  const baseURI = "https://gateway.pinata.cloud/ipfs/bafkreif6lc3oqpmvoxds46jglk7puhecmqw43fxccdgr7tbk5caeowo5sq";
  const carDealer = m.contract("CarDealer", [baseURI]);
  
  return { carDealer };
});
