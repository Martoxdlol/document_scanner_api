import express from "express";
import path from 'path'
import fs from 'fs/promises'
import { exec } from "child_process";
import crypto from 'crypto'

const app = express()

app.use(express.json({ limit: '100mb' }));

app.post('/scan', async (req, res) => {
    try {
        const [metadata, data] = req.body.data.split(';base64,')
        const buffer = Buffer.from(data, 'base64')

        const sha256Hasher = crypto.createHmac("sha256", '1234');
        const hash = sha256Hasher.update(req.body.data).digest("hex");

        const filename = 'data/' + hash + '.' + metadata.split('/')[1]

        try {
            await fs.access(filename);
            const scanned = await fs.readFile(filename + '.scanned.png', { encoding: 'base64' })
            console.log(`image ${hash} found`)
            res.send('data:image/png;base64,' + scanned)
            return
        } catch {
            console.log('New file with hash ' + hash)
        }

        await fs.writeFile(filename, buffer)
        exec('python3 main.py ' + filename, async (err, stdout) => {
            console.log("Python script output: ", stdout)
            const scanned = await fs.readFile(filename + '.scanned.png', { encoding: 'base64' })
            res.send('data:image/png;base64,' + scanned)
        })
    } catch (error) {
        console.error(error)
        res.send(req.body?.data)
    }
})

// Testing
app.use('/public', express.static(path.resolve('./public')))
app.use('/scan/test', express.static(path.resolve('./public')))

app.listen(3000, () => {
    console.log("App listening ok")
})