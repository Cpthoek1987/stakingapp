import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";
import { useEffect } from "react";

export const StakeRewards = () => {
    const account = useActiveAccount();

    const {
        data: tokenBalance,
        isLoading: isTokenBalanceLoading,
        refetch: refetchTokenBalance,
    } = useReadContract(
        balanceOf,
        {
            contract: REWARD_TOKEN_CONTRACT,
            owner: account?.address || "",
        }
    );

    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""],
    });

    useEffect(() => {
        refetchStakedInfo();
        const interval = setInterval(() => {
            refetchStakedInfo();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            animation: "rewardGlow 3s infinite",
            padding: "2px",
            borderRadius: "16px",
            background: "linear-gradient(45deg, rgba(0, 200, 83, 0.1), rgba(105, 240, 174, 0.1))",
            backdropFilter: "blur(10px)"
        }}>
            <style>{`
                @keyframes rewardGlow {
                    0%, 100% { box-shadow: 0 0 10px rgba(0, 200, 83, 0.1); }
                    50% { box-shadow: 0 0 20px rgba(105, 240, 174, 0.2); }
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
                    box-shadow: 0 5px 15px rgba(0, 200, 83, 0.3);
                }
            `}</style>
            <div style={{
                background: "rgba(26, 26, 26, 0.95)",
                borderRadius: "15px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px"
            }}>
                <h2 style={{
                    fontSize: "20px",
                    color: "#fff",
                    margin: 0,
                    textAlign: "center",
                    textShadow: "0 0 10px rgba(0, 200, 83, 0.3)"
                }}>Staking Rewards</h2>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    alignItems: 'center'
                }}>
                    <p style={{
                        fontSize: "16px",
                        color: "#fff",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Wallet Balance: {tokenBalance ? `${toEther(tokenBalance)} tokens` : "0 tokens"}
                    </p>
                    <p style={{
                        fontSize: "16px",
                        color: "#fff",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Staked NFTs: {stakedInfo ? stakedInfo[0].length : 0}
                    </p>
                    <p style={{
                        fontSize: "16px",
                        color: "#fff",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Rewards Earned: {stakedInfo ? `${toEther(stakedInfo[1])} tokens` : "0 tokens"}
                    </p>
                </div>

                <TransactionButton
                    transaction={() => (
                        prepareContractCall({
                            contract: STAKING_CONTRACT,
                            method: "claimRewards",
                            params: []
                        })
                    )}
                    onTransactionConfirmed={() => {
                        refetchStakedInfo();
                        refetchTokenBalance();
                        alert("Rewards claimed!");
                    }}
                    className="animated-button"
                    style={{
                        border: "none",
                        background: "linear-gradient(45deg, #00c853, #69f0ae)",
                        color: "#fff",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                    }}
                >
                    Claim Rewards
                </TransactionButton>
            </div>
        </div>
    );
};
