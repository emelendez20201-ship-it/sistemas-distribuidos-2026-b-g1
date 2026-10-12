# Product Brief

project_key: PRJ-CANCHAS-FUTBOL-V01

## Declared Tech Stack

- backend: Go
- database: MySQL
- frontend: Angular

---

## 00-contexto-inicial.md

# Contexto inicial

El negocio administra varias canchas de fútbol y recibe reservas de clientes
durante la semana.

Actualmente las reservas se realizan mediante llamadas, mensajes o anotaciones
manuales, lo que puede generar confusión con los horarios disponibles.

Se necesita un sistema sencillo para registrar clientes, consultar la
disponibilidad de las canchas y realizar reservas.

El sistema utilizará Angular para la interfaz, Go para el backend y MySQL para
la base de datos.

---

## 01-necesidades-y-problemas.md

# Necesidades y problemas

- Registrar las canchas disponibles.
- Registrar clientes.
- Consultar horarios disponibles.
- Crear reservas.
- Consultar las reservas realizadas.
- Evitar reservar una cancha que ya esté ocupada.

Problema principal: actualmente no existe un sistema centralizado para controlar
la disponibilidad y las reservas de las canchas.

---

## 02-procesos-actuales.md

# Procesos actuales

1. El cliente solicita una cancha.
2. El administrador revisa la disponibilidad.
3. Se selecciona la fecha y horario.
4. Se registran los datos del cliente.
5. Se confirma la reserva.
6. El administrador consulta las reservas del día.

---

## 03-preguntas-abiertas.md

# Preguntas abiertas

- ¿Cuántas canchas tendrá el establecimiento?
- ¿Cuál será el precio por hora?
- ¿Cuánto durará cada reserva?
- ¿Se manejarán anticipos?
- ¿Habrá uno o varios administradores?
- ¿Se podrán cancelar las reservas?

---

## 04-glosario-negocio.md

# Glosario de negocio

- **Cancha:** espacio destinado para jugar fútbol.
- **Reserva:** registro de una cancha para una fecha y horario.
- **Cliente:** persona que realiza la reserva.
- **Horario:** periodo de tiempo reservado.
- **Disponibilidad:** indica si una cancha puede ser reservada.
- **Administrador:** persona encargada de gestionar las canchas y reservas.

---

## Historias de usuario

### HU-CAN-001 - Registrar cancha

**Como** administrador,  
**quiero** registrar una cancha,  
**para** tener disponibles sus datos en el sistema.

### HU-CAN-002 - Consultar disponibilidad

**Como** administrador,  
**quiero** consultar las canchas disponibles,  
**para** conocer qué horarios puedo reservar.

### HU-CAN-003 - Registrar reserva

**Como** administrador,  
**quiero** registrar una reserva indicando cliente, cancha, fecha y horario,  
**para** asegurar el espacio solicitado.

### HU-CAN-004 - Consultar reservas

**Como** administrador,  
**quiero** consultar las reservas realizadas,  
**para** conocer la programación de las canchas.

### HU-CAN-005 - Cancelar reserva

**Como** administrador,  
**quiero** cancelar una reserva,  
**para** liberar nuevamente el horario de la cancha.

---

## Modelo básico

### Cancha

- id
- nombre
- tipo
- precio_hora

### Cliente

- id
- nombre
- telefono

### Reserva

- id
- cancha_id
- cliente_id
- fecha
- hora_inicio
- hora_fin
- estado

---

## API básica

```text
GET    /api/canchas
POST   /api/canchas

GET    /api/clientes
POST   /api/clientes

GET    /api/reservas
POST   /api/reservas
DELETE /api/reservas/{id}

GET    /api/canchas/disponibles
