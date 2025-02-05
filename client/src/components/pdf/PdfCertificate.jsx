import { useContext, useEffect, useState } from 'react';
import '../../../public/fonts/Raleway';
import { CircularProgress } from '@mui/material';
import { jsPDF } from "jspdf";
import { EntriesContext } from '../contexts/EntriesContext';
import PdfCertificateEditor from './PdfCertificateEditor';
import useNotification from '../hooks/useNotification';
import Message from '../reusable/Message';
import { createCertificatePageTwo, createPdfCertificatePageOne } from './helpers/utilityFunctions';
import GoBack from '../reusable/GoBack';
import { useNavigate } from 'react-router-dom';

import './PdfCertificate.css';

const PdfCertificate = () => {

  // eslint-disable-next-line no-unused-vars
  const {showError, error} = useNotification();
  const { currentImages } = useContext(EntriesContext);
  const navigate = useNavigate();

  let myStorage = window.localStorage;
  let storedImages = JSON.parse(myStorage.getItem('currentImages')) || [];
  const selectedImage = (currentImages && currentImages.length > 0) 
    ? currentImages[0] 
    : storedImages[0];

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState({
    logo: '',
    bio: '',
    artists: [selectedImage?.artist, ''],
    titles: [selectedImage?.title, ''],
    techniques: [selectedImage?.technique, ''],
    notes: [selectedImage?.notes, ''],
    website: '',
    email: ''
  });

  const [logoName, setLogoName] = useState('');

  const helperText = `${pdfData.bio.length}/2700`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      generatePdf();
    }, 1000);

    return () => clearTimeout(timeout);

  }, [pdfData.artists, pdfData.titles, pdfData.techniques, pdfData.notes, pdfData.bio, pdfData.logo, pdfData.website, pdfData.email]);

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
        [updatedField[0], updatedField[1]] = [updatedField[1], updatedField[0]];
        return { ...prev, [field]: updatedField };
      }
      return prev;
    });
  };
  
  // const loadImage = (url) => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = url;
  //     img.onload = () => {
  //       resolve({
  //         naturalWidth: img.width,
  //         naturalHeight: img.height,
  //       });
  //     };
  //   });
  // };

  const loadImage = (url, targetWidth = 1000) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Prevent CORS issues
      img.src = url;
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const targetHeight = targetWidth * aspectRatio; // Maintain aspect ratio
  
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
  
        // Draw the image resized on the canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  
        // Convert the canvas to a Base64 Data URL
        const resizedImageUrl = canvas.toDataURL("image/jpeg"); // or "image/jpeg"
  
        resolve({
          naturalWidth: img.width,
          naturalHeight: img.height,
          resizedWidth: targetWidth,
          resizedHeight: targetHeight,
          resizedUrl: resizedImageUrl, // Already in Base64 format
        });
      };
    });
  };

  // const toDataURL = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.onerror = reject;
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     showError('Failed to load image for the PDF, please, check your connection!');
  //   }
  // };

  const preparePdfImageData = async () => {
    try {
      const imageUrl = selectedImage?.download_url;
      //const imageData = await toDataURL(imageUrl);

      const { resizedWidth, resizedHeight, resizedUrl } = await loadImage(imageUrl);
  
      let imageWidth;
  
      // Determine image width for PDF
      if (resizedWidth > resizedHeight) imageWidth = 95;
      else if (Math.abs(resizedWidth - resizedHeight) < 30) imageWidth = 95;
      else imageWidth = 60;
  
      const aspectRatio = resizedHeight / resizedWidth;
      const autoHeight = imageWidth * aspectRatio;
  
      return { imageData: resizedUrl, imageWidth, autoHeight }; // Use resizedUrl directly
    } catch (error) {
      console.error("Error preparing PDF image data:", error);
    }
  };
  
  const generatePdf = async () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a5',
    });

    const {imageData, imageWidth, autoHeight} = await preparePdfImageData();
    
    createPdfCertificatePageOne(doc, pdfData, imageData, imageWidth, autoHeight, selectedImage, logoName);

    if (pdfData.bio) {
      createCertificatePageTwo(doc, pdfData, logoName);
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    //doc.save("example.pdf");
  };

  return (
    <>
      <GoBack handleGoBack={() => { myStorage.removeItem('currentImages'); navigate(-1); }}/>
      {!pdfUrl && !error.state && <CircularProgress className="loader" color="primary" />}
      <Message
        open={error.state}
        handleClose={() => {}}
        message={error.message}
        severity="error"
      />
      <div className="pdf-maker-content">
        {pdfUrl &&
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
              logoName={logoName}
              setLogoName={setLogoName}
            />       
          </>}
      </div>
    </>
  );
};

export default PdfCertificate;