import React, { useEffect, useRef, useState } from 'react';
import agent from '../../api/agent';
import { ControleAplicacao } from '../../models/controleAplicacao';
import Container from '../../components/Containers/Container/Container';
import Column from '../../components/Containers/Grid/Column/Column';
import Row from '../../components/Containers/Grid/Row/Row';
import './style.css';
import { modalActions } from '../../store/modal';
import { notificationActions } from '../../store/notification';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogControleAplicacao } from '../../models/logControleAplicacao';
import Dialog from '../../components/Containers/Dialog/Dialog';

import { spinnerlActions } from '../../store/spinner';
import TextBox from '../../components/Containers/TextBox/TextBox';
import { ajustaData } from '../../helpers/date';

const sort = (aplicacoes:ControleAplicacao[], ascending:boolean, coluna:string) => {
    if (coluna === 'nome') {
        return aplicacoes.sort((aplicacaoA:ControleAplicacao, aplicacaoB:ControleAplicacao) => {
            if (ascending) {
                return aplicacaoA.nome > aplicacaoB.nome ? 1 : -1;
            } else {
                return aplicacaoA.nome < aplicacaoB.nome ? 1 : -1;
            }
        })
    } else if (coluna === 'alerta') {
        return aplicacoes.sort((aplicacao:ControleAplicacao) => {
            if (ascending) {
                return aplicacao.ultimoErroVerificado ? 1 : -1;
            } else {
                return aplicacao.ultimoErroVerificado ? -1 : 1;
            }            
        })
    } else if (coluna === 'tipo') {
        return aplicacoes.sort((aplicacaoA:ControleAplicacao, aplicacaoB:ControleAplicacao) => {
            if (aplicacaoA.tipo === aplicacaoB.tipo) {
                return 0;
            }
            else if (aplicacaoA.tipo === null) {
                return 1;
            }
            else if (aplicacaoB === null) {
                return -1;
            }
            
            if (ascending) {
                return aplicacaoA.tipo! > aplicacaoB.tipo! ? 1 : -1;
            } else {
                return aplicacaoA.tipo! < aplicacaoB.tipo! ? 1 : -1;
            }
        })
    }
}

