export interface DataSetRelatorios {
    labels: string[];    
    datasets: Data[];
}

export interface Data {
    label: string;
    data: {
        x: number,
        y: number
    }[] | number;
    borderColor?: string | any;
    backgroundColor?: string | any;
}