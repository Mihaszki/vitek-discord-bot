module.exports = {
  name: 'graph',
  description: 'Generate graph based on equation',
  usage: 'help',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const colors = require('../vitek_modules/colors');
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'help') {
      return sendEmbed(message, 'Graph - Help', `You can type equations e.g. \`x+2, x*x\`.
      You can also use these functions:
      \`Math.sin(x)\` - returns the sine of a number.
      \`Math.cos(x)\` - returns the cosine of a number.
      \`Math.tan(x)\` - returns the tangent of a number.
      \`Math.abs(x)\` - returns the absolute value of a number.
      \`Math.log(x)\` - returns the natural logarithm (base e) of a number.
      \`Math.random()\` - returns a floating-point, pseudo-random number.
      \`Math.PI\` - ratio of the circumference of a circle to its diameter.`);
    }

    const equ = args.join(' ').split(',');
    let fns = [];
    for(const e of equ) {
      let fn = e.trim().match(/[-()\d/*+.x]|(Math\.sin)|(Math\.cos)|(Math\.tan)|(Math\.PI)|(Math\.random)|(Math\.abs)|(Math\.log)/g);
      if(!fn) return message.channel.send('You need to provide a valid equations! e.g. `x*x, -x*x`. See help for more info.');
      fn = fn.join('');
      fns.push(fn);
    }
    fns = fns.filter((item, pos) => {
      return fns.indexOf(item) == pos;
    });

    if(fns.length > 50) return message.channel.send('Too many arguments!');
    const bgColors = colors.generate(fns.length + 1);

    const chartDataSets = [];
    const loopNum = 60;
    const divider = 10;

    const x = [];
    for(let i = -loopNum; i <= loopNum; i++) {
      x.push(parseFloat(i / divider));
    }

    for(let i = 0; i < fns.length; i++) {
      const y = [];

      try {
        for(const _x of x) {
          const num = eval(fns[i].replace(/x/g, `(${_x})`));
          // if(isNaN(num)) return message.channel.send(`There was an error in function: \`${fns[i]}\`!\n\`\`\`Don't divide by zero!\`\`\``);
          if(isNaN(num)) y.push(null);
          else y.push(parseFloat(num));
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

    const width = 2000;
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
            fontSize: fontSize * 1.6,
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
                fontSize: fontSize * 0.7,
              },
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'x',
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: parseInt(loopNum / 3),
                fontSize: fontSize * 0.7,
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