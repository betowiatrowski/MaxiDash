import * as React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import './style.css';
import { usuarioActions } from '../../../store/usuario';
import { tokenActions } from '../../../store/token';
interface DropdownDetails {
    username: string;
    icon: string;
}

export default function Dropdown(props:DropdownDetails){
    const dispatch = useAppDispatch();
    const handleLougout = () => {
        dispatch(usuarioActions.logout());
        dispatch(tokenActions.logout());
    }

    return(
        <div className='dropdown'>
            <button className='dropbtn'>{props.username}</button>
            <div className='dropdown-content'>
                <div onClick={handleLougout} className='list'>
                    <a href="#">Logout</a>                    
                    <span className='material-icons'>{props.icon}</span>
                </div>
            </div>
        </div>
    );
}