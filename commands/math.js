module.exports = {
  name: 'math',
  description: 'Solve math using math.js',
  usage: '<equation>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const { create, all } = require('mathjs');
    const { sendEmbed } = require('../vitek_modules/embed');
    const { prefix } = require('../bot_config');
    const colors = require('../vitek_modules/colors');
    const math = create(all);
    const limitedEvaluate = math.evaluate;

    math.import({
      'import':     function() { throw new Error('Function import is disabled'); },
      'createUnit': function() { throw new Error('Function createUnit is disabled'); },
      'evaluate':   function() { throw new Error('Function evaluate is disabled'); },
      'parse':      function() { throw new Error('Function parse is disabled'); },
      'simplify':   function() { throw new Error('Function simplify is disabled'); },
      'derivative': function() { throw new Error('Function derivative is disabled'); },
    }, { override: true });

    const option = args[0];
    args.shift();
    if(option == 'calc') {
      try {
        if(args.length == 0) return message.channel.send('You didn\'t provide any equations!');
        return message.channel.send(`\`\`\`${limitedEvaluate(args.join(' ').trim())}\`\`\``);
      }
      catch (error) {
        return message.channel.send(`\`\`\`${error}\`\`\``);
      }
    }
    else if(option == 'graph') {
      if(args.length == 0) return message.channel.send('You didn\'t provide any equations!');
      let fns = args.join(' ').trim().split(',');
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
            const num = limitedEvaluate(fns[i].replace(/x/g, `(${_x})`));
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
          pointBackgroundColor: bgColors[i],
          pointRadius: fns[i].includes('tan') ? 2 : 0,
          showLine: fns[i].includes('tan') ? false : true,
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
        return message.channel.send(attachment);
      })();
    }
    else {
      return sendEmbed(message, 'Math - Help', `\`${prefix}${this.name} calc <equation>\` - Calculator
      \`${prefix}${this.name} graph <equation>\` - Draw graph
      You can draw multiple graphs e.g.:
      \`${prefix}${this.name} graph sin(x), cos(x)\`
      
      *The calculations are done by math.js library, so you can use functions like sin(), cos() etc.*`);
    }
  },
};