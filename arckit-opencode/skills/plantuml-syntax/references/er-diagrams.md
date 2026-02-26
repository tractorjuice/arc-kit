# PlantUML ER Diagram Reference

PlantUML supports Entity-Relationship diagrams for data modelling. Entities are defined with attributes, and relationships connect them with cardinality.

---

## Basic Syntax

```plantuml
@startuml
entity "Customer" as customer {
    * customer_id : INT <<PK>>
    --
    * name : VARCHAR(100)
    * email : VARCHAR(255)
    phone : VARCHAR(20)
    created_at : TIMESTAMP
}

entity "Order" as order {
    * order_id : INT <<PK>>
    --
    * customer_id : INT <<FK>>
    * order_date : DATE
    * status : VARCHAR(20)
    total_amount : DECIMAL(10,2)
}

customer ||--o{ order : places
@enduml
```

## Entity Attributes

### Key Markers

| Marker | Meaning |
|--------|---------|
| `*` | Mandatory (NOT NULL) |
| (no marker) | Optional (nullable) |
| `<<PK>>` | Primary Key |
| `<<FK>>` | Foreign Key |
| `<<UK>>` | Unique Key |

### Separator Lines

- `--` — single line separator (between PKs and other fields)
- `==` — double line separator
- `..` — dotted separator
- `__` — thick separator

### Example with Multiple Key Types

```plantuml
entity "OrderLine" as orderline {
    * order_id : INT <<PK, FK>>
    * line_number : INT <<PK>>
    --
    * product_id : INT <<FK>>
    * quantity : INT
    unit_price : DECIMAL(10,2)
}
```

## Relationships

### Cardinality Notation

| Syntax | Meaning |
|--------|---------|
| `\|o--o\|` | Zero or one to zero or one |
| `\|\|--o{` | Exactly one to zero or many |
| `\|\|--\|\|` | Exactly one to exactly one |
| `}o--o{` | Zero or many to zero or many |
| `\|\|--|{` | Exactly one to one or many |

### Cardinality Symbols

| Symbol | Meaning |
|--------|---------|
| `\|\|` | Exactly one |
| `o\|` | Zero or one |
| `\|{` | One or many |
| `o{` | Zero or many |

### Relationship Labels

```plantuml
customer ||--o{ order : "places"
order ||--|{ orderline : "contains"
product ||--o{ orderline : "appears in"
```

### Direction Control

```plantuml
' Default (left to right)
customer ||--o{ order

' Explicit directions
customer ||--o{ order   ' horizontal
customer ||..o{ order   ' horizontal dotted

' Vertical relationships (use -down-, -up-)
customer ||--o{ order
```

## Notes

```plantuml
entity Customer {
    * id : INT <<PK>>
}

note right of Customer
    Customer records are
    soft-deleted (not removed).
end note
```

## Packages

```plantuml
package "Customer Domain" {
    entity Customer
    entity Address
    Customer ||--o{ Address
}

package "Order Domain" {
    entity Order
    entity OrderLine
    Order ||--|{ OrderLine
}

Customer ||--o{ Order
```

## Colour and Styling

```plantuml
entity Customer #LightBlue {
    * id : INT <<PK>>
    --
    * name : VARCHAR
}

entity Order #LightGreen {
    * id : INT <<PK>>
    --
    * customer_id : INT <<FK>>
}
```

## Complete Example

```plantuml
@startuml
title Payment Gateway Data Model

entity "Customer" as customer {
    * customer_id : UUID <<PK>>
    --
    * email : VARCHAR(255) <<UK>>
    * name : VARCHAR(100)
    * created_at : TIMESTAMP
    phone : VARCHAR(20)
    address_id : INT <<FK>>
}

entity "Address" as address {
    * address_id : INT <<PK>>
    --
    * line1 : VARCHAR(255)
    line2 : VARCHAR(255)
    * city : VARCHAR(100)
    * postcode : VARCHAR(10)
    * country_code : CHAR(2)
}

entity "PaymentMethod" as paymethod {
    * method_id : UUID <<PK>>
    --
    * customer_id : UUID <<FK>>
    * type : VARCHAR(20)
    * token : VARCHAR(255)
    * is_default : BOOLEAN
    expires_at : DATE
}

entity "Transaction" as txn {
    * transaction_id : UUID <<PK>>
    --
    * customer_id : UUID <<FK>>
    * method_id : UUID <<FK>>
    * amount : DECIMAL(10,2)
    * currency : CHAR(3)
    * status : VARCHAR(20)
    * created_at : TIMESTAMP
    completed_at : TIMESTAMP
    provider_ref : VARCHAR(100)
}

entity "AuditLog" as audit {
    * log_id : BIGINT <<PK>>
    --
    * transaction_id : UUID <<FK>>
    * event_type : VARCHAR(50)
    * event_data : JSONB
    * created_at : TIMESTAMP
}

customer ||--o| address : "lives at"
customer ||--o{ paymethod : "has"
customer ||--o{ txn : "makes"
paymethod ||--o{ txn : "used for"
txn ||--o{ audit : "logged in"

@enduml
```

## Skinparam Options

```plantuml
skinparam entity {
    BackgroundColor #FFFFFF
    BorderColor #333333
    FontColor #333333
}

skinparam linetype ortho
```

**Tip**: `skinparam linetype ortho` forces orthogonal (right-angle) lines, which is often cleaner for ER diagrams.
