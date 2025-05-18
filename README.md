# Nestjs eCommerce API

A RESTful API for an eCommerce platform built with NestJS, PostgreSQL, and TypeORM.
Dependencies

- typeorm: ORM for database operations (`npm install typeorm --save`)
- pg: PostgreSQL driver for Node.js (`npm install pg --save`)
- reflect-metadata: Metadata reflection for TypeScript (`npm install reflect-metadata --save`)
- node typings: (`npm install @types/node --save-dev`)
- nestjs typeorm integration (`npm install --save @nestjs/typeorm`)
- class-validator: Decorator-based validation for DTOs (`npm install --save class-validator`)
- class-transformer: Transforms plain objects to class instances and handles serialization (`npm install --save class-transformer`)
- dotenv (`npm i dotenv`)
- Json Web Token (`npm i jsonwebtoken`)
- Hash Password (`npm i bcrypt`)

## Modules

- users
- products
- orders
- shipping info
- category

## Database Commands

The following commands are available for managing the database and migrations:

```
"scripts": {
    "typeorm": "npm run build && npx typeorm -d dist/db/data-source.js",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "db:drop": "npm run typeorm schema:drop"
}
```

- **typeorm**: Base command that builds your project and runs TypeORM with your data source configuration.
- **migration:generate**: Creates a new migration file with SQL statements...

  - `npm run migration:generate -- db/migrations/initial`

- **migration:run**: Applies pending migrations to update your database schema...
  - `npm run migration:run`
- **migration:revert**: Rolls back the most recent migration...
  - `npm run migration:revert`
- **db:drop**: Completely drops all tables from your database...
  - `npm run db:drop`
