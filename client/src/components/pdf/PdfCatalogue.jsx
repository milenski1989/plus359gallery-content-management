import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { EntriesContext } from '../contexts/EntriesContext';
import { createCatalogueContent, embedFont, insertImage, preparePdfImageData, savePdfOnMobile } from "./helpers/utilityFunctions";
import useNotification from '../hooks/useNotification';
import Message from '../reusable/Message';
import PdfCatalogueEditor from './PdfCatalogueEditor';
import { useNavigate } from 'react-router-dom';
import GoBack from '../reusable/GoBack';
import { PDFDocument } from 'pdf-lib';
import { useMediaQuery } from "@mui/material";

import './PdfCertificate.css';
import { mmToPoints } from './helpers/constants';

function PdfCatalogue() {

  const {error} = useNotification();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const navigate = useNavigate();
  const { currentImages, setCurrentImages } = useContext(EntriesContext);
  let myStorage = window.localStorage;
  let storedImages = JSON.parse(myStorage.getItem('currentImages')) || [];

  const selectedImages = currentImages && currentImages.lenght > 0 ? currentImages : storedImages;
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const [pdfDataList, setPdfDataList] = useState(
    selectedImages.map((image) => ({
      artist: image?.artist,
      title: image?.title,
      technique: image?.technique,
      dimensions: image?.dimensions
    }))
  );

  const [logo, setLogo] = useState({url: '', width: 0, height: 0});
  const [website, setWebsite] = useState("");
    
  useEffect(() => {
    const timeout = setTimeout(() => {
      previewPdfLibDoc();
    }, 1000);
  
    return () => clearTimeout(timeout);
  
  }, [pdfDataList, logo, website]);

  const previewPdfLibDoc = async () => {

    const pdfDoc = await PDFDocument.create();
    const raleway = await embedFont('Raleway-Medium', pdfDoc);
  
    const imagesData = await Promise.all(
      selectedImages.map(async (image) => {
        const { imageData, imageWidth, autoHeight } = await preparePdfImageData(image.download_url);
        return { imageData, imageWidth, autoHeight };
      })
    );

    selectedImages.forEach(async (selectedImage, index) => {
   
      const pageWidthInMM = 210;
      const pageHeightInMM = 297;

      const pageWidth = pageWidthInMM * mmToPoints;
      const pageHeight = pageHeightInMM * mmToPoints;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      await createCatalogueContent(pdfDoc, page, raleway, pdfDataList, imagesData, index, website);
      
      if (logo && logo.url) {

        const logoImage = await pdfDoc.embedJpg(logo.url);
        const logoWidth = (logo.width * 25.4) / 300 / 1.4 * mmToPoints;
        const logoHeight = (logo.height * 25.4) / 300 / 1.4 * mmToPoints;

        insertImage(page, logoImage, 0, 0, logoWidth, logoHeight);
      }
    });
    
    const pdfBytes = await pdfDoc.save();
    const _pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(_pdfBlob);
    if (!isSmallDevice) setPdfUrl(pdfUrl);
    else setPdfBlob(_pdfBlob);
  };

  const handleGoBack = () => {
    window.localStorage.removeItem('currentImages');
    setCurrentImages([]);
    navigate(-1);
  };

  return (
    <>
      <Message
        open={error.state}
        handleClose={() => {}}
        message={error.message}
        severity="error"
      />
      <GoBack handleGoBack={handleGoBack}/>
      {pdfUrl && !error.state && !isSmallDevice ?
        <div className="pdf-maker-content">
          <>
            <iframe src={pdfUrl} className="pdf-maker-preview"></iframe>
            <PdfCatalogueEditor 
              pdfDataList={pdfDataList}
              setPdfDataList={setPdfDataList}
              setLogo={setLogo}
              website={website} 
              setWebsite={setWebsite}
            />       
          </>
        </div>
        :
        isSmallDevice ?
          <div className="pdf-maker-mobile-content">
            <PdfCatalogueEditor 
              pdfDataList={pdfDataList}
              setPdfDataList={setPdfDataList}
              setLogo={setLogo}
              website={website} 
              setWebsite={setWebsite}
              selectedImages={selectedImages}
            />   
            <Button variant="contained" onClick={() => savePdfOnMobile(pdfBlob, 'catalogue')}>Save</Button>    
          </div>
          :
          <CircularProgress className="loader" color="primary" />
      }
    </>
  );
}

export default PdfCatalogue;