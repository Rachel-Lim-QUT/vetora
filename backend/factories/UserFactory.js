const { User, Administrator, Veterinarian, VeterinaryNurse, Receptionist } = require('../classes/userClass');

class UserFactory {
    static createUser(username, password, fname, lname, clinic, role) {
        let userInstance;
        switch (role) {
            case "Administrator":
                userInstance = new Administrator(username, password, fname, lname, clinic);
                break;
            case "Veterinarian":
                userInstance = new Veterinarian(username, password, fname, lname, clinic);
                break;
            case "Veterinary Nurse":
                userInstance = new VeterinaryNurse(username, password, fname, lname, clinic);
                break;
            case "Receptionist":
                userInstance = new Receptionist(username, password, fname, lname, clinic);
                break;
            default:
                userInstance = new User(username, password, fname, lname, clinic, role);
        }
        return userInstance;
    }
}

module.exports = { UserFactory };