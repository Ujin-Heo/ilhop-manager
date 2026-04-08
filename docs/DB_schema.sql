-- UUID 확장이 필요하다면 실행
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "customers" (
    "customer_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "table_num"   int NOT NULL,
    "entry_time"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "menus" (
    "menu_id"    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "menu_name"  varchar(50) UNIQUE NOT NULL,
    "price"      bigint NOT NULL, -- 원화 기준 bigint 추천
    "image_url"  text,            -- 경로 저장
    "options"    text[]           -- ['살구맛', '청포도맛'] 등
);

CREATE TABLE "orders" (
    "order_id"       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customer_id"    uuid NOT NULL CONSTRAINT "FK_orders_customers" REFERENCES "customers"("customer_id"),
    "order_time"     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price"    bigint NOT NULL,
    "depositor"      varchar(50),
    "payment_status" bool DEFAULT false NOT NULL
);

CREATE TABLE "order_items" ( -- 'menus by order' 대신 직관적인 이름
    "order_id"    uuid NOT NULL CONSTRAINT "FK_order_items_orders" REFERENCES "orders"("order_id"),
    "menu_id"     uuid NOT NULL CONSTRAINT "FK_order_items_menus" REFERENCES "menus"("menu_id"),
    "quantity"    int NOT NULL CHECK (quantity > 0),
    "price_at_order" bigint NOT NULL, -- 주문 당시 가격 기록
    "selected_option" varchar(50),
    "is_served"   bool DEFAULT false NOT NULL,
    PRIMARY KEY ("order_id", "menu_id")
);