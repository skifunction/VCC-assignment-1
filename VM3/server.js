const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 6000;

const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    const outputAudioPath = `output/${path.basename(req.file.originalname, path.extname(req.file.originalname))}.mp3`;

    // Output fodler checking
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }

    const command = `ffmpeg -i ${videoPath} -vn -acodec libmp3lame -q:a 3 ${outputAudioPath}`;

    exec(command, (error, stdout, stderr) => {
        // Important
        fs.unlinkSync(videoPath);

        if (error) {
            console.error('Error converting video to audio:', error);
            return res.status(500).send('An error occurred while processing the video.');
        }

        res.download(outputAudioPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            fs.unlinkSync(outputAudioPath);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Video-to-Audio Converter service is running on port ${PORT}`);
});
