About Vetora
---

Vetora is a pet clinic management system that was developed for the purposes of IFN636 Software Life Cycle Management's Assessment 2: Software, Development, Testing, and Configuration. It aims to facilitate day-to-day operations of Australian general-practice veterinary clinics. It currently supports CRUD (Create, Read, Update, Delete) operations for user, patient file, and appointment management.

Setup
---

**Requirements**<br>
Git (https://git-scm.com/)<br>
MongoDB (https://www.mongodb.com/)<br>
Node.js (https://nodejs.org/en)<br>
Visual Studio Code (https://code.visualstudio.com/)<br>

**Step 1. Set Up Local Repository**<br>
Launch Command Prompt (or your preferred CLI):
1. ```git clone https://github.com/Rachel-Lim-QUT/vetora.git```
2. ```cd vetora```

**Step 2. Connect Remote Repository**<br>
To connect your local repository to your GitHub repository:
1. ```git remote remove origin```
2. ```git remote add origin <YOUR REMOTE REPOSITORY URL>```
3. ```git branch -M main```
4. ```git push -u origin main```

**Step 3. Set Up Vetora**<br>
Launch Visual Studio Code and open your project folder:
1. Create a .env file in the **backend** folder.
2. Set your MONGO_URI.
3. Select Terminal > New Terminal.
4. Run ```npm install mongodb``` in the **root** folder.
5. Run ```npm run install-all``` in the **root** folder.
6. Run ```npm start``` to test.