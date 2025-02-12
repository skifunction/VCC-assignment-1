require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Base URLs for microservices (from environment variables or defaults)
const pdfMergerUrl = process.env.PDF_MERGER_URL || 'http://192.168.56.102:4000';
const pdfConverterUrl = process.env.PDF_CONVERTER_URL || 'http://192.168.56.103:5000';
const videoConverterUrl = process.env.VIDEO_CONVERTER_URL || 'http://192.168.56.103:6000';

// Proxy endpoint for PDF Merger
app.use('/merge', createProxyMiddleware({
    target: pdfMergerUrl,
    changeOrigin: true,
    pathRewrite: { '^/merge': '' },
    onError: (err, req, res) => {
        console.error('Error in /merge proxy:', err);
        res.status(502).send('Error communicating with PDF Merger service.');
    }
}));

// Proxy endpoint for PDF-to-Image Converter
app.use('/convert', createProxyMiddleware({
    target: pdfConverterUrl,
    changeOrigin: true,
    pathRewrite: { '^/convert': '' },
    onError: (err, req, res) => {
        console.error('Error in /convert proxy:', err);
        res.status(502).send('Error communicating with PDF-to-Image Converter service.');
    }
}));

// Proxy endpoint for Video-to-Audio Converter
app.use('/convert-video', createProxyMiddleware({
    target: videoConverterUrl,
    changeOrigin: true,
    pathRewrite: { '^/convert-video': '/convert' },
    onError: (err, req, res) => {
        console.error('Error in /convert-video proxy:', err);
        res.status(502).send('Error communicating with Video-to-Audio Converter service.');
    }
}));

// Fallback route for undefined endpoints
app.use('*', (req, res) => {
    res.status(404).send('API endpoint not found.');
});

// Start the API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
