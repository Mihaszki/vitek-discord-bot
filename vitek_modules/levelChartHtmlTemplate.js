module.exports = {
  getHTMLData: function(chartData, { chartTitle, chartLabels = [], fgColor = '#ffffff', stepSize = null, fontSize = 35, type = 'bar', unit = '', showOneUser = false, showOnlyID = '' }) {
    const colors = require('../vitek_modules/colors');
    let html = '';
    let dataSetStr = '[';
    let labelsStr = '[';
    let bgColorsStr = '[';

    const escapeCharacters = (val) => val.replace(/['\\]/g, '\\$&');
    const bgColors = colors.generate(chartData.length + 1);
    bgColors.forEach(val => bgColorsStr += `'${val}',`);

    bgColorsStr += ']';

    if (type == 'bar') {
      for (let i = 0; i < chartLabels.length; i++) {
        chartLabels[i] = chartLabels[i].length > 22 ? chartLabels[i].slice(0, 22) + '...' : chartLabels[i];
        labelsStr += `'${chartLabels[i].length > 22 ? escapeCharacters(chartLabels[i].slice(0, 22)) + '...' : escapeCharacters(chartLabels[i])}',`;
      }
      labelsStr += '],';
      let d = '';
      chartData.forEach(val => d += `'${val}',`);
      dataSetStr += `
      {
        label: 'Data',
        data: [${d}],
        backgroundColor: ${bgColorsStr},
        borderColor: ${bgColorsStr},
        borderWidth: 1,
      }]`;
    }
    else if (type == 'line') {
      let gotUser = false;
      const serverLevels = [];
      const hours = [];
      for (let i = 0; i < chartData.length; i++) {
        chartData[i].hours.forEach(item => {
          if (!hours.includes(item.hour)) {
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

      for (let i = 0; i < hours.length; i++) {
        let value = 0;
        let counter = 0;
        for (let j = 0; j < chartData.length; j++) {
          if (chartData[j].hours.some(item => item.hour == hours[i])) {
            value += chartData[j].hours.filter(item => item.hour == hours[i])[0].value;
            counter++;
          }
        }
        serverLevels.push({ value: Math.floor(value / counter), hour: hours[i] });
      }

      for (let i = 0; i < chartData.length; i++) {
        const dataNumbers = [];
        let lastIndex = 0;
        chartData[i].hours.forEach(item => {
          for (let j = lastIndex; j < hours.length; j++) {
            if (hours[j] == item.hour) {
              dataNumbers.push(item.value);
              lastIndex = j + 1;
              break;
            }
            else {
              dataNumbers.push(null);
            }
          }
        });
        const _diff = hours.length - dataNumbers.length;
        if (_diff > 0) {
          for (let j = 0; j < _diff; j++) {
            dataNumbers.push(null);
          }
        }

        let color = '';
        let username = '';

        if (!showOneUser) {
          color = bgColors[i - 1];
          username = chartData[i].username;
        }
        else if (showOneUser && showOnlyID == chartData[i].user_id) {
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
          label: '${i == 0 ? escapeCharacters(chartData[i].username) : escapeCharacters(username)}',
          pointRadius: 5,
          fontSize: 30,
          tension: 0.4,
          spanGaps: ${i == 0 ? true : false},
          data: [${_data}],
          borderJoinStyle: 'miter',
          pointBackgroundColor: '${i == 0 ? '#050505' : color}',
          pointBorderColor: '${i == 0 ? '#050505' : color}',
          pointBorderWidth: ${i == 0 ? '8' : '5'},
          borderWidth: ${i == 0 ? '6' : '3'},
          pointHitRadius: 10,
          borderDash: ${i == 0 ? '[8, 5]' : '[]'},
          backgroundColor: [
            '${i == 0 ? '#050505' : color}',
          ],
          borderColor: [
            '${i == 0 ? '#050505' : color}',
          ],
        },
        `;
      }

      dataSetStr += ']';

      if (showOneUser && !gotUser) {
        console.log('There is no data for the given user!');
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
  margin: 0 auto;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
}

@media screen and (max-width: 1000px) {
  .wrapper {
    min-width: 1500px;
    min-height: 1500px;
    position: static;
  }
}

</style>
</head>

<body>
<div class="wrapper">
<canvas id="myChart"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>

let ctx = document.getElementById('myChart').getContext('2d');
Chart.defaults.font.size = ${fontSize};
Chart.defaults.color = '#f7f7f7';
let myChart = new Chart(ctx, {
  type: '${type}',
  data: {
    labels: ${labelsStr}
    datasets: ${dataSetStr},
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: ${type == 'line' ? 'true' : 'false'},
      },
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
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        ticks: {
          stepSize: ${stepSize},
          callback: (value) => value + '${unit}',
          font: {
            size: ${Math.round(fontSize * 0.8)},
            color: '${fgColor}',
          },
        },
      },
      x: {
        ticks: {
          font: {
            color: '${fgColor}',
            size: ${fontSize * 0.8},
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      },
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
    return html;
  },
};