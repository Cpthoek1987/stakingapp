import { ConnectEmbed } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking";

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "0",
      width: "100%",
      padding: "20px"
    }}>
      <h1 style={{ 
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center"
      }}>Welcome at the ChillingChiliz HUB</h1>
      <ConnectEmbed
        client={client}
        chain={chain}
      />
      <Staking />
    </div>
  );
}
