import axios from "axios";

const PINATA_API_KEY = "685539d8a0fde139ec5e";
const PINATA_SECRET_API_KEY = "a655dc7e40f01095e732edb422118b2571a53539d9915480f74e5829b974a604";

export async function uploadToPinata(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append("pinataMetadata", metadata);
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    try {
        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_API_KEY,
                },
            }
        );

        const ipfsHash = response.data.IpfsHash;
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
        console.error("Pinata Upload Error:", error);
        throw new Error("Failed to upload image to IPFS");
    }
}
