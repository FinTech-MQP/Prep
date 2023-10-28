# Database

This package defines the prisma schema, and provides access to this project's database

## Installing and running PostgresSQL

1. Download PostgresSQL at https://www.postgresql.org/download/
    * Windows: Just click "Download the Installer" on the first line
    * I downloaded PostgreSQL Version 16, for Windows x86-64
2. Launch the installer, and follow the steps to install
    1. I just used the defaults, but if you change anything just make sure the box for the pgadmin4 install is checked so it installs that too
    2. Make sure to remember the password you put in
3. Once it is done, launch pgadmin4
    * You should be able to search for it
4. In the object explorer, Under servers, right click the "PostgresSQL" dropdown and click "Create -> Database"
5. Name the database WillowDB (technically this can be anything you want)
6. Click "Save"
7. Now the database is setup, you will need the connection string to put in the .env file
8. ```DATABASE_URL="postgresql://user:pass@localhost:5432/WillowDB?schema=public"```
    * default user should be postgres
    * password should be what you entered during step 2.2
    * Feel free to set this database up however you want, this is just how i did it
    * In the future we can use a remote deployment and change the URL


## How to use (if you want to access the database)
To use the database in your package/app, you will need to do the following in your package/app:
1. Add the database to your package.json
```
"dependencies": {
    "database": "*",
    ...
  },
```

2. Import the prisma client
```import { prisma } from "database"```

3. Use the prisma client

CRUD Operations using Prisma: https://www.prisma.io/docs/concepts/components/prisma-client/crud

## How to use (if you want to change the database)

We use [Prisma](https://prisma.io/) to manage & access our database. As such you will need a database for this project, either locally or hosted in the cloud.

Once deployed you will need to copy the `.env.example` file to `.env` in order for Prisma to have a `DATABASE_URL` environment variable to access.

```bash
cp .env.example .env
```

If you added a custom database name, or use a cloud based database, you will need to update the `DATABASE_URL` in your `.env` accordingly.

Once deployed & up & running, you will need to create & deploy migrations to your database to add the necessary tables. This can be done using [Prisma Migrate](https://www.prisma.io/migrate):

```bash
npx prisma migrate dev
```

If you need to push any existing migrations to the database, you can use either the Prisma db push or the Prisma migrate deploy command(s):

```bash
pnpm run db:push

# OR

pnpm run db:migrate:deploy
```

There is slight difference between the two commands & [Prisma offers a breakdown on which command is best to use](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate).

An optional additional step is to seed some initial or fake data to your database using [Prisma's seeding functionality](https://www.prisma.io/docs/guides/database/seed-database).

To do this update check the seed script located in `packages/database/src/seed.ts` & add or update any users you wish to seed to the database.

Once edited run the following command to run tell Prisma to run the seed script defined in the Prisma configuration:

```bash
yarn run db:seed
```

For further more information on migrations, seeding & more, we recommend reading through the [Prisma Documentation](https://www.prisma.io/docs/).
## Commands

### Generate
Generates the prisma client based on the schema.
Run this command whenever the database schema is updated.

```prisma generate```

### Build
Builds the project and exports the prisma client so other apps/packages can import it

```pnpm run build```

### Other commands
Look in this project's package.json for other commands you can run, such as seeding the database with dummy values (defined in seed.ts)