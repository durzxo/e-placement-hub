# Email Notification Setup Guide

## 1. Gmail App Password Setup

To enable email notifications for new notices, you need to set up Gmail with an App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. In Google Account settings → Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" as the app
4. Select "Other" as the device and name it "E-Placement Hub"
5. Copy the generated 16-character password

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env` in the backend folder:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit the `.env` file and add your email credentials:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## 3. Test Email Notifications

After setting up the environment variables, you can test the email system:

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Send a POST request to test the email system:
   ```bash
   # Using curl (if available)
   curl -X POST http://localhost:5000/api/notices/test-email

   # Or use Postman/Thunder Client with:
   # Method: POST
   # URL: http://localhost:5000/api/notices/test-email
   ```

3. Check the server console for email sending logs
4. Verify that students receive the test email

## 4. Email Notification Features

- **Automatic Notifications**: When an admin creates a new notice, all students automatically receive email notifications
- **Rich HTML Emails**: Emails include notice title, content, priority, and a link to the student portal
- **Async Processing**: Email sending doesn't block the notice creation process
- **Error Handling**: Failed email attempts are logged but don't affect notice creation

## 5. Troubleshooting

### Common Issues:
1. **"Email configuration missing"**: Make sure `.env` file has `EMAIL_USER` and `EMAIL_PASS` set
2. **Authentication failed**: Verify the app password is correct (16 characters, no spaces)
3. **No students receiving emails**: Check if students have email addresses in the database

### Testing Without Students:
If you don't have student data yet, you can:
1. Add a test student to the database with your email
2. Use the test endpoint to verify email configuration
3. Check server logs for detailed error messages

## 6. Production Considerations

For production deployment:
- Use environment variables in your hosting platform
- Consider using a dedicated email service (SendGrid, Mailgun) for better deliverability
- Implement email queuing for high volumes
- Add unsubscribe functionality if required