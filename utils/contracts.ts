import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "0x17b55c2E01C16bD3C024c5a20FD82D63E07B3CFd";
const rewardTokenContractAddress = "0x517C154a0b1f0C86628D725c64238313E00e014D";
const stakingContractAddress = "0xae17770FF2B14281aE85E37325CF5102e7dC2234";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress
});

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: stakingABI
});
