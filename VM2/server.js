require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

const pdfMergerUrl = process.env.PDF_MERGER_URL || 'http://192.168.56.102:4000';
const pdfConverterUrl = process.env.PDF_CONVERTER_URL || 'http://192.168.56.103:5000';
const videoConverterUrl = process.env.VIDEO_CONVERTER_URL || 'http://192.168.56.103:6000';

app.use('/merge', createProxyMiddleware({
    target: pdfMergerUrl,
    changeOrigin: true,
    pathRewrite: { '^/merge': '' },
    onError: (err, req, res) => {
        console.error('Error in /merge proxy:', err);
        res.status(502).send('Error communicating with PDF Merger service.');
    }
}));

app.use('/convert', createProxyMiddleware({
    target: pdfConverterUrl,
    changeOrigin: true,
    pathRewrite: { '^/convert': '' },
    onError: (err, req, res) => {
        console.error('Error in /convert proxy:', err);
        res.status(502).send('Error communicating with PDF-to-Image Converter service.');
    }
}));

app.use('/convert-video', createProxyMiddleware({
    target: videoConverterUrl,
    changeOrigin: true,
    pathRewrite: { '^/convert-video': '/convert' },
    onError: (err, req, res) => {
        console.error('Error in /convert-video proxy:', err);
        res.status(502).send('Error communicating with Video-to-Audio Converter service.');
    }
}));

app.use('*', (req, res) => {
    res.status(404).send('API endpoint not found.');
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
