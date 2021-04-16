module.exports = {
  name: 'graph',
  description: 'Generate graph based on equation',
  usage: '<equations> e.g. x+2, x*x',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const colors = require('../vitek_modules/colors');

    const equ = args.join(' ').toLowerCase().split(',');
    let fns = [];
    for(const e of equ) {
      const fn = e.trim().replace(/[^-()\d/*+.x]/g, '');
      if(!fn) return message.channel.send('You need to provide a valid equations! e.g. `x*x, -x*x`');
      fns.push(fn);
    }
    fns = fns.filter((item, pos) => {
      return fns.indexOf(item) == pos;
    });

    if(fns.length > 50) return message.channel.send('Too many arguments!');
    const bgColors = colors.generate(fns.length + 1);

    const chartDataSets = [];

    const x = [];
    for(let i = -5; i <= 5; i++) {
      x.push(i);
    }

    for(let i = 0; i < fns.length; i++) {
      const y = [];

      try {
        for(let j = -5; j <= 5; j++) {
          const num = eval(fns[i].replace(/x/g, `(${j})`));
          if(isNaN(num)) return message.channel.send(`There was an error in function: \`${fns[i]}\`!\n\`\`\`Don't divide by zero!\`\`\``);
          y.push(parseFloat(num));
        }
      }
      catch(error) {
        return message.channel.send(`There was an error in function: \`${fns[i]}\`!\n\`\`\`${error}\`\`\``);
      }

      chartDataSets.push({
        fill: false,
        label: fns[i],
        pointRadius: 0,
        data: y,
        backgroundColor: bgColors[i],
        borderColor: bgColors[i],
        borderWidth: 2,
      });
    }

    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

    const width = 1000;
    const height = 1000;
    const fontSize = 35;
    const chartCallback = (ChartJS) => {

      // Global config example: https://www.chartjs.org/docs/latest/configuration/
      ChartJS.defaults.global.defaultFontSize = fontSize;
      ChartJS.defaults.global.defaultFontColor = '#FFFFFF';
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
        type: 'line',
        data: {
          labels: x,
          datasets: chartDataSets,
        },
        options: {
          title: {
            display: true,
            fontSize: fontSize * 1.4,
            text: 'Graph',
          },
          chartArea: {
            backgroundColor: '#35383e',
          },
          layout: {
            padding: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5,
            },
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'y',
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.2)',
              },
              ticks: {
                fontSize: fontSize * 0.8,
              },
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'x',
              },
              ticks: {
                fontSize: fontSize * 0.8,
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.2)',
              },
            }],
          },
        },
      };
      const image = await chartJSNodeCanvas.renderToBuffer(configuration);
      const attachment = new Discord.MessageAttachment(image, 'graph.png');
      message.channel.send(attachment);
    })();
  },
};