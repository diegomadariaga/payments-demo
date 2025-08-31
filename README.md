📦 Order / Payments Event-Driven Core

📝 Descripción

Este proyecto implementa un núcleo de pedidos y pagos basado en eventos que demuestra cómo manejar consistencia eventual y transacciones distribuidas en un ecosistema de microservicios.

El flujo principal es:

Orders → Payments → Fulfillment

Al crear una orden, se dispara una saga distribuida que coordina el proceso de pago y la reserva de inventario, garantizando confiabilidad en un entorno asíncrono y desacoplado.

Este sistema no está pensado como un e-commerce completo, sino como un proyecto demostrativo de arquitectura moderna, ideal para mostrar dominio en:
	•	Mensajería asíncrona (Kafka)
	•	Patrones de consistencia eventual (Outbox, Sagas, Idempotencia)
	•	Observabilidad completa (Métricas, Logs, Traces distribuidos)
	•	Tolerancia a fallos (Retry, Backoff, Circuit Breaker)

⸻

🎯 Objetivos de Aprendizaje
	•	Diseñar un sistema basado en eventos con garantías de entrega exacta (exactly-once lógico).
	•	Implementar idempotency keys para evitar duplicados en órdenes y pagos.
	•	Orquestar una saga distribuida con pasos de negocio y compensaciones potenciales.
	•	Medir KPIs clave de rendimiento y resiliencia.
	•	Mostrar una integración completa con herramientas de observabilidad moderna.

⸻

🛠️ Stack Tecnológico

Backend & Core
	•	Node.js + NestJS → Framework backend modular y escalable.
	•	PostgreSQL → Base de datos transaccional para órdenes, inventario y tabla outbox.
	•	Kafka → Event bus para propagar cambios entre servicios.
	•	Redis → Cache + control de idempotencia y circuit breaker.

Observabilidad
	•	OpenTelemetry → Trazas distribuidas entre servicios y eventos.
	•	Prometheus → Recolección de métricas.
	•	Grafana → Dashboards con KPIs del sistema.
	•	Logs estructurados con orderId, correlationId y traceId.

Infraestructura
	•	Docker + Docker Compose → Orquestación local de servicios (Postgres, Kafka, Redis, Prometheus, Grafana, etc.).
	•	Zookeeper (Bitnami) → Requisito de Kafka en local.
	•	OTEL Collector → Centraliza métricas y traces.

⸻

📐 Arquitectura

Servicios principales
	1.	Order Service
	•	API REST (POST /orders, GET /orders/{id})
	•	Persiste órdenes en PostgreSQL
	•	Aplica Outbox Pattern para publicar eventos OrderCreated en Kafka
	2.	Payments Adapter (simulado)
	•	Recibe eventos OrderCreated
	•	Simula autorización de pago (aprobado/rechazado con retry/backoff)
	•	Emite eventos PaymentConfirmed o PaymentFailed
	3.	Fulfillment / Inventory Service
	•	Escucha PaymentConfirmed
	•	Reserva inventario y responde con InventoryReserved o InventoryFailed
	4.	(Opcional) Saga Orchestrator
	•	Alternativa a la coreografía de eventos: coordina pasos explícitamente.
	•	Útil para demostrar compensaciones y mayor control.

⸻

estructura del Proyecto: 

/repo
  /services
    /orders-service
    /payments-adapter
    /fulfillment-service
    /saga-orchestrator (opcional)
  /infra
    docker-compose.yml
    prometheus/
    grafana/
    otel-collector/
  /scripts
    demo.sh
  README.md


  Cada servicio = NestJS app independiente con su propio Dockerfile y package.json. Usa TypeORM (si ya estás familiarizado) o Prisma; en los ejemplos uso TypeORM.

  

📊 Patrones Implementados
	•	Outbox Pattern → Garantiza que los eventos se publiquen una sola vez lógicamente, dentro de la misma transacción que la orden.
	•	Idempotency Keys → Asegura que la creación de órdenes y pagos no se duplique bajo reintentos.
	•	Retry + Backoff + Circuit Breaker → En la integración de pagos, se reintenta con política exponencial y se evita sobrecargar servicios fallidos.
	•	Saga Pattern (coreografía / orquestación) → La creación de una orden dispara una saga que avanza paso a paso (pago → inventario → fulfilment).
	•	Event Correlation → Cada mensaje Kafka lleva correlationId y traceparent para rastrear el flujo completo en traces.

⸻

📡 APIs Principales
	•	POST /orders → Crea una nueva orden y dispara la saga.
	•	GET /orders/{id} → Devuelve el estado agregado de la orden (FSM + pasos completados).
	•	POST /payments/callback → Webhook de simulación de pagos.

⸻

🗄️ Modelo de Datos
	•	Orders → Representa la orden con un estado tipo máquina de estados finita (CREATED, PAYMENT_PENDING, FULFILLED, etc.).
	•	OutboxEvents → Almacena eventos generados en transacciones para posterior publicación.
	•	InventoryReservations → Registra intentos de reserva de inventario asociados a órdenes.

⸻

📈 Observabilidad
	•	Métricas Prometheus
	•	order_saga_duration_seconds → Duración total de la saga por orden.
	•	payment_failures_total → Total de pagos fallidos.
	•	outbox_pending → Cantidad de eventos en espera de publicación.
	•	Traces OpenTelemetry
	•	Cada paso de la saga genera spans correlacionados.
	•	Propagación de contexto en headers HTTP y Kafka headers.
	•	Logs estructurados
	•	En formato JSON con orderId, correlationId, traceId, service.

⸻

📊 KPIs (objetivos de rendimiento)
	•	<100ms P50 creación de orden (sin incluir pago).
	•	<2s promedio confirmación completa de orden.
	•	<5% tasa de reintentos en pagos.

⸻



🔮 Extensiones Futuras
	•	Dead-letter topic handler para mensajes no procesados.
	•	Compensations (ej: cancelar pago o liberar inventario).
	•	Multi-tenancy con aislamiento de tenants en DB y topics Kafka.
	•	Schema Registry (Avro/Protobuf) para contratos de eventos.

⸻

🎓 Valor Curricular

Este proyecto muestra dominio práctico en:
	•	NestJS avanzado (módulos, transacciones, workers).
	•	Consistencia eventual y sagas distribuidas.
	•	Patrones de resiliencia en microservicios.
	•	Observabilidad full-stack (traces, métricas, logs).
	•	Infra moderna con Docker/Kafka/Postgres/Redis.

Ideal para entrevistas técnicas y como pieza clave en un portafolio de backend / arquitectura distribuida.