class User {
    constructor(username, password, fname, lname, clinic, role) {
        this.username = username;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.clinic = clinic;
        this.role = role;
    }

    print() {
        console.log(
            'User Details\n' +
            '------------\n' +
            `Username: ${this.username}\n` +
            `Password: ${this.password}\n` +
            `Name:     ${this.fname} ${this.lname}\n` +
            `Clinic:   ${this.clinic}\n` +
            `Role:     ${this.role}`
        )
    }
}

class Administrator extends User {
    constructor(username, password, fname, lname, clinic, role = 'Administrator') {
        super(username, password, fname, lname, clinic, role);
        this.permissions = {
            patientCreate: true,
            patientView: true,
            patientUpdate: { 'Details': true, 'Medical History': true },
            patientDelete: true,
            appointmentCreate: true,
            appointmentView: true,
            appointmentUpdate: true,
            appointmentDelete: true
        }
    }
}

class Veterinarian extends User {
    constructor(username, password, fname, lname, clinic, role = 'Veterinarian') {
        super(username, password, fname, lname, clinic, role);
        this.permissions = {
            patientCreate: true,
            patientView: true,
            patientUpdate: { 'Details': true, 'Medical History': true },
            patientDelete: false,
            appointmentCreate: true,
            appointmentView: true,
            appointmentUpdate: true,
            appointmentDelete: true
        }
    }
}

class VeterinaryNurse extends User {
    constructor(username, password, fname, lname, clinic, role = 'Veterinary Nurse') {
        super(username, password, fname, lname, clinic, role);
        this.permissions = {
            patientCreate: true,
            patientView: true,
            patientUpdate: { 'Details': true, 'Medical History': true },
            patientDelete: false,
            appointmentCreate: true,
            appointmentView: true,
            appointmentUpdate: true,
            appointmentDelete: true
        }
    }
}

class Receptionist extends User {
    constructor(username, password, fname, lname, clinic, role = 'Receptionist') {
        super(username, password, fname, lname, clinic, role);
        this.permissions = {
            patientCreate: true,
            patientView: true,
            patientUpdate: { 'Details': true, 'Medical History': false },
            patientDelete: false,
            appointmentCreate: true,
            appointmentView: true,
            appointmentUpdate: true,
            appointmentDelete: true
        }
    }
}

module.exports = { User, Administrator, Veterinarian, VeterinaryNurse, Receptionist };