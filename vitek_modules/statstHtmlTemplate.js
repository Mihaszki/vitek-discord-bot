module.exports = {
  getHTMLData: function(allMessages, messagesNoBots, userRankingAll, channelRankingAll, serverName) {
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&apos;',
    };
    let html = `<!DOCTYPE html><html lang="en"><head><title>Stats - ${serverName}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="UTF-8"><style>table{border-collapse: collapse; margin-bottom: 30px;}*{box-sizing: border-box;padding:0;margin:0;}body{font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.8; font-weight: normal; background: #2b3035; color: #ffffff;}.content{margin: 40px auto; width: 70%; overflow: auto;}table{overflow: auto; width: 98%;margin: 0 auto;margin-top: 10px;margin-bottom: 35px; border-collapse: collapse; background-color: #343a40; box-shadow: 0 0 7px 1px #0000003d;}table tbody tr{margin-bottom: 10px;}table thead th{border: none; padding: 20px 30px; font-size: 14px; text-align: left; background-color: #343a40; border-bottom: 4px solid #2b3035;}table tbody th, table tbody td{border: none; padding: 20px 30px; border-bottom: 3px solid #2b3035; font-size: 14px; text-align: left;}table thead tr:last-child td,table thead tr:last-child th,table tbody tr:last-child td,table tbody tr:last-child th{border-bottom: 0;}@media only screen and (max-width: 800px){.content{width: 95%;}table tbody th, table tbody td,table thead th{padding: 20px 12px;}}h1,h2{text-align: center;}h1{margin-bottom: 25px;}</style></head><body> <div class="content"><h1>Stats - ${serverName}</h1><h2>Most active users</h2><table><thead><tr><th>#</th><th>User</th><th>Messages</th></tr></thead><tbody>`;
    let tableData = '';
  
    let i = 1;
    for (const item of userRankingAll) {
      tableData += `<tr><th>${i}</th><td>${item.username.replace(/([&<>"'])/g, match => htmlEntities[match])}</td><td>${item.count}</td></tr>`;
      i++;
    }

    html += tableData;

    tableData = '</tbody></table><h2>Most active channels</h2><table><thead><tr><th>#</th><th>Channel</th><th>Messages</th></tr></thead><tbody>';
  
    i = 1;

    for (const item of channelRankingAll) {
      tableData += `<tr><th>${i}</th><td>${item.channel_name.replace(/([&<>"'])/g, match => htmlEntities[match])}</td><td>${item.count}</td></tr>`;
      i++;
    }

    html += tableData;
    html += ` </tbody></table><h2>Message Stats</h2><table><tbody><tr><th>Messages</th><th>${messagesNoBots}</th></tr><tr><th>Messages (+bots)</th><th>${allMessages.count}</th></tr><tr><th>Words</th><th>${allMessages.words}</th></tr><tr><th>Swears</th><th>${allMessages.swears}</th></tr></tbody></table></div></body></html>`;

    return html;
  },
};