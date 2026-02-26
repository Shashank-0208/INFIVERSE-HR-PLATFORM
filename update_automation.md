# Automation Endpoints Update Documentation

## 📋 Overview

This document summarizes the comprehensive cleanup and standardization of automation endpoints in the BHIV HR Platform. All deprecated, duplicate, and backward compatibility endpoints have been removed, leaving only single, clean endpoints for each automation function.

---

## 🔍 Analysis: Endpoints Before Cleanup

### Previous State (Dual Endpoints)
The backend had duplicate routes for each automation function - a "new" endpoint and a "deprecated" endpoint:

| Function | Primary Endpoint | Deprecated Endpoint |
|----------|-----------------|---------------------|
| Send Notification | `/automation/notifications/send` | `/tools/send-notification` |
| Bulk Notifications | `/automation/notifications/bulk` | `/automation/bulk-notifications` |
| Trigger Workflow | `/automation/workflows/trigger` | `/automation/trigger-workflow` |
| WhatsApp Webhook | `/automation/webhooks/whatsapp` | `/webhook/whatsapp` |
| Test Email | `/automation/test/email` | `/test/send-email` |
| Test WhatsApp | `/automation/test/whatsapp` | `/test/send-whatsapp` |
| Test Telegram | `/automation/test/telegram` | `/test/send-telegram` |
| Test WhatsApp Buttons | `/automation/test/whatsapp-buttons` | `/test/send-whatsapp-buttons` |
| Test Sequence | `/automation/test/sequence` | `/test/send-automated-sequence` |

---

## ✅ Cleanup Completed

### Backend Changes (LangGraph Service)

**File:** `backend/services/langgraph/app/main.py`

All deprecated duplicate decorators have been removed. Each automation endpoint now has exactly one route:

#### 1. Notifications Endpoints
```python
# BEFORE (dual routes):
@app.post("/automation/notifications/send", tags=["Automation - Notifications"])
@app.post("/tools/send-notification", tags=["Automation - Notifications"], deprecated=True, include_in_schema=False)
async def send_notification(...):

# AFTER (single route):
@app.post("/automation/notifications/send", tags=["Automation - Notifications"])
async def send_notification(...):
```

#### 2. Bulk Notifications Endpoint
```python
# Single endpoint: /automation/notifications/bulk
@app.post("/automation/notifications/bulk", tags=["Automation - Notifications"])
async def send_bulk_notifications(...):
```

#### 3. Workflow Trigger Endpoint
```python
# Single endpoint: /automation/workflows/trigger
@app.post("/automation/workflows/trigger", tags=["Automation - Workflows"])
async def trigger_workflow_automation(...):
```

#### 4. WhatsApp Webhook Endpoint
```python
# Single endpoint: /automation/webhooks/whatsapp
@app.post("/automation/webhooks/whatsapp", tags=["Automation - Webhooks"])
async def whatsapp_webhook(...):
```

#### 5. Test Endpoints
```python
# All test endpoints are now clean single routes:
@app.post("/automation/test/email", tags=["Automation - Testing"])
@app.post("/automation/test/whatsapp", tags=["Automation - Testing"])
@app.post("/automation/test/telegram", tags=["Automation - Testing"])
@app.post("/automation/test/whatsapp-buttons", tags=["Automation - Testing"])
@app.post("/automation/test/sequence", tags=["Automation - Testing"])
```

---

## 📁 Files Updated

### Backend Files

| File | Change |
|------|--------|
| `backend/services/langgraph/app/main.py` | Removed 9 deprecated endpoint decorators |
| `backend/services/candidate_portal/app.py` | Updated `/automation/trigger-workflow` → `/automation/workflows/trigger` |
| `backend/tests/comprehensive_endpoint_tests.py` | Updated test URL to `/automation/workflows/trigger` |

### Frontend Files (Already Aligned)

| File | Endpoint Used | Status |
|------|---------------|--------|
| `frontend/src/pages/recruiter/AutomationPanel.tsx` | `/automation/notifications/send` | ✅ Correct |
| `frontend/src/pages/recruiter/AutomationPanel.tsx` | `/automation/test/sequence` | ✅ Correct |
| `frontend/src/pages/recruiter/BatchOperations.tsx` | `/automation/notifications/bulk` | ✅ Correct |

---

## 🏗️ Final Endpoint Architecture

### Production Endpoints

```
POST /automation/notifications/send     - Send single notification
POST /automation/notifications/bulk     - Send bulk notifications
POST /automation/workflows/trigger      - Trigger workflow automation
POST /automation/webhooks/whatsapp      - Handle WhatsApp webhook callbacks
```

### Test Endpoints

```
POST /automation/test/email             - Test email sending
POST /automation/test/whatsapp          - Test WhatsApp sending
POST /automation/test/telegram          - Test Telegram sending
POST /automation/test/whatsapp-buttons  - Test WhatsApp interactive buttons
POST /automation/test/sequence          - Test automated notification sequence
```

### Endpoint Hierarchy

