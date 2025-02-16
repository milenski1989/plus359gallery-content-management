import fontkit from '@pdf-lib/fontkit';
import { rgb } from 'pdf-lib';
import { mmToPoints } from './constants';
import { saveAs } from 'file-saver';

export const createCertFirstPageContent = async (pdfDoc, page, font1, font2, image, pdfData) => {

  const { width: pageWidthPoints, height: pageHeightPoints } = page.getSize();

  const titleText = 'Certificate of';
  const titleWidth = font1.widthOfTextAtSize(titleText, 8 * mmToPoints);
  const titleX = (pageWidthPoints - titleWidth) / 2;

  insertText(page, titleText, titleX, pageHeightPoints - 50, 8 * mmToPoints, font1);

  const subTitleText = 'Authenticity';
  const subTitleWidth = font1.widthOfTextAtSize(subTitleText, 8 * mmToPoints);
  const subTitleX = (pageWidthPoints - subTitleWidth) / 2;

  insertText(page, subTitleText, subTitleX, pageHeightPoints - 70, 8 * mmToPoints, font1);

  const { imageData, imageWidth, autoHeight } = await preparePdfImageData(image.download_url, 'A5');
  const jpgImage = await pdfDoc.embedJpg(imageData);
  const imageWidthInPoints = imageWidth * mmToPoints;
  const autoHeightInPoints = autoHeight * mmToPoints;

  let currentY = pageHeightPoints - 105;

  const artistHeaderText = 'Автор | Artist';
  const artistValueText = `${pdfData.artists[0]} | ${pdfData.artists[1]}`;
  const artistHeaderWidth = font2.widthOfTextAtSize(artistHeaderText, 3 * mmToPoints);
  const artistHeaderX = (pageWidthPoints - artistHeaderWidth) / 2;

  insertText(page, artistHeaderText, artistHeaderX, currentY, 3 * mmToPoints, font2);

  currentY -= 15;

  const artistValueWidth = font2.widthOfTextAtSize(artistValueText, 4 * mmToPoints);
  const artistValueX = (pageWidthPoints - artistValueWidth) / 2;

  insertText(page, artistValueText, artistValueX, currentY, 4 * mmToPoints, font2);

  currentY -= 15;

  const imageX = (pageWidthPoints - imageWidthInPoints) / 2;
  insertImage(page, jpgImage, imageX, currentY - autoHeightInPoints, imageWidthInPoints, autoHeightInPoints);

  currentY -= autoHeightInPoints + 20;

  const rows = [
    { text: 'Заглавие на произведението | Artwork', fontSize: 3 * mmToPoints, type: 'header' },
    { text: `${pdfData.titles[0]} | ${pdfData.titles[1]}`, fontSize: 4 * mmToPoints, type: 'content' },
    { text: '', fontSize: 2 * mmToPoints },
    { text: 'Детайли | Details', fontSize: 3 * mmToPoints, type: 'header' },
    { text: `${pdfData.techniques[0]} | ${pdfData.techniques[1]}`, fontSize: 4 * mmToPoints, type: 'content' },
    { text: '', fontSize: 2 * mmToPoints },
    { text: 'Размери | Dimensions', fontSize: 3 * mmToPoints, type: 'header' },
    { text: `${image?.dimensions}`, fontSize: 4 * mmToPoints, type: 'content' },
  ];

  rows.forEach((row) => {
    if (row.text) {
      const rowWidth = font2.widthOfTextAtSize(row.text, row.fontSize);
      const rowX = (pageWidthPoints - rowWidth) / 2;

      insertText(page, row.text, rowX, currentY, row.fontSize, font2);
    }
    currentY -= row.type === 'header' ? 13 : row.fontSize === 2 * mmToPoints ? 10 : 7;
  });

  page.drawRectangle({
    x: 8 * mmToPoints,
    y: 15 * mmToPoints,
    width: 50 * mmToPoints,
    height: 0.25 * mmToPoints,
    color: rgb(0, 0, 0),
  });

  const signatureText = 'Подпис | Signature';

  insertText(page, signatureText, 8 * mmToPoints, 10 * mmToPoints, 3 * mmToPoints, font2);
};

