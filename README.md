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

- `backend/PetCareJordan.Api`  
  Contains the ASP.NET Core Web API project, controllers, models, data context, services, and backend configuration.

- `frontend/petcare-jordan-client`  
  Contains the React and Vite frontend application.

- `PetCareJordan.Tests`  
  Contains automated backend tests using xUnit.

- `testing_proofs`  
  Contains screenshots for Postman, xUnit, security testing, and frontend testing.

## Setup Instructions

### Prerequisites

Before running the project, make sure the following tools are installed:

- .NET SDK
- Node.js and npm
- SQL Server LocalDB
- Git
- Visual Studio or Visual Studio Code

You can check the installations using these commands:

- `dotnet --version`
- `node --version`
- `npm --version`
- `git --version`

## Running the Backend

Open a terminal from the project root, then run:

1. `cd backend/PetCareJordan.Api`
2. `dotnet restore`
3. `dotnet run`

After running the backend, the API URL will appear in the terminal.

Swagger can be opened by adding `/swagger` to the backend URL.

Example:

`http://localhost:PORT/swagger`

Replace `PORT` with the port number shown in your terminal.

## Running the Frontend

Open a second terminal from the project root, then run:

1. `cd frontend/petcare-jordan-client`
2. `npm install`
3. `npm run dev`

The frontend usually runs on:

`http://localhost:5173`

Open this link in the browser to use the website.

## Demo Accounts

Use the following demo accounts to test the system after running both the backend and frontend.

### User Account

Email: `yaqeen.alhammad@petcare.com`  
Password: `Pass123!`

### Veterinarian Account

Email: `malak.alquraan@petcare.com`  
Password: `Pass123!`

### Admin Account

Email: `safaa.alquraan@petcare.com`  
Password: `Pass123!`

## How to Use the Website

1. Start the backend using `dotnet run`.
2. Start the frontend using `npm run dev`.
3. Open the frontend link in the browser.
4. Choose one of the demo accounts from the sidebar.
5. Log in using the email and password.
6. Use the tabs to navigate between the main pages.

## Main Pages

### Overview

The overview page shows dashboard statistics and an interactive map for public pets across Jordan.

### Adoption

The adoption page allows users and veterinarians to create adoption posts. Admins can approve, reject, or delete adoption posts. Users can also search and filter pets by type, age, city, and health status.

### Lost and Found

The lost and found page allows users and veterinarians to create lost or found pet reports. Admins can approve, reject, or delete pending reports.

### Chat

The chat page allows users to communicate with veterinarians and pet owners.

### Medical Status

The medical page allows users to view medical and vaccination information. Veterinarians can create vaccination plans and send vaccine reminder notifications.

## Running Automated Tests

From the project root, run:

`dotnet test`

The test project includes backend tests for authentication, password verification, JWT role claims, pet search, adoption validation, medical records, and chat validation.

## API Controllers

The backend is organized into the following main controllers:

- `AuthController.cs`  
  Handles login, registration, authentication, and role-based access.

- `PetsController.cs`  
  Handles pet browsing, pet information, and collar ID search.

- `AdoptionsController.cs`  
  Handles adoption posts, adoption filtering, admin approval, rejection, and deletion.

- `CommunityController.cs`  
  Handles lost and found pet reports, pending reports, approval, rejection, and deletion.

- `MedicalController.cs`  
  Handles medical records, vaccination plans, and vaccine notifications.

- `ChatController.cs`  
  Handles chat conversations and messages.

- `DashboardController.cs`  
  Handles dashboard statistics and map-related data.

## Testing Evidence

Testing screenshots and reports are available in the `testing_proofs` folder.

This folder includes evidence for:

- Valid and invalid login
- User, Vet, and Admin authentication
- Postman API testing
- Security testing with JWT roles
- xUnit backend test results
- Adoption filtering
- Frontend testing
- Medical record testing
- Lost and found report testing

## Implemented Features Status

| Feature | Status |
|---|---|
| User Authentication | Implemented |
| Vet Authentication | Implemented |
| Admin Authentication | Implemented |
| Adoption Posts | Implemented |
| Adoption Filtering and Search | Implemented |
| Lost and Found Reports | Implemented |
| Lost Pet Search by ID / Collar ID | Implemented |
| Chat | Implemented |
| Medical Records | Implemented |
| Vaccination Tracking | Implemented |
| Vaccine Notifications | Implemented |
| Interactive Map | Implemented |
| Arabic and English Interface | Implemented |
| Admin Review and Management | Implemented |
| Backend Automated Tests | Implemented |

## Notes

- The system uses role-based access, so some pages and actions are only available to specific roles.
- Admin accounts are used to approve, reject, or delete adoption and lost/found posts.
- User and Vet accounts can create adoption or lost/found posts.
- The frontend supports both Arabic and English interface text.
- The project is intended for academic use as a Graduation Project.

## Team Members

- Yaqeen Daifallah Alhammad
- Safaa Mohammad Alquraan
- Heba Muwaffaq Aldwairi

## Supervisor

Dr. Luay Alawneh

## Committee Members

- Dr. Zakarea Alshara
- Dr. Raed Shatnawi

## Academic Information

Jordan University of Science and Technology  
College of Computer Sciences and Information Technology  
Software Engineering Department  
Graduation Project 2  
May 2026
