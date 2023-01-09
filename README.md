#CHUTA - Instrumental Tutoring Personal Management System
Frontend app created for my Capstone Project using Reactjs, Javascript. Should be installed and connected with my Capstone Backend for full stack functionalities.
A web application frontend that has features that an instrumental tutor can utilise, it connects with a backend and consumes the api it offers.

#Some features are:
- User authentication            
- Basic authentication (bcrypt for salt and hash)
- Store school main contacts
- Log attendance and lesson notes for each student
- Contact all students (parents CC'ed) or parents of a school in a click
- Simple and aesthethic UI
#How to run
- Clone this frontend project to your local.
- In the project directory, run
 npm install (if there are peer dependecy issues with npm install, you can try npm install --legacy-peer-deps)
 npm start
 your default browser should automatically open to localhost:3000
- Clone the associated backend to your local
- You will need to create a .env file with 3 variables
  -API_PORT=4000
  -MONGO_URI= (this should look something like mongodb://localhost:27017/chutaDB)
  -TOKEN_KEY=(Long string of numbers and letters)
- Once this is created, in the project directory, run
npm run devStart
 
- Backend Repository: https://github.com/bonthebassist/Capstone-Backend.

The app and its functionality should be ready to use.
