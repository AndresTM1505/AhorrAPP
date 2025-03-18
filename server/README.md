
# AhorrAPP Node.js Server

Este es el servidor Node.js para la aplicación AhorrAPP que conecta con PostgreSQL.

## Requisitos

- Node.js instalado
- PostgreSQL instalado y configurado con usuario `postgres` y contraseña `postgres`
- Base de datos `AhorrAPP` creada

## Configuración

1. Asegúrate de tener PostgreSQL instalado y funcionando
2. Crea la base de datos `AhorrAPP` en PostgreSQL:
   ```sql
   CREATE DATABASE "AhorrAPP";
   ```

## Instalación

1. Instala las dependencias:
   ```bash
   cd server
   npm install
   ```

## Ejecución del servidor

1. Inicia el servidor:
   ```bash
   node server.js
   ```
   
2. El servidor se ejecutará en el puerto 3001 por defecto.

## API Endpoints

- `GET /api/transactions` - Obtener todas las transacciones
- `POST /api/transactions` - Agregar una nueva transacción
- `PUT /api/transactions/:id` - Actualizar una transacción existente
- `DELETE /api/transactions/:id` - Eliminar una transacción
- `POST /api/whatsapp-webhook` - Webhook para mensajes de WhatsApp

## Integración con WhatsApp

El servidor incluye un endpoint para procesar mensajes desde WhatsApp. La estructura esperada del mensaje es:

```
Tipo, Categoría, Descripción, Monto, Fecha, Hora
```

Ejemplo: `Gasto, comida, bembos, 22.90, 4-2-25, 3pm`

Para una integración completa con WhatsApp Business API, se necesitará configurar un webhook con un proveedor como Twilio o MessageBird.
