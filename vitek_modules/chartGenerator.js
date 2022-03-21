module.exports = {
  sendChart: function(interaction, chartData, { width, height, chartTitle, chartLabels = [], stepSize = null, fontSize = 35, type = 'bar', unit = '', fgColor = '#ffffff', chartAreaBgColor = '#35383e', showOneUser = false, showOnlyID = '', attachmentFileName = 'chart' }) {
    const { MessageAttachment } = require('discord.js');
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
    const colors = require('../vitek_modules/colors');

    const dataSet = [];
    const bgColors = colors.generate(chartData.length + 1);

    if(type == 'bar') {
      for(let i = 0; i < chartLabels.length; i++) {
        chartLabels[i] = chartLabels[i].length > 19 ? chartLabels[i].slice(0, 19) + '...' : chartLabels[i];
      }
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

      hours.sort((a, b) => a - b);
      hours.forEach(item => chartLabels.push(('0' + item).slice(-2) + ':00'));

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
          pointBackgroundColor: i == 0 ? '#050505' : color,
          pointBorderColor: i == 0 ? '#050505' : color,
          pointBorderWidth: i == 0 ? 8 : 5,
          borderWidth: i == 0 ? 6 : 3,
          pointHitRadius: 10,
          borderDash: i == 0 ? [8, 5] : [],
          backgroundColor: [
            i == 0 ? '#050505' : color,
          ],
          borderColor: [
            i == 0 ? '#050505' : color,
          ],
        });
      }

      if(showOneUser && !gotUser) {
        return interaction.editReply({ content: 'There is no data for the given user!' });
      }
    }
    const plugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = chartAreaBgColor;
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
      afterDatasetsDraw: function(chart) {
        const ctx = chart.canvas.getContext('2d');
        chart.data.datasets.forEach(function(dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if(!meta.hidden && type == 'bar') {
            meta.data.forEach(function(element, index) {
              ctx.font = `${Math.round(fontSize * 0.8)}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const position = element.tooltipPosition();
              const posY = height / 2;
              ctx.shadowBlur = 2;
              ctx.lineWidth = 5;
              ctx.shadowColor = '#000000';
              ctx.fillStyle = '#ffffff';
              ctx.strokeStyle = '#000000';
              ctx.shadowBlur = 0;
              ctx.strokeText(chartData[index] + unit, position.x, posY);
              ctx.fillText(chartData[index] + unit, position.x, posY);
            });
          }
        });
      },
    };
    const chartCallback = (ChartJS) => {
      ChartJS.defaults.color = fgColor;
      ChartJS.defaults.font.size = fontSize;
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback, plugins: { modern: [plugin] },
    });

    (async () => {
      const configuration = {
        type: type,
        data: {
          labels: chartLabels,
          datasets: dataSet,
        },
        options: {
          plugins: {
            title: {
              display: true,
              font: {
                color: fgColor,
                size: fontSize * 1.3,
              },
              text: chartTitle,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              ticks: {
                stepSize: stepSize,
                callback: (value) => value + unit,
                font: {
                  color: fgColor,
                  size: fontSize * 0.8,
                },
              },
            },
            x: {
              ticks: {
                font: {
                  color: fgColor,
                  size: fontSize * 0.8,
                },
              },
              grid: {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
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
      const attachment = new MessageAttachment(image, `${attachmentFileName}.png`);
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    })();
  },
};