class Users {
    constructor() {
        this.users = []
    }

    addUser(id, name, room, joinTime) {
        let user = { id, name, room, joinTime }
        this.users.push(user);
        return user;
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        let nameArray = users.map((user) => user);
        return nameArray;
    }

    getUserInsideRoom(room) {
        let users = this.users.filter((user) => user.room === room);
        let userCount = users.length
        return userCount;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
}
module.exports = { Users }