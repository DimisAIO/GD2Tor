const gdps = "http://t2nmtl5tqyhyjpv757b5ulstey7ejheqwgqywhsiuxw3e64ioxj4vgid.onion";
const { SocksProxyAgent } = require('socks-proxy-agent')
const torProxyAgent = new SocksProxyAgent("socks://127.0.0.1:9050");
let torProcess;

const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();

app.use(express.json({limit: '64mb'}));
app.use(express.urlencoded({ limit: '64mb', extended: true }));

app.post('*', async (req, res) => {
    try {
        const path = req.path;
        const postBody = req.body;

        // Forward the modified request to another server via axios
        const response = await axios.post(`${gdps}${path}`, postBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            httpsAgent: torProxyAgent,
            httpAgent: torProxyAgent,
            validateStatus: () => true // Make all status codes valid
        });

        res.status(200);
        res.send(`${response.data}`);
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(8888, () => {
    console.log(`GD2Tor Ready!`);
        // Capture and log stdout from tor.exe
        torProcess = spawn('tor.exe');

        torProcess.stdout.on('data', (data) => {
          console.log(`${data}`);
        });
  
        // Handle errors when spawning the process
        torProcess.on('error', (error) => {
            console.error(`Error starting Tor: ${error.message}`);
        });

        // Handle the process closing
        torProcess.on('close', (code) => {
            process.exit();
        });
});
