# API Reference

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Health

| Method | Path           | Description            |
|--------|----------------|------------------------|
| GET    | `/api/health`  | Health check           |

### Documents

| Method | Path                  | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/documents`      | List all documents       |
| POST   | `/api/documents`      | Upload a new document    |
| GET    | `/api/documents/:id`  | Get document by ID       |

### Workflows

| Method | Path                          | Description                  |
|--------|-------------------------------|------------------------------|
| GET    | `/api/workflows`              | List available n8n workflows |
| POST   | `/api/workflows/:id/trigger`  | Trigger a workflow           |
