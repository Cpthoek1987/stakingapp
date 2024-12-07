import { MediaRenderer } from "thirdweb/react";
import { NFT } from "thirdweb";
import { client } from "../src/app/client";
import { Modal } from "./Modal";

type NFTModalProps = {
    nft: NFT;
    onClose: () => void;
};

interface NFTAttribute {
    trait_type: string;
    value: string;
}

export const NFTModal: React.FC<NFTModalProps> = ({ nft, onClose }) => {
    const traits = Array.isArray(nft.metadata.attributes) 
        ? (nft.metadata.attributes as NFTAttribute[])
        : [];

    return (
        <Modal isOpen={true} onClose={onClose}>
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 1000001,
                    padding: "4px",
                    lineHeight: "1"
                }}
            >×</button>

            <div style={{
                width: "320px",
                height: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                borderRadius: "10px",
                marginBottom: "12px"
            }}>
                <MediaRenderer
                    client={client}
                    src={nft.metadata.image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "10px"
                    }}
                />
            </div>

            <h1 style={{
                color: "#fff",
                fontSize: "22px",
                textAlign: "center",
                margin: "0 0 12px 0",
                textShadow: "0 0 10px rgba(255, 69, 0, 0.3)"
            }}>{nft.metadata.name}</h1>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                width: "100%"
            }}>
                {traits.map((trait, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "rgba(255, 69, 0, 0.1)",
                            padding: "8px",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "1px solid rgba(255, 69, 0, 0.2)"
                        }}
                    >
                        <p style={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: "11px",
                            textTransform: "uppercase",
                            marginBottom: "3px",
                            margin: 0
                        }}>{trait.trait_type}</p>
                        <p style={{
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "600",
                            margin: 0
                        }}>{trait.value}</p>
                    </div>
                ))}
            </div>
        </Modal>
    );
};
