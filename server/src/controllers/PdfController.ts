import * as express from 'express'
import {Request, Response} from "express";
import PdfService from '../services/PdfService'
import { PdfBody } from '../interfaces/PdfInterfaces'

export class PdfController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/create-certificate', this.createCertificate)
}

createCertificate = async (req: Request<{}, {}, PdfBody, {}>, res: Response) => {
    const {imageSrc, bio, artist, title, technique, dimensions} = req.body 
  
    try {
      PdfService.getInstance().createCertificate(
        imageSrc, bio, artist, title, technique, dimensions,
        (chunk) => stream.write(chunk),
        () => stream.end()
      )
  
      const stream: Response<any, Record<string, any>> = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=certificate.pdf'
      })
  
    } catch (error) {
      res.status(400).json(error);
    }
  }
}