import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, useMediaQuery } from '@mui/material';
import { EntriesContext } from '../contexts/EntriesContext';
import PdfCertificateEditor from './PdfCertificateEditor';
import useNotification from '../hooks/useNotification';
import Message from '../reusable/Message';
import { convertPdfToBlob, createCertFirstPageContent, createCertSecondPageContent, embedFont, insertImage, savePdfOnMobile } from './helpers/utilityFunctions';
import GoBack from '../reusable/GoBack';
import { useNavigate } from 'react-router-dom';
import './PdfCertificate.css';
import { PDFDocument} from 'pdf-lib';
import { mmToPoints } from './helpers/constants';

const PdfCertificate = () => {

  const {error} = useNotification();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { currentImages, setCurrentImages } = useContext(EntriesContext);
  const navigate = useNavigate();

  let myStorage = window.localStorage;
  let storedImages = JSON.parse(myStorage.getItem('currentImages')) || [];
  const selectedImage = (currentImages && currentImages.length > 0) 
    ? currentImages[0] 
    : storedImages[0];

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfData, setPdfData] = useState({
    bio: '',
    artists: [selectedImage?.artist, ''],
    titles: [selectedImage?.title, ''],
    techniques: [selectedImage?.technique, ''],
    dimensions: selectedImage?.dimensions,
    website: '',
    email: ''
  });

  const [logo, setLogo] = useState({url: '', width: 0, height: 0});
  const helperText = `${pdfData.bio.length}/2700`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      //generatePdf();
      generatePdfPreview();
    }, 1000);

    return () => clearTimeout(timeout);

  }, [pdfData.artists, pdfData.titles, pdfData.techniques, pdfData.dimensions, pdfData.bio, logo, pdfData.website, pdfData.email]);

  const updatePdfData = (field, value, index = 1) => {
    setPdfData((prev) => {
      if (Array.isArray(prev[field])) {
        const updatedField = [...prev[field]];
        updatedField[index] = value;
        return { ...prev, [field]: updatedField };
      }

      return { ...prev, [field]: value };
    });
  };
  
  const handleSwap = (field) => {
    setPdfData((prev) => {
      if (Array.isArray(prev[field]) && prev[field].length >= 2) {
        const updatedField = [...prev[field]];
        [updatedField[1], updatedField[0]] = [updatedField[0], updatedField[1]];
        return { ...prev, [field]: updatedField };
      }
      return prev;
    });
  };

  const generatePdfPreview = async () => {
  
    const pdfDoc = await PDFDocument.create();
   
    const raleway = await embedFont('Raleway-Medium', pdfDoc);
    const cinzelDecorative = await embedFont('Cinzel Decorative', pdfDoc);

    const pageWidthInMM = 148;
    const pageHeightInMM = 210;
  
    const pageWidth = pageWidthInMM * mmToPoints;
    const pageHeight = pageHeightInMM * mmToPoints;
  
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { height: pageHeightPoints } = page.getSize();

    let logoWidthInPoints = 0;
    let logoHeightInPoints = 0;

    if (logo && logo.url) {
      logoWidthInPoints =  ((logo.width * 25.4) / 300 / 1.8) * mmToPoints;
      logoHeightInPoints = ((logo.height * 25.4) / 300 / 1.8) * mmToPoints;
    }

    if (logo && logo.url) {
      const logoImage = await pdfDoc.embedJpg(logo.url);
      insertImage(page, logoImage, 0, pageHeightPoints - 90, logoWidthInPoints, logoHeightInPoints);
    }

    await createCertFirstPageContent(pdfDoc, page, cinzelDecorative, raleway, selectedImage, pdfData);

    if (pdfData.bio) {
  
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      await createCertSecondPageContent(page, raleway, pdfData);
 
      if (logo && logo.url) {
        const logoImage = await pdfDoc.embedJpg(logo.url);
        insertImage(page, logoImage, 0, 0, logoWidthInPoints, logoHeightInPoints);
      }
    }

    const {blob, url} = await convertPdfToBlob(pdfDoc);
  
    if (!isSmallDevice) setPdfUrl(url);
    else setPdfBlob(blob);
  };

  const handleGoBack = () => {
    window.localStorage.removeItem('currentImages');
    setCurrentImages([]);
    navigate(-1);
  };

  return (
    <>
      <GoBack handleGoBack={handleGoBack}/>
      <Message
        open={error.state}
        handleClose={() => {}}
        message={error.message}
        severity="error"
      />
      <div className="pdf-maker-content">
        {pdfUrl && !error.state && !isSmallDevice ?
          <>
            <iframe
              src={pdfUrl}
              className="pdf-maker-preview"
              title="PDF Preview"
            />
            <PdfCertificateEditor 
              pdfData={pdfData}
              updatePdfData={updatePdfData}
              handleSwap={handleSwap}
              helperText={helperText}
              setLogo={setLogo}
            />       
          </>
          :
          isSmallDevice ?
            <div className="pdf-maker-mobile-content">
              <PdfCertificateEditor 
                pdfData={pdfData}
                updatePdfData={updatePdfData}
                handleSwap={handleSwap}
                helperText={helperText}
                setLogo={setLogo}
                selectedImage={selectedImage}
              />
              <Button variant="contained" onClick={() => savePdfOnMobile(pdfBlob, 'certificate')}>Save</Button>   
            </div>
            :
            <CircularProgress className="loader" color="primary" />
        }
      </div>
    </>
  );
};

export default PdfCertificate;