import * as React from 'react';
import { ReactNode } from 'react';
import './style.css';

type Props = {
    children: ReactNode;
    style? : React.CSSProperties;
}

export default function Container(props:Props) {   

    return(
        <div className='Container' style={props.style}>
            {props.children}
        </div>
    );
}