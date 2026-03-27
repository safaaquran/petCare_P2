# PetCare Jordan

PetCare Jordan is a graduation-project web application with an ASP.NET Core Web API backend and a React frontend.

## Features

- Role-based login for `User`, `Vet`, and `Admin`
- Pet adoption listings
- Lost and found pet posts
- Collar ID search
- Pet medical history and vaccination tracking
- Vaccine reminder notifications
- Analytics dashboard
- Seeded demo data with 24 pets

## Project Structure

- `backend/PetCareJordan.Api`: ASP.NET Core backend
- `frontend/petcare-jordan-client`: React frontend

## Run Backend

1. Restore packages:
   - `dotnet restore backend/PetCareJordan.Api/PetCareJordan.Api.csproj --configfile NuGet.Config`
2. Start the API:
   - `dotnet run --project backend/PetCareJordan.Api`

The API uses LocalDB by default:

- `Server=(localdb)\MSSQLLocalDB;Database=PetCareJordanDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True`

## Run Frontend

1. Install dependencies:
   - `npm.cmd install`
2. Start the client:
   - `npm.cmd run dev`

## Demo Accounts

- Admin: `alaa@petcare.jo` / `Pass123!`
- Vet: `noor.vet@petcare.jo` / `Pass123!`
- User: `lina@petcare.jo` / `Pass123!`
