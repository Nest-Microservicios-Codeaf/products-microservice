# Products Microservice

Microservicio de productos construido con NestJS y Prisma 7.

## Tecnologías

- **NestJS** - Framework de Node.js
- **Prisma 7** - ORM con sistema de adapters
- **SQLite** - Base de datos
- **TypeScript** - Lenguaje de programación

## Instalación

```bash
npm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
```

2. Genera el cliente de Prisma:

```bash
npx prisma generate
```

3. Ejecuta las migraciones:

```bash
npx prisma migrate dev
```

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Modelo de datos

### Product

- `id` - Int (autoincremental)
- `name` - String
- `price` - Float
- `available` - Boolean (default: true)
- `createdAt` - DateTime
- `updatedAt` - DateTime

## Endpoints (Microservicio)

Este servicio usa **message patterns** para comunicación entre microservicios:

- `create_product` - Crear producto
- `finad_all_products` - Listar productos con paginación
- `find_one_product` - Obtener producto por ID
- `update_product` - Actualizar producto
- `delete_product` - Soft delete (marca available como false)

## Prisma 7

Este proyecto usa Prisma 7 con el nuevo sistema de adapters. La configuración se encuentra en:

- `prisma/schema.prisma` - Schema de la base de datos
- `prisma.config.ts` - Configuración de Prisma
- `src/prisma.service.ts` - Servicio con adapter de LibSQL

## Comandos útiles de Prisma

```bash
# Generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio
npx prisma studio
```

## Autor

DaniSW15
