import { MediaRenderer, TransactionButton, useReadContract } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { getNFT } from "thirdweb/extensions/erc721";
import { client } from "../src/app/client";
import { NFT,prepareContractCall } from "thirdweb";
import { useState } from "react";
import { NFTModal } from "./NFTModal";
import {getNFTDownloadLink} from '../utils/nftDownloadLinks'

type StakedNFTCardProps = {
    nft: NFT;
    tokenId: bigint;
    refetchStakedInfo: () => void;
    refetchOwnedNFTs: () => void;
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({ tokenId, refetchStakedInfo, refetchOwnedNFTs }) => {
    const [showNFTModal, setShowNFTModal] = useState(false);
    const { data: nft } = useReadContract(
        getNFT,
        {
            contract: NFT_CONTRACT,
            tokenId: tokenId,
        }
    );

    const handleDownload = () => {
        const nftNumber = nft?.metadata.name?.split("#")[1];
        if (nftNumber) {
            window.open(getNFTDownloadLink(nftNumber), '_blank');
        }
    };
    
    if (!nft) return null;

    return (
        <div style={{ 
            margin: "12px",
            position: "relative",
            animation: "cardGlow 3s infinite",
            padding: "2px",
            borderRadius: "16px",
            background: "linear-gradient(45deg, rgba(255, 255, 0, 0.1), rgba(173, 255, 47, 0.1))",
            backdropFilter: "blur(10px)",
            width: "200px"
        }}>
            <style>{`
                @keyframes cardGlow {
                    0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 0, 0.1); }
                    50% { box-shadow: 0 0 20px rgba(173, 255, 47, 0.2); }
                }
                @keyframes imageGlow {
                    0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.15)); }
                    50% { filter: drop-shadow(0 0 10px rgba(173, 255, 47, 0.25)); }
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
                    box-shadow: 0 5px 15px rgba(173, 255, 47, 0.3);
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
                        src={nft?.metadata.image}
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
                }}>{nft?.metadata.name}</p>
                <div style={{ 
                    display: "flex", 
                    gap: "10px", 
                    justifyContent: "center",
                    width: "170px"
                }}>
                    <TransactionButton
                        transaction={() => (
                            prepareContractCall({
                                contract: STAKING_CONTRACT,
                                method: "withdraw",
                                params: [[tokenId]]
                            })
                        )}
                        onTransactionConfirmed={() => {
                            refetchOwnedNFTs();
                            refetchStakedInfo();
                            alert("Withdrawn!");
                        }}
                        className="animated-button"
                        style={{
                            border: "none",
                            background: "linear-gradient(45deg, #ffd700, #adff2f)",
                            color: "#000",
                            padding: "10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            width: "80px",
                            minWidth: "80px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textAlign: "center"
                        }}
                    >Withdraw</TransactionButton>
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
        </div>
    );
};
