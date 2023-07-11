## Preparation
1. Run a local instance of PostgreSQL through docker with
```
docker run --name admin -p 5432:5432 -e POSTGRES_PASSWORD=admin -d postgres
```
or natively following instructions for your OS.

2. Set `.env` file to the root folder with your credentials  
You also need to acquire API key at https://www.football-data.org/
```
POSTGRES_STRING=postgres://postgres:admin@0.0.0.0:5432/postgres
FOOTBALL_API_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
## Installation

1. Install dependencies with
```
pnpm i
```
2. Run DB migrations with
```
pnpm migrate
```
3. To run in development mode watching changes use
```
pnpm watch
```