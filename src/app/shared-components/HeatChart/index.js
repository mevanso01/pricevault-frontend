import React from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatChart = (props) => {
  const { data, dataRange, xRange, title } = props;

  // let dataMin;
  // let dataMax;
  // let diff;
  // if (dataRange && dataRange.length == 2) {
  //   dataMin = +(dataRange[0]);
  //   dataMax = +(dataRange[1]);
  //   diff = dataMax - dataMin;
  // }

  const options = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: {
        show: true
      },
    },
    colors: ["#17a2b8"],
    stroke: {
      width: 1
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {}
      }
    ],
    // plotOptions: {
    //   heatmap: {
    //     shadeIntensity: 0.5,
    //     radius: 0,
    //     useFillColorAsStroke: true,
    //     colorScale: {
    //       ranges: [
    //         {
    //           from: null,
    //           to: null,
    //           name: 'empty',
    //           color: '#ffffff'
    //         },
    //         {
    //           from: dataMin || -100,
    //           to: (dataMin + diff / 4) || 20,
    //           name: 'low',
    //           color: '#99ff99'
    //         },
    //         {
    //           from: (dataMin + diff / 4) || 21,
    //           to: (dataMin + diff * 2 / 4) || 50,
    //           name: 'medium',
    //           color: '#1aff1a'
    //         },
    //         {
    //           from: (dataMin + diff * 2 / 4) || 51,
    //           to: (dataMin + diff * 3 / 4) || 100,
    //           name: 'high',
    //           color: '#00cc00'
    //         },
    //         {
    //           from: (dataMin + diff * 3 / 4) || 101,
    //           to: dataMax || 1000,
    //           name: 'extreme',
    //           color: '#008000'
    //         }
    //       ]
    //     }
    //   }
    // },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#363535']
      }
    },
    xaxis: {
      type: 'category',
      categories: xRange || [],
      title: {
        text: 'Tenor',
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
      tooltip: {
        enabled: true
      }
    },
    yaxis: {
      seriesName: 'name',
      title: {
        text: 'Expiry',
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
        },
      },
      tooltip: {
        enabled: false
      }
    },
    title: {
      text: title,
      align: 'center',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => "Expiry-" + seriesName + ": ",
        }
      }
    }
  };

  return (
    <div className="area">
      <ReactApexChart options={options} series={data} type="heatmap" />
    </div>
  );
}

export default HeatChart;
