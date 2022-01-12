import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const LineChart = (props) => {
	const { data, title } = props;

	const [series, setSeries] = useState([]);
    
    useEffect(() => {
        var ts2 = 1484418600000;
        var dates = [];
        for (var i = 0; i < 120; i++) {
            ts2 = ts2 + 86400000;
            dates.push([ts2, data[1][i].value])
        }

        setSeries([{
            name: 'Price',
            data: dates
        }]);
    }, [])

    const options = {
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        dataLabels: {
            enabled: false
        },
        series: series,
        markers: {
            size: 0,
        },
        title: {
            text: title || '',
            align: 'center'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
        yaxis: {
            min: 20000000,
            max: 250000000,
            labels: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0);
                },
            },
            title: {
                text: 'Price'
            },
        },
        xaxis: {
            type: 'datetime',
        },
        stroke: {
            width: 1
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0)
                }
            }
        }
    }

    return (
        <div className='pb-8'>
            <Chart options={options} series={series} height={320} />
        </div>
    );
}

export default LineChart;
