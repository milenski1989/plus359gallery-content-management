import { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { jsPDF } from "jspdf";
import { EntriesContext } from '../contexts/EntriesContext';
import '../../fonts/Raleway';
import Editor from './Editor';

import './PdfMaker.css';
import useNotification from '../hooks/useNotification';
import Message from '../reusable/Message';
import { CONTENT_SPACING, EXTRA_CONTENT_SPACING, HEADER_FONT_SIZE, IMAGE_Y_POSITION, SECOND_PAGE_MAX_WIDTH, SECOND_PAGE_VERTICAL_OFFSET, SECTION_CONTENT_FONT_SIZE, SECTION_HEADER_FONT_SIZE, SECTION_SPACING, SIGNATURE_FONT_SIZE } from './pdfSizes';

const PdfMaker = () => {

  const {showError, error} = useNotification();
  const { currentImages } = useContext(EntriesContext);
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

  const helperText = `${pdfData.bio.length}/2700`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      generatePdf();
    }, 2000);

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
  
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({
          naturalWidth: img.width,
          naturalHeight: img.height,
        });
      };
    });
  };

  const toDataURL = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
  
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log(error);
      showError('Failed to load image for the PDF, please, check your connection!');
    }
  };

  const preparePdfImageData = async () => {
    try {
      const imageUrl = selectedImage?.image_url;
      const imageData = await toDataURL(imageUrl);
      const imageWidth = 50;
      
      const { naturalWidth, naturalHeight } = await loadImage(imageUrl);
      
      const aspectRatio = naturalHeight / naturalWidth;
      const autoHeight = imageWidth * aspectRatio;
      return { imageData, imageWidth, autoHeight };
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

    doc.addImage(pdfData.logo, 'JPEG', 10, 10, 15, 15);

    doc.setFontSize(HEADER_FONT_SIZE);
    doc.setFont('Raleway', 'normal');
    doc.text("CERTIFICATE OF", 74, 15, null, null, 'center');
    doc.text("AUTHENTICITY", 74, 22, null, null, 'center');

    doc.setFontSize(SECTION_HEADER_FONT_SIZE);
    doc.text('Автор | Artist', 74, 30, null, null, 'center');
    doc.setFontSize(SECTION_CONTENT_FONT_SIZE);

    doc.text(`${pdfData.artists[0]} | ${pdfData.artists[1]}`, 74, 35, null, null, 'center');

    const pageWidth = doc.internal.pageSize.width;

    const xPosition = (pageWidth - imageWidth) / 2;

    doc.addImage(imageData, 'JPEG', xPosition, IMAGE_Y_POSITION, imageWidth, autoHeight);

    const rows = [
      { text: 'Заглавие на произведението | Artwork', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
      { text: `${pdfData.titles[0]} | ${pdfData.titles[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
      { text: 'Детайли | Details', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
      { text: `${pdfData.techniques[0]} | ${pdfData.techniques[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
      { text: `${pdfData.notes[0]} | ${pdfData.notes[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
      { text: 'Размери | Dimensions', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
      { text: `${selectedImage?.dimensions}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
    ];

    // const targetRowIndex = rows.findIndex(
    //     (row) => row.text === `${notes[0]} | ${notes[1]}`
    // );

    // if (targetRowIndex !== -1) {
    //     const additionalRows = [
    //         { text: 'Доп ред 1 | Add Row 1', fontSize: sectionContentFontSize, type: 'content' },
    //         { text: 'Доп ред 2 | Add Row 2', fontSize: sectionContentFontSize, type: 'content' },
    //     ];
    //     rows.splice(targetRowIndex + 1, 0, ...additionalRows);
    // }

    let currentY = IMAGE_Y_POSITION + autoHeight + 5;

    rows.forEach((row, index) => {
      doc.setFontSize(row.fontSize);
      doc.text(row.text, 74, currentY, null, null, 'center');

      if (row.type === 'header') {
        currentY += SECTION_SPACING;
      } else {
        const nextRow = rows[index + 1];
        if (nextRow && nextRow.type === 'header') {
          currentY += EXTRA_CONTENT_SPACING;
        } else {
          currentY += CONTENT_SPACING;
        }
      }
    });

    doc.rect(10, 195, 50, (0.1 / doc.internal.scaleFactor));
    doc.setFontSize(SIGNATURE_FONT_SIZE);
    doc.text('Подпис', 10, 200, {
      halign: 'left',
      valign: 'middle',
    });
    if (pdfData.bio) {
      // PAGE 2
      doc.addPage();

      doc.setFont('Raleway', 'normal');
      doc.setFontSize(SECTION_HEADER_FONT_SIZE);
            
      doc.text('Автор | Artist', 74, 15, null, null, 'center');
      doc.setFontSize(SECTION_CONTENT_FONT_SIZE);

      doc.text(`${pdfData.artists[0]} | ${pdfData.artists[1]}`, 74, 20, null, null, 'center');

      const textlines = doc.setFont('Raleway', 'normal')
        .setFontSize(10)
        .splitTextToSize(pdfData.bio, SECOND_PAGE_MAX_WIDTH);

      const pageWidth = doc.internal.pageSize.width;
      const textWidth = Math.max(...textlines.map(line => doc.getTextWidth(line)));
      const xPosition = (pageWidth - textWidth) / 2;

      let verticalOffset = SECOND_PAGE_VERTICAL_OFFSET;

      doc.text(xPosition, verticalOffset + 10 / 72, textlines);

      verticalOffset += (textlines.length + 1) * 10 / 72;

      const textToAlign = `${pdfData.website} | ${pdfData.email}`;
      const textToAlignWidth = doc.getTextWidth(textToAlign);
      const rightAlignedXPosition = pageWidth - 10 - textToAlignWidth;

      doc.setFontSize(10);
      doc.text(rightAlignedXPosition, 205 + 10 / 72, textToAlign);

      doc.addImage(pdfData.logo, 'JPEG', 10, 190, 15, 15);
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    //doc.save("example.pdf");
  };

  return (
    <>
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
            <Editor 
              pdfData={pdfData}
              updatePdfData={updatePdfData}
              handleSwap={handleSwap}
              helperText={helperText}
            />       
          </>}
      </div>
    </>
  );
};

export default PdfMaker;