```
/automation/
├── /notifications/
│   ├── /send              (single notification)
│   └── /bulk              (bulk notifications)
├── /workflows/
│   └── /trigger           (workflow automation)
├── /webhooks/
│   └── /whatsapp          (WhatsApp callbacks)
└── /test/
    ├── /email             (email testing)
    ├── /whatsapp          (WhatsApp testing)
    ├── /telegram          (Telegram testing)
    ├── /whatsapp-buttons  (interactive buttons)
    └── /sequence          (full sequence testing)
```

---

## 📄 API Documentation

### 1. Send Single Notification

**Endpoint:** `POST /automation/notifications/send`

**Description:** Send notifications to a single candidate via email, WhatsApp, and other channels.

**Request Body:**
```json
{
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "candidate_phone": "+1234567890",
  "job_title": "Software Engineer",
  "message": "Your application has been updated",
  "channels": ["email", "whatsapp"],
  "application_status": "shortlisted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Automated notification sequence completed",
  "candidate_name": "John Doe",
  "job_title": "Software Engineer",
  "sequence_type": "shortlisted",
  "channels_requested": ["email", "whatsapp"],
  "results": {...},
  "sent_at": "2026-02-23T10:30:00.000Z"
}
```

### 2. Send Bulk Notifications

**Endpoint:** `POST /automation/notifications/bulk`

**Description:** Send notifications to multiple candidates at once.

**Request Body:**
```json
{
  "candidates": [
    {
      "candidate_name": "John Doe",
      "candidate_email": "john@example.com",
      "candidate_phone": "+1234567890"
    },
    {
      "candidate_name": "Jane Smith",
      "candidate_email": "jane@example.com",
      "candidate_phone": "+0987654321"
    }
  ],
  "sequence_type": "shortlisted",
  "job_data": {
    "job_title": "Software Engineer",
    "job_id": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "bulk_result": {
    "total": 2,
    "success_count": 2,
    "failed_count": 0,
    "results": [...]
  },
  "sent_at": "2026-02-23T10:30:00.000Z"
}
```

### 3. Trigger Workflow Automation

**Endpoint:** `POST /automation/workflows/trigger`

**Description:** Trigger automated workflows based on events.

**Request Body:**
```json
{
  "event_type": "candidate_shortlisted",
  "payload": {
    "candidate_id": "abc123",
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "job_title": "Software Engineer"
  }
}
```

**Supported Event Types:**
- `application_received`
- `candidate_shortlisted`
- `interview_scheduled`
- `feedback_requested`
- `candidate_rejected`
- `candidate_profile_updated`

### 4. WhatsApp Webhook

**Endpoint:** `POST /automation/webhooks/whatsapp`

**Description:** Handle incoming WhatsApp message responses (from Twilio).

**Note:** This endpoint should be configured in Twilio dashboard as the webhook URL.

---

## 🔧 Notification Types

The system supports the following notification types:

| Type | Description | Channels |
|------|-------------|----------|
| `application_received` | Confirmation of application receipt | Email, WhatsApp |
| `shortlisted` | Candidate has been shortlisted | Email, WhatsApp |
| `interview_scheduled` | Interview has been scheduled | Email, WhatsApp (with buttons) |
| `feedback_request` | Request for feedback | Email, WhatsApp |
| `rejection_sent` | Professional rejection notification | Email, WhatsApp |

---

## ⚠️ Breaking Changes

### Removed Endpoints

The following endpoints have been **permanently removed**:

| Removed Endpoint | Replacement |
|-----------------|-------------|
| `/tools/send-notification` | `/automation/notifications/send` |
| `/automation/bulk-notifications` | `/automation/notifications/bulk` |
| `/automation/trigger-workflow` | `/automation/workflows/trigger` |
| `/webhook/whatsapp` | `/automation/webhooks/whatsapp` |
| `/test/send-email` | `/automation/test/email` |
| `/test/send-whatsapp` | `/automation/test/whatsapp` |
| `/test/send-telegram` | `/automation/test/telegram` |
| `/test/send-whatsapp-buttons` | `/automation/test/whatsapp-buttons` |
| `/test/send-automated-sequence` | `/automation/test/sequence` |

### External Integration Updates Required

**Twilio WhatsApp Webhook:**
- Old: `https://your-domain.com/webhook/whatsapp`
- New: `https://your-domain.com/automation/webhooks/whatsapp`

---

## ✅ Verification Checklist

- [x] All deprecated endpoint decorators removed from `main.py`
- [x] Frontend components using correct endpoints
- [x] Candidate portal using updated workflow trigger path
- [x] Test configuration files updated
- [x] API documentation updated
- [x] Endpoint naming follows RESTful conventions

---

## 🧪 Testing

Run the comprehensive test script to verify all endpoints:

```bash
cd backend
python test_automation_endpoints.py
```

See `test_automation_endpoints.py` for the complete test suite.

---

## 📅 Update History

| Date | Change |
|------|--------|
| 2026-02-23 | Initial cleanup - removed all deprecated dual endpoints |
| 2026-02-23 | Updated candidate_portal/app.py endpoint path |
| 2026-02-23 | Updated test configuration files |
| 2026-02-23 | Created documentation |

---

**Document Version:** 1.0  
**Last Updated:** February 23, 2026
