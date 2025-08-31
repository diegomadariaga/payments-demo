-- Orders (simplificado)
CREATE TYPE order_state AS ENUM (
    'CREATED',
    'PAYMENT_PENDING',
    'PAYMENT_CONFIRMED',
    'PAYMENT_FAILED',
    'INVENTORY_RESERVED',
    'FULFILLED',
    'CANCELLED'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    state order_state NOT NULL DEFAULT 'CREATED',
    idempotency_key TEXT,
    correlation_id UUID,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Outbox table
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID,
    aggregate_type TEXT,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    attempts INT DEFAULT 0,
    published BOOLEAN DEFAULT FALSE,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ
);

-- Inventory reservations
CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    sku TEXT NOT NULL,
    qty INT NOT NULL,
    status TEXT NOT NULL,
    -- RESERVED, COMMITTED, RELEASED
    created_at TIMESTAMPTZ DEFAULT now()
);