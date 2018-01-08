class User {
    constructor(nick, socketId) {
        this.socketId = socketId;
        this.nick = nick;
    }
}

class Users {
    constructor() {
        this.users = [];
    }

    add(nick, socketId) {
        this.users.push(new User(nick, socketId));
    }

    remove(socketId) {
        this.users = this.users.filter(u => u.socketId !== socketId);
    }

    nickAvailable(nick) {
        return this.users.every(user => user.nick !== nick);
    }
}

module.exports = Users;
