async function pinFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataOptions', JSON.stringify({cidVersion: 1}));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'pinata_api_key': '10e2908bf418b0edb269',
            'pinata_secret_api_key': '6d5317a95e54d944fe704ea713c12adf7b4099a5a63191a5b3754545ee9bf954'
        },
        body: formData
    });
    const responseHash = await response.json();
    console.table(responseHash);
    return await responseHash.IpfsHash;
}

export default pinFile;