const { v4 } = require('uuid');
const sessions = {}; // Store sessions by session ID
const userAccounts = {}; // Store user accounts by session ID


const startSession = () => {
    const sessionId = v4();
    sessions[sessionId] = { credits: 10 };
    userAccounts[sessionId] = { totalCredits: 0 }; // Initialize user account
    return sessionId;
};

const sessionExists = (sessionId) => { return sessions[sessionId] }

const getSessionCredits = (sessionId) => {
    if (sessions[sessionId]) {
        let obj = Object.assign({}, sessions[sessionId])        
        return obj.credits;
    }
}


const getSessionById = (sessionId) => {
    if (sessions[sessionId]) {
        return sessions[sessionId]
    }
}


const addCreditsToSession = (sessionId, amount) => {
    if (sessions[sessionId]) {
        sessions[sessionId].credits += amount
        return true;
    }
    return false;
}

const deductCredit = (sessionId) => {
    if (sessions[sessionId]) {
        sessions[sessionId].credits -= 1
        return true;
    }
    return false;
}

const cashOut = (sessionId, credits) => {
    userAccounts[sessionId].totalCredits += credits;
    delete sessions[sessionId];
}


module.exports = {
    startSession,
    getSessionCredits,
    sessionExists,
    addCreditsToSession,
    getSessionById,
    deductCredit,
    cashOut
};




