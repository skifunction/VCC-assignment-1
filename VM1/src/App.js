import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const uploadFile = async (endpoint) => {
    if (!file) return alert("Select a file first!");
    setProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://192.168.56.102:3000/${endpoint}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setDownloadLink(response.data.downloadUrl);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Audio Processing Service</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => uploadFile("convert")}>Convert to MP3</button>
      <button onClick={() => uploadFile("trim")}>Trim MP3</button>

      {processing && <p>Processing...</p>}
      {downloadLink && <a href={downloadLink}>Download Processed File</a>}
    </div>
  );
}

export default App;
