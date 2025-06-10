const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.cwd(), 'database');


class Users {
    constructor() {
        this.usersPath = path.join(process.cwd(), 'database/users.json');
        this.usersData = [];
        this.loadUsers();
        
        if (fs.existsSync(this.usersPath)) {
            this.usersData = JSON.parse(fs.readFileSync(this.usersPath, 'utf8'));
        } else {
            fs.writeFileSync(this.usersPath, JSON.stringify([], null, '\t'));
        }
    }


    addUser(user) {
        createLogMessage(new Date().toLocaleString(), `Adding user: ${user.username} | User ID: ${user.id}`, 'info');

        const usersPath = path.join(process.cwd(), 'database/users.json');
        let usersData = [];
        
        if (fs.existsSync(usersPath)) {
            usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        }
        
        usersData.push(user);
        fs.writeFileSync(usersPath, JSON.stringify(usersData, null, '\t'));

        this.createHTMLContent(user.username, user.id, user.reason, user.comment, user.createdAt);
        createLogMessage(new Date().toLocaleString(), 'User added successfully: ' + user.username, 'success');
    }

    createHTMLContent(username, id, reason, comment, createdAt) {
        const userContainer = document.querySelector('.blacklist-container');
        const userDiv = document.createElement('div');
        userDiv.classList.add('blacklist-item');
        
        userDiv.innerHTML = `
            <div class="actions">
                <div class="info">
                    <span class="blacklist-name">${username}</span>
                    <span class="blacklist-id">ID: ${id}</span>
                </div>
                <button class="remove-button">Remove</button>
            </div>
            <div class="collapse">
                <p class="blacklist-reason">Reason for blacklisting: ${reason}</p>
                <p class="blacklist-date">Date added: ${createdAt}</p>
                <p class="blacklist-notes">Notes: ${comment}</p>
                <p class="id">ID: ${id}</p>
            </div>
        `;
        
        userContainer.prepend(userDiv);
        
        const removeButton = userDiv.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            this.removeUser(username);
            userContainer.removeChild(userDiv);
        });
    }

    removeUser(username) {
        const usersPath = path.join(process.cwd(), 'database/users.json');
        if (fs.existsSync(usersPath)) {
            let usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            usersData = usersData.filter(user => user.username !== username);
            fs.writeFileSync(usersPath, JSON.stringify(usersData, null, '\t'));
        }
    }

    loadUsers() {
        const usersPath = path.join(process.cwd(), 'database/users.json');
        if (fs.existsSync(usersPath)) {
            this.usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            this.usersData.forEach(user => {
                this.createHTMLContent(user.username, user.id, user.reason, user.comment, user.createdAt);
            });
        } else {
            createLogMessage(new Date().toLocaleString(), 'Users file does not exist.', 'error');
        }
    }
}


const users = new Users();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function createLogMessage(date = new Date().toLocaleString(), message, type = 'info', isSave = true) {
    const logLimit = 100; // Maximum number of logs to keep
    if (document.querySelectorAll('.log-item').length >= logLimit) {
        console.error('Log limit reached. Removing oldest log.');
        sleep(1000).then(() => {
            const logContainer = document.querySelector('.logs-container');
            const firstLog = logContainer.querySelector('.log-item');
            if (firstLog) {
                logContainer.removeChild(firstLog);
                console.log('Oldest log removed to maintain limit.');
            }   
        });
    }


    const logContainer = document.querySelector('.logs-container');
    const logMessage = document.createElement('div');
    logMessage.classList.add('log-item', type);
    logMessage.innerHTML = `
        <span class="log-date">${date}</span>
        <span class="log-message">${message}</span>
        <span class="log-type ${type}">${type}</span>
    `;
    logContainer.appendChild(logMessage);

    if (!isSave) {
        return;
    }


    const logsPath = path.join(dbPath, 'logs.json');
    let logsData = [];
    if (fs.existsSync(logsPath)) {
        logsData = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    }
    const logEntry = {
        date: date,
        message: message,
        type: type
    };
    logsData.push(logEntry);
    fs.writeFileSync(logsPath, JSON.stringify(logsData, null, '\t'));
}


const loadLogs = () => {
    const logsPath = path.join(dbPath, 'logs.json');
    if (fs.existsSync(logsPath)) {
        const logsData = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
        logsData.forEach(log => {
            createLogMessage(log.date, log.message, log.type, false);
        });
    } else {
        console.error('Logs file does not exist.');
    }
};