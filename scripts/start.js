const inquirer = require('inquirer');
const exec = require('child_process').exec;

var questions = [
  {
    type: 'input',
    name: 'stopstart',
    message: "Would you like to start or stop or restart the bot"
  }
];

inquirer.prompt(questions).then(answers => {
  if(answers.stopstart === 'start') {
	exec('pm2 start main.js', function(err, stdout, stderr) {
		if(err) {
			console.log(err)
		} else {
			if(stdout) {
				console.log(`Bot started: ${stdout}`)
			}
			if(stderr) {
				console.log(`Bot not started: ${stderr}`)
			}
		}
	})
  }
  if(answers.stopstart === 'stop') {
	exec('pm2 stop main.js', function(err, stdout, stderr) {
		if(err) {
			console.log(err)
		} else {
			if(stdout) {
				console.log(`Bot stopped: ${stdout}`)
			}
			if(stderr) {
				console.log(`Bot not stopped: ${stderr}`)
			}
		}
	})
  }
  if(answers.stopstart === 'restart') {
	exec('pm2 restart main.js', function(err, stdout, stderr) {
		if(err) {
			console.log(err)
		} else {
			if(stdout) {
				console.log(`Bot restarted: ${stdout}`)
			}
			if(stderr) {
				console.log(`Bot not restarted: ${stderr}`)
			}
		}
	})
  }
});