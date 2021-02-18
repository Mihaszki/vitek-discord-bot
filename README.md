# Vitek
Vitek is a discord bot created for entertainment and statistical purposes. It uses Node.js, Discord.js library and MongoDB.
[Invite Link](https://discord.com/oauth2/authorize?client_id=670248278130163722&scope=bot&permissions=1544027328)

## Main features
* Reputation system stored in a database
* It can generate images
* It can generate GIF animations
* Saving messages to the database

## Example commands
![GIF Generator](demo/gifcommand.gif)
![Some commands](demo/commands1.png)
![Reputation system](demo/reputationsystem.png)

## Setup
* Install node packages with `npm install`
* Create a `.env` file like this:
```
BOT_TOKEN=Your_bot_token
MONGODB=mongodb://localhost:27017/your_database
```
* Run it with `node index.js`