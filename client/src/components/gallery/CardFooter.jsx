import './CardFooter.css';

const keysToMap = ['Title', 'Technique', 'Dimensions', 'Price', 'Notes', 'Storage', 'Cell', 'Position'];

const CardFooter = ({art}) => {

  return <>
    <div className="card-footer-container">
      <div>
        {keysToMap.map(key => {
          const value = art[key.toLowerCase()];
          const displayValue = value
            ? typeof value === 'object' && value.name
              ? value.name
              : value
            : `No ${key.toLowerCase()}`;

          return (
            <p key={key} className="card-footer-item">
              <span className='input-label'>{`${key}: `}</span>
              {displayValue}
            </p>
          );
        })}
      </div>     
    </div>
  </>;  
};

export default CardFooter;