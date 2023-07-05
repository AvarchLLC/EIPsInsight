import React, { useEffect, useState } from 'react';
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

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const BarChart = () => {
  const [data, setData] = useState<EIP[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
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
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgb(255, 159, 64)',
  
            ],
            borderWidth: 1
          },
          {
            label: 'Interface',
            data: [data.filter(item => item.category === 'Interface').length],
            backgroundColor: [
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(201, 203, 207)'
  
            ],
            borderWidth: 1
          },
          {
            label: 'Meta',
            data: [0, data.filter(item => item.type === 'Meta').length, 0],
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
            data: [0,0,data.filter(item => item.type === 'Informational').length],
            backgroundColor: [
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgb(153, 102, 255)',
  
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