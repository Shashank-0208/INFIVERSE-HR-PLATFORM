# BHIV HR Platform - External Service Integration Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Twilio WhatsApp Integration](#1-twilio-whatsapp-integration)
3. [Gmail SMTP Configuration](#2-gmail-smtp-configuration)
4. [Telegram Bot Integration](#3-telegram-bot-integration)
5. [Environment Variables Reference](#4-environment-variables-reference)
6. [Testing Each Channel](#5-testing-each-channel)
7. [Error Handling & Fallback Mechanisms](#6-error-handling--fallback-mechanisms)
8. [Rate Limiting Considerations](#7-rate-limiting-considerations)
9. [Compliance & Privacy Requirements](#8-compliance--privacy-requirements)
10. [Troubleshooting Guide](#9-troubleshooting-guide)

---

## Overview

The BHIV HR Platform uses three communication channels for candidate notifications:

| Channel | Provider | Purpose |
|---------|----------|---------|
| Email | Gmail SMTP | Primary communication, formal notifications |
| WhatsApp | Twilio API | Real-time updates, interactive responses |
| Telegram | Telegram Bot API | Alternative messaging, optional channel |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LangGraph Service                         │
│                     (Port 9001)                              │
├─────────────────────────────────────────────────────────────┤
│                  CommunicationManager                        │
│                  (communication.py)                          │
├─────────────┬─────────────────┬─────────────────────────────┤
│   Email     │    WhatsApp     │         Telegram            │
│   (SMTP)    │    (Twilio)     │         (Bot API)           │
└─────────────┴─────────────────┴─────────────────────────────┘
        │               │                    │
        ▼               ▼                    ▼
   Gmail Server    Twilio API         Telegram API
  (smtp.gmail.com) (api.twilio.com)  (api.telegram.org)
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/automation/notifications/send` | POST | Send single notification |
| `/automation/notifications/bulk` | POST | Send bulk notifications |
| `/automation/test/email` | POST | Test email sending |
| `/automation/test/whatsapp` | POST | Test WhatsApp sending |
| `/automation/test/telegram` | POST | Test Telegram sending |
| `/automation/test/sequence` | POST | Test full notification sequence |
| `/automation/webhooks/whatsapp` | POST | Handle WhatsApp responses |

---

## 1. Twilio WhatsApp Integration

### Step 1.1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account (includes $15 trial credit)
3. Verify your email and phone number

### Step 1.2: Get Twilio Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. From the dashboard, copy:
   - **Account SID**: Found at the top of the dashboard
   - **Auth Token**: Click "Show" next to Auth Token

```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (34 characters)
Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 characters)
```

### Step 1.3: Set Up WhatsApp Sandbox (Development)

For development/testing, use the Twilio WhatsApp Sandbox:

1. Navigate to: **Messaging → Try it out → Send a WhatsApp message**
2. Or go directly to: [https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
3. Note the sandbox number: `+14155238886`

#### Join the Sandbox

Each recipient must join the sandbox before receiving messages:

1. Send this message from the recipient's WhatsApp to **+1 415 523 8886**:
   ```
   join <your-sandbox-code>
   ```
   Example: `join brown-cat`

2. Wait for confirmation message from Twilio

### Step 1.4: Configure Webhook URL

**This is the critical step for receiving WhatsApp responses!**

1. Go to: **Messaging → Settings → WhatsApp Sandbox Settings**
   - Or: [https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox)

2. Set the webhook URLs - **copy these exact values:**

   **WHEN A MESSAGE COMES IN:**
   ```
   https://bhiv-hr-langgraph-luy9.onrender.com/automation/webhooks/whatsapp
   ```
   
   **HTTP Method:** POST

   **STATUS CALLBACK URL:**
   ```
   https://bhiv-hr-langgraph-luy9.onrender.com/automation/webhooks/whatsapp
   ```

3. Click **Save**

### Step 1.5: Production WhatsApp (Optional)

For production, you need:

1. **WhatsApp Business Account**: Apply via Twilio Console
2. **Business Verification**: Submit business documents
3. **Phone Number**: Purchase a Twilio phone number
4. **Message Templates**: Create and approve message templates

### Step 1.6: Environment Variables

**Copy and paste these exact lines to your .env file:**

```bash
# Required Twilio Environment Variables
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Note:** Get your Auth Token from Twilio Console dashboard (click "Show" next to Auth Token)

### Step 1.7: Verify Configuration

**Copy and paste this exact command in PowerShell:**

```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/whatsapp" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"phone":"+919284967526","message":"Test from BHIV HR Platform"}'
```

**Or use curl (Git Bash/CMD):**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/whatsapp" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"phone\":\"+919284967526\",\"message\":\"Test from BHIV HR Platform\"}"
```

Expected Response:
```json
{
  "success": true,
  "result": {
    "status": "success",
    "channel": "whatsapp",
    "message_id": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "recipient": "+919284967526"
  }
}
```

---

## 2. Gmail SMTP Configuration

### Step 2.1: Enable 2-Step Verification (Required)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in to your Google Account
3. Click **2-Step Verification**
4. Follow the setup wizard:
   - Add phone number for verification
   - Choose verification method (Text or Call)
   - Enter verification code
   - Click **Turn On**

### Step 2.2: Generate App Password

**Note:** App passwords are only available with 2-Step Verification enabled.

1. Go to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords

2. Sign in if prompted

3. Create new app password:
   - **Select app:** Mail
   - **Select device:** Other (Custom name)
   - Enter name: `BHIV HR Platform`
   - Click **Generate**

4. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
   - **Important:** Save this immediately - you won't see it again!
   - Remove spaces for use: `xxxxxxxxxxxxxxxx`

### Step 2.3: Configure Gmail Settings

Enable "Less secure app access" (if app password doesn't work):

1. Go to: [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)
2. Turn on "Allow less secure apps"
3. **Note:** This is less secure than app passwords

### Step 2.4: SMTP Server Details

```
Host: smtp.gmail.com
Port: 465 (SSL) or 587 (TLS)
Authentication: Required
Username: your-email@gmail.com
Password: Your 16-character app password
```

### Step 2.5: Environment Variables

**Copy and paste these exact lines to your .env file:**

```bash
GMAIL_EMAIL=blackholeinfiverse56@gmail.com
GMAIL_APP_PASSWORD=ca********xt
```

### Step 2.6: Verify Configuration

**Copy and paste this exact command in PowerShell:**

```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/email" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"recipient_email":"blackholeinfiverse56@gmail.com","subject":"BHIV HR Test Email","message":"This is a test email from BHIV HR Platform"}'
```

**Or use curl (Git Bash/CMD):**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/email" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"recipient_email\":\"blackholeinfiverse56@gmail.com\",\"subject\":\"BHIV HR Test Email\",\"message\":\"This is a test email from BHIV HR Platform\"}"
```

Expected Response:
```json
{
  "success": true,
  "result": {
    "status": "success",
    "channel": "email",
    "recipient": "blackholeinfiverse56@gmail.com",
    "subject": "BHIV HR Test Email"
  }
}
```

### Step 2.7: Daily Sending Limits

| Account Type | Daily Limit |
|--------------|-------------|
| Free Gmail | 500 emails/day |
| Google Workspace | 2,000 emails/day |
| Google Workspace (paid) | 10,000 emails/day |

---

## 3. Telegram Bot Integration

### Step 3.1: Create Telegram Bot

**Your bot is already created: @bhiv_hr_bot**

Your bot details:
```
Bot Username: @bhiv_hr_bot
Bot Token: 8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs
```

To create a new bot (if needed):
1. Open Telegram and search for **@BotFather**
2. Start a conversation with BotFather
3. Send command: `/newbot`
4. Follow the prompts:
   - Enter bot name: `BHIV HR Bot`
   - Enter bot username: must end in `bot`
5. Save the token BotFather gives you

### Step 3.2: Get Your Chat ID

**Your Chat ID is: `5326747205`**

To verify or get another user's chat ID:

**Method 1: Using @userinfobot**
1. Search for @userinfobot on Telegram
2. Start conversation
3. It will reply with your chat ID

**Method 2: Using getUpdates API**
1. Send a message to your bot (@bhiv_hr_bot)
2. Run this command in browser or terminal:
   ```
   https://api.telegram.org/bot8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs/getUpdates
   ```
3. Find the chat ID in the response under `result[0].message.chat.id`

### Step 3.3: Configure Bot Settings (Optional)

Open Telegram, go to @BotFather, send these commands one by one:

**Command 1:** Set description
```
/setdescription
```
Select @bhiv_hr_bot, then send:
```
BHIV HR Platform Bot - Receive application updates and notifications
```

**Command 2:** Set about text
```
/setabouttext
```
Select @bhiv_hr_bot, then send:
```
Official bot for BHIV HR Platform candidate notifications
```

**Command 3:** Set commands
```
/setcommands
```
Select @bhiv_hr_bot, then send:
```
start - Start the bot
status - Check application status
help - Get help
```

### Step 3.4: Environment Variables

**Copy and paste these exact lines to your .env file:**

```bash
TELEGRAM_BOT_TOKEN=8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs
TELEGRAM_BOT_USERNAME=bhiv_hr_bot
```

### Step 3.5: Verify Configuration

**Copy and paste this exact command in terminal to test:**

```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/telegram" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"chat_id":"5326747205","message":"Test from BHIV HR Platform"}'
```

**Or use curl (Git Bash/CMD):**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/telegram" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"chat_id\":\"5326747205\",\"message\":\"Test from BHIV HR Platform\"}"
```

You should receive a Telegram message from @bhiv_hr_bot.

---

## 4. Environment Variables Reference

### Complete Environment Variables - COPY ALL BELOW

**Copy this entire block and paste into your backend/.env file:**

```bash
# ============================================
# COMMUNICATION SERVICES - YOUR VALUES
# ============================================

# Gmail SMTP Configuration
GMAIL_EMAIL=blackholeinfiverse56@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# Twilio WhatsApp Configuration  
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs
TELEGRAM_BOT_USERNAME=bhiv_hr_bot

# Service URLs
LANGGRAPH_SERVICE_URL=https://bhiv-hr-langgraph-luy9.onrender.com

# API Authentication
API_KEY_SECRET=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
```

### Environment Variables by Service

| Service | Variable | Your Value |
|---------|----------|------------|
| Gmail | `GMAIL_EMAIL` | blackholeinfiverse56@gmail.com |
| Gmail | `GMAIL_APP_PASSWORD` | (your app password) |
| Twilio | `TWILIO_ACCOUNT_SID` | (your Twilio SID) |
| Twilio | `TWILIO_AUTH_TOKEN` | (get from Twilio Console) |
| Twilio | `TWILIO_WHATSAPP_NUMBER` | +14155238886 |
| Telegram | `TELEGRAM_BOT_TOKEN` | 8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs |
| Telegram | `TELEGRAM_BOT_USERNAME` | bhiv_hr_bot |

### Setting Environment Variables on Render

1. Go to: https://dashboard.render.com
2. Click your LangGraph service
3. Click **Environment** tab
4. Click **Add Environment Variable** for each:

| Key | Value (copy exactly) |
|-----|---------------------|
| GMAIL_EMAIL | blackholeinfiverse56@gmail.com |
| GMAIL_APP_PASSWORD | (your app password) |
| TWILIO_ACCOUNT_SID | (your Twilio SID) |
| TWILIO_AUTH_TOKEN | (paste your auth token) |
| TWILIO_WHATSAPP_NUMBER | +14155238886 |
| TELEGRAM_BOT_TOKEN | 8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs |
| TELEGRAM_BOT_USERNAME | bhiv_hr_bot |

5. Click **Save Changes**
6. Wait for service to redeploy

---

## 5. Testing Each Channel

### TEST 1: Email Test

**Copy and paste in PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/email" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"recipient_email":"blackholeinfiverse56@gmail.com","subject":"BHIV HR Test","message":"Test email from BHIV HR Platform"}'
```

**Expected:** Check your Gmail inbox for test email.

---

### TEST 2: WhatsApp Test

**First: Join Twilio Sandbox**
1. Open WhatsApp on your phone
2. Send this message to **+14155238886**:
```
join <your-sandbox-code>
```
(Get your sandbox code from Twilio Console → Messaging → WhatsApp Sandbox)

**Then copy and paste in PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/whatsapp" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"phone":"+919284967526","message":"Test from BHIV HR Platform"}'
```

**Expected:** WhatsApp message on your phone.

---

### TEST 3: Telegram Test

**Copy and paste in PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/telegram" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"chat_id":"5326747205","message":"Test from BHIV HR Platform"}'
```

**Expected:** Telegram message from @bhiv_hr_bot.

---

### TEST 4: Full Notification Sequence

**Copy and paste in PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/sequence" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"candidate_name":"Test Candidate","candidate_email":"blackholeinfiverse56@gmail.com","candidate_phone":"+919284967526","job_title":"Software Engineer","sequence_type":"application_received"}'
```

**Expected:** Email + WhatsApp + Telegram notifications.

---

### TEST 5: Send Actual Notification

**Copy and paste in PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/notifications/send" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"candidate_id":"test123","notification_type":"application_received","channels":["email","telegram"],"candidate_data":{"name":"Test User","email":"blackholeinfiverse56@gmail.com","phone":"+919284967526"},"job_data":{"title":"Software Engineer","company":"BHIV"}}'
```

---

### Curl Commands (for Git Bash or CMD)

**Email Test:**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/email" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"recipient_email\":\"blackholeinfiverse56@gmail.com\",\"subject\":\"BHIV HR Test\",\"message\":\"Test email\"}"
```

**WhatsApp Test:**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/whatsapp" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"phone\":\"+919284967526\",\"message\":\"Test from BHIV HR\"}"
```

**Telegram Test:**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/telegram" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"chat_id\":\"5326747205\",\"message\":\"Test from BHIV HR\"}"
```

**Full Sequence Test:**
```bash
curl -X POST "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/sequence" -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" -H "Content-Type: application/json" -d "{\"candidate_name\":\"Test Candidate\",\"candidate_email\":\"blackholeinfiverse56@gmail.com\",\"candidate_phone\":\"+919284967526\",\"job_title\":\"Software Engineer\",\"sequence_type\":\"application_received\"}"
```

### Expected Response Formats

#### Success Response
```json
{
  "success": true,
  "result": {
    "status": "success",
    "channel": "email|whatsapp|telegram",
    "message_id": "unique_id",
    "recipient": "recipient_info"
  }
}
```

#### Mock Response (No Credentials)
```json
{
  "success": true,
  "result": {
    "status": "mock_sent",
    "channel": "whatsapp",
    "message_id": "mock_msg_123",
    "recipient": "+919284967526",
    "note": "Mock mode - add real Twilio credentials to send actual messages"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "result": {
    "status": "failed",
    "channel": "email",
    "error": "Gmail authentication failed: Check app password",
    "recipient": "test@example.com"
  }
}
```

---

## 6. Error Handling & Fallback Mechanisms

### Automatic Fallback System

The CommunicationManager implements automatic fallback:

```python
# How fallback works in communication.py

1. Check if credentials exist
2. If no credentials → Return mock response (development mode)
3. If credentials exist → Attempt real send
4. If send fails → Log error and return failure response
```

### Error Codes Reference

| Channel | Error | Cause | Solution |
|---------|-------|-------|----------|
| Email | `SMTPAuthenticationError` | Invalid credentials | Regenerate app password |
| Email | `SMTPRecipientsRefused` | Invalid email address | Validate email format |
| WhatsApp | `21608` | Phone not verified | Join Twilio sandbox |
| WhatsApp | `21211` | Invalid phone number | Use E.164 format |
| WhatsApp | `63003` | Sandbox expired | Rejoin sandbox |
| Telegram | `401 Unauthorized` | Invalid bot token | Regenerate token |
| Telegram | `400 Bad Request` | Invalid chat ID | Verify chat ID |

### Implementing Custom Fallback

```python
# Example: Fallback email to admin if primary fails
async def send_with_fallback(payload, channels):
    results = []
    
    # Try primary channels
    primary_results = await comm_manager.send_multi_channel(payload, channels)
    results.extend(primary_results)
    
    # Check for failures
    failures = [r for r in results if r.get('status') == 'failed']
    
    if failures:
        # Notify admin of failures
        await comm_manager.send_email(
            'admin@company.com',
            'Notification Failure Alert',
            f'Failed to send notifications: {failures}'
        )
    
    return results
```

### Retry Logic

```python
# Built-in retry for transient failures
import asyncio

async def send_with_retry(func, *args, max_retries=3, delay=1):
    for attempt in range(max_retries):
        try:
            result = await func(*args)
            if result.get('status') == 'success':
                return result
        except Exception as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(delay * (attempt + 1))
            else:
                raise
    return {'status': 'failed', 'error': 'Max retries exceeded'}
```

---

## 7. Rate Limiting Considerations

### Service Limits

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Gmail SMTP | 500/day | 2,000-10,000/day | Per Google Workspace tier |
| Twilio WhatsApp | 1 msg/sec | 80 msg/sec | Sandbox limited |
| Telegram Bot | 30 msg/sec | 30 msg/sec | Per chat: 1 msg/sec |

### Rate Limiting Implementation

```python
# Built-in rate limiting in communication.py

class RateLimiter:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    async def acquire(self):
        now = time.time()
        self.requests = [r for r in self.requests if now - r < self.time_window]
        
        if len(self.requests) >= self.max_requests:
            wait_time = self.requests[0] + self.time_window - now
            await asyncio.sleep(wait_time)
        
        self.requests.append(now)

# Usage
email_limiter = RateLimiter(max_requests=500, time_window=86400)  # 500/day
whatsapp_limiter = RateLimiter(max_requests=1, time_window=1)      # 1/sec
telegram_limiter = RateLimiter(max_requests=30, time_window=1)     # 30/sec
```

### Bulk Notification Throttling

For bulk notifications, the system automatically throttles:

```python
async def send_bulk_notifications(candidates, sequence_type, job_data):
    results = []
    
    for candidate in candidates:
        try:
            # Send notification
            result = await send_automated_sequence(candidate, sequence_type)
            results.append(result)
            
            # Rate limit delay
            await asyncio.sleep(0.5)  # 500ms between messages
            
        except Exception as e:
            results.append({'status': 'failed', 'error': str(e)})
    
    return results
```

---

## 8. Compliance & Privacy Requirements

### GDPR Compliance

1. **Consent**: Obtain explicit consent before sending messages
2. **Data Minimization**: Only collect necessary contact information
3. **Right to Erasure**: Implement opt-out mechanism
4. **Data Portability**: Allow candidates to export their data

### Implementation

```python
# Consent tracking in candidate data
candidate = {
    "email": "john@example.com",
    "phone": "+919284967526",
    "communication_preferences": {
        "email_opt_in": True,
        "whatsapp_opt_in": True,
        "telegram_opt_in": False
    },
    "consent_timestamp": "2026-02-23T10:00:00Z"
}

# Check consent before sending
async def send_with_consent_check(candidate, channels):
    prefs = candidate.get('communication_preferences', {})
    
    allowed_channels = []
    if prefs.get('email_opt_in') and 'email' in channels:
        allowed_channels.append('email')
    if prefs.get('whatsapp_opt_in') and 'whatsapp' in channels:
        allowed_channels.append('whatsapp')
    if prefs.get('telegram_opt_in') and 'telegram' in channels:
        allowed_channels.append('telegram')
    
    return await send_multi_channel(candidate, allowed_channels)
```

### Message Templates

All automated messages should include:

1. **Sender identification**: `BHIV HR Team`
2. **Purpose**: Clear reason for contact
3. **Opt-out instructions**: How to unsubscribe
4. **Contact information**: HR contact details

Example footer:
```
---
This is an automated message from BHIV HR Platform.
To unsubscribe, reply STOP or contact hr@bhiv.com
```

### Data Retention

| Data Type | Retention Period | Action |
|-----------|------------------|--------|
| Application data | 2 years | Archive then delete |
| Communication logs | 1 year | Anonymize |
| Consent records | 7 years | Retain for compliance |

---

## 9. Troubleshooting Guide

### Gmail Issues

| Problem | Symptoms | Solution |
|---------|----------|----------|
| Authentication failed | `SMTPAuthenticationError` | Regenerate app password |
| 2FA not enabled | Cannot create app password | Enable 2-Step Verification |
| Account blocked | "Sign-in attempt was blocked" | Enable "Less secure apps" |
| Rate limited | `SMTPRecipientsRefused` | Wait 24 hours |

**Debug Steps:**
```powershell
# Test SMTP connection manually - replace with your actual app password
python -c "import smtplib; server = smtplib.SMTP_SSL('smtp.gmail.com', 465); server.login('blackholeinfiverse56@gmail.com', 'YOUR_APP_PASSWORD'); print('Connection successful!'); server.quit()"
```

### Twilio WhatsApp Issues

| Problem | Error Code | Solution |
|---------|------------|----------|
| Phone not in sandbox | 21608 | User must join sandbox |
| Invalid phone format | 21211 | Use E.164 format (+country code) |
| Sandbox expired | 63003 | Rejoin sandbox |
| Rate limited | 21610 | Wait and retry |
| Invalid credentials | 20003 | Check SID and token |

**Debug Steps:**
```powershell
# Test Twilio credentials - replace with your actual SID and token
python -c "from twilio.rest import Client; client = Client('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN'); print('Account:', client.api.account.fetch().friendly_name)"
```

### Telegram Issues

| Problem | Error | Solution |
|---------|-------|----------|
| Invalid token | 401 Unauthorized | Get new token from @BotFather |
| Bot blocked | 403 Forbidden | User blocked the bot |
| Invalid chat_id | 400 Bad Request | Verify chat ID |
| Message too long | 400 Bad Request | Split into multiple messages |

**Debug Steps:**
```powershell
# Test Telegram bot token - paste in browser or run:
Invoke-RestMethod -Uri "https://api.telegram.org/bot8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs/getMe"

# Get recent messages
Invoke-RestMethod -Uri "https://api.telegram.org/bot8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs/getUpdates"
```

### Common Configuration Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Mock mode always | Missing env vars | Set environment variables |
| Connection refused | Service not running | Start LangGraph service |
| 401 Unauthorized | Invalid API key | Check `API_KEY_SECRET` |
| 500 Internal Error | Service misconfiguration | Check logs |

### Checking Service Health

```powershell
# Check LangGraph health
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/health"

# Check test-integration
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/test-integration" -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"}
```

Expected healthy response:
```json
{
  "service": "langgraph-orchestrator",
  "status": "operational",
  "communication_manager": "initialized",
  "database_tracking": "connected"
}
```

### Log Analysis

Check service logs for errors:

```bash
# Render logs
# Go to Dashboard → Service → Logs

# Local logs
tail -f backend/services/langgraph/logs/app.log

# Docker logs
docker logs bhiv-langgraph -f
```

Common log patterns:
```
✅ Twilio client initialized       # Success
⚠️ Twilio initialization failed   # Check credentials
📱 Sending WhatsApp to: +91...    # Sending in progress
✅ WhatsApp sent to +91...: SM... # Success
❌ WhatsApp error for +91...: ... # Failed - check error
```

---

## Quick Reference Card

### Your Service URLs

| Service | URL |
|---------|-----|
| Your LangGraph Service | https://bhiv-hr-langgraph-luy9.onrender.com |
| Twilio Console | https://console.twilio.com |
| Twilio WhatsApp Sandbox | https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox |
| Google App Passwords | https://myaccount.google.com/apppasswords |
| Telegram BotFather | https://t.me/BotFather |
| Your Telegram Bot | https://t.me/bhiv_hr_bot |

### Your Credentials Summary

| Service | Credential | Your Value |
|---------|------------|------------|
| Gmail | Email | blackholeinfiverse56@gmail.com |
| Gmail | App Password | (your app password) |
| Twilio | Account SID | (your Twilio SID) |
| Twilio | WhatsApp Number | +14155238886 |
| Telegram | Bot Token | 8741252506:AAFMHtNhbz167moBT3VooyQiaOI9wlm1yTs |
| Telegram | Chat ID | 5326747205 |
| API | API Key | prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o |

### Quick Copy-Paste Test Commands

**PowerShell - Test Email:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/email" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"recipient_email":"blackholeinfiverse56@gmail.com"}'
```

**PowerShell - Test WhatsApp:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/whatsapp" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"phone":"+919284967526"}'
```

**PowerShell - Test Telegram:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/telegram" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"chat_id":"5326747205"}'
```

**PowerShell - Test All Channels:**
```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/automation/test/sequence" -Method POST -Headers @{"Authorization"="Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"; "Content-Type"="application/json"} -Body '{"candidate_name":"Test User","candidate_email":"blackholeinfiverse56@gmail.com","candidate_phone":"+919284967526","job_title":"Test Job","sequence_type":"application_received"}'
```

### Check Service Health

```powershell
Invoke-RestMethod -Uri "https://bhiv-hr-langgraph-luy9.onrender.com/health"
```

---

**Document Version:** 1.1  
**Last Updated:** February 26, 2026  
**Author:** BHIV HR Platform Team
