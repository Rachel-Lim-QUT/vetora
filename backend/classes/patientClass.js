class Patient {
    constructor(photo, name, age, gender, color, history, fname, lname, phone, email, type) {
        this.photo = photo;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.color = color;
        this.history = history;
        this.fname = fname; // Owner's first name.
        this.lname = lname; // Owner's last name.
        this.phone = phone; // Owner's phone number.
        this.email = email; // Owner's email address.
        this.type = type;
    }

    printPatientDetails() {
        console.log(
            'Patient Details\n' +
            '---------------\n' +
            `Photo:   ${this.photo}\n` +
            `Name:    ${this.name}\n` +
            `Age:     ${this.age}\n` +
            `Gender:  ${this.gender}\n` +
            `Color:   ${this.color}\n` +
            `Type:    ${this.type}\n`
        )
    }

    printOwnerDetails() {
        console.log(
            'Owner Details\n' +
            '-------------\n' +
            `First Name: ${this.fname}\n` +
            `Last Name:  ${this.lname}\n` +
            `Phone:      ${this.phone}\n` +
            `Email:      ${this.email}`
        )
    }
}

class Cat extends Patient {

    // Rachel's note: A universal list shared by all Cat objects.
    static breeds = ['Domestic Short Hair', 'Domestic Medium Hair', 'Domestic Long Hair'];

    constructor(photo, name, age, gender, color, history, fname, lname, phone, email, type = 'Cat') {
        super(photo, name, age, gender, color, history, fname, lname, phone, email, type);
        this.breed = '';
    }

    static addBreed(breed) {
        if (Cat.breeds.includes(breed) == true) {
            console.log(`${breed} has already been added.`)
        } else {
            Cat.breeds.push(breed);
            console.log(`${breed} has been added.`)
        }
    }

    setBreed(breed) {
        this.breed = breed;
        console.log(`${this.name}'s breed has been set to ${breed}.`)
    }
}

class Dog extends Patient {

    // Rachel's note: A universal list shared by all Dog objects.
    static breeds = ['Borzoi', 'Chihuahua', 'Shih Tzu'];

    constructor(photo, name, age, gender, color, history, fname, lname, phone, email, type = 'Dog') {
        super(photo, name, age, gender, color, history, fname, lname, phone, email, type);
        this.breed = '';
    }

    static addBreed(breed) {
        if (Dog.breeds.includes(breed) == true) {
            console.log(`${breed} has already been added.`)
        } else {
            Dog.breeds.push(breed);
            console.log(`${breed} has been added.`)
        }
    }

    setBreed(breed) {
        this.breed = breed;
        console.log(`${this.name}'s breed has been set to ${breed}.`)
    }
}

class Snake extends Patient {

    // Rachel's note: A universal list shared by all Snake objects.
    static speciesList = ["Children's Python", 'Pygmy Python', 'Eastern Brown Tree Snake'];

    constructor(photo, name, age, gender, color, history, fname, lname, phone, email, type = 'Snake') {
        super(photo, name, age, gender, color, history, fname, lname, phone, email, type);
        this.species = '';
    }

    static addSpecies(species) {
        if (Snake.speciesList.includes(species) == true) {
            console.log(`${species} has already been added.`)
        } else {
            Snake.speciesList.push(species);
            console.log(`${species} has been added.`)
        }
    }

    setSpecies(species) {
        this.species = species;
        console.log(`${this.name}'s breed has been set to ${species}.`)
    }
}

module.exports = { Patient, Cat, Dog, Snake };