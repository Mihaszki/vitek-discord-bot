module.exports = {
  sendChart: function(message, chartData, chartLabels, { width, height, chartTitle, stepSize = null, fontSize = 35, type = 'bar', unit = '', fgColor = '#fafafa', chartAreaBgColor = '#35383e', attachmentFileName = 'chart' }) {
    const Discord = require('discord.js');
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

    const dataSet = [];
    const bgColors = [];

    for(let i = 0; i < chartData.length; i++) {
      bgColors.push(getRandomColor());
    }

    if(type == 'bar') {
      dataSet.push({
        label: 'Ogólny poziom użytkownika',
        data: chartData,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 1,
      });
    }

    const chartCallback = (ChartJS) => {
      // Global config example: https://www.chartjs.org/docs/latest/configuration/
      ChartJS.defaults.global.defaultFontColor = fgColor;
      ChartJS.defaults.global.defaultFontSize = fontSize;
      // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
      ChartJS.plugins.register({
        // plugin implementation
        beforeDraw: function(chart) {
          if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
            const ctx = chart.chart.ctx;
            const chartArea = chart.chartArea;
            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.restore();
          }
        },
        afterDatasetsDraw: function(chartInstance) {
          const ctx = chartInstance.chart.ctx;
          chartInstance.data.datasets.forEach(function(dataset, i) {
            const meta = chartInstance.getDatasetMeta(i);
            if(!meta.hidden && type == 'bar') {
              meta.data.forEach(function(element, index) {
                ctx.fillStyle = 'black';
                ctx.font = `${fontSize * 1.3}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const position = element.tooltipPosition();
                const posY = height / 2;
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'black';
                ctx.fillStyle = 'black';
                ctx.fillText(chartData[index] + unit, position.x, posY);
                ctx.fillStyle = 'white';
                ctx.shadowBlur = 0;
                ctx.fillText(chartData[index] + unit, position.x, posY);
              });
            }
          });
        },
      });
      // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
      ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
      });
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    (async () => {
      const configuration = {
        type: type,
        data: {
          labels: chartLabels,
          datasets: dataSet,
        },
        options: {
          title: {
            display: true,
            fontSize: fontSize * 1.3,
            text: chartTitle,
          },
          scales: {
            yAxes: [{
              gridLines: {
                color: fgColor,
              },
              ticks: {
                stepSize: stepSize,
                beginAtZero: true,
                callback: (value) => value + unit,
              },
            }],
            xAxes: [{
              gridLines: {
                color: fgColor,
              },
            }],
          },
          chartArea: {
            backgroundColor: chartAreaBgColor,
          },
          legend: {
            display: false,
          },
          layout: {
            padding: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5,
            },
          },
        },
      };
      const image = await chartJSNodeCanvas.renderToBuffer(configuration);
      const attachment = new Discord.MessageAttachment(image, `${attachmentFileName}.png`);
      message.channel.send(attachment);
    })();

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  },
};