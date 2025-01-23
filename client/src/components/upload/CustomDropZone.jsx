import Dropzone from 'react-dropzone';
import './CustomDropZone.css';

export default function CustomDropZone({handleOndrop, acceptedFormats, isRequired = false, classes, customText}) {

  const classNames = classes ? classes.join(' ') : '';

  return <>
    <Dropzone onDrop={acceptedFiles => handleOndrop(acceptedFiles)} accept={acceptedFormats}>
      {({getRootProps, getInputProps}) => (
        <div  {...getRootProps({className: `drop-zone ${classNames}`})}>
          <input {...getInputProps()} />
          <p className='drop-zone-text'>
            {isRequired ? `*${customText}` : customText}
                       
          </p>
          <em className='drop-zone-helper-text' >*.jpeg, *.png</em>
        </div>
                
      )}
          
    </Dropzone>
  </>;
}

