import classes from './Alert.module.css';

interface AlertDetail {
    type: string;
    text: string;
}

export default function Alert(props:AlertDetail) {
    return(
        <div className={props.type === 'failure' ? classes.failure : classes.success}>
            {props.text}
        </div>
    );
}