export const createCertSecondPageContent = async (page, font1, pdfData) => {

  const { width: pageWidthPoints, height: pageHeightPoints } = page.getSize();

  const artistHeaderText = 'Автор | Artist';
  const artistValueText = `${pdfData.artists[0]} | ${pdfData.artists[1]}`;
  const artistHeaderWidth = font1.widthOfTextAtSize(artistHeaderText, 3 * mmToPoints);
  const artistHeaderX = (pageWidthPoints - artistHeaderWidth) / 2;

  insertText(page, artistHeaderText, artistHeaderX, pageHeightPoints - 50, 3 * mmToPoints, font1);
    
  const artistValueWidth = font1.widthOfTextAtSize(artistValueText, 4 * mmToPoints);
  const artistValueX = (pageWidthPoints - artistValueWidth) / 2;
  
  insertText(page, artistValueText, artistValueX, pageHeightPoints - 65, 4 * mmToPoints, font1);
  
  // Format Bio Text (Left-Aligned)
  const MAX_TEXT_WIDTH = pageWidthPoints - 25 - 25; // Left and right margins
  const paragraphs = pdfData.bio.split(/\n+/);
  const bioStartY = pageHeightPoints - 90;
  const LINE_SPACING = 10;
  const PARAGRAPH_SPACING = 5;
  let bioY = bioStartY;
      
  paragraphs.forEach((paragraph, pIndex) => {
    // Split each paragraph into lines
    const bioLines = splitTextIntoLines(paragraph, MAX_TEXT_WIDTH, font1, 3 * mmToPoints);
      
    bioLines.forEach((line, lineIndex) => {
      // Optionally, decide not to justify the last line of a paragraph:
      const isLastLine = lineIndex === bioLines.length - 1;
      if (isLastLine) {

        // Draw left-aligned for the last line
        insertText(page, line, 25, bioY, 3 * mmToPoints, font1);
      } else {
        // Draw justified line
        drawJustifiedTextLine(line, bioY, 25, MAX_TEXT_WIDTH, font1, 3 * mmToPoints, page);
      }
      bioY -= LINE_SPACING;
    });
      
    // Add extra spacing between paragraphs if this isn't the last paragraph
    if (pIndex < paragraphs.length - 1) {
      bioY -= PARAGRAPH_SPACING;
    }
  });
      
  const websiteTextWidth = font1.widthOfTextAtSize(pdfData.website, 8);
  const emailTextWidth = font1.widthOfTextAtSize(pdfData.email, 8);

  insertText(page, pdfData.website, pageWidthPoints - 20 - websiteTextWidth, 30, 8, font1);
  insertText(page, pdfData.email, pageWidthPoints - 20 - emailTextWidth, 20, 8, font1);
 
};

export const embedFont = async (font, pdfDoc) => {
  const importedFont = `/fonts/${font}.ttf`;
  const fontBytes = await fetch(importedFont).then(res => res.arrayBuffer());
  pdfDoc.registerFontkit(fontkit);
  const embeddedFont = await pdfDoc.embedFont(fontBytes);

  return embeddedFont;
};

const insertText = (page, text, x, y, fontSize, font) => {
  page.drawText(text, { 
    x: x, 
    y: y, 
    size: fontSize, 
    font: font, 
    color: rgb(0, 0, 0) 
  });
};

export const insertImage = (page, image, x, y, width, height) => {
  page.drawImage(image, { x: x, y: y, width: width, height: height });
};

