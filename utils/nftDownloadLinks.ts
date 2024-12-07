// This function will return the download link for a given NFT number
export const getNFTDownloadLink = (nftNumber: string): string => {
    // Validate NFT number is between 1 and 9998
    const num = parseInt(nftNumber);
    if (isNaN(num) || num < 1 || num > 9998) {
        throw new Error('Invalid NFT number');
    }

    // Return placeholder link - replace this URL with the actual base URL when provided
    return `https://placeholder-download-link/nft-${nftNumber}`;
};

// Example usage:
// const link = getNFTDownloadLink("1"); // For NFT #1
// const link = getNFTDownloadLink("9998"); // For NFT #9998

// When you have the actual download links, you can either:
// 1. Replace the placeholder URL in the function above with the actual base URL
// 2. Or create a mapping object for specific NFTs if they have different URLs:
/*
const NFT_DOWNLOAD_LINKS: Record<string, string> = {
    "1": "https://actual-download-link/nft-1",
    "2": "https://actual-download-link/nft-2",
    // ... and so on
};

export const getNFTDownloadLink = (nftNumber: string): string => {
    if (!NFT_DOWNLOAD_LINKS[nftNumber]) {
        throw new Error('Download link not found for this NFT');
    }
    return NFT_DOWNLOAD_LINKS[nftNumber];
};
*/
