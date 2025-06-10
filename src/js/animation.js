const blacklistContainer = document.querySelector('.blacklist-container');

blacklistContainer.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.remove-button');
    if (removeBtn) {
        const item = removeBtn.closest('.blacklist-item');
        item.remove();
        return;
    }

    const item = event.target.closest('.blacklist-item');
    if (item && blacklistContainer.contains(item)) {
        const collapseBlock = item.querySelector('.collapse');
        if (collapseBlock) {
            collapseBlock.classList.toggle('active');
        }
    }
});


const addNewUserBtn = document.querySelector('#add');
const newUserWindow = document.querySelector('.add-new-user-container');

addNewUserBtn.addEventListener('click', () => {
    newUserWindow.classList.toggle('active');
});



window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
        const activeCollapse = document.querySelector('.blacklist-item .collapse.active');
        if (activeCollapse) {
            activeCollapse.classList.remove('active');
        }
        newUserWindow.classList.remove('active');
    }
});



const loggedInDate = document.querySelector('.loggedin');
const usersLength = document.querySelector('.total-users');



window.addEventListener('DOMContentLoaded', () => {
    const settingsPath = path.join(process.cwd(), 'database/settings.json');
    if (fs.existsSync(settingsPath)) {
        const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if (settingsData.loggedIn && settingsData.loggedIn.date) {
            loggedInDate.textContent = `Logged in: ${settingsData.loggedIn.date}`;
        } else {
            loggedInDate.textContent = 'Logged in: Never';
        }
    } else {
        loggedInDate.textContent = 'Logged in: Never';
    }

    const usersPath = path.join(process.cwd(), 'database/users.json');
    if (fs.existsSync(usersPath)) {
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const totalUsers = Object.keys(usersData).length;
        usersLength.textContent = `${totalUsers}`;
    }
    else {
        usersLength.textContent = '0';
    }

    loadLogs();
});


const confirmNewUserBtn = document.querySelector('.confirm-new-user');


confirmNewUserBtn.addEventListener('click', () => {
    if (!document.querySelector('.add-new-user-container #username').value ||
        !document.querySelector('.add-new-user-container #id').value ||
        !document.querySelector('.add-new-user-container #reason').value ||
        !document.querySelector('.add-new-user-container #comment').value) {
        alert('Please fill in all fields.');
        return;
    }

    users.addUser({
        username: document.querySelector('.add-new-user-container #username').value,
        id: document.querySelector('.add-new-user-container #id').value,
        reason: document.querySelector('.add-new-user-container #reason').value,
        comment: document.querySelector('.add-new-user-container #comment').value,
        createdAt: new Date().toLocaleString()
    });

    newUserWindow.classList.remove('active');
});


const searchInput = document.querySelector('#searchInput');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const blacklistItems = document.querySelectorAll('.blacklist-item');

    blacklistItems.forEach(item => {
        const username = item.querySelector('.blacklist-name').textContent.toLowerCase();
        const id = item.querySelector('.blacklist-id').textContent.toLowerCase();
        const reason = item.querySelector('.blacklist-reason').textContent.toLowerCase();
        const comment = item.querySelector('.blacklist-notes').textContent.toLowerCase();

        if (username.includes(searchValue) || id.includes(searchValue) || reason.includes(searchValue) || comment.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';    
        }
    });
});




const windows = ['dashboard', 'logs', 'dev'];
const navigation = document.querySelectorAll('nav ul li a');


navigation.forEach(nav => {
    const location = nav.dataset.location;
    const element = document.querySelector(`.${location}`);
    if (element) {
        nav.addEventListener('click', (event) => {
            event.preventDefault();
            windows.forEach(win => {
                const winElement = document.querySelector(`.${win}`);
                if (winElement) {
                    winElement.classList.remove('active');
                }
            });
            element.classList.add('active');
        });
    }
});


