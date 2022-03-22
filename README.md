# Vitek
Vitek is a discord bot created for entertainment and statistical purposes. It uses Node.js, Discord.js library and MongoDB.
Works with slash commands.

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
CLIENT_ID=Bot_client_id
TEST_GUILD_ID=Optional_guild_for_testing
```
* Run it with `node index.js`
* The bot uses slash commands, there are 4 deployment scripts:
`node deploy-commands.js` - deploy commands (test guild)
`node deploy-commands-global.js` - deploy commands (global)
`node deploy-commands-remove.js` - remove commands (test guild)
`node deploy-commands-remove-global.js` - remove commands (global)