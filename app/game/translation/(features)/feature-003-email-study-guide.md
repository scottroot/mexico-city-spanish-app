# Feature 003 - Email Study Guide to User

## Summary
Adds an "Email Me This" button to the StudyGuideModal that sends the study guide content to the user's registered email address. Uses Resend API for reliable email delivery with a formatted HTML email template that includes quiz metadata and study guide recommendations.

## Motivation
Users want to save study guides for offline review or have them accessible outside the app. Emailing study guides provides a persistent reference that users can revisit, archive, or print. This makes the learning material more accessible and increases the value of the study guide feature.

## Requirements
- [ ] "Email Me This" button present in StudyGuideModal
- [ ] Button disabled if no study guide content exists
- [ ] Clicking button sends formatted email to user's registered email
- [ ] Email includes quiz metadata (date, score, direction, focus)
- [ ] Email includes full study guide content formatted for email clients
- [ ] Button shows loading state while sending
- [ ] Button shows success state after email sent
- [ ] Button disabled after successful send (prevents duplicate emails)
- [ ] Toast notification on success or error
- [ ] Email sent via Resend API
- [ ] Requires user authentication (verified via quiz ownership)

## Non goals
- Sending to custom email addresses (only registered email)
- Scheduling or batch sending multiple study guides
- Customizing email content or format per user
- Email delivery tracking or read receipts
- Unsubscribe functionality (not a newsletter)

## UX and flows
1. User views study guide in modal (either after quiz or from history)
2. User clicks "Email Me This" button at bottom of modal
3. Button shows loading spinner and "Sending..." text
4. System fetches quiz data and user profile
5. System sends formatted email via Resend
6. On success:
   - Button shows checkmark and "Email Sent ✓"
   - Toast notification: "Study guide sent to your email!"
   - Button becomes disabled
7. On error:
   - Button returns to normal state
   - Toast notification: "Failed to send email"
   - User can retry
8. User can close modal at any time

**Screens affected:**
- StudyGuideModal (button already present, needs wiring)

## Data and API changes

**No database schema changes needed**

**New API endpoint:**
- `POST /api/translation/email-study-guide`
  - Request: `{ quizId: string }`
  - Response: `{ success: boolean, message?: string }`
  - Auth: Required (verified via quiz ownership)
  - Fetches quiz and user profile from Supabase
  - Sends email via Resend API

**Existing data used:**
- User email from `profiles` table
- Quiz data from `translation_quizzes` table

## Component and file plan
- `app/game/translation/StudyGuideModal.tsx` - Wire up email button handler
- `app/api/translation/email-study-guide/route.ts` - Create email sending endpoint
- `emails/StudyGuideEmail.tsx` - Create React email template component
- `.env.local` - Add `RESEND_API_KEY` environment variable
- `package.json` - Add `resend` package

## Implementation plan
1. Sign up for Resend account at https://resend.com
2. Get API key from Resend dashboard
3. Add `RESEND_API_KEY=re_xxxxx` to `.env.local`
4. Install Resend package: `npm install resend`
5. Create `emails/StudyGuideEmail.tsx`:
   - React component that renders HTML email
   - Props: quiz metadata, study guide content
   - Styled for email clients (inline styles)
   - Include quiz date, score, direction, focus
   - Include full study guide HTML
6. Create `POST /api/translation/email-study-guide/route.ts`:
   - Verify authentication
   - Fetch quiz by ID, verify user owns it
   - Fetch user profile to get email address
   - Render email template with quiz data
   - Send via Resend API
   - Return success/error response
7. Update `StudyGuideModal.tsx`:
   - Wire up `handleEmailStudyGuide` function
   - Make POST request to email endpoint
   - Handle loading, success, and error states
   - Update button text and disabled state
8. Test email delivery in development
9. Verify email rendering in multiple email clients

## Edge cases
- User has no email in profile: API returns error, show toast
- Resend API rate limit hit: Show error toast, allow retry
- Resend API timeout: Show error toast after timeout
- User clicks button multiple times: Disabled after first successful send
- Study guide is null: Button already disabled
- Very long study guide: Email may be large but Resend handles it
- User not authenticated: API returns 401
- Quiz doesn't belong to user: API returns 404

## Testing plan

**Manual testing:**
- Send email from quiz end modal
- Send email from quiz history modal
- Verify email received in inbox
- Check email formatting in Gmail, Outlook, Apple Mail
- Test with long study guides
- Test error handling (invalid quiz ID, etc.)

**Integration testing:**
- Mock Resend API in tests
- Verify quiz ownership check works
- Verify email template renders correctly
- Verify error handling for API failures

**Email client testing:**
- Gmail web
- Outlook web
- Apple Mail
- Mobile email clients

## Status
**Not started** - Pending Resend account setup

## Implementation notes
- Use Resend instead of SendGrid/Mailgun for simplicity and better DX
- Email template should use inline styles for email client compatibility
- Resend free tier: 100 emails/day, 3,000 emails/month
- Production domain verification required for custom from address
- Development can use `onboarding@resend.dev` for testing
- Button state managed locally in modal (isSendingEmail, emailSent)
- Consider adding email send tracking to analytics later
- No need to store email delivery status in database for MVP
