# Peluquería - Sistema de Gestión

## Estructura del Proyecto

```
peluqueria/
├── frontend/          → React + Vite + Tailwind CSS + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── back/              → Node.js + Express + TypeScript (Arquitectura Hexagonal)
│   ├── src/
│   │   ├── domain/           ← Entidades y Puertos (contratos)
│   │   │   ├── entities/
│   │   │   └── ports/
│   │   ├── application/      ← Casos de uso
│   │   │   └── use-cases/
│   │   └── infrastructure/   ← Adaptadores (HTTP, Persistencia)
│   │       ├── http/
│   │       │   ├── routes/
│   │       │   └── server.ts
│   │       └── persistence/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Instalación

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd back
npm install
npm run dev
```

## Arquitectura Hexagonal (Backend)

- **Domain**: Entidades puras y puertos (interfaces). Sin dependencias externas.
- **Application**: Casos de uso que orquestan la lógica de negocio.
- **Infrastructure**: Implementaciones concretas (Express, base de datos, etc.)

Los repositorios son inyectados, lo que permite intercambiar fácilmente
la persistencia (InMemory → MongoDB → PostgreSQL) sin tocar la lógica de negocio.
