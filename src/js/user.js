const userDB = path.join(__process.cwd(), 'database/user.json');   

if (!fs.existsSync(userDB)) {
  // if not, create it with an empty object
  fs.writeFileSync(userDB, JSON.stringify({
      username: 'admin',
      id: Math.random().toString(36).substring(2, 15),
      date: new Date().toLocaleString(),
    }, null, '\t'));
} else {
  // if it exists, read the file and parse it
  const userData = JSON.parse(fs.readFileSync(userDB, 'utf8'));
  
  // Check if the user data is empty and initialize if necessary
  if (Object.keys(userData).length === 0) {
    fs.writeFileSync(userDB, JSON.stringify({
      username: 'admin',
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toLocaleString(),
    }, null, '\t'));
  }
}