export default function ApplicationMonitor() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isSortingAscending = queryParams.get('direction') === 'asc';
    const sortingBy = queryParams.get('sortBy');

    const dispatch = useAppDispatch();

    const [aplicacoes, setAplicacoes] = useState<ControleAplicacao[]>([]);
    const [aplicacao, setAplicacao] = useState<ControleAplicacao>();
    const [showDialog, setShowDialog] = useState(false);
    const [primeiroCarregamento, setPrimeiroCarregamento] = useState(true);  
    const [showSearchIcon, setShowSearchIcon] = useState(false);
    const [showClearIcon, setShowClearIcon] = useState(false);

    // const [ultimoErro, setUltimoErro] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    const sortedAplicacoes = sort(aplicacoes, isSortingAscending, sortingBy === null ? 'nome' : sortingBy);
    const [filteredList, setFilteredList] = useState<ControleAplicacao[]>([])


    const adicionaNotificacoes = (aplicacoesParam:ControleAplicacao[]) => {
        let notificationList:string[] = [];

        aplicacoesParam.forEach(element => {            
            if (element.ultimoErroVerificado === false) {
                notificationList.push(`Ocorreu uma falha em ${element.nome}`)
            }
        })
        if (notificationList.length > 0) {            
            
            dispatch(notificationActions.setItems(notificationList));
            dispatch(notificationActions.counter(notificationList.length));             
        } else {
            dispatch(notificationActions.setItems([]));
            dispatch(notificationActions.counter(0));            
        }
    }

    const arrayEquals = (aplicacoesParam:ControleAplicacao[]) => {
        if (sortedAplicacoes === null || aplicacoesParam === null) {
            return false;
        }

        if (aplicacoesParam.length !== sortedAplicacoes!.length) {
            return false;
        }

        for (let index = 0; index < sortedAplicacoes!.length; index++) {
            const element1 = sortedAplicacoes![index];
            for (let index2 = 0; index2 < aplicacoesParam.length; index2++) {
                const element2 = aplicacoesParam[index2];
                if (element1.id === element2.id) {
                    if (element1.ultimaExecucao !== element2.ultimaExecucao) {
                        return false;
                    }
                    if (element1.ultimoErroVerificado !== element2.ultimoErroVerificado) {
                        return false;
                    }
                }
            }            
        }
        return true;
    }

    const fetchData = async () => {      
        agent.ControleAplicacoes.list()
        .then(response => {
            const newData = response.data;
            
            if (!arrayEquals(newData)) {
                setAplicacoes(response.data);   
                setFilteredList(response.data);
            }            
            adicionaNotificacoes(response.data);
            return response.data;
        })
        .catch(error => {
            console.log('erro em fetch data', error);                
        })
        .finally(() => {
            if (primeiroCarregamento) {
                dispatch(spinnerlActions.show(false));                
                setPrimeiroCarregamento(false);
            }            
        })
    };

    useEffect(() => {        
        if (primeiroCarregamento) {
            dispatch(spinnerlActions.show(true));
            fetchData();
            const interval = setInterval(fetchData, 1000);
            return () => clearInterval(interval);
        } else {
            const interval = setInterval(fetchData, 1000);
            return () => clearInterval(interval);
        }        
      },[aplicacoes]);
    
    const openModal = (title:string, content:LogControleAplicacao[], onlyErrors:LogControleAplicacao[]) => {
        dispatch(modalActions.show(true));
                
        const modalData = {
            title: title,
            messages: content.map(c => 
                `${c.id} | ${c.mensagem} | ${ajustaData(c.data?.toString()!, 'full')} | ${c.gerouErro ? 'error' : 'check_circle'}`
            ),
            extraData: onlyErrors.map(c => 
                `${c.id} | ${c.mensagem} | ${ajustaData(c.data?.toString()!, 'full')} | ${c.gerouErro ? 'error' : 'check_circle'}`
            )
        }
        
        
        
        dispatch(modalActions.setData(modalData));
    }
    
    const openInfo = (id:number) => {
        const aplicacaoSelecionada = sortedAplicacoes?.find(p => parseInt(p.id!) === id);        
        
        if (aplicacaoSelecionada !== null)
        {
            dispatch(modalActions.show(true));
            const modalData = {
                title: aplicacaoSelecionada!.nome,
                messages: [aplicacaoSelecionada!.descricao ?? 'Descrição não cadastrada.']
            }
            dispatch(modalActions.setData(modalData))
        }
    }

    const changeSortingHandler = (coluna:string) => {        
        navigate(location.pathname + `?sortBy=${coluna}&direction=${(isSortingAscending ? 'desc' : 'asc')}`);        
    }

    const buscaLogsHandler = (idLog:number, nomeAplicacao:string) => {
        agent.LogControleAplicacoes.lastErrors(idLog)
        .then(response => {
            return response.data;
        })
        .then((res) => {
            agent.LogControleAplicacoes.list(idLog)
            .then(response => {
                openModal(nomeAplicacao, response.data, res);
            })
        })
        

        
    }

    const marcarVerificado = () => {
        aplicacao!.ultimoErroVerificado = true;
        agent.ControleAplicacoes.verificado(aplicacao!, parseInt(aplicacao!.id!))
        .then(() => {
            setShowDialog(false);
        })
        .catch(error => {
            console.log("erro no marcarVerificado " + error);            
        })
    }

    const setaItemParaVerificar = (aplicacao:ControleAplicacao) => {   
        agent.LogControleAplicacoes.lastError(aplicacao.id!)  
        .then(response => {
            aplicacao.ultimoErro = response.data;
            setAplicacao(aplicacao);
            setShowDialog(true);
        })        
    }

    const fechaDialog = () => {
        setShowDialog(false);
    }

    const handleFiltro = (e: React.ChangeEvent<HTMLInputElement>) => {        
        const filtro:ControleAplicacao[] = filterByValue(e.target.value);
        setFilteredList(filtro);

        if (e.target.value.length > 0) {
            setShowClearIcon(true);
        } else {
            setShowClearIcon(false);
        }
    }
    const handleFocus = () => {        
        setShowSearchIcon(true);
    }
    const handleBlur = () => {        
        setShowSearchIcon(false);
    }

    const clearSearch = () => {
        if (searchRef !== null) {
            searchRef.current!.value = ''
            setShowClearIcon(false);
            const filtro:ControleAplicacao[] = filterByValue('');
            setFilteredList(filtro);
        }        
    }

    function filterByValue(value:string) {
        return sortedAplicacoes!.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    return(
        <Container  > 
            <Row color='neutral'>
                <Column size='medium'> 
                    <div> 
                        <h3>Aplicações</h3>
                    </div>
                    <Column size='medium' hasShadow={false} style={{marginBottom:'10px', flexDirection: 'row', width: '95%'}}>
                    
                        <span className={`material-icons icone-pesquisa ${showSearchIcon ? '' : 'hide'}`}>search</span>
                        <TextBox id='busca' 
                                name='busca' 
                                placeholder='Busque a aplicação pelo nome'
                                required={false} 
                                type='text' 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) =>handleFiltro(e)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                ref={searchRef}
                        />                   

                        <span onClick={clearSearch} className={`material-icons icone-fechar ${showClearIcon ? '' : 'hide'}`}>close</span>                    
                        <div style={{textAlign: 'right', width: '100%', alignSelf: 'center'}}>
                            <span>Total de aplicações monitoradas:</span>    
                            <span><strong> {aplicacoes.length}</strong></span>               
                        </div>                        
                        
                    </Column>
                    
                    <Row color='primary'>
                        <Column size='small' style={{flex: 2}}>
                            <span style={{fontWeight: 'bold'}}>Info</span>
                        </Column>
                        <Column size='small' style={{flex: 5}}>
                            <span onClick={() => changeSortingHandler('nome')} style={{fontWeight: 'bold', cursor: 'pointer'}}>Aplicação</span>
                        </Column>
                        <Column size='small' style={{flex: 2}}>
                            <span onClick={() => changeSortingHandler('tipo')} style={{fontWeight: 'bold', cursor: 'pointer'}}>Tipo</span>
                        </Column>
                        <Column size='small' style={{flex: 5}}>
                            <span style={{fontWeight: 'bold'}}>Última execução</span>
                        </Column>
                        <Column size='small' style={{flex: 2}}>
                            <span style={{fontWeight: 'bold'}}>Logs</span>
                        </Column>
                        <Column size='small' style={{flex: 2}}>
                            <span onClick={() => changeSortingHandler('alerta')} style={{fontWeight: 'bold', cursor: 'pointer'}}>Alerta</span>
                        </Column>
                        <Column size='small' style={{flex: 2}}>
                            <span style={{fontWeight: 'bold'}}>Editar</span>
                        </Column>
                    </Row>
                    {
                        filteredList?.map(aplicacao => (
                            <Row color='secondary' key={aplicacao.id}>
                                <Column size='small' style={{flex: 2}}>
                                    <span
                                        onClick={() => openInfo(parseInt(aplicacao.id!))} 
                                        style={{color: 'black', cursor: 'pointer'}} className='material-icons'>help
                                    </span>
                                </Column>
                                <Column size='small' style={{flex: 5}}>
                                    <span>{aplicacao.nome}</span>
                                </Column>
                                <Column size='small' style={{flex: 2}}>
                                    <span>{aplicacao.tipo}</span>
                                </Column>
                                <Column size='small' style={{flex: 5}}>
                                    <span>{ajustaData(aplicacao.ultimaExecucao!, 'full').includes('Invalid') ? 'Nunca' : ajustaData(aplicacao.ultimaExecucao!, 'full')}</span>
                                </Column>
                                <Column size='small' style={{flex: 2}}>
                                    <span
                                        onClick={() => buscaLogsHandler(parseInt(aplicacao.id!), aplicacao.nome)} 
                                        style={{color: 'black', cursor: 'pointer'}} className='material-icons'>text_snippet
                                    </span>
                                </Column>
                                <Column size='small' style={{flex: 2}}>
                                    {
                                        aplicacao.ultimoErroVerificado ? 
                                        <span style={{color: '#097152', cursor: 'pointer'}} className='material-icons'>check_circle</span>:
                                        <span onClick={() => setaItemParaVerificar(aplicacao)} style={{color: '#DA0D0D', cursor: 'pointer'}} className='material-icons'>error</span>
                                    }   
                                </Column>
                                <Column size='small' style={{flex: 2}}>
                                    <span
                                        onClick={() => navigate(`${aplicacao.id}`)} 
                                        style={{color: 'black', cursor: 'pointer'}} className='material-icons'>edit
                                    </span>
                                </Column>   
                                                    
                            </Row>
                        ))
                    }
                </Column>                
            </Row>
            {
                showDialog ?
                <Dialog type='question' confirmationClick={marcarVerificado} 
                        cancelationClick={fechaDialog}
                        description={aplicacao?.ultimoErro}
                        show={true} title={`Confirma que a aplicação ${aplicacao?.nome} foi verificada?`}/>
                :
                null
            }
            
        </Container>
    );
}