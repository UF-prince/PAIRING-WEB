const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.json());

const authState = useMultiFileAuthState('./auth');

const sock = makeWASocket({
  auth: authState.state,
  printQRInTerminal: true,
});

app.get('/pairing-code', async (req, res) => {
  try {
    const code = await sock.requestPairingCode();
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate pairing code' });
  }
});

app.get('/qr-code', async (req, res) => {
  try {
    const qrCode = await sock.generateQRCode();
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
