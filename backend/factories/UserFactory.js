const UserModel = require('../models/User');
const { User, Administrator, Veterinarian, VeterinaryNurse, Receptionist } = require('../classes/userClass');

let userInstance;

class UserFactory {
    static async createUser(username, password, fname, lname, clinic, role) {
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

        const user = await UserModel.create({
            fname: userInstance.fname,
            lname: userInstance.lname,
            clinic: userInstance.clinic,
            role: userInstance.role,
            username: userInstance.username,
            password: userInstance.password,
        });

        return user;
    }
}

module.exports = { UserFactory };