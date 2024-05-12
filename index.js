const express = require("express")
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints');

const app = express()
const detector = new DeviceDetector({
    deviceIndexes: true,
    clientIndexes: true
})
const clientHints = new ClientHints();

app.use(express.json())

app.use("/", express.static("public"))

app.post("/analyze", async (req, res) => {
    const hints = clientHints.parse(Object.assign(req.headers, req.body?.hints || {}), req.body?.meta || {})
    const device = detector.detect(req.headers["user-agent"], hints)

    res.send(device)
})


app.listen(3000)