# Estado Actual del Proyecto (Payments Demo)

Fecha: 2025-08-30

## Infraestructura
- Docker Compose con: Postgres, Redis, Zookeeper, Kafka, OTEL Collector, Prometheus, Grafana, orders-service.
- Archivos:
  - `infra/docker-compose.yml`
  - `infra/prometheus.yml`
  - `infra/otel-collector-config.yml`

## Servicios (skeletons generados con Nest CLI)
- `orders-service` (con dominio inicial + TypeORM)
- `payments-adapter` (sólo skeleton)
- `fulfillment-service` (sólo skeleton)
- `saga-orchestrator` (sólo skeleton, aún sin lógica)

## Orders Service (implementado)
- Entidades: `Order`, `OutboxEvent` (`synchronize: true` temporal).
- Endpoints:
  - POST `/orders` → crea orden y registra evento `order.created` en tabla outbox.
  - GET `/orders/:id` → obtiene orden.
- Validación global (`ValidationPipe`).
- Variables de entorno relevantes:
  - `DATABASE_URL=postgres://pguser:pgpass@postgres:5432/orders`
  - `PORT` (por defecto 3000 dentro del contenedor, expuesto como 3001 en host).

## Verificación realizada
1. Stack levantado: `docker compose -f infra/docker-compose.yml up -d`
2. Creación de orden (respuesta OK con estado `CREATED`).
3. Consulta de orden recupera registro persistido.

## Pendiente (Backlog Prioritario)
1. Outbox Dispatcher:
   - Worker/cron que lea `outbox_events` no publicados, emita a Kafka (`order.created`) y marque `published` + `publishedAt`.
   - Manejo de `attempts` y backoff simple.
2. Payments Adapter Logic:
   - Consumir topic `order.created`.
   - Simular autorización (éxito/fallo con probabilidad y retry/backoff).
   - Publicar `payment.authorized` o `payment.failed`.
3. Fulfillment Logic:
   - Consumir `payment.authorized`.
   - Simular reserva de inventario y publicar `inventory.reserved` / `inventory.failed`.
4. (Opcional) Saga Orchestrator:
   - Orquestar pasos en lugar de coreografía (modo alternativo configurable).
5. Observabilidad:
   - Instrumentar OpenTelemetry (traces) en Nest + Kafka producer/consumer.
   - Exponer métricas Prometheus: `order_saga_duration_seconds`, `outbox_pending`, etc.
6. Idempotencia:
   - Uso de Redis para almacenar claves (idempotencyKey) en creación de órdenes y pagos.
7. Circuit Breaker / Retry Policy:
   - Implementar wrapper (por ejemplo con `p-limit` o lógica propia) para pagos simulados.
8. Esquema de Topics Kafka:
   - Crear topics al inicio (script o wait-for) si no existen: `order.created`, `payment.authorized`, `payment.failed`, `inventory.reserved`, `inventory.failed`.
9. README (actualizar):
   - Instrucciones de arranque, endpoints, flujo de eventos, métricas y cómo observar logs/traces.
10. Hardening:
   - Reemplazar `synchronize: true` por migraciones.
   - Añadir índices (ej: `idempotency_key`, `published=false` en outbox).

## Riesgos / Notas Técnicas
- Actualmente no existe aislamiento de transacción para asegurar atomicidad outbox + order (faltaría transacción explícita si se complica la lógica futura).
- Falta gestión de reintentos y eliminación de eventos publicados antiguos (retention strategy).
- La imagen Node base muestra advertencia de vulnerabilidad alta (revisar alternativa o actualizar). 

## Próximo Paso Recomendado
Implementar el Outbox Dispatcher + publicación a Kafka para cerrar el ciclo inicial de eventos antes de avanzar con payments.

---
Este archivo resume el estado intermedio; actualizar al completar cada hito.
