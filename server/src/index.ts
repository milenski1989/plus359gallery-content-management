import "reflect-metadata"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"
import session from "express-session"
import path from "path"
import { AuthenticationController } from "./controllers/AuthenticationController"
import { ArtworksController } from "./controllers/ArtworksController"
import { S3Controller } from "./controllers/S3Controller"
import { StorageController } from "./controllers/StorageController"
import { PdfController } from "./controllers/PdfController"
import { BiosController } from "./controllers/BiosController"
import { ArtistsController } from "./controllers/ArtistsController"
import { DocsController } from "./controllers/DocsController"
dotenv.config()

    const app = express()
   
    app.use(express.static(path.join(__dirname, '/build')));
    const origin = process.env.NODE_ENV === 'production' ? "https://app.plus359gallery.com" : ["http://localhost:5173", "http://localhost:8081", "exp://euxrx7g-murkov-8081.exp.direct"]
    const domain = process.env.NODE_ENV === 'production' ? 'app.plus359gallery.com' : 'localhost'

    app.use((req, res, next) => {
      const allowedOrigins = origin;
      const originHeader = req.headers.origin;
    
      if (allowedOrigins.includes(originHeader)) {
        res.setHeader("Access-Control-Allow-Origin", originHeader);
      }
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("Content-Security-Policy", `object-src 'none'; script-src 'self'; base-uri 'self'`);
      res.setHeader("Referrer-Policy", "no-referrer")
      if (req.secure) {
        res.setHeader("Strict-Transport-Security", "max-age=15778463; includeSubDomains");
      }
      next();
    });

    const sessionSecret = process.env.EXPRESS_SESSION_SECRET
    if (!sessionSecret) {
    throw new Error("EXPRESS_SESSION_SECRET is not defined")
    }

    app.use(cors({origin: origin, credentials: true}))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    
    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          domain: domain,
          path: '/',
          maxAge: 24 * 60 * 60 * 1000
        }
      })
    )

    const authController = new AuthenticationController();
    const artworksController = new ArtworksController()
    const s3Controller = new S3Controller()
    const storageController = new StorageController()
    const pdfController = new PdfController()
    const biosController = new BiosController()
    const artistsController = new ArtistsController()
    const docsController = new DocsController()

    app.use('/auth', authController.router);
    app.use('/artworks', artworksController.router)
    app.use('/s3', s3Controller.router)
    app.use('/storage', storageController.router)
    app.use('/pdf', pdfController.router)
    app.use('/bios', biosController.router)
    app.use('/artists', artistsController.router)
    app.use('/docs', docsController.router)
    
    console.log(__dirname)
    
    app.get('*', (req,res) =>{
      res.sendFile(path.join(__dirname+'/build/index.html'));
      });
    
    const PORT = process.env.PORT
    
    app.listen(PORT, () => console.log(`Server is connected on ${5000}`))



