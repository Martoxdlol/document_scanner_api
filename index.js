const express = require('express')
const app = express()
app.listen(3000)

app.use(express.json());

app.post('/scan_document', (req, res) => {
    console.log(req.body)
    res.end(req.body)
    //const buf = Buffer.from(req.body, 'base64'); // Ta-da
})