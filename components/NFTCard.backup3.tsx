import { client } from "../src/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";
import { NFTModal } from "./NFTModal";

type OwnedNFTsProps = {
    nft: NFT;
    refetch: () => void;
    refecthStakedInfo: () => void;
    isStaked?: boolean;
};

export const NFTCard = ({ nft, refetch, refecthStakedInfo, isStaked = false }: OwnedNFTsProps) => {
    const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [showNFTModal, setShowNFTModal] = useState(false);

    const handleDownload = () => {
        const nftNumber = nft.metadata.name?.split("#")[1];
        if (nftNumber) {
            window.open(`https://placeholder-download-link/nft-${nftNumber}`, '_blank');
        }
    };

    return (
        <div style={{ 
            margin: "10px",
            position: "relative",
            animation: "glow 3s infinite",
            padding: "2px",
            borderRadius: "12px",
            background: "rgba(255, 69, 0, 0.1)",
            boxShadow: "0 0 20px rgba(255, 69, 0, 0.2)"
        }}>
            <style>{`
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.2); }
                    50% { box-shadow: 0 0 40px rgba(255, 140, 0, 0.4); }
                }
                @keyframes imageGlow {
                    0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.3)); }
                    50% { filter: drop-shadow(0 0 20px rgba(255, 140, 0, 0.5)); }
                }
            `}</style>
            <div style={{
                background: "#1a1a1a",
                borderRadius: "10px",
                padding: "10px"
            }}>
                <div onClick={() => setShowNFTModal(true)} style={{ 
                    cursor: "pointer",
                    animation: "imageGlow 3s infinite"
                }}>
                    <MediaRenderer
                        client={client}
                        src={nft.metadata.image}
                        style={{
                            borderRadius: "10px",
                            marginBottom: "10px",
                            height: "200px",
                            width: "200px"
                        }}
                    />
                </div>
                <p style={{ margin: "0 10px 10px 10px", color: "#fff" }}>{nft.metadata.name}</p>
                <div style={{ display: "flex", gap: "10px", padding: "0 10px" }}>
                    {!isStaked && (
                        <button
                            onClick={() => setIsStakeModalOpen(true)}
                            style={{
                                border: "none",
                                backgroundColor: "#333",
                                color: "#fff",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                flex: "1"
                            }}
                        >Stake</button>
                    )}
                    <button
                        onClick={handleDownload}
                        style={{
                            border: "none",
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            flex: isStaked ? "1" : "1"
                        }}
                    >Download Model</button>
                </div>
            </div>

            {showNFTModal && (
                <NFTModal
                    nft={nft}
                    onClose={() => setShowNFTModal(false)}
                />
            )}

            {isStakeModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        minWidth: "300px",
                        backgroundColor: "#222",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}>
                            <button
                                onClick={() => setIsStakeModalOpen(false)}
                                style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                            >Close</button>
                        </div>
                        <h3 style={{ margin: "10px 0" }}>You about to stake:</h3>
                        <MediaRenderer
                            client={client}
                            src={nft.metadata.image}
                            style={{
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        />
                        {!isApproved ? (
                            <TransactionButton
                                transaction={() => (
                                    approve({
                                        contract: NFT_CONTRACT,
                                        to: STAKING_CONTRACT.address,
                                        tokenId: nft.id
                                    })
                                )}
                                style={{
                                    width: "100%"
                                }}
                                onTransactionConfirmed={() => setIsApproved(true)}
                            >Approve</TransactionButton>
                        ) : (
                            <TransactionButton
                                transaction={() => (
                                    prepareContractCall({
                                        contract: STAKING_CONTRACT,
                                        method: "stake",
                                        params: [[nft.id]]
                                    })
                                )}
                                onTransactionConfirmed={() => {
                                    alert("Staked!");
                                    setIsStakeModalOpen(false);
                                    refetch();
                                    refecthStakedInfo();
                                }}
                                style={{
                                    width: "100%"
                                }}
                            >Stake</TransactionButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
