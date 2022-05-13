
export const options = (nomeRelat: string, formatter: string | undefined, legendPosition: string, maintainAspectRatio: boolean) => ({
  maintainAspectRatio: maintainAspectRatio,  
  scales: {
      y: {
        beginAtZero: false,        
      },
    },
    plugins: {
        datalabels: {
            anchor: 'end' as 'end',
            align: 'end' as 'end',
            borderRadius: 5,
            formatter: function(value:any, context:any) {
              if (formatter) return  value.y;
              else return null;
            },
        },        
        autocolors: true,
        legend: {
          position: legendPosition === 'top' ? 'top' as const : 'right' as const,
        },
        title: {
          display: true,
          text: `Relatório de: ${nomeRelat}`,
          align: 'center' as 'center',
        },
    },    
});

export const coresMes: any = {
    'jan': '#0074D9', 'fev': '#85144b', 'mar': '#3D9970', 'abr': '#FF851B', 'mai': '#FFDC00', 'jun': '#39CCCC', 
    'jul': '#111111', 'ago': '#2ECC40', 'set': '#B10DC9', 'out': '#001f3f', 'nov': '#7FDBFF', 'dez': '#01FF70'
}

export const coresAplicacao: any = [
  '#0074D9', '#85144b', '#3D9970', '#FF851B', '#FFDC00', 
  '#39CCCC', '#111111','#2ECC40', '#B10DC9', '#7FDBFF'
]