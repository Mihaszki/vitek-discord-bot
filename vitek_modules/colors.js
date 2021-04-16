module.exports = {
  generate: function(n) {
    const colors = ['#62ff00', '#ff0d00', '#05faf6', '#ff00bf', '#f5f502', '#f5f5dc', '#00008b', '#ff8c00', '#4b0082', '#006400', '#e9967a', '#d3d3d3', '#000080', '#800000'];

    if(n > colors.length) {
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for(let j = 0; j < 6; j++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      for(let i = 0; i <= n - colors.length + 5; i++) {
        colors.push(getRandomColor());
      }
    }

    return colors;
  },
};