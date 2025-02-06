import { ralewayMedium } from "../../../../public/fonts/Raleway-medium";
import {cinzelDecorativeNormal} from "../../../../public/fonts/CinzelDecorative-normal";
import { CONTENT_SPACING, EXTRA_CONTENT_SPACING, HEADER_FONT_SIZE, IMAGE_Y_POSITION_CATALOGUE, logoSize, SECOND_PAGE_MAX_WIDTH, SECOND_PAGE_VERTICAL_OFFSET, SECTION_CONTENT_FONT_SIZE, SECTION_HEADER_FONT_SIZE, SECTION_SPACING, SIGNATURE_FONT_SIZE } from "../helpers/constants";

export const createPdfCertificatePageOne = (doc, pdfData, imageData, imageWidth, autoHeight, selectedImage) => {

  // if (logoName.includes('collect')) doc.addImage(pdfData.logo, 'JPEG', 7, -1, collectLogoSize.width, collectLogoSize.height);
  // else if (logoName.includes('plus359')) doc.addImage(pdfData.logo, 'JPEG', 6, 7, plus359LogoSize.width, plus359LogoSize.height);
  // else if (logoName.includes('mhg')) doc.addImage(pdfData.logo, 'JPEG', 0, 10, mhgLogoSize.width, mhgLogoSize.height);
  doc.addImage(pdfData.logo, 'JPEG', 0, 0, logoSize.width, logoSize.height);

  doc.setFontSize(HEADER_FONT_SIZE);

  doc.addFileToVFS('CinzelDecorative-normal.ttf', cinzelDecorativeNormal);
  doc.addFont('CinzelDecorative-normal.ttf', 'CinzelDecorative', 'normal');
  doc.setFont("CinzelDecorative", "normal");

  doc.text("Certificate of", 74, 15, null, null, 'center');
  doc.text("Authenticity", 74, 22, null, null, 'center');

  doc.addFileToVFS("Raleway-Medium.ttf", ralewayMedium);
  doc.addFont("Raleway-Medium.ttf", "Raleway", "medium");
  doc.setFont("Raleway", "medium");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  const artistHeaderText = 'Автор | Artist';
  const artistValueText = `${pdfData.artists[0]} | ${pdfData.artists[1]}`;
  
  const artistSectionSpacing = 5;
  const gapAfterArtist = 5;
  const gapAfterImage = 10;
  
  const rows = [
    { text: 'Заглавие на произведението | Artwork', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
    { text: `${pdfData.titles[0]} | ${pdfData.titles[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
    { text: 'Детайли | Details', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
    { text: `${pdfData.techniques[0]} | ${pdfData.techniques[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
    { text: 'Размери | Dimensions', fontSize: SECTION_HEADER_FONT_SIZE, type: 'header' },
    { text: `${selectedImage?.dimensions}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },
  ];

  //    { text: `${pdfData.notes[0]} | ${pdfData.notes[1]}`, fontSize: SECTION_CONTENT_FONT_SIZE, type: 'content' },

  let rowsHeight = 0;
  rows.forEach((row, index) => {
    rowsHeight += row.type === 'header' ? SECTION_SPACING : CONTENT_SPACING;
    const nextRow = rows[index + 1];
    if (nextRow && nextRow.type === 'header' && row.type !== 'header') {
      rowsHeight += EXTRA_CONTENT_SPACING;
    }
  });
  
  const groupTotalHeight = artistSectionSpacing + gapAfterArtist + autoHeight + gapAfterImage + rowsHeight;
  
  const groupStartY = (pageHeight - groupTotalHeight) / 2 + 6;
  
  let currentY = groupStartY;
  
  doc.setFontSize(SECTION_HEADER_FONT_SIZE);
  doc.text(artistHeaderText, 74, currentY, null, null, 'center');
  currentY += SECTION_SPACING;
  
  doc.setFontSize(SECTION_CONTENT_FONT_SIZE);
  doc.text(artistValueText, 74, currentY, null, null, 'center');
  currentY += (artistSectionSpacing - SECTION_SPACING);
  
  currentY += gapAfterArtist;
  
  const xPosition = (pageWidth - imageWidth) / 2;
  
  doc.addImage(imageData, 'JPEG', xPosition, currentY, imageWidth, autoHeight);
  
  currentY += autoHeight;
  currentY += gapAfterImage;
  
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
  doc.text('Подпис | Signature', 10, 200, {
    halign: 'left',
    valign: 'middle',
  });
};

export const createCertificatePageTwo = (doc, pdfData) => {

  doc.addPage();

  doc.addFileToVFS("Raleway-Medium.ttf", ralewayMedium);
  doc.addFont("Raleway-Medium.ttf", "Raleway", "medium");
  doc.setFont("Raleway", "medium");

  doc.setFontSize(SECTION_HEADER_FONT_SIZE);
        
  doc.text('Автор | Artist', 74, 15, null, null, 'center');
  doc.setFontSize(SECTION_CONTENT_FONT_SIZE);

  doc.text(`${pdfData.artists[0]} | ${pdfData.artists[1]}`, 74, 20, null, null, 'center');

  const textlines = doc.setFont('Raleway', 'medium')
    .setFontSize(8)
    .splitTextToSize(pdfData.bio, SECOND_PAGE_MAX_WIDTH);

  const pageWidth = doc.internal.pageSize.width;
  const textWidth = Math.max(...textlines.map(line => doc.getTextWidth(line)));
  const xPosition = (pageWidth - textWidth) / 2;

  let verticalOffset = SECOND_PAGE_VERTICAL_OFFSET;

  doc.text(xPosition, verticalOffset + 10 / 72, textlines);

  verticalOffset += (textlines.length + 1) * 10 / 72;

  //const emailWebsite = `${pdfData.website} | ${pdfData.email}`;

  const websiteTextWidth = doc.getTextWidth(pdfData.website);
  const emailTextWidth = doc.getTextWidth(pdfData.email);

  const rightAlignedWebsite = pageWidth - 15 - websiteTextWidth;
  const rightAlignedEmail = pageWidth - 15 - emailTextWidth;

  doc.setFontSize(10);
  doc.text(rightAlignedWebsite, 200 + 10 / 72, pdfData.website);
  doc.text(rightAlignedEmail, 205 + 10 / 72, pdfData.email);

  // if (logoName.includes('collect')) doc.addImage(pdfData.logo, 'JPEG', 10, 185, collectLogoSize.width, collectLogoSize.height);
  // else if (logoName.includes('plus359')) doc.addImage(pdfData.logo, 'JPEG', 10, 190, plus359LogoSize.width, plus359LogoSize.height);
  // else if (logoName.includes('mhg')) doc.addImage(pdfData.logo, 'JPEG', 4, 180, mhgLogoSize.width, mhgLogoSize.height);
  // else doc.addImage(pdfData.logo, 'JPEG', -4, 178, chartaLogoSize.width, chartaLogoSize.height);
  
  doc.addImage(pdfData.logo, 'JPEG', (pageWidth - logoSize.width) / 2 , 180, logoSize.width, logoSize.height);
};

export const createPdfCatalogue = (doc, pdfDataList, website, logo, imagesData, selectedImages, logoName) => {
  
  doc.addFileToVFS("Raleway-Medium.ttf", ralewayMedium);
  doc.addFont("Raleway-Medium.ttf", "Raleway", "medium");
  doc.setFont("Raleway", "medium");

  selectedImages.forEach((selectedImage, index) => {
    if (index > 0) {
      doc.addPage();
    }

    const pdfData = pdfDataList[index];
    const { imageData, imageWidth, autoHeight } = imagesData[index];
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const xPosition = (pageWidth - imageWidth) / 2;
    let currentY;

    doc.setFontSize(SECTION_CONTENT_FONT_SIZE);
    doc.text(`${index + 1}`, 10, 10, null, null, "left");

    const rows = [
      { text: `${pdfData.artist}`, fontSize: SECTION_CONTENT_FONT_SIZE },
      { text: `${pdfData.title}`, fontSize: SECTION_CONTENT_FONT_SIZE },
      { text: `${pdfData.technique}`, fontSize: SECTION_CONTENT_FONT_SIZE },
      { text: `${pdfData.dimensions}`, fontSize: SECTION_CONTENT_FONT_SIZE },
    ];

    const rowsHeight = rows.length * CONTENT_SPACING;
    const totalHeight = autoHeight + rowsHeight + 15; 
    if (imageWidth > autoHeight) {
      currentY = (pageHeight - autoHeight) / 2 + autoHeight;
      doc.addImage(imageData, "JPEG", xPosition, (pageHeight - totalHeight) / 2, imageWidth, autoHeight);
    } else {
      currentY = IMAGE_Y_POSITION_CATALOGUE + autoHeight + 30;
      doc.addImage(imageData, "JPEG", xPosition, (pageHeight - totalHeight) / 2, imageWidth, autoHeight); 
    }

    rows.forEach((row) => {
      doc.setFontSize(row.fontSize);
      doc.text(row.text, xPosition, currentY, null, null, "left");
      currentY += CONTENT_SPACING;
    });

    doc.setFontSize(10);
    doc.text(5, pageHeight - 5, `${website}`);

    const logoMargin = 5;

    let logoXPos;
    let logoYPos;

    if (logoName.includes('collect')) {
      logoXPos = pageWidth - logoMargin - 30;
      logoYPos = pageHeight + logoMargin - 30;
      doc.addImage(logo, 'JPEG', logoXPos, logoYPos, logoSize.width, logoSize.height);
    } else if (logoName.includes('plus359')) {
      logoXPos = pageWidth - logoMargin - 25;
      logoYPos = pageHeight - logoMargin - 20;
      doc.addImage(logo, 'JPEG', logoXPos, logoYPos, logoSize.width, logoSize.height);
    }  else if (logoName.includes('mhg')) {
      logoXPos = pageWidth - logoMargin - 15;
      logoYPos = pageHeight - logoMargin - 27;
      doc.addImage(logo, 'JPEG', logoXPos, logoYPos, logoSize.width, logoSize.height);
    } else {
      console.log('here');
      logoXPos = pageWidth + logoMargin - 30;
      logoYPos = pageHeight + logoMargin - 35;
      doc.addImage(logo, 'JPEG', logoXPos, logoYPos, logoSize.width, logoSize.height);
    }
  });
};

export const loadAndResizeImage = (url, targetWidth = 1000) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const targetHeight = targetWidth * aspectRatio;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const resizedImageUrl = canvas.toDataURL("image/jpeg");

      resolve({
        resizedWidth: targetWidth,
        resizedHeight: targetHeight,
        resizedUrl: resizedImageUrl,
      });
    };
  });
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    
    reader.readAsDataURL(file);
  });
};

export const handleOndrop = async (acceptedFiles, updatePdfData, key = null, updateLogoName) => {
  for (const file of acceptedFiles) {
    const base64Url = await fileToBase64(file);
    const result = await loadAndResizeImage(base64Url);

    if (key) {
      updatePdfData(key, result.resizedUrl);
    } else {
      updatePdfData(result.resizedUrl);
    }

    if (updateLogoName) {
      updateLogoName(file.name);
    }
  }
};

