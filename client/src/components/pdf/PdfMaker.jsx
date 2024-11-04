import { useContext, useState } from 'react';
import { Button, Checkbox, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { jsPDF } from "jspdf";
import {EntriesContext} from '../contexts/EntriesContext'
const PdfMaker = () => {
    const [bio, setBio] = useState()
    const [info, setInfo] = useState()
    const [signed, setSigned] = useState(false)

    const {currentImages} = useContext(EntriesContext)
    console.log(currentImages)
    

    const handleChangeBio = (e) => {
        setBio(e.target.value)
    }

    const handleChangeInfo = (e) => {
        setInfo(e.target.value)
    }

    const generatePdf = async () => {
        const doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
      
        const imageUrl = currentImages[0].image_url  // Replace with your image URL
      
        // Convert the image URL to a Base64 string
        const toDataURL = (url) =>
            fetch(url)
                .then((response) => response.blob())
                .then(
                    (blob) =>
                        new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        })
                );
      
        const imageData = await toDataURL(imageUrl);
      
        // Add the image to the PDF
        doc.addImage(imageData, 'JPEG', 10, 20); // Adjust position and size as needed
      
        doc.save("example.pdf");
    };
     
    return (

        <>
            <div style={{margin: '2rem auto', width: '50%'}}>
                <TextField
                    multiline
                    style={{ width: '50vw', minHeight: '100px', marginBottom: '1rem' }}
                    placeholder="Биография..."
                    onChange={(e) => handleChangeBio(e)}
                    value={bio}
                />
                <div style={{display: 'flex'}}>
                    <TextField sx={{width: '20vw'}} multiline placeholder='История на картината...' onChange={(e) => handleChangeInfo(e)}>{info}</TextField>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Checkbox
                            onChange={() => setSigned(prev => !prev)}
                            checked={signed}
                            sx={{
                                marginLeft: '1rem',
                                color: "black",
                                "&.Mui-checked": {
                                    color: "black",
                                },
                            }}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleOutlineIcon />}
                        />
                        <span>Подписана</span>
                        <Button style={{ marginLeft: '3rem', marginRight: '3rem' }} onClick={generatePdf}>Download PDF</Button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PdfMaker