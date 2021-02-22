module.exports = {
  sendChart: function(message, chartData, { width, height, chartTitle, chartLabels = [], stepSize = null, fontSize = 35, type = 'bar', unit = '', fgColor = '#fafafa', chartAreaBgColor = '#35383e', showOneUser = false, showOnlyID = '', attachmentFileName = 'chart' }) {
    const Discord = require('discord.js');
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

    const dataSet = [];
    const bgColors = ['#2fff00', '#00f2ff', '#fbff00', '#ff0000', '#ff00c3', '#ff7b00', '#001aff'];

    if(chartData.length > bgColors.length) {
      for(let i = 0; i <= (chartData.length - bgColors.length) + 5; i++) {
        bgColors.push(getRandomColor());
      }
    }

    if(type == 'bar') {
      dataSet.push({
        label: 'User level',
        data: chartData,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 1,
      });
    }
    else if(type == 'line') {
      let gotUser = false;
      const serverLevels = [];
      const hours = [];
      for(let i = 0; i < chartData.length; i++) {
        chartData[i].hours.forEach(item => {
          if(!hours.includes(item.hour)) {
            hours.push(item.hour);
          }
        });
      }
      hours.sort();
      hours.forEach(item => chartLabels.push(item + ':00'));

      for(let i = 0; i < hours.length; i++) {
        let value = 0;
        let counter = 0;
        for(let j = 0; j < chartData.length; j++) {
          if(chartData[j].hours.some(item => item.hour == hours[i])) {
            value += chartData[j].hours.filter(item => item.hour == hours[i])[0].value;
            counter++;
          }
        }
        serverLevels.push({ value: Math.floor(value / counter), hour: hours[i] });
      }

      chartData.unshift({
        username: 'Server level',
        hours: serverLevels,
      });

      for(let i = 0; i < chartData.length; i++) {
        const dataNumbers = [];
        let last_index = 0;
        chartData[i].hours.forEach(item => {
          for(let j = last_index; j < hours.length; j++) {
            if(hours[j] == item.hour) {
              dataNumbers.push(item.value);
              last_index = j + 1;
              break;
            }
            else {
              dataNumbers.push(null);
            }
          }
        });
        const _diff = hours.length - dataNumbers.length;
        if(_diff > 0) {
          for(let j = 0; j < _diff; j++) {
            dataNumbers.push(null);
          }
        }

        let color = '';
        let username = '';

        if(!showOneUser) {
          color = bgColors[i - 1];
          username = chartData[i].username;
        }
        else if(showOneUser && showOnlyID == chartData[i].user_id) {
          color = bgColors[i - 1];
          username = chartData[i].username;
          gotUser = true;
        }
        else {
          color = 'rgba(0,0,0,0)';
          username = '';
        }

        dataSet.push({
          fill: false,
          label: i == 0 ? chartData[i].username : username,
          pointRadius: 5,
          fontSize: 30,
          spanGaps: i == 0 ? true : false,
          data: dataNumbers,
          borderJoinStyle: 'miter',
          pointBackgroundColor: i == 0 ? 'red' : color,
          pointBorderColor: i == 0 ? 'red' : color,
          pointBorderWidth: i == 0 ? 8 : 5,
          borderWidth: i == 0 ? 6 : 3,
          pointHitRadius: 10,
          borderDash: i == 0 ? [8, 5] : [],
          backgroundColor: [
            i == 0 ? 'red' : color,
          ],
          borderColor: [
            i == 0 ? 'red' : color,
          ],
        });
      }

      if(showOneUser && !gotUser) {
        return message.channel.send('There is no data for the given user!');
      }
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
                ctx.font = `${fontSize * 0.8}px sans-serif`;
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
                color: 'rgba(255, 255, 255, 0.3)',
              },
              ticks: {
                stepSize: stepSize,
                beginAtZero: true,
                callback: (value) => value + unit,
              },
            }],
            xAxes: [{
              gridLines: {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }],
          },
          chartArea: {
            backgroundColor: chartAreaBgColor,
          },
          legend: {
            display: type == 'line' ? true : false,
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