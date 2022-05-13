import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from '../../api/agent';
import Alert from '../../components/Containers/Alert/Alert';
import Button from '../../components/Containers/Button/Button';
import Container from '../../components/Containers/Container/Container';
import Column from '../../components/Containers/Grid/Column/Column';
import Row from '../../components/Containers/Grid/Row/Row';
import TextBox from '../../components/Containers/TextBox/TextBox';
import { DadosUsuario } from '../../models/dadosUsuario';
import { LoginData } from '../../models/login';
import { useAppDispatch } from '../../store/hooks';
import { tokenActions } from '../../store/token';
import { usuarioActions } from '../../store/usuario';
import classes from './Login.module.css';

export default function Login() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertDetail, setAlertDetail] = useState({ type: '', text: '' });
    const dispatch = useAppDispatch();
    const usuarioRef = useRef<HTMLInputElement>(null);
    const senhaRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    
    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('env',process.env.NODE_ENV);

        const dadosLogin:LoginData = {
            matriculaUser: usuarioRef.current!.value,
            senha: senhaRef.current!.value
        };

        agent.Login.login(dadosLogin)
        .then(response => {            
            if (response.status === 200) {

                const user:DadosUsuario = {
                    matriculaUser: dadosLogin.matriculaUser,
                    idPerfil: 0,
                    nomeUser: '',
                    isLoggedIn: true
                }  

                dispatch(tokenActions.setToken(response.data));  
                dispatch(usuarioActions.setUsuario(user));  
                handleLoginSuccessFul(true);                                                                        
            }
        })
        .catch(error => {
            handleLoginSuccessFul(false);
        }) 
    }

    const handleLoginSuccessFul = (isSuccessfull:boolean) => {
       setShowAlert(true);
        if (isSuccessfull) {                         
            setAlertDetail({
                type: 'success',
                text: 'Login efetuado com sucesso. Redirecionando...'
            })
                        
            setTimeout(() => {                               
                navigate(0);    
            }, 3000);
            
       } else {
            setAlertDetail({
                type: 'failure',
                text: 'Usuário ou senha incorretos!'
            })
       }
    }

    return(
        <Container style={{width: '360px', 
                           display: 'flex', padding: '10rem', 
                           margin: '0 auto', justifyContent: 'center', alignItems: 'center'}}
        >
            <form onSubmit={handleLogin} className={classes.login}>
                <Row color='secondary'>
                    <Column hasShadow={false} size='small' style={{flex: '5'}}>
                        <span className={`material-icons ${classes.logo}`}>dashboard</span> 
                    </Column>
                    <Column hasShadow={false} size='small'>
                        <span className={classes.logo}>MaxiDash</span>
                    </Column>                               
                </Row>
                <Row color='secondary'>
                    <Column size='small' hasShadow={false} style={{flex: '5'}}>
                        <span className="material-icons">person</span>
                    </Column>
                    
                    <Column size='small' hasShadow={false}>
                        <TextBox 
                            name='username'
                            type='number'
                            id='user'
                            required={true}
                            ref={usuarioRef}
                            placeholder='Digite sua matricula'
                            style={{textAlign: 'center'}}
                        />
                    </Column>
                </Row>
                <Row color='secondary'>   
                    <Column size='small' hasShadow={false} style={{flex: '5'}}>
                        <span className="material-icons">lock</span>
                    </Column>                 
                    <Column size='small' hasShadow={false}>
                        <TextBox 
                            name='password'
                            type='password'
                            id='password'
                            required={true}
                            ref={senhaRef}
                            placeholder='Digite sua senha'
                            style={{textAlign: 'center'}}
                        />
                    </Column>
                </Row>
                <Row color='secondary'>
                    <Column size='small' hasShadow={false}> 
                        <Button size='full' type='confirm' text={'Login'} />
                    </Column>
                </Row>
                {
                    showAlert ?
                    <Row color='secondary'>
                        <Column hasShadow={false} size={'small'} style={{marginLeft: '15px'}}>
                            <Alert type={alertDetail.type} text={alertDetail.text} />                            
                        </Column>
                    </Row> :

                    null
                }
                
            </form>
            
        </Container>
    );
}