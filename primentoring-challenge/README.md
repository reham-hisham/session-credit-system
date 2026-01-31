
# Primentoring Challenge

## Quick setup
- Requirements: Docker & Docker Compose.
- Start everything with:

```bash
docker compose up --build -d
```

This will build and run the backend, Postgres and Redis in detached mode. Migrations and seeding are run by the container scripts.

Swagger UI: http://localhost:5000/api

---

## Short summary of architectural decisions
- Tried to follow the DDD architecture (Domain-Driven Design) 
- I added a repository layer so services do not directly use the DB driver (keeps services focused on business logic).
- Aggregator services handle interactions with external services (keeps domain logic isolated).
- Redis is included to help with caching 
- Added `endDate` to bookings to make overlap validation easier and more correct.
- Global DTO validation (`class-validator`) is used for input validation.
- Custom exceptions live in `src/common/exceptions` for consistent error responses.
- Config values like `MINUTES_PER_CREDIT` and `BASE_BOOKING_DURATION` are set via `.env` and loaded with `@nestjs/config`.
- Seeder file provides preconfigured credit packages so the app is ready after boot, and also seeds a mentor user with id `eeec42a8-a876-4ddb-ac53-5c25f38ff08f` for easy booking.
- Create / edit / delete of credit packages is restricted to **admin** users.

---


## What I'd improve with more time
- Concurrency handling (to prevent double-booking and race conditions on credit deductions).
- Add unit tests.
- make more validations, review more for any possible enhancments 

