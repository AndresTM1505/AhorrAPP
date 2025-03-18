
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

## Configuración de la aplicación cliente

Por defecto, la aplicación cliente intenta conectarse a `http://localhost:3001/api`. Si estás accediendo a la aplicación desde otro dispositivo o dominio, deberás cambiar la URL de la API:

1. En la aplicación web, haz clic en el ícono de engranaje (⚙️) en la parte superior derecha.
2. Introduce la URL completa del servidor, incluyendo la dirección IP del servidor y el puerto:
   ```
   http://192.168.1.100:3001/api
   ```
   (Reemplaza 192.168.1.100 con la dirección IP de tu servidor)
3. Haz clic en "Probar Conexión" para verificar la conectividad.
4. Haz clic en "Guardar Configuración" para aplicar los cambios.

## Acceso desde otros dispositivos

Para permitir el acceso desde otros dispositivos en tu red local:

1. Asegúrate de que el servidor esté escuchando en todas las interfaces (esto ya está configurado).
2. Asegúrate de que el firewall permita conexiones al puerto 3001:
   - En Windows: Abre el Firewall de Windows > Configuración avanzada > Reglas de entrada > Nueva regla > Puerto > TCP > 3001
   - En macOS: Sistema > Seguridad y privacidad > Firewall > Opciones de firewall > Añadir aplicación/servicio
   - En Linux: `sudo ufw allow 3001/tcp`
3. Utiliza la dirección IP de tu computadora en lugar de `localhost` al configurar la aplicación cliente.

## API Endpoints

- `GET /api/transactions` - Obtener todas las transacciones
- `POST /api/transactions` - Agregar una nueva transacción
- `PUT /api/transactions/:id` - Actualizar una transacción existente
- `DELETE /api/transactions/:id` - Eliminar una transacción
- `POST /api/whatsapp-webhook` - Webhook para mensajes de WhatsApp
- `GET /api/status` - Verificar el estado del servidor

## Integración con WhatsApp

El servidor incluye un endpoint para procesar mensajes desde WhatsApp. La estructura esperada del mensaje es:

```
Tipo, Categoría, Descripción, Monto, Fecha, Hora
```

Ejemplo: `Gasto, comida, bembos, 22.90, 4-2-25, 3pm`

Para una integración completa con WhatsApp Business API, se necesitará configurar un webhook con un proveedor como Twilio o MessageBird.

## Solución de problemas

Si tienes problemas para conectar la aplicación cliente con el servidor:

1. Asegúrate de que el servidor está ejecutándose correctamente (`node server.js`).
2. Verifica que puedes acceder al servidor directamente: abre `http://localhost:3001/api/status` en un navegador en el mismo dispositivo donde se ejecuta el servidor.
3. Si estás accediendo desde otro dispositivo, asegúrate de usar la dirección IP correcta de la máquina del servidor.
4. Comprueba la configuración del firewall y asegúrate de que el puerto 3001 está abierto.
5. Verifica que tanto el cliente como el servidor estén en la misma red.
