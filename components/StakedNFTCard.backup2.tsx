import { MediaRenderer, TransactionButton, useReadContract } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { getNFT } from "thirdweb/extensions/erc721";
import { client } from "../src/app/client";
import { prepareContractCall } from "thirdweb";
import { useState } from "react";
import { NFTModal } from "./NFTModal";

type StakedNFTCardProps = {
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
            window.open(`https://placeholder-download-link/nft-${nftNumber}`, '_blank');
        }
    };
    
    if (!nft) return null;

    return (
        <div style={{ margin: "12px" }}>
            <div onClick={() => setShowNFTModal(true)} style={{ cursor: "pointer" }}>
                <MediaRenderer
                    client={client}
                    src={nft?.metadata.image}
                    style={{
                        borderRadius: "10px",
                        marginBottom: "10px",
                        height: "200px",
                        width: "200px"
                    }}
                />
            </div>
            <p style={{ margin: "0 10px 10px 10px"}}>{nft?.metadata.name}</p>
            <div style={{ 
                display: "flex", 
                gap: "10px", 
                padding: "0",
                width: "200px",
                margin: "0 auto",
                justifyContent: "center"
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
                    style={{
                        border: "none",
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        width: "90px",
                        minWidth: "90px",
                        fontSize: "12px"
                    }}
                >Withdraw</TransactionButton>
                <button
                    onClick={handleDownload}
                    style={{
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        width: "90px",
                        fontSize: "12px"
                    }}
                >Download Model</button>
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
