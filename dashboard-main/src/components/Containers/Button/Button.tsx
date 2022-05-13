
import './style.css'

interface ButtonDetail {
    text: string;
    type: string;
    size: string;
    style?: React.CSSProperties;
    click?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props:ButtonDetail) {
    return(
        <button 
            style={props.style}
            onClick={props.click}
            className={`btn ${props.type} ${props.size}`} 
            type='submit'>{props.text}
        </button>
    );
}