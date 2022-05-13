import { Pie } from "react-chartjs-2";
import Container from "../../../components/Containers/Container/Container";
import MensalProduto from "../../../components/Containers/Filtros/MensalProduto/MensalProduto";
import { coresAplicacao, options } from "../../../helpers/reports";
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import Row from "../../../components/Containers/Grid/Row/Row";
import agent from "../../../api/agent";
import { useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import { QtdErrosAplicacao } from "../../../models/qtdErrosAplicacao";

  
const ErrosSistema = () => {
    const selector = useAppSelector(state => state.report);
    const [qtdErrosAplicacao, setQtdErrosAplicacao] = useState<QtdErrosAplicacao[]>([]);

    const [dados, setDados] = useState<any>();

    ChartJS.overrides['pie'].plugins.legend.maxWidth = 320;
    ChartJS.register(
        ArcElement, Tooltip, Legend
    );

    const foo = () => {
        const dataIni: string = selector.dtIni;
        const dataFim: string = selector.dtFim;

        agent.LogControleAplicacoes.qtdByDate(dataIni, dataFim)
        .then(response => {
            setQtdErrosAplicacao(response.data);
        })
        // .catch(error => {
        //     if (error.status === 400) {
        //         console.log((Object.entries(error.data.errors)));
        //         setShowAlert(true);
        //         setAlertDetail({
        //             type: 'failure',
        //             text: trataMensagemErro(Object.values(error.data.errors))
        //         })
        //     }

        // })
    }

    const montaDataSets = () => {
        const dados: any = {
            labels: qtdErrosAplicacao.map(p => p.nome),
            datasets: [{
                label: 'test',
                data: qtdErrosAplicacao.map(p => p.qtd),
                backgroundColor: coresAplicacao.map((element:string) => element)
            }],
            hoverOffset: 4
        }

        setDados(dados);
    }

    useEffect(() => {
        if (qtdErrosAplicacao.length <= 0) 
            return;

        montaDataSets();
    }, [qtdErrosAplicacao])

    return(
        <Container>
            <MensalProduto title="Erros de sistemas" showProduto={false} click={foo}/>
            <Row color="neutral" style={{display: 'flex', justifyContent: 'left'}}>                
                {
                    dados ?
                    <Container style={{width: '100%', height: '60vh', alignItems: 'left'}}> 
                        <Pie options={options('Erros dos sistemas', undefined, 'right', false)} data={dados!} />  
                    </Container>
                    :                    
                    null
                }                                
            </Row>
        </Container>
    )
}

export default ErrosSistema;