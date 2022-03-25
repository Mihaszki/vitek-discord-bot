module.exports = {
  sendHTML: function(username, userAvatar, userId, repData, allPoints, pointsOnServer, interaction) {
    const { date_locale } = require('../bot_config');
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&apos;',
    };
    let tableData = '';
    let html = '';
    for(const item of repData) {
      tableData += `<tr><td class="${item.value == 1 ? 'g' : 'r'}">${item.value}</td><td>${item.reason.replace(/([&<>"'])/g, match => htmlEntities[match])}</td><td>${item.sender.username}</td><td>${item.sender.user_id}</td><td>${item.createdAt.toLocaleString(date_locale)}</td></tr>`;
    }

    html += `<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="utf-8"><title>Rep - History | ${username} (${userId})</title><style>*,*:before,*:after{box-sizing:border-box}html,head{width:100%;height:100%;font-family:Verdana,sans-serif;color:#efefef;background:#292929}.h{overflow:hidden;padding:30px 5px;text-align:center}h1{margin-left: 10px;}.h img{width:100px;height:100px;box-shadow:1px 1px 6px 1px black;width:100px;height:100px;border-radius:100%}.g{background:green;font-weight:700;font-size:24px}.r{background:red;font-weight:700;font-size:24px}.h div{display:inline-block;vertical-align:middle}table{font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;width:100%}table td, table th{border:1px solid #ddd;padding:8px}table tr:nth-child(even){background:#383838}table tr:hover{background:#454444;color:white}table th{padding-top:12px;padding-bottom:12px;text-align:left;background:#1e1e1e;color:white}@media only screen and (max-width: 700px){table,thead,tbody,th,td,tr{display:block}thead tr{position:absolute;top:-9999px;left:-9999px}tr{border:1px solid #ccc;margin-bottom:20px}td{border:none;border-bottom:1px solid #eee;position:relative;padding-left:50%}td:before{position:absolute;top:6px;left:6px;width:45%;padding-right:10px;white-space:nowrap}}</style></head><body><div class="h"><div><img src="${userAvatar}" alt="logo"></div><div><h1>Rep - History | ${username}<br>${userId}</h1></div></div><h2>All points: ${allPoints}</h2><h2>Points on ${interaction.guild.name}: ${pointsOnServer}</h2><h2>Rep list length: ${repData.length}</h2><table><tr><th>Value</th><th>Reason</th><th>Sender name</th><th>Sender ID</th><th>Date</th></tr>${tableData}</table></body></html>`;

    interaction.reply({
      content: 'Here\'s the rep history, download it and open it in your web browser:',
      files:  [{ attachment: Buffer.from(html, 'UTF8'), name: `rep_history_${userId}.html` }],
    });
  },
};