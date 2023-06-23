import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


import { Bar }            from 'react-chartjs-2'
import { Box } from '@chakra-ui/react';
import { mockEIP } from '@/data/eipdata';

const BarChart = () => {
    const data = mockEIP;
    const dataa = {
        labels: ["Standards Track", "Meta", "Informational"],
        datasets: [{
          label: 'Core',
          data: [data.filter(item => item.category === 'Core').length,0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',

          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',

          ],
          borderWidth: 1,
          
        },
        {
            label: 'ERC',
            data: [data.filter(item => item.category === 'ERC').length],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgb(75, 192, 192)',
  
            ],
            borderWidth: 1
          },
          {
            label: 'Networking',
            data: [data.filter(item => item.category === 'Networking').length],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgb(75, 192, 192)',
  
            ],
            borderWidth: 1
          },
          {
            label: 'Interface',
            data: [data.filter(item => item.category === 'Interface').length],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
  
            ],
            borderWidth: 1
          },
          {
            label: 'Meta',
            data: [0, data.filter(item => item.category === 'Meta').length, 0],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
  
            ],
            borderWidth: 1
          },
          {
            label: 'Informational',
            data: [0,0,data.filter(item => item.category === 'Informational').length],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
  
            ],
            borderWidth: 1
          },
    ]
      };
  return (
        <Bar

    data={dataa} options={{
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: true,
          },

        scales: {
            x: {
              stacked: true,
              
            },
            y: {
              stacked: true
            }
          }
    }}
    />


  )
}

export default BarChart