import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import agent from "../../../api/agent";
import Button from "../../../components/Containers/Button/Button";
import Container from "../../../components/Containers/Container/Container";
import Column from "../../../components/Containers/Grid/Column/Column"
import Row from "../../../components/Containers/Grid/Row/Row"
import TextBox from "../../../components/Containers/TextBox/TextBox";
import { ControleAplicacao } from "../../../models/controleAplicacao";
import classes from './ApplicationDetails.module.css';
import { spinnerlActions } from "../../../store/spinner";
import { useAppDispatch } from "../../../store/hooks";
import Dialog from "../../../components/Containers/Dialog/Dialog";
import { ControleAplicacoesAgendamento } from "../../../models/controleAplicacoesAgendamento";
import { ajustaData } from '../../../helpers/date';

interface ApplicationDetailsProps {
    isAdding?: boolean;
}

export default function ApplicationDetails(props:ApplicationDetailsProps) {
    const [tiposAplicacoes, setTiposAplicacoes] = useState<string[]>([])
    const nomeAppRef = useRef<HTMLFormElement>(null);
    const descAppRef = useRef<HTMLFormElement>(null);
    const habilitadoAppRef = useRef<HTMLFormElement>(null);
    const ultimaExecucaoAppRef = useRef<HTMLFormElement>(null);
    const horarioAgendamentoRef = useRef<HTMLFormElement>(null);
    const tipoRef = useRef<HTMLFormElement>(null);
    const dispatch = useAppDispatch();
    const [primeiroCarregamento, setPrimeiroCarregamento] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [aplicacao, setAplicacao] = useState<ControleAplicacao>();
    const aplicacaoNewIdRef = useRef('');
    const [agendamentos, setAgendamentos] = useState<ControleAplicacoesAgendamento[]>([]);
    const [agendamentosRemovidos, setAgendamentosRemovidos] = useState<ControleAplicacoesAgendamento[]>([]);
    const [agendamentosAdicionados, setAgendamentosAdicionados] = useState<ControleAplicacoesAgendamento[]>([]);
    const [horarioAgendamentoRequired, setHorarioAgendamentoRequired] = useState(false);
    const [erro, setErro] = useState('');
    const params = useParams();
    const navigate = useNavigate();    

    const handleCancel = () => {
        navigate('/sistemas');
    }

    const preencheTiposAplicacoes = () => {
        agent.ControleAplicacoes.tipos()
        .then(response => {
            setTiposAplicacoes(response.data);
        })
        .catch(error => {
            console.log(error);            
        })
    }

    useEffect(() => {    
        preencheTiposAplicacoes();
        
        if (!props.isAdding) {            
            if (primeiroCarregamento) {
                dispatch(spinnerlActions.show(true));
            }
            agent.ControleAplicacoesAgendamentos.getAll(params.id!.toString())
            .then(response => {            
                setAgendamentos(response.data);                        
            })
            .catch(error => {
                console.log(error);            
            })

            agent.ControleAplicacoes.details(params.id!.toString())
            .then((response) => {
                const app = response.data;                       
                setAplicacao(app);
                nomeAppRef.current!.value = app.nome;
                descAppRef.current!.value = app.descricao;
                ultimaExecucaoAppRef.current!.value = ajustaData(app.ultimaExecucao!,'full');
                habilitadoAppRef.current!.checked = app.habilitado;
                tipoRef.current!.value = app.tipo;
            })
            .catch((error) => {
                console.log(error);            
            })
            .finally(() => {
                if (primeiroCarregamento) {
                    dispatch(spinnerlActions.show(false));                
                    setPrimeiroCarregamento(false);
                } 
            })
        } else {
            if (aplicacao === undefined) {
                setAplicacao({
                    descricao: undefined,
                    habilitado: true,
                    nome: '',
                    id: uuidv4(),
                    ultimoErroVerificado: true,
                    tipo: undefined
                });
            }            
        }
    }, [aplicacao?.id])  

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {                        
        e.preventDefault();
        
        dispatch(spinnerlActions.show(true));

        if (!props.isAdding) {        
            agent.ControleAplicacoes.update(aplicacao!.id!.toString(), aplicacao!)
            .then(() => {            
                dispatch(spinnerlActions.show(false));
                setErro('');
                setShowDialog(true);
            })
            .then(() => {
                removeAgendamentos();
                adicionaAgendamentos();
                limpaDados();
            })
            .catch(error => {
                setErro(`Ocorreu um erro ao atualizar a aplicação ${aplicacao?.nome}`)
                setShowDialog(true);
                console.log("erro na atualização da aplicacao " + error);            
            })    
            .finally(() => {                        
                dispatch(spinnerlActions.show(false));
            })
        } else {

            agent.ControleAplicacoes.create({
                habilitado: true,
                nome: aplicacao!.nome,
                descricao: aplicacao!.descricao,
                ultimoErroVerificado: true,
                tipo: aplicacao!.tipo
            })
            .then(response => {      
                setAplicacao(response.data);
                aplicacaoNewIdRef.current = response.data.id!;
                dispatch(spinnerlActions.show(false));
                setErro('');                
            })
            .then(() => {
                removeAgendamentos();
                adicionaAgendamentos();
                limpaDados();
            })
            .catch(error => {
                setErro(`Ocorreu um erro ao inserir a aplicação ${aplicacao?.nome}`)
                setShowDialog(true);
                console.log("erro na inserção da aplicacao " + error);            
            })    
            .finally(() => {                        
                dispatch(spinnerlActions.show(false));
                setShowDialog(true);
            })
        }
    }

    const fechaDialog = () => {
        setShowDialog(false);
    }

    const handleOnChange = (field: string, e: React.ChangeEvent<HTMLFormElement>) => {

        if (field === 'nome') {
            aplicacao!.nome = e.target.value;
        } else if (field === 'descricao') {
            aplicacao!.descricao = e.target.value;
        } else if (field === 'habilitado') {            
            aplicacao!.habilitado = e.target.checked;
        } else if (field === 'tipo') {            
            aplicacao!.tipo = e.target.value;
        } 
    }
    
    const handleAdicionaAgendamento = () => {
        setHorarioAgendamentoRequired(true);
        if (horarioAgendamentoRef.current!.value !== '') {        
            const hora = horarioAgendamentoRef.current!.value;          

            const agendamento:ControleAplicacoesAgendamento = {
                horarioAgendamento: `${hora.toString().split(':')[0]}:${hora.toString().split(':')[1]}`,
                horarioAgendamentoString: hora,
                idControleAplicacoes: parseInt(aplicacao!.id!),
                id: uuidv4()
            };

            setAgendamentos([...agendamentos, agendamento]);
            setAgendamentosAdicionados([...agendamentosAdicionados, agendamento]);            
        }
        setHorarioAgendamentoRequired(false);
    }

    const handleRemoveAgendamento = (id: string) => {
        const agendamentosCopy = agendamentos.filter((el) => {
            return el.id !== id;
        })

        const agendamentoRemovido = agendamentos.find((el) => {
            return el.id === id;
        }) 

        setAgendamentos(agendamentosCopy);
        setAgendamentosRemovidos([...agendamentosRemovidos, agendamentoRemovido!])
        horarioAgendamentoRef.current!.value = '';
    }

    const adicionaAgendamentos = () => {
        agendamentosAdicionados.forEach((element, index) => {
            agent.ControleAplicacoesAgendamentos.create({
                horarioAgendamento: element.horarioAgendamentoString!,
                idControleAplicacoes: props.isAdding ? parseInt(aplicacaoNewIdRef.current) : parseInt(aplicacao!.id!)
            })
            .then(response => {
                const agendamentoCriado = response.data;
                let agendamentosCopy = [...agendamentos];
                agendamentosCopy[index].id = agendamentoCriado.id;
                setAgendamentos(agendamentosCopy);
            })
            .catch((error) => {
                console.log('erro ao adicionar agendamento', error);
            })
        });
    }

    const removeAgendamentos = () => {
        agendamentosRemovidos.forEach(element => {
            agent.ControleAplicacoesAgendamentos.delete(element.id!.toString())
            .catch(error => {
                console.log(error);
            })    
        });        
    }

    const limpaDados = () => {
        setAgendamentosAdicionados([]);
        setAgendamentosRemovidos([]);        
    }

    return(
        <Container>
            <Row color="neutral">
                <Column size='medium'> 
                    <div> 
                        <h3>Aplicação</h3>
                    </div>
                    <form className={classes.form} onSubmit={(event:React.FormEvent<HTMLFormElement>) => handleUpdate(event)}>
                                                
                        <Row color="secondary">
                            <Column size="small"><label>Nome:</label></Column>
                            <Column size="small">
                                <TextBox 
                                    id='nome'
                                    name='nome'
                                    placeholder="Informe o nome da aplicação"
                                    required={true}
                                    type="text"                            
                                    ref={nomeAppRef}
                                    //value={aplicacao?.nome}
                                    onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('nome', e)}
                                    class={classes.busca}
                                />
                            </Column>
            
                        </Row>       
                        <Row color="secondary">
                            <Column size="small"><label>Tipo:</label></Column>
                            <Column size="small">
                                <TextBox 
                                    list="tipo-aplicacao"
                                    id='tipo'
                                    name='tipo'
                                    placeholder="Informe o tipo da aplicação"
                                    required={true}
                                    type="text"                            
                                    ref={tipoRef}
                                    //value={aplicacao?.nome}
                                    onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('tipo', e)}
                                    class={classes.busca}
                                />
                                <datalist id="tipo-aplicacao">
                                    {
                                        tiposAplicacoes.map(t => 
                                            <option key={t} value={t} />
                                        )
                                    }                                                                        
                                </datalist>
                            </Column>
            
                        </Row> 
                        <Row color="secondary">
                            <Column size="small" style={{height:'240px', justifyContent: 'start'}}><label>Descrição:</label></Column>
                            <Column size="small" style={{height:'240px'}}>
                                <TextBox 
                                    style={{height:'190px'}}
                                    id='descricao'
                                    name='descricao'
                                    placeholder="Informe a descrição detalhada sobre o que a aplicação é responsável"
                                    required={true}
                                    type="textarea"                            
                                    ref={descAppRef}     
                                    //value={aplicacao?.descricao}                               
                                    onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('descricao', e)}
                                />
                            </Column>
                            
                        </Row>                              
                        <Row color="secondary">
                            <Column size="small" style={{height:'150px', justifyContent: 'start'}}>
                                <label>Adicionar agendamento:</label>
                            </Column>
                            
                            <Column size="small" style={{height:'150px', justifyContent: 'start'}}>
                                <TextBox     
                                    style={{marginTop: '5px', textAlign: 'center', height: '15px'}}  
                                    id='agendamento'
                                    name='agendamento'
                                    placeholder=""
                                    required={horarioAgendamentoRequired}
                                    type="time"                                                        
                                    onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('agendamentos', e)}
                                    ref={horarioAgendamentoRef}
                                />
                            </Column>
                            <Column size="small" style={{height:'150px', justifyContent: 'start', alignItems: 'start'}}>
                                <span onClick={handleAdicionaAgendamento} className={`material-icons ${classes.add}`}>add_circle_outline</span>
                            </Column>
                            <Column size="small" style={{height:'150px', justifyContent: 'space-between', alignItems: 'start'}}>
                                <ul className={classes.horarios}>
                                    {   
                                        agendamentos.length > 0 ?                     
                                        agendamentos.map(agendamento => (                                            
                                            <li key={agendamento.id}>
                                                <Row color="primary" key={agendamento.id}>
                                                    <Column size="small" hasShadow={false} style={{paddingLeft: 0, pointerEvents: 'none'}}>
                                                        <TextBox     
                                                            style={{marginTop: 0, textAlign: 'center', height: '15px', width:'100px'}}  
                                                            id={agendamento.id! }
                                                            name={agendamento.id!}
                                                            required={false}
                                                            placeholder=""
                                                            type="time"    
                                                            onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('horarios', e)}
                                                            value={agendamento.horarioAgendamentoString}
                                                        />
                                                    </Column>
                                                    <Column size="small"  hasShadow={false}>
                                                        <span onClick={() => handleRemoveAgendamento(agendamento.id!)} className={`material-icons ${classes.close}`}>close</span>
                                                    </Column>
                                                </Row>
                                            </li>
                                            
                                        ))
                                        : null
                                    }                                    
                                </ul>                                    
                            </Column>
                        </Row>     
                        <Row color="secondary">
                            <Column size="small"><label>Habilitado:</label></Column>
                            <Column size="small">
                                <TextBox                                     
                                    id='habilitado'
                                    name='habilitado'
                                    placeholder=""
                                    required={false}
                                    type="checkbox"                            
                                    ref={habilitadoAppRef}
                                    //value={aplicacao?.habilitado}
                                    onChange={(e: React.ChangeEvent<HTMLFormElement>) => handleOnChange('habilitado', e)}
                                />
                            </Column>
                            <Column size="small"><label>Última execução:</label></Column>
                            <Column size="small">
                                <TextBox                                     
                                    id='ultima-execucao'
                                    name='ultima-execucao'
                                    placeholder=""
                                    required={true}
                                    type="text"                            
                                    ref={ultimaExecucaoAppRef}
                                    readOnly={true}
                                />
                            </Column>
                        </Row>
                        <Row color="primary" style={{justifyContent:'end'}}>                                                        
                            <Button click={handleCancel} text="Cancelar" type="cancel" size="small"/>
                            <Button text="Salvar" type="confirm" size="small"/>                            
                        </Row> 
                    </form>
                </Column>
            </Row>
            {
                showDialog ?
                <Dialog type='confirmation' 
                        confirmationClick={fechaDialog}                         
                        show={true} 
                        title={erro === '' ? `Aplicação ${aplicacao?.nome} foi ${props.isAdding ? 'inserida' : 'atualizada'} com sucesso.` : erro}/>
                :
                null
            }
        </Container>
    );
} 