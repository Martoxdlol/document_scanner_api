import express from "express";
import path from 'path'
import fs from 'fs/promises'
import { exec } from "child_process";
import crypto from 'crypto'
import sharp from 'sharp'
import cors from 'cors'

const app = express()

app.use(express.json({ limit: '100mb' }));

app.use(cors())

app.post('/scan', async (req, res) => {
    try {
        const [metadata, data] = req.body.data.split(';base64,')
        let buffer = Buffer.from(data, 'base64')

        let sharpInstance = sharp(buffer)
        sharpInstance = sharpInstance.rotate()
        sharpInstance = sharpInstance.resize({
            withoutEnlargement: true,
            fit: 'contain',
            width: 1600,
        })
        buffer = await sharpInstance.toFormat("jpeg").toBuffer()

        const sha256Hasher = crypto.createHmac("sha256", '1234');
        const hash = sha256Hasher.update(buffer).digest("hex");

        const filename = 'data/' + hash + '.jpeg'

        try {
            await fs.access(filename);
            const scanned = await fs.readFile(scannedFilename, { encoding: 'base64' })
            console.log(`image ${hash} found`)
            res.send('data:image/png;base64,' + scanned)
            return
        } catch {
            console.log('New file with hash ' + hash)
        }

        await fs.writeFile(filename, buffer)

        exec('python3 main.py ' + filename, async (err, stdout) => {
            console.log("Python script output: ", stdout)
            console.log("Python script error: ", err)
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