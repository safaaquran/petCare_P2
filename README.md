# Pet Care Jordan

Pet Care Jordan is a full-stack web application designed to support pet adoption, lost and found pet reporting, veterinary communication, vaccination tracking, and pet care management in Jordan.

The system provides role-based access for Users, Veterinarians, and Admins. Users can browse adoption posts, report lost or found pets, chat with veterinarians or pet owners, and view pet-related information on an interactive map. Veterinarians can manage medical and vaccination information, while Admins can review and manage adoption and lost/found posts.

## Project Repository

GitHub Repository:  
https://github.com/safaaquran/petCare_P2

## Main Features

- User, Veterinarian, and Admin authentication
- Role-based access control using JWT
- Adoption posts with admin approval
- Adoption search and filtering by pet type, age, city, and health status
- Lost and found pet reporting
- Admin review for lost and found reports
- Interactive public pets map
- Chat between users and veterinarians
- Chat between users through adoption and lost/found posts
- Pet medical history viewing
- Vaccination tracking and vaccine reminders
- Image upload for adoption and community posts
- Arabic and English user interface support
- Dashboard analytics for public pet information
- Backend API testing with Postman
- Automated backend tests using xUnit

## User Roles

### User
Users can:
- Register and log in
- Browse pets available for adoption
- Create adoption posts
- Report lost pets
- Report found pets
- View lost and found community reports
- Start chats with pet owners or veterinarians
- View vaccine reminders and medical information related to their pets

### Veterinarian
Veterinarians can:
- Register and log in
- Communicate with users through chat
- View pet medical information
- Create vaccination plans
- Send vaccine reminder notifications

### Admin
Admins can:
- Log in using an admin account
- Review pending adoption posts
- Approve or reject adoption posts
- Review pending lost and found reports
- Approve, reject, or delete community reports
- View dashboard statistics

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- C#
- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication

### Database
- SQL Server LocalDB
- PetCareJordanDb

### Testing and Tools
- xUnit
- Postman
- Swagger / OpenAPI
- Visual Studio
- Visual Studio Code
- GitHub

## Project Structure

```text
petCare_P2
├── backend
│   └── PetCareJordan.Api
│       ├── Controllers
│       ├── Models
│       ├── Data
│       ├── Services
│       └── Program.cs
│
├── frontend
│   └── petcare-jordan-client
│       ├── src
│       │   ├── App.jsx
│       │   ├── api.js
│       │   └── main.jsx
│       └── package.json
│
├── PetCareJordan.Tests
│   └── Automated backend tests
│
└── testing_proofs
    └── Screenshots for Postman, xUnit, security, and frontend testing
