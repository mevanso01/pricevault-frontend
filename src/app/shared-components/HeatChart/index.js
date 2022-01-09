import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

const HeatChart = (props) => {
	const { data, title } = props;

	const [series, setSeries] = useState(data);

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
		plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: [
                        {
                            from: -30,
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
            categories: ['3M', '1Y', '2Y', '3Y', '4Y', '5Y', '7Y', '10Y', '15Y', '20Y', '25Y', '30Y']
		},
		title: {
			text: title,
            align: 'center',
		},
	};

    return (
        <div className="area">
            <ReactApexChart options={options} series={series} type="heatmap" width="500" />
        </div>
    );
}

export default HeatChart;