const createLog = (message) => {
    const logsPath = path.join(process.cwd(), 'database/logs.json');
    let logsData = [];
    if (fs.existsSync(logsPath)) {
        logsData = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    }
    const logEntry = {
        message,
        timestamp: new Date().toLocaleString()
    };
    logsData.push(logEntry);
    fs.writeFileSync(logsPath, JSON.stringify(logsData, null, '\t'));
    createHTMLElementInConsole(`Log created: ${message}`, '#00ff00');
};

const consoleContainer = document.querySelector('.console-output');
const createHTMLElementInConsole = (message, color = "#ddd") => {
    const logDiv = document.createElement('pre');
    logDiv.style.color = color || '#fff';
    logDiv.textContent = message;
    consoleContainer.appendChild(logDiv);
    consoleContainer.scrollTop = consoleContainer.scrollHeight; // Scroll to the bottom
};

const commands = [{
    name: 'add',
    description: 'Add a new user to the blacklist',
    execute: (args) => {
        if (args.length < 4) {
            createHTMLElementInConsole('Usage: add <username> <id> <reason> <comment>', 'red');
            return;
        }
        const [username, id, reason, comment] = args;
        users.addUser({
            username,
            id,
            reason,
            comment,
            createdAt: new Date().toLocaleString()
        });
        createHTMLElementInConsole('New user added to the blacklist.');
        createHTMLElementInConsole(`User added: ${username}, ID: ${id}, Reason: ${reason}, Comment: ${comment}`, '#00ff00');
    }
}, {
    name: 'remove',
    description: 'Remove a user from the blacklist',
    execute: (args) => {
        if (args.length < 1) {
            createHTMLElementInConsole('Usage: remove <username>', 'red');
            return;
        }
        const [username] = args;
        users.removeUser(username);
    }
}, {
    name: 'users',
    description: 'List all users in the blacklist',
    execute: () => {
        const usersPath = path.join(process.cwd(), 'database/users.json');
        if (fs.existsSync(usersPath) && fs.readFileSync(usersPath, 'utf8').length > 0) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            createHTMLElementInConsole('Blacklisted Users:');
            createHTMLElementInConsole(JSON.stringify(usersData, null, '\t'));
        } else {
            createHTMLElementInConsole('No users found in the blacklist.', 'yellow');
        }
    },
}, {
    name: 'help',
    description: 'List all available commands',
    execute: () => {
        createHTMLElementInConsole('Available commands:');
        commands.forEach(cmd => {
            createHTMLElementInConsole(`${cmd.name} - ${cmd.description}`, 'cyan');
        });
    }
}, {
    name: 'clear',
    description: 'Clear the console',
    execute: () => {
        console.clear();
        consoleContainer.innerHTML = ''; // Clear the console output
        createHTMLElementInConsole('------ Console cleared ------', 'yellow');
        
    }
}, {
    name: 'log',
    description: 'Create a log entry',
    execute: (args) => {
        if (args.length < 1) {
            createHTMLElementInConsole('Usage: log <message>', 'red');
            return;
        }
        const message = args.join(' ');
        createLog(message);
    }
}, {
    name: 'version',
    description: 'Display the current version of the application',
    execute: () => {
        const configPath = path.join(process.cwd(), 'database/config.json');
        if (fs.existsSync(configPath)) {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            createHTMLElementInConsole(`Version: ${configData.version}`);
            createHTMLElementInConsole(`Author: ${configData.author}`);
            createHTMLElementInConsole(`Link: ${configData.link}`);
        } else {
            createHTMLElementInConsole('Config file not found.', 'yellow');
        }
    }
}];

const consoleInput = document.querySelector('.console-input');

consoleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const input = consoleInput.value.trim();
        if (input) {
            const args = input.split(' ');
            const commandName = args.shift().toLowerCase();
            const command = commands.find(cmd => cmd.name === commandName);
            if (command) {
                command.execute(args);
            } else {
                createHTMLElementInConsole(`Command not found: ${commandName}`);
            }
        }
        consoleInput.value = '';
    }
});