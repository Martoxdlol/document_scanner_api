import express, { Request, Response } from 'express'
import fs from 'fs/promises'
import cv from 'opencv4nodejs'

const app = express()

app.listen(3000)

app.get('/', async (req, res) => {
    const data = await fs.readFile('target.jpg')
    const image = await cv.imread('target.jpg')
    const grayImage = image.cvtColor(cv.COLOR_BGR2GRAY);
    const cannyImage = grayImage.canny(50, 150);
    const contours = cannyImage.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let maxContour = contours[0];
    for (let i = 1; i < contours.length; i++) {
      if (contours[i].area > maxContour.area) {
        maxContour = contours[i];
      }
    }
    const borderedImage = image.drawContours([maxContour], new cv.Vec3(0, 255, 0), 2);
    cv.imwrite('out.jpg', image)
})