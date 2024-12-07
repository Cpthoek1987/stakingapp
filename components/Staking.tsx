'use client';

import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { NFT } from "thirdweb";
import { useEffect, useState } from "react";
import { claimTo, getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import Image from "next/image";

export const Staking = () => {
    const account = useActiveAccount();
    const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
    
    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""],
    });

    const getOwnedNFTs = async () => {
        let ownedNFTs: NFT[] = [];

        const totalNFTSupply = await totalSupply({
            contract: NFT_CONTRACT,
        });
        const nfts = await getNFTs({
            contract: NFT_CONTRACT,
            start: 0,
            count: parseInt(totalNFTSupply.toString()),
        });
        
        for (let nft of nfts) {
            const owner = await ownerOf({
                contract: NFT_CONTRACT,
                tokenId: nft.id,
            });
            if (owner === account?.address) {
                ownedNFTs.push(nft);
            }
        }
        setOwnedNFTs(ownedNFTs);
    };
    
    useEffect(() => {
        if(account) {
            getOwnedNFTs();
        }
    }, [account]);
    
    if(account) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "linear-gradient(45deg, #1a0f0f, #2c1a1a, #1a0f0f)",
                backgroundSize: "400% 400%",
                animation: "gradientBG 15s ease infinite",
                borderRadius: "20px",
                width: "500px",
                padding: "30px",
                boxShadow: "0 8px 32px 0 rgba(135, 31, 31, 0.37)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 69, 0, 0.1)"
            }}>
                <style>{`
                    @keyframes gradientBG {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }
                    @keyframes glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.3); }
                        50% { box-shadow: 0 0 40px rgba(255, 140, 0, 0.5); }
                    }
                `}</style>
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "20px 0",
                    width: "100%",
                    gap: "20px",
                    padding: "30px",
                    background: "rgba(255, 69, 0, 0.05)",
                    borderRadius: "15px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    animation: "glow 3s infinite"
                }}>
                    <div style={{
                        position: "relative",
                        animation: "pulse 3s ease-in-out infinite"
                    }}>
                        <Image 
                            src="/logo_clean.png"
                            alt="Chiliz Logo"
                            width={150}
                            height={150}
                            style={{
                                filter: "drop-shadow(0 0 10px rgba(255, 69, 0, 0.5))"
                            }}
                        />
                    </div>
                    <h2 style={{ 
                        fontSize: "28px",
                        marginBottom: "20px",
                        textAlign: "center",
                        color: "#fff",
                        textShadow: "0 0 10px rgba(255, 69, 0, 0.5)",
                        fontWeight: "600",
                        letterSpacing: "1px"
                    }}>Mint a Chili today</h2>
                    <TransactionButton
                        transaction={() => (
                            claimTo({
                                contract: NFT_CONTRACT,
                                to: account?.address || "",
                                quantity: BigInt(1)
                            })
                        )}
                        onTransactionConfirmed={() => {
                            alert("NFT Minted!");
                            getOwnedNFTs();
                        }}
                        style={{
                            fontSize: "14px",
                            background: "linear-gradient(45deg, #ff3d00, #ff9100)",
                            color: "#fff",
                            padding: "12px 30px",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(255, 69, 0, 0.3)",
                            transition: "all 0.3s ease",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontWeight: "600"
                        }}
                    >Mint NFT</TransactionButton>
                </div>
                <div style={{ 
                    margin: "20px 0",
                    width: "100%",
                    background: "rgba(255, 69, 0, 0.03)",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    animation: "glow 3s infinite"
                }}>
                    <h2 style={{
                        fontSize: "24px",
                        color: "#fff",
                        textShadow: "0 0 10px rgba(255, 69, 0, 0.3)",
                        marginBottom: "20px"
                    }}>Owned NFTs</h2>
                    <div style={{ 
                        display: "flex", 
                        flexDirection: "row", 
                        flexWrap: "wrap", 
                        gap: "20px",
                        justifyContent: "center"
                    }}>
                        {ownedNFTs && ownedNFTs.length > 0 ? (
                            ownedNFTs.map((nft) => (
                                <NFTCard
                                    key={nft.id}
                                    nft={nft}
                                    refetch={getOwnedNFTs}
                                    refecthStakedInfo={refetchStakedInfo}
                                />
                            ))
                        ) : (
                            <p style={{ 
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "16px"
                            }}>You own 0 NFTs</p>
                        )}
                    </div>
                </div>
                <div style={{ 
                    width: "100%", 
                    margin: "20px 0",
                    background: "rgba(255, 69, 0, 0.03)",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    animation: "glow 3s infinite"
                }}>
                    <h2 style={{
                        fontSize: "24px",
                        color: "#fff",
                        textShadow: "0 0 10px rgba(255, 69, 0, 0.3)",
                        marginBottom: "20px"
                    }}>Staked NFTs</h2>
                    <div style={{ 
                        display: "flex", 
                        flexDirection: "row", 
                        flexWrap: "wrap", 
                        gap: "20px",
                        justifyContent: "center"
                    }}>
                        {stakedInfo && stakedInfo[0].length > 0 ? (
                            stakedInfo[0].map((nft: any, index: number) => (
                                <StakedNFTCard
                                    key={index}
                                    tokenId={nft}
                                    refetchStakedInfo={refetchStakedInfo}
                                    refetchOwnedNFTs={getOwnedNFTs}
                                />
                            ))
                        ) : (
                            <p style={{ 
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "16px"
                            }}>No NFTs staked</p>
                        )}
                    </div>
                </div>
                <div style={{
                    width: "100%",
                    background: "rgba(255, 69, 0, 0.03)",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    animation: "glow 3s infinite"
                }}>
                    <StakeRewards />
                </div>
            </div>
        );
    }
};
