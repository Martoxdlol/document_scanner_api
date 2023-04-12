import express from "express";
import path from 'path'
import fs from 'fs/promises'
import { exec as exec_original } from "child_process";
import crypto from 'crypto'
import sharp from 'sharp'
import cors from 'cors'

import util from 'util'

const exec = util.promisify(exec_original);

const app = express()

app.use(express.json({ limit: '100mb' }));

app.use(cors())

app.post('/scan', async (req, res) => {
    try {
        const [_, data] = req.body.data.split(';base64,')
        let buffer = Buffer.from(data, 'base64')

        let sharpInstance = sharp(buffer)
        sharpInstance = sharpInstance.rotate()
        buffer = await sharpInstance.toFormat("jpeg").toBuffer()

        const sha256Hasher = crypto.createHmac("sha256", '1234');
        const hash = sha256Hasher.update(buffer).digest("hex");

        const filename = 'data/' + hash + '.jpeg'
        const scannedFilename = filename + '.scanned.png'



        try {
            await fs.access(scannedFilename);
            const scanned = await fs.readFile(scannedFilename, { encoding: 'base64' })
            console.log(`image ${hash} found`)
            res.send('data:image/png;base64,' + scanned)
            return
        } catch {
            console.log('New file with hash ' + hash)
        }

        await fs.writeFile(filename, buffer)

        await delay(1000)

        const { stdout, stderr } = await exec('python3 main.py ' + filename);
        if(stdout.trim()) {
            console.log("Python script output: ", stdout)
        }

        if(stderr.trim()) {
            console.log("Python script error: ", stderr)
        }

        if(stderr) throw stderr

        const scanned = await fs.readFile(filename + '.scanned.png', { encoding: 'base64' })
        res.send('data:image/png;base64,' + scanned)
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))