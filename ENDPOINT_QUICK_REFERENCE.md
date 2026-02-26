# Quick Endpoint Reference Guide

## 🚀 Use These Endpoints (NEW - Preferred)

### Production Endpoints
```bash
# Send single notification
POST /automation/notifications/send
Body: {
  "candidate_name": "John Doe",
  "notification_type": "application_received|interview_scheduled|shortlisted|feedback_request|rejection_sent",
  "candidate_email": "john@example.com",
  "candidate_phone": "+1234567890"
}

# Send bulk notifications
POST /automation/notifications/bulk
Body: {
  "candidates": [...],
  "sequence_type": "application_received|interview_scheduled|shortlisted|feedback_request|rejection_sent",
  "job_data": {...}
}

# Trigger workflow
POST /automation/workflows/trigger
Body: {
  "event_type": "application_received|interview_scheduled|candidate_shortlisted|feedback_requested|candidate_rejected",
  "payload": {...}
}

# WhatsApp webhook (configure in Twilio)
POST /automation/webhooks/whatsapp
```

### Test Endpoints
```bash
# Test email
POST /automation/test/email

# Test WhatsApp
POST /automation/test/whatsapp

# Test Telegram
POST /automation/test/telegram

# Test WhatsApp buttons
POST /automation/test/whatsapp-buttons

# Test full sequence
POST /automation/test/sequence
```

---

## ⚠️ Deprecated Endpoints (Still Work - Update When Possible)

These old paths still function but are marked deprecated:

```bash
# Old notification endpoint → Use /automation/notifications/send
POST /tools/send-notification

# Old bulk notifications → Use /automation/notifications/bulk
POST /automation/bulk-notifications

# Old workflow trigger → Use /automation/workflows/trigger
POST /automation/trigger-workflow

# Old WhatsApp webhook → Use /automation/webhooks/whatsapp
POST /webhook/whatsapp

# Old test endpoints → Use /automation/test/*
POST /test/send-email
POST /test/send-whatsapp
POST /test/send-telegram
POST /test/send-whatsapp-buttons
POST /test/send-automated-sequence
```

---

## 📋 Notification Types Reference

### Available Types (5 total)

1. **application_received** 
   - Event: `application_received`
   - Use: When candidate first applies

2. **interview_scheduled**
   - Event: `interview_scheduled`
   - Use: When interview is booked

3. **shortlisted**
   - Event: `candidate_shortlisted`
   - Use: When candidate advances

4. **feedback_request**
   - Event: `feedback_requested`
   - Use: Request candidate feedback

5. **rejection_sent** ✨ NEW
   - Event: `candidate_rejected`
   - Use: Professional rejection notification
   - Features: Encouraging message about future opportunities

---

## 🔧 Frontend Usage Examples

### BatchOperations.tsx
```typescript
// Bulk notification endpoint
const response = await axios.post(
  `${LANGGRAPH_URL}/automation/notifications/bulk`,
  {
    candidates: selectedCandidates,
    sequence_type: notificationType,  // "rejection_sent", etc.
    job_data: jobData
  }
);
```

### AutomationPanel.tsx
```typescript
// Single notification endpoint
const response = await axios.post(
  `${LANGGRAPH_URL}/automation/notifications/send`,
  notificationData
);

// Test sequence endpoint
const response = await axios.post(
  `${LANGGRAPH_URL}/automation/test/sequence`,
  testData
);
```

---

## 🏗️ Migration Path

### If you're updating code:
1. Replace old endpoint paths with new ones
2. No change to request/response format needed
3. Test functionality (should work identically)
4. Both old and new paths work during transition

### If you're integrating externally:
1. Use new `/automation/*` paths for all new integrations
2. Update existing webhooks when convenient
3. Old paths will remain functional for backward compatibility

---

## 📊 Endpoint Namespace Structure

```
/automation/
├── /notifications/     Production notification APIs
├── /workflows/         Workflow automation triggers
├── /webhooks/          External service callbacks
└── /test/             Testing and debugging endpoints
```

**Benefits:**
- ✅ Logical grouping by function
- ✅ Clear separation of test vs production
- ✅ RESTful naming conventions
- ✅ Easier to understand and maintain

---

## 🎯 Quick Checklist for Developers

**When sending notifications:**
- [ ] Use `/automation/notifications/send` or `/automation/notifications/bulk`
- [ ] Include notification_type (5 types available including `rejection_sent`)
- [ ] Provide candidate contact info (email/phone)
- [ ] Add job_data for context

**When testing:**
- [ ] Use `/automation/test/*` endpoints
- [ ] Check logs for delivery confirmation
- [ ] Verify email/WhatsApp/Telegram receipt

**When updating code:**
- [ ] Replace old paths with new `/automation/*` paths
- [ ] No other changes needed (API contracts identical)
- [ ] Test to confirm functionality

---

**See ENDPOINT_STANDARDIZATION_COMPLETE.md for full technical details**