const splitTextIntoLines = (text, maxWidth, font, fontSize) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";
    
  for (let word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

const drawJustifiedTextLine = (line, y, xStart, maxWidth, font, fontSize, page) => {
  const words = line.split(" ");
  const numberOfGaps = words.length - 1;
  
  // For single-word lines or the last line of a paragraph, simply left-align.
  if (numberOfGaps === 0) {
    page.drawText(line, {
      x: xStart,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    return;
  }
  
  // Calculate the total width of the line without extra spacing
  const wordsWidth = words.reduce((acc, word) => acc + font.widthOfTextAtSize(word, fontSize), 0);
  // Get the natural space width (you may adjust this if needed)
  const spaceWidth = font.widthOfTextAtSize(" ", fontSize);
  const totalNaturalSpaces = spaceWidth * numberOfGaps;
  
  // Calculate extra space to distribute
  const extraSpace = maxWidth - (wordsWidth + totalNaturalSpaces);
  const extraSpacePerGap = extraSpace / numberOfGaps;
  
  // Draw each word with the calculated extra spacing
  let xOffset = xStart;
  words.forEach((word, index) => {
    page.drawText(word, {
      x: xOffset,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    // Increase offset by the width of the word
    xOffset += font.widthOfTextAtSize(word, fontSize);
    // For all but the last word, add a normal space and the extra space
    if (index < numberOfGaps) {
      xOffset += spaceWidth + extraSpacePerGap;
    }
  });
};

export const createCatalogueContent = async (pdfDoc, page, font1, pdfDataList, imagesData, index, website) => {

  const { width: pageWidthPoints, height: pageHeightPoints } = page.getSize();

  insertText(page, `${index + 1}`, 30, pageHeightPoints - 40, 5 * mmToPoints, font1);

  const pdfData = pdfDataList[index];
  const { imageData, imageWidth, autoHeight } = imagesData[index];
  const jpgImage = await pdfDoc.embedJpg(imageData);

  const rows = [
    { text: pdfData.artist, fontSize: 5 },
    { text: pdfData.title, fontSize: 5 },
    { text: pdfData.technique, fontSize: 5 },
    { text: pdfData.dimensions, fontSize: 5 },
  ];

  const TEXT_SPACING = 15;
  const IMAGE_TO_TEXT_SPACING = 40;

  const imageWidthInPoints = imageWidth * mmToPoints;
  const imageHeightInPoints = autoHeight * mmToPoints;

  const rowsHeight = rows.length * TEXT_SPACING;
  const groupHeight = rowsHeight + IMAGE_TO_TEXT_SPACING + imageHeightInPoints;
  const groupBottomY = (pageHeightPoints - groupHeight) / 2;

  const imageY = groupBottomY + rowsHeight + IMAGE_TO_TEXT_SPACING;
  const imageX = (pageWidthPoints - imageWidthInPoints) / 2;

  insertImage(page, jpgImage, imageX, imageY, imageWidthInPoints, imageHeightInPoints);

  let currentY = groupBottomY + rowsHeight;
  rows.forEach((row) => {

    insertText(page, row.text, imageX, currentY, row.fontSize * mmToPoints, font1);
    currentY -= TEXT_SPACING;
  });

  const websiteTextWidth = font1.widthOfTextAtSize(website, 10);

  insertText(page, website, pageWidthPoints - 20 - websiteTextWidth, 20, 10, font1);
};

export const convertPdfToBlob = async (pdfDoc) => {
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return {blob, url};
};

export const savePdfOnMobile = (pdfBlob, fileType) => {
  if (pdfBlob) saveAs(pdfBlob, `${fileType}.pdf`);
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

export const handleOndrop = async (acceptedFiles, updateLogo) => {
  for (const file of acceptedFiles) {
    const base64Url = await fileToBase64(file);
    const result = await loadAndResizeImage(base64Url, 700);
    updateLogo({url: result.resizedUrl, width: result.resizedWidth, height: result.resizedHeight});
  }
};

export const preparePdfImageData = async (imageUrl, format = 'A4') => {
  if (!imageUrl) {
    console.error("Image URL is missing.");
    return null;
  }
  
  try {
    const { resizedWidth, resizedHeight, resizedUrl } = await loadAndResizeImage(imageUrl);

    let imageWidth;

    if (resizedWidth > resizedHeight) {
      if (format === 'A5') imageWidth = 110;
      else imageWidth = 150;
    }  else if  (Math.abs(resizedWidth - resizedHeight) < 30) {
      if (format === 'A5') imageWidth = 95;
      else imageWidth = 150;
    }  else {
      if (format === 'A5') imageWidth = 60;
      else imageWidth = 110;
    } 
  
    const aspectRatio = resizedHeight / resizedWidth;
    const autoHeight = imageWidth * aspectRatio;
  
    return { imageData: resizedUrl, imageWidth, autoHeight };
  } catch (error) {
    console.error("Error preparing PDF image data:", error);
    return null;
  }
};

