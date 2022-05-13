import moment from "moment";
import { InicioFimSemana } from "../models/inicioFimSemana";

export const ajustaData = (data:string, formato:string) => {
    moment.locale('pt-br');
    if (formato === 'full') {
        return moment(data).format('DD/MM/YYYY HH:mm:ss')!;
    } 
    
    if(formato === 'short') {
        return moment(data).format('DD/MM');
    }

    if (formato === 'only-date') {
        return moment(data).format('DD/MM/YYYY');
    }

    return 'Invalid';
}

export const rangeMeses = (dataIni:string, dataFim:string) => {
    const ini = moment(dataIni);
    const fim = moment(dataFim);
    let mesAux = moment(dataIni);
    let rangeMeses:string[] = []

    rangeMeses.push(ini.format('MMM').concat('/', ini.format('YY')));

    const rangeTotal = fim.diff(ini, 'months');
    
    for (let index = 0; index < rangeTotal; index++) {     
        mesAux.add(1, 'M');
        rangeMeses.push( mesAux.format('MMM').concat('/', mesAux.format('YY')));
    }
    return rangeMeses;
}

export const ultimoDiaMes = (anoMes: string) => {
    const dados: string[] = anoMes.split('-');
    const data: Date = new Date(parseInt(dados[0]), parseInt(dados[1]), 0);
    return moment(data).format("YYYY-MM-DD");
}

export const inicioFimSemana = (week?: string, isOnlyDate?: boolean) => {
    let now = moment();
    if (week) {
        now = moment(week);
    }    
    const monday = now.clone().weekday(1);
    const saturday = now.clone().weekday(6);
    
    const obj:InicioFimSemana = {
        inicio: !isOnlyDate ? ajustaData(monday.toString(), 'short') : ajustaData(monday.toString(), 'only-date'),
        fim: !isOnlyDate ? ajustaData(saturday.toString(), 'short') : ajustaData(saturday.toString(), 'only-date')
    }
    
    return obj;
}