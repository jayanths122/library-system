# Library System :books:
### NodeJs application to manage a library system. See the [working application](https://node-library-service.herokuapp.com/)

## Application functionality :sparkles:
1. Admin Role :computer:
   - Admin log-in
   - Admin profile with basic info
   - View all the books in the library
   - Manage Books
     - Add a new book
     - Update details of existing book
     - Delete books
   - Manage Requests
     - Approve issue requests from users
     - Disapprove requests from users
   - Log-our

2. User Role :bust_in_silhouette:
   - User registration
   - User log-in post completion of registration
   - User profile with basic info the user used to sign up
   - Profile updation 
   - View all the books in the library
   - Issue a request for a book which will later be approved or disapproved by the admin
   - View a list of all previous activities involving requesting and issuing of books
   - Delete all previous activities with a click of a button
   - Log-out    


## Instructions to install the dependencies :package:
```
npm install --save body-parser connect-flash cookie-parser dotenv ejs express express-sanitizer express-session mongoose mongoose-paginate passport passport-local passport-local-mongoose uuid
```

## Instructions to run the application :sparkles:
```
npm start
```

## Sample credentials to test out the application
1. Admin
   - **username**: **_admin_**
   - **password**: **_123_**  

2. User
   - **username**: **_user_**
   - **password**: **_123_**  


## Technologies used :package: 
## Front-end 
1. HTML
2. CSS
3. Jquery
4. BOOTSTRAP/BOOTSTRAP4

## Back-end
1. Node.js
2. Express.js
3. Passport.js

## Database
1. MongoDB

