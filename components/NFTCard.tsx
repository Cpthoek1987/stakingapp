import { client } from "../src/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";
import { NFTModal } from "./NFTModal";
import {getNFTDownloadLink} from '../utils/nftDownloadLinks'

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
            window.open(getNFTDownloadLink(nftNumber), '_blank');
        }
    };

    return (
        <div style={{ 
            margin: "12px",
            position: "relative",
            animation: "cardGlow 3s infinite",
            padding: "2px",
            borderRadius: "16px",
            background: "linear-gradient(45deg, rgba(255, 69, 0, 0.1), rgba(255, 140, 0, 0.1))",
            backdropFilter: "blur(10px)",
            width: "200px"
        }}>
            <style>{`
                @keyframes cardGlow {
                    0%, 100% { box-shadow: 0 0 10px rgba(255, 69, 0, 0.1); }
                    50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.2); }
                }
                @keyframes imageGlow {
                    0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 69, 0, 0.15)); }
                    50% { filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.25)); }
                }
                @keyframes buttonPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animated-button {
                    animation: buttonPulse 2s infinite;
                    transition: all 0.3s ease;
                }
                .animated-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 69, 0, 0.3);
                }
            `}</style>
            <div style={{
                background: "rgba(26, 26, 26, 0.95)",
                borderRadius: "15px",
                padding: "15px",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div 
                    onClick={() => setShowNFTModal(true)} 
                    style={{ 
                        cursor: "pointer",
                        animation: "imageGlow 3s infinite",
                        width: "170px",
                        height: "170px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                        borderRadius: "12px",
                        overflow: "hidden"
                    }}
                >
                    <MediaRenderer
                        client={client}
                        src={nft.metadata.image}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </div>
                <p style={{ 
                    margin: "0 0 15px 0",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "500",
                    textAlign: "center",
                    width: "100%"
                }}>{nft.metadata.name}</p>
                <div style={{ 
                    display: "flex", 
                    gap: "10px", 
                    justifyContent: "center",
                    width: "170px"
                }}>
                    {!isStaked && (
                        <button
                            onClick={() => setIsStakeModalOpen(true)}
                            className="animated-button"
                            style={{
                                border: "none",
                                background: "linear-gradient(45deg, #ff3d00, #ff9100)",
                                color: "#fff",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                width: "80px",
                                minWidth: "80px",
                                fontSize: "12px",
                                fontWeight: "600",
                                textAlign: "center"
                            }}
                        >Stake</button>
                    )}
                    <button
                        onClick={handleDownload}
                        className="animated-button"
                        style={{
                            border: "none",
                            background: "linear-gradient(45deg, #00c853, #69f0ae)",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            width: "80px",
                            minWidth: "80px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textAlign: "center"
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    backdropFilter: "blur(5px)"
                }}>
                    <div style={{
                        minWidth: "300px",
                        background: "linear-gradient(45deg, #1a0f0f, #2c1a1a)",
                        padding: "25px",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: "0 8px 32px rgba(255, 69, 0, 0.2)",
                        border: "1px solid rgba(255, 69, 0, 0.1)",
                        animation: "cardGlow 3s infinite"
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
                                    cursor: "pointer",
                                    fontSize: "20px"
                                }}
                            >×</button>
                        </div>
                        <h3 style={{ 
                            margin: "10px 0 20px 0",
                            color: "#fff",
                            textShadow: "0 0 10px rgba(255, 69, 0, 0.3)"
                        }}>You are about to stake:</h3>
                        <div style={{
                            width: "170px",
                            height: "170px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            marginBottom: "20px"
                        }}>
                            <MediaRenderer
                                client={client}
                                src={nft.metadata.image}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                        {!isApproved ? (
                            <TransactionButton
                                transaction={() => (
                                    approve({
                                        contract: NFT_CONTRACT,
                                        to: STAKING_CONTRACT.address,
                                        tokenId: nft.id
                                    })
                                )}
                                className="animated-button"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(45deg, #ff3d00, #ff9100)",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer"
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
                                className="animated-button"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(45deg, #ff3d00, #ff9100)",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >Stake</TransactionButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
