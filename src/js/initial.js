if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const files = ['config.json', 'user.json', 'settings.json', 'logs.json', 'users.json'];
files.forEach(file => {
  const filePath = path.join(dbPath, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify((file === 'users.json' || file === 'logs.json') ? [] : {}, null, '\t'));
    // createLogMessage(new Date().toLocaleString(), `Created ${file} file`, "info");
  }
});


const settingsPath = path.join(dbPath, 'settings.json');
if (fs.existsSync(settingsPath)) {
  const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  
  if (Object.keys(settingsData).length === 0) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      safeMode: true,
      loggedIn: {
        date: new Date().toLocaleString(),
      }
    }, null, '\t'));
  }
} else {
  fs.writeFileSync(settingsPath, JSON.stringify({
    safeMode: true
  }, null, '\t'));
}

const configPath = path.join(dbPath, 'config.json');
if (fs.existsSync(configPath)) {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (Object.keys(configData).length === 0) {
    fs.writeFileSync(configPath, JSON.stringify({
      version: '1.0.0',
      author: 'aket0r',
      link: 'https://github.com/aket0r'
    }, null, '\t'));
  }
}
else {
  fs.writeFileSync(configPath, JSON.stringify({
    version: '1.0.0',
    author: 'aket0r',
    link: 'https://github.com/aket0r'
  }, null, '\t'));
}