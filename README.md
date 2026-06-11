# ₿ Real-Time Crypto Arbitrage & Price Comparison Engine

> A fault-tolerant, full-stack distributed system ingesting live cryptocurrency prices from 6 global exchanges via WebSocket, with an intelligent normalization pipeline, Redis Streams, and a React dashboard for real-time arbitrage visualization.

---

## 📌 Overview

A production-grade crypto intelligence platform that simultaneously connects to 6 global exchanges, normalizes heterogeneous price data in real time, detects arbitrage opportunities across trading pairs, and streams everything to a responsive React frontend — all with ~99% uptime through self-healing fault detection.

This is not a toy project. It handles live WebSocket feeds from multiple exchanges concurrently, manages connection failures gracefully, and pushes pre-normalized data into Redis Streams to eliminate redundant downstream computation.

---

## ✨ Features

### ⚙️ Backend — Distributed Data Pipeline
- **6 Exchange Integrations** — Binance, Bybit, Coinbase, Kraken, OKX, WazirX
- **WebSocket-first with REST fallback** — Primary feed via WebSocket streams; auto-switches to REST polling on disconnection
- **Auto-reconnect & ~99% uptime** — Self-healing reconnection logic across all exchange connections
- **Concurrent ingestion** — 15 live cryptocurrency trading pairs ingested simultaneously
- **Multi-exchange normalization layer** — Handles heterogeneous schemas, symbol remapping, and live INR/USDT conversion
- **Redis Streams** — Pre-normalized data published directly into Redis Streams, eliminating redundant computation per consumer
- **Fault detection** — Circuit-breaker flags, batch subscription splitting, dynamic symbol validation to isolate failures without service interruption
- **Arbitrage engine** — Real-time spread detection across exchanges to identify price discrepancy opportunities

### 🖥️ Frontend — React Dashboard
- Live price comparison across all 6 exchanges
- Real-time WebSocket feed consumption
- Spread alerts for arbitrage opportunities
- Interactive coin tracking system
- Live price charts

---

## 🏗️ Architecture

```
BitcoinApp/
│
├── Bitcoin/                        # Spring Boot Backend
│   └── src/main/java/
│       ├── service/
│       │   ├── ExchangeWebSocketService.java   # WS connections per exchange
│       │   ├── NormalizationService.java        # Schema mapping & INR/USDT conversion
│       │   ├── ArbitrageService.java            # Spread detection logic
│       │   └── RedisStreamPublisher.java        # Publishes to Redis Streams
│       ├── config/
│       │   ├── RedisConfig.java                 # Redis Streams setup
│       │   └── KafkaConfig.java                 # Kafka producer config
│       ├── controller/
│       │   └── PriceController.java             # REST + WebSocket endpoints
│       └── model/
│           └── NormalizedPrice.java             # Unified price model
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/             # PriceTable, SpreadAlert, Chart
│   │   ├── hooks/                  # useWebSocket, usePriceData
│   │   ├── services/               # API + WebSocket connection handlers
│   │   └── App.jsx
│   └── package.json
│
└── .gitignore
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Java + Spring Boot** | Core backend framework |
| **WebSocket (javax/Spring)** | Real-time exchange data ingestion |
| **REST (Spring Web)** | Fallback polling for exchange APIs |
| **Apache Kafka** | Event-driven async message pipeline |
| **Redis + Redis Streams** | Caching & normalized data stream |
| **Spring Scheduler** | Reconnect & health-check tasks |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI framework |
| **WebSocket API** | Live data consumption from backend |
| **JavaScript (ES6+)** | Core logic |
| **CSS3** | Styling & layout |

---

## 🔌 Key Backend Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/prices` | Get latest normalized prices for all pairs |
| `GET` | `/arbitrage` | Get current spread opportunities |
| `WS` | `/ws/prices` | WebSocket feed — live price updates |
| `WS` | `/ws/spreads` | WebSocket feed — live arbitrage alerts |

---

## ⚙️ Setup & Run

### Prerequisites
- Java JDK 17+
- Node.js 18+
- Redis (local or Upstash)
- Apache Kafka (local or cloud)

---

### 🔧 Backend Setup

**1. Navigate to backend folder**
```bash
cd Bitcoin
```

**2. Configure environment**

Create `src/main/resources/application.properties` (gitignored — never commit it):
```properties
spring.data.redis.host=${REDIS_HOST}
spring.data.redis.port=${REDIS_PORT}
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS}

# Exchange API keys (if applicable)
BINANCE_API_KEY=${BINANCE_API_KEY}
COINBASE_API_KEY=${COINBASE_API_KEY}
```

**3. Run the backend**
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

---

### 🎨 Frontend Setup

**1. Navigate to frontend folder**
```bash
cd frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure backend URL**

Create `.env` in the `frontend/` folder:
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

**4. Start the frontend**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🔐 Security Notes

> ⚠️ The following are **never committed** to this repository:

| Sensitive Item | How to Handle |
|---------------|--------------|
| `application.properties` | Create locally with your own credentials |
| Exchange API keys | Use environment variables |
| Redis credentials | Use environment variables |
| Frontend `.env` | Create locally with backend URL |

---

## 🚫 What's Not Included

| Excluded Item | Reason |
|--------------|--------|
| `application.properties` | Contains Redis, Kafka, API credentials |
| `.env` (frontend) | Contains backend URL config |
| `.idea/` | IntelliJ IDE settings — should be gitignored |
| `target/` | Compiled build artifacts |
| `node_modules/` | Frontend dependencies — run `npm install` |

> 💡 **Note:** The `.idea/` folder is currently present in the repo. Run the following to clean it up:
> ```bash
> echo ".idea/" >> .gitignore
> git rm -r --cached .idea/
> git commit -m "Remove .idea from tracking"
> git push
> ```

---

## 🎯 Key Engineering Decisions

- **WebSocket-first with REST fallback** — WebSocket is always preferred for low latency; REST polling kicks in automatically on WS disconnection, ensuring no data gaps
- **Normalization before publishing** — Data is normalized once at ingestion and pushed into Redis Streams, so all downstream consumers receive clean, unified data without re-processing
- **Circuit-breaker pattern** — Exchange integration failures are isolated immediately via circuit-breaker flags, preventing cascading failures across the pipeline
- **Redis Streams over Kafka for price data** — Ultra-low latency price ticks are better suited for Redis Streams; Kafka handles heavier event-driven workflows

---

## 🎯 Key Concepts Demonstrated

- Distributed real-time data pipeline architecture
- Multi-source WebSocket connection management with fault tolerance
- Schema normalization across heterogeneous APIs
- Redis Streams for high-throughput message passing
- Full-stack ownership — Java backend + React frontend
- Self-healing systems with circuit-breaker and reconnect logic
- Concurrent ingestion across 15 live trading pairs

---

## 👩‍💻 Author

**Shalvi Gaur** — [GitHub](https://github.com/Shalvigour) · [LinkedIn](https://linkedin.com/in/shalvi-gour)
