module.exports = {
  sendChart: function(message, chartData, chartLabels, { width, height, chartTitle, stepSize = null, fontSize = 30, type = 'bar', unit = '', fgColor = '#fafafa', chartAreaBgColor = '#35383e', attachmentFileName = 'chart' }) {
    const Discord = require('discord.js');
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

    const dataSet = [];
    for(let i = 0; i < chartData.length; i++) {
      const color = getRandomColor();
      dataSet.push({
        label: chartLabels[i],
        data: [chartData[i]],
        backgroundColor: color,
        borderColor: color,
      });
    }

    const chartCallback = (ChartJS) => {
      // Global config example: https://www.chartjs.org/docs/latest/configuration/
      ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
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
          labels: [''],
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