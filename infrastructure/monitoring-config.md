# Configuração de Monitoramento e Alertas para Azure Container Apps

## Métricas Disponíveis

### Container App Métricas
- `Requests`: Número total de requests HTTP
- `RequestsPerSecond`: Requests por segundo
- `CpuUsage`: Uso de CPU (percentual)
- `MemoryUsage`: Uso de memória (percentual)
- `Replicas`: Número de réplicas ativas
- `RestartCount`: Número de reinicializações

### Alertas Recomendados

#### 1. Alto Uso de CPU
```bash
az monitor metrics alert create \
  --name "FastTech-Frontend-HighCPU" \
  --resource-group "rg-fasttech-foods" \
  --scopes "/subscriptions/{subscription-id}/resourceGroups/rg-fasttech-foods/providers/Microsoft.App/containerApps/ca-fasttech-frontend" \
  --condition "avg CpuUsage > 80" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 2 \
  --description "CPU usage is above 80% for 5 minutes"
```

#### 2. Alto Uso de Memória
```bash
az monitor metrics alert create \
  --name "FastTech-Frontend-HighMemory" \
  --resource-group "rg-fasttech-foods" \
  --scopes "/subscriptions/{subscription-id}/resourceGroups/rg-fasttech-foods/providers/Microsoft.App/containerApps/ca-fasttech-frontend" \
  --condition "avg MemoryUsage > 85" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 2 \
  --description "Memory usage is above 85% for 5 minutes"
```

#### 3. Muitos Erros HTTP
```bash
az monitor metrics alert create \
  --name "FastTech-Frontend-HighErrorRate" \
  --resource-group "rg-fasttech-foods" \
  --scopes "/subscriptions/{subscription-id}/resourceGroups/rg-fasttech-foods/providers/Microsoft.App/containerApps/ca-fasttech-frontend" \
  --condition "avg Requests where ResponseCode startswith '5' > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 1 \
  --description "High number of 5xx errors"
```

#### 4. Aplicação Indisponível
```bash
az monitor metrics alert create \
  --name "FastTech-Frontend-AppDown" \
  --resource-group "rg-fasttech-foods" \
  --scopes "/subscriptions/{subscription-id}/resourceGroups/rg-fasttech-foods/providers/Microsoft.App/containerApps/ca-fasttech-frontend" \
  --condition "avg Replicas < 1" \
  --window-size 2m \
  --evaluation-frequency 1m \
  --severity 0 \
  --description "No replicas available"
```

## Dashboard Personalizado

### KQL Queries Úteis

#### 1. Top URLs por Request Count
```kql
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "ca-fasttech-frontend"
| where Log_s contains "HTTP"
| extend ParsedLog = parse_json(Log_s)
| extend Method = tostring(ParsedLog.method)
| extend Path = tostring(ParsedLog.path)
| extend StatusCode = toint(ParsedLog.status)
| summarize RequestCount = count() by Path
| top 10 by RequestCount desc
```

#### 2. Tempo de Resposta por Endpoint
```kql
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "ca-fasttech-frontend"
| where Log_s contains "HTTP"
| extend ParsedLog = parse_json(Log_s)
| extend Path = tostring(ParsedLog.path)
| extend ResponseTime = toint(ParsedLog.responseTime)
| where isnotnull(ResponseTime)
| summarize AvgResponseTime = avg(ResponseTime), P95ResponseTime = percentile(ResponseTime, 95) by Path
| order by AvgResponseTime desc
```

#### 3. Erros por Hora
```kql
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "ca-fasttech-frontend"
| where Log_s contains "ERROR" or Log_s contains "Exception"
| summarize ErrorCount = count() by bin(TimeGenerated, 1h)
| render timechart
```

#### 4. Status de Saúde da Aplicação
```kql
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "ca-fasttech-frontend"
| where Log_s contains "health"
| extend ParsedLog = parse_json(Log_s)
| extend HealthStatus = tostring(ParsedLog.status)
| summarize count() by HealthStatus, bin(TimeGenerated, 5m)
| render timechart
```

## Configuração de Auto-scaling

### CPU-based Scaling
```bash
az containerapp update \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --scale-rule-name "cpu-scale" \
  --scale-rule-type "cpu" \
  --scale-rule-metadata "type=Utilization" "value=70"
```

### HTTP-based Scaling
```bash
az containerapp update \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --scale-rule-name "http-scale" \
  --scale-rule-type "http" \
  --scale-rule-metadata "concurrentRequests=50"
```

### Memory-based Scaling
```bash
az containerapp update \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --scale-rule-name "memory-scale" \
  --scale-rule-type "memory" \
  --scale-rule-metadata "type=Utilization" "value=80"
```

## Health Checks Avançados

### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Startup Probe
```yaml
startupProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 10
```

## Performance Tuning

### Configurações Recomendadas

#### Recursos Mínimos (Desenvolvimento)
- CPU: 0.25 cores
- Memory: 0.5Gi
- Min Replicas: 1
- Max Replicas: 3

#### Recursos Médios (Staging)
- CPU: 0.5 cores
- Memory: 1.0Gi
- Min Replicas: 1
- Max Replicas: 5

#### Recursos Altos (Produção)
- CPU: 1.0 cores
- Memory: 2.0Gi
- Min Replicas: 2
- Max Replicas: 10

## Troubleshooting

### Comandos Úteis

#### Ver logs em tempo real
```bash
az containerapp logs show \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --follow
```

#### Ver revisões ativas
```bash
az containerapp revision list \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --output table
```

#### Ver métricas
```bash
az monitor metrics list \
  --resource "/subscriptions/{subscription-id}/resourceGroups/rg-fasttech-foods/providers/Microsoft.App/containerApps/ca-fasttech-frontend" \
  --metric "Requests" \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z
```

#### Executar comando no container
```bash
az containerapp exec \
  --name ca-fasttech-frontend \
  --resource-group rg-fasttech-foods \
  --command "/bin/sh"
```
