import path from 'path'

export default class PdfService {

    private static pdfService: PdfService

    private constructor() {}

     static getInstance() {
       if (!PdfService.pdfService) { 
            PdfService.pdfService = new PdfService()
          }

        return PdfService.pdfService
    }

    createCertificate (
      imageSrc: string, 
      bio: string, 
      artist: string, 
      title: string, 
      technique: string, 
      dimensions: string, 
      dataCallback: (chunk: any) => boolean, 
      endCallback: () => void
    ) {

        try {
        
        
        } catch {
         throw new Error("Could not create certificate!");
        }
       };
}