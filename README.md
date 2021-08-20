# Vitek
Vitek is a discord bot created for entertainment and statistical purposes. It uses Node.js, Discord.js library and MongoDB. The repository is archived now, because I had to stop the development of the bot. The code still works if you run it on your machine, but I'm not planning on adding new features in the near future.

## Main features

### "Behavior" level
The bot can analyse profanities in your messages and generate "levels". The less profanity you use, the higher level you have.
![Behavior level](demo/behaviorlevel.png)

### Word usage stats and word usage between users
![Word usage counter](demo/wordusage.png)
![Word usage ranking](demo/wordranking.png)

### Reputation system stored in a database
![Reputation system](demo/reputationsystem.png)

### Message logs stored in a database
![Message logs system](demo/stats.png)

### GIF animation generation
![GIF Generator](demo/scifun.gif)

### Image generation
![Some commands](demo/commands.png)

## Setup
* Install node packages with `npm install`
* Create a `.env` file like this:
```
BOT_TOKEN=Your_bot_token
MONGODB=mongodb://localhost:27017/your_database
```
* Run it with `node index.js`
* The bot uses slash commands, you can load them by using ```!deploy-vitek``` command