import React from 'react'
import Dropzone from 'react-dropzone'
import './CustomDropZone.css'

export default function CustomDropZone({handleOndrop, acceptedFormats, isRequired = false}) {

    return <>
        <Dropzone onDrop={acceptedFiles => handleOndrop(acceptedFiles)} accept={acceptedFormats}>
            {({getRootProps, getInputProps}) => (
                <div  {...getRootProps({className: 'drop-zone'})}>
                    <input {...getInputProps()} />
                    <p className='drop-zone-text'>
                        {isRequired ? '*Drag and drop or select files' : 'Drag and drop or select files'}
                       
                    </p>
                    <em className='drop-zone-helper-text' >*.jpeg, *.png</em>
                </div>
                
            )}
          
        </Dropzone>
    </>
}

