// Import the sqlite3 library
const sqlite3 = require('sqlite3').verbose();


// Open a connection to the database, returns Database obj.
function connDB() {
    let db = new sqlite3.Database('../DB/Assignment', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });
    return db;
}


// Close a connection to the database
function disConDB(db) {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}


// Define a function to query Users table to get user data by UserName
function getUserByName(userName) {
    const db = connDB();
    try {
        if (db) {

            db.serialize(() => { // Use a parameterized query to safely update the tokens
                db.all(`SELECT * FROM Users WHERE UserName IS ?;`, [userName], (err, row) => {
                    if (err) {
                        console.error('Error fetching data:', err.message);
                    } else {
                        if (row.length > 0) {
                            console.log('User data:' + [row.UserName, row.Tokens]);
                            rows.forEach((row) => {
                                return row
                            });
                        } else {
                            console.log('No user found with the given username.');
                        }
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error getting data from DB:', err.message);
    } finally {
        disConDB(db);
    }
}

function getTokensByUserName(userName, callback) {
    const db = connDB();
    const query = `SELECT Tokens FROM Users WHERE UserName = ?`;
    
    db.get(query, [userName], (err, row) => {
        disConDB(db);
        if (err) {
            console.error('Error fetching data:', err.message);
            callback(err, null);
            return;
        }
        if (row) {
            callback(null, row.Tokens);
        } else {
            callback(new Error('User not found'), null);
        }
    });
}


function addTokens(userName, tokensToAdd, callback) {
    const db = connDB();
    
    // SQL query to update the Tokens column
    const updateQuery = `UPDATE Users SET Tokens = Tokens + ? WHERE UserName = ?`;

    db.run(updateQuery, [tokensToAdd, userName], function(err) {
        disConDB(db);
        if (err) {
            console.error('Error updating tokens:', err.message);
            callback(err, null);
            return;
        }
        if (this.changes === 0) {
            callback(new Error('User not found or no changes made'), null);
        } else {
            callback(null, `Tokens successfully added to user ${userName}`);
        }
    });
}




function updateTokens(userName, newTokens) {
    const db = connDB();
    try {
        if (db) {
            db.serialize(() => {
                const query = `UPDATE Users SET Tokens = ? WHERE UserName = ?;`;

                db.run(query, [newTokens, userName], function (err) {
                    if (err) {
                        console.error('Error updating tokens:', err.message);
                    } else {
                        console.log(`Tokens updated for ${userName}. Rows affected: ${this.changes}`);
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error updating tokens in DB:', err.message);
    } finally {
        disConDB(db);
    }
}


//TODO: Proper login page. 
function login(userName, newTokens) {
    const db = connDB();
    try {
        if (db) {
            db.serialize(() => {
                db.all(`SELECT * FROM Users WHERE UserName IS ?;`, [userName], (err, rows) => {
                    if (err) {
                        console.error('Error fetching data:', err.message);
                    } else {
                        if (rows.length > 0) {
                            console.log('User data:');
                            rows.forEach((row) => {
                                console.log(`${row.UserName}, ${row.Tokens}`);
                            });
                        } else {
                            console.log('No user found with the given username.');
                        }
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error getting data from DB:', err.message);
    } finally {
        disConDB(db);
    }
}

module.exports = {
    addTokens,
    getUserByName,
    updateTokens,
    getTokensByUserName,
    login
};