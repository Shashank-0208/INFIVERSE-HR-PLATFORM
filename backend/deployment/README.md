# 🚀 BHIV HR Platform - Deployment Configuration

**Professional deployment setup for all environments**

## 📁 Directory Structure

```
deployment/
├── scripts/                    # Deployment and utility scripts
│   ├── cleanup-docker.bat      # Windows Docker cleanup
│   ├── deploy_rl_migration.py  # RL database migration
│   ├── deploy_rl_tables.py     # RL table deployment
│   ├── deploy_rl_to_render.py  # RL Render deployment
│   ├── deploy_to_render.cmd    # Windows Render deployment
│   ├── health-check.sh         # Service health monitoring
│   ├── push_rl_tables.py       # RL table push script
│   ├── quick-deploy.sh         # Quick deployment script
│   ├── unified-deploy.sh       # Main deployment script
│   └── requirements.txt        # Script dependencies
├── render-deployment.yml       # Render platform configuration
└── README.md                   # This deployment guide
```

## 🐳 Docker Deployment

### Local Development
```bash
# Start all services (from project root)
docker-compose -f docker-compose.production.yml up -d

# Check service health
./deployment/scripts/health-check.sh

# Stop services
docker-compose -f docker-compose.production.yml down
```

### Unified Deployment Script
```bash
# Deploy locally with all options
./deployment/scripts/unified-deploy.sh local --build --health --logs

# Quick deployment
./deployment/scripts/quick-deploy.sh

# Production information
./deployment/scripts/unified-deploy.sh production
```

## ☁️ Cloud Deployment (Render)

### Configuration
- **Platform**: Render Cloud (Oregon, US West)
- **Config File**: `render-deployment.yml`
- **Auto-Deploy**: GitHub integration enabled
- **SSL**: Automatic HTTPS certificates

### Services
| Service | URL | Status |
|---------|-----|--------|
| Gateway | bhiv-hr-gateway-ltg0.onrender.com | 🟢 Live (80 endpoints) |
| Agent | bhiv-hr-agent-nhgg.onrender.com | 🟢 Live (6 endpoints) |
| LangGraph | bhiv-hr-langgraph.onrender.com | 🟢 Live (9 endpoints) |
| HR Portal | bhiv-hr-portal-u670.onrender.com | 🟢 Live |
| Client Portal | bhiv-hr-client-portal-3iod.onrender.com | 🟢 Live |
| Candidate Portal | bhiv-hr-candidate-portal-abe6.onrender.com | 🟢 Live |

## 🔧 Environment Configuration

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Security
API_KEY_SECRET=your_secure_api_key
JWT_SECRET=your_jwt_secret

# Services
GATEWAY_URL=http://gateway:8000
AGENT_URL=http://agent:9000
```

### Configuration Files
- **Local**: `.env`
- **Production**: Environment variables on Render
- **Staging**: `config/.env.staging`

## 📊 Health Monitoring

### Health Check Endpoints
```bash
# Gateway service
curl https://bhiv-hr-gateway-ltg0.onrender.com/health

# Agent service  
curl https://bhiv-hr-agent-nhgg.onrender.com/health

# Detailed health with metrics
curl https://bhiv-hr-gateway-ltg0.onrender.com/health/detailed
```

### Monitoring Dashboard
- **Metrics**: `/metrics` (Prometheus format)
- **Dashboard**: `/metrics/dashboard`
- **System Health**: `/health/detailed`

## 🔄 Deployment Process

### Automated Deployment
1. **Code Push**: Push to main branch
2. **Auto-Build**: Render builds services automatically
3. **Health Check**: Automated health verification
4. **Go Live**: Services become available

### Manual Deployment
1. **Prepare**: Update environment variables
2. **Build**: `docker-compose build`
3. **Deploy**: `docker-compose up -d`
4. **Verify**: Run health checks
5. **Monitor**: Check logs and metrics

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Dependencies updated
- [ ] Tests passing
- [ ] Security scan completed

### Post-Deployment
- [ ] All services healthy
- [ ] API endpoints responding
- [ ] Database connectivity verified
- [ ] Monitoring active
- [ ] Performance metrics normal

## 🚨 Troubleshooting

### Common Issues
1. **Service Not Starting**: Check environment variables
2. **Database Connection**: Verify DATABASE_URL
3. **API Errors**: Check API_KEY_SECRET
4. **Performance Issues**: Monitor resource usage

### Debug Commands
```bash
# Check service logs
docker-compose logs gateway

# Test database connection
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://bhiv-hr-gateway-ltg0.onrender.com/test-candidates

# Verify API endpoints
curl https://bhiv-hr-gateway-ltg0.onrender.com/docs
```

## 🔧 Deployment Troubleshooting

### Common Deployment Issues

**1. Docker Compose File Not Found**
```bash
# Issue: docker-compose.production.yml not found
# Solution: Run from project root directory
cd "C:\BHIV HR PLATFORM"
docker-compose -f docker-compose.production.yml up -d
```

**2. Port Conflicts**
```bash
# Issue: Port already in use
# Solution: Stop conflicting services
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**3. Environment Variables Missing**
```bash
# Issue: Service fails to start
# Solution: Check .env file exists and has required variables
type .env
```

**4. Database Connection Failed**
```bash
# Issue: Cannot connect to PostgreSQL
# Solution: Verify DATABASE_URL in environment
echo %DATABASE_URL%
```

---

**Last Updated**: December 9, 2025  
**Status**: 🟢 All 6 Services Operational (111 Endpoints)  
**Cost**: $0/month (Free tier)
