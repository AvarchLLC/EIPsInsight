const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Your wallet address
const walletAddress = '0x68B1C495096710Ab5D3aD137F5024221aAf35B7d';

// Use Ethereum URI format for better wallet app recognition
const ethereumURI = `ethereum:${walletAddress}`;

// Output path
const outputPath = path.join(__dirname, '..', 'public', 'qr-wallet.png');

// QR code options
const options = {
  type: 'png',
  quality: 0.92,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  width: 256
};

// Generate QR code
QRCode.toFile(outputPath, ethereumURI, options, function (err) {
  if (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
  
  console.log('QR code generated successfully!');
  console.log('File saved to:', outputPath);
  console.log('Wallet address:', walletAddress);
  console.log('Ethereum URI:', ethereumURI);
});