module.exports = {
  sendHTML: function(message, chartData, { chartTitle, chartLabels = [], stepSize = null, fontSize = 35, type = 'bar', unit = '', showOneUser = false, showOnlyID = '' }) {
    let html = '';
    const dataSet = [];
    const bgColors = ['#2fff00', '#00f2ff', '#fbff00', '#ff0000', '#ff00c3', '#ff7b00', '#001aff', '#ededed', '#1f633e'];

    let dataSetStr = '[';
    let labelsStr = '[';
    let bgColorsStr = '[';

    if(chartData.length > bgColors.length) {
      for(let i = 0; i <= (chartData.length - bgColors.length) + 5; i++) {
        bgColors.push(getRandomColor());
      }
    }

    bgColors.forEach(val => bgColorsStr += `'${val}',`);

    bgColorsStr += ']';

    if(type == 'bar') {
      for(let i = 0; i < chartLabels.length; i++) {
        chartLabels[i] = chartLabels[i].length > 22 ? chartLabels[i].slice(0, 22) + '...' : chartLabels[i];
        labelsStr += `'${chartLabels[i].length > 22 ? chartLabels[i].slice(0, 22) + '...' : chartLabels[i]}',`;
      }
      labelsStr += '],';
      let d = '';
      chartData.forEach(val => d += `'${val}',`);
      dataSetStr += `
      {
        label: 'User level',
        data: [${d}],
        backgroundColor: ${bgColorsStr},
        borderColor: ${bgColorsStr},
        borderWidth: 1,
      }]`;
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
      hours.forEach(item => {
        chartLabels.push(('0' + item).slice(-2) + ':00');
        labelsStr += `'${('0' + item).slice(-2) + ':00'}',`;
      });

      labelsStr += '],';

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

        let _data = '';
        dataNumbers.forEach(val => _data += `'${val}',`);

        dataSetStr += `
        {
          fill: false,
          label: '${i == 0 ? chartData[i].username : username}',
          pointRadius: 5,
          fontSize: 30,
          spanGaps: ${i == 0 ? true : false},
          data: [${_data}],
          borderJoinStyle: 'miter',
          pointBackgroundColor: '${i == 0 ? 'red' : color}',
          pointBorderColor: '${i == 0 ? 'red' : color}',
          pointBorderWidth: ${i == 0 ? '8' : '5'},
          borderWidth: ${i == 0 ? '6' : '3'},
          pointHitRadius: 10,
          borderDash: ${i == 0 ? '[8, 5]' : '[]'},
          backgroundColor: [
            '${i == 0 ? 'red' : color}',
          ],
          borderColor: [
            '${i == 0 ? 'red' : color}',
          ],
        },
        `;

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

      dataSetStr += ']';

      if(showOneUser && !gotUser) {
        return message.channel.send('There is no data for the given user!');
      }
    }

    html += `<!DOCTYPE html>
<html>
<head>
<title>${chartTitle.join(' ')}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="utf-8">
<style>
*{padding:0;margin:0;box-sizing: border-box}
*:before, *:after {box-sizing: border-box}
html {height: 100%;}
body {min-height: 100%; background:#212121; color:#f7f7f7}
.wrapper {
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
}

</style>
</head>

<body>
<div class="wrapper">
<canvas id="myChart"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>

var ctx = document.getElementById('myChart').getContext('2d');
Chart.defaults.font.size = ${fontSize};
Chart.defaults.color = '#f7f7f7';
var myChart = new Chart(ctx, {
  type: '${type}',
  data: {
    labels: ${labelsStr}
    datasets: ${dataSetStr},
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        font: {
          size: ${Math.round(fontSize * 1.5)},
        },
        text: ['${chartTitle.join(' ')}'],
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        gridLines: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
        ticks: {
          stepSize: ${stepSize},
          callback: (value) => value + '${unit}',
          font: {
            size: ${Math.round(fontSize * 0.8)},
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: ${Math.round(fontSize * 0.8)},
          },
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
    legend: {
      display: ${type == 'line' ? true : false},
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
});
</script>

</body>

</html>
    `;

    message.channel.send('Here\'s the chart, download and open it in a web browser:', { files: [{ attachment: Buffer.from(html, 'UTF8'), name: 'chart.html' }] });

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