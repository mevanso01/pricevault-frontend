import React from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatChart = (props) => {
  const { data, xRange, title } = props;
  const options = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: {
        show: true
      },
    },
    stroke: {
      width: 1
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {}
      }
    ],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: -100,
              to: 20,
              name: 'low',
              color: '#00A100'
            },
            {
              from: 21,
              to: 50,
              name: 'medium',
              color: '#128FD9'
            },
            {
              from: 51,
              to: 100,
              name: 'high',
              color: '#FFB200'
            },
            {
              from: 101,
              to: 1000,
              name: 'extreme',
              color: '#FF0000'
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    xaxis: {
      type: 'category',
      categories: xRange || []
    },
    title: {
      text: title,
      align: 'center',
    },
  };

  return (
    <div className="area">
      <ReactApexChart options={options} series={data} type="heatmap" />
    </div>
  );
}

export default HeatChart;
