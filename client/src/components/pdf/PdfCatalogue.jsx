import { useContext, useEffect, useState } from 'react';
import '../../../public/fonts/Raleway';
import { CircularProgress } from '@mui/material';
import { jsPDF } from "jspdf";
import { EntriesContext } from '../contexts/EntriesContext';
import { createPdfCatalogue } from "./helpers/utilityFunctions";
import useNotification from '../hooks/useNotification';
import Message from '../reusable/Message';
import PdfCatalogueEditor from './PdfCatalogueEditor';

import './PdfCertificate.css';
import { useNavigate } from 'react-router-dom';
import GoBack from '../reusable/GoBack';

function PdfCatalogue() {

  // eslint-disable-next-line no-unused-vars
  const {showError, error} = useNotification();
  const navigate = useNavigate();
  const { currentImages } = useContext(EntriesContext);
  let myStorage = window.localStorage;
  let storedImages = JSON.parse(myStorage.getItem('currentImages')) || [];

  const selectedImages = currentImages && currentImages.lenght > 0 ? currentImages : storedImages;
  
  const [pdfUrl, setPdfUrl] = useState(null);

  const [pdfDataList, setPdfDataList] = useState(
    selectedImages.map((image) => ({
      artist: image?.artist,
      title: image?.title,
      technique: image?.technique,
      dimensions: image?.dimensions
    }))
  );

  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState('');
  const [website, setWebsite] = useState("");
    
  useEffect(() => {
    const timeout = setTimeout(() => {
      generatePdf();
    }, 1000);
  
    return () => clearTimeout(timeout);
  
  }, [pdfDataList, logo, website]);

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

  const preparePdfImageData = async (imageUrl) => {
    if (!imageUrl) {
      console.error("Image URL is missing.");
      return null;
    }
  
    try {
      const { resizedWidth, resizedHeight, resizedUrl } = await loadImage(imageUrl);

      //const imageData = await toDataURL(imageUrl);

      let imageWidth;

      if (resizedWidth > resizedHeight) imageWidth = 110;
      else if (Math.abs(resizedWidth - resizedHeight) < 30) imageWidth = 110;
      else imageWidth = 80;
  
      const aspectRatio = resizedHeight / resizedWidth;
      const autoHeight = imageWidth * aspectRatio;
  
      return { imageData: resizedUrl, imageWidth, autoHeight };
    } catch (error) {
      console.error("Error preparing PDF image data:", error);
      return null;
    }
  };
    
  const generatePdf = async () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a5',
    });
  
    const imagesData = await Promise.all(
      selectedImages.map(async (image) => {
        const { imageData, imageWidth, autoHeight } = await preparePdfImageData(image.download_url);
        return { imageData, imageWidth, autoHeight };
      })
    );
  
    createPdfCatalogue(doc, pdfDataList, website, logo, imagesData, selectedImages, logoName);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
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
              <PdfCatalogueEditor 
                pdfDataList={pdfDataList}
                setPdfDataList={setPdfDataList}
                setLogo={setLogo}
                website={website} 
                setWebsite={setWebsite} 
                logoName={logoName}
                setLogoName={setLogoName}
              />       
            </>}
      </div>
    </>
  );
}

export default PdfCatalogue;