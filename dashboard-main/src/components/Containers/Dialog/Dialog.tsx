import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import classes from './Dialog.module.css';

interface DialogDetails {
    title: string;    
    show: boolean;
    type: string;
    description?: string; 
    confirmationClick: React.MouseEventHandler<HTMLButtonElement>;
    cancelationClick?: React.MouseEventHandler<HTMLButtonElement>;    
}

export default function Dialog(props:DialogDetails) {

    return(
        <div className={classes.dialog}>
            <h2>{props.title}</h2>
            <span><strong>Último erro {'=>'} </strong> {props.description}</span>
            <div className={classes.buttons}>
                <Button click={props.confirmationClick} size='half' type='confirm' text='Confirma'/>
                {
                    props.type === 'question' ?
                    <Button click={props.cancelationClick} size='half' type='cancel' text='Cancela'/>
                    :
                    null
                }                
            </div>
        </div>
    )
}