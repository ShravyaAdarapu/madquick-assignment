# 🧪 Testing Guide

A comprehensive guide to test all features of SecureVault.

## Testing Checklist

Use this checklist to verify everything works correctly.

---

## 1. Authentication Tests

### Sign Up Flow
- [ ] Navigate to signup page
- [ ] Enter valid email
- [ ] Enter password (< 6 chars) → Should show error
- [ ] Enter password (≥ 6 chars)
- [ ] Confirm password (mismatch) → Should show error
- [ ] Confirm password (match) → Should create account
- [ ] Should redirect to dashboard
- [ ] Should see welcome message

### Login Flow
- [ ] Navigate to login page
- [ ] Enter wrong email → Should show error
- [ ] Enter wrong password → Should show error
- [ ] Enter correct credentials → Should login
- [ ] Should redirect to dashboard
- [ ] Should persist session (reload page, still logged in)

### Logout Flow
- [ ] Click logout button
- [ ] Should redirect to login
- [ ] Should clear localStorage
- [ ] Can't access dashboard after logout

---

## 2. Password Generator Tests

### Basic Generation
- [ ] Click "Generate Strong Password"
- [ ] Should generate password
- [ ] Should show in input field
- [ ] Should show strength bar
- [ ] Length should match slider value

### Options Testing
- [ ] Adjust length slider (8-32)
- [ ] Password length should match
- [ ] Uncheck "Include Numbers"
- [ ] Generated password should have no numbers
- [ ] Uncheck "Include Symbols"
- [ ] Generated password should have no symbols
- [ ] Check "Exclude Similar"
- [ ] Should not contain: i, l, 1, L, o, 0, O

### Copy Password
- [ ] Generate a password
- [ ] Click copy icon
- [ ] Should show checkmark
- [ ] Paste somewhere → Should be the password
- [ ] Wait 15 seconds
- [ ] Paste again → Clipboard should be cleared

### Strength Indicator
- [ ] Short password (8 chars) → Yellow/Orange bar
- [ ] Medium password (12 chars, mixed) → Yellow bar
- [ ] Long password (20+ chars, all options) → Green bar

---

## 3. Vault Item Management Tests

### Add New Item
- [ ] Click "Add Item" button
- [ ] Modal should open
- [ ] Try to submit empty form → Should require title
- [ ] Fill in title only → Should save
- [ ] Should close modal
- [ ] Should appear in vault list
- [ ] Add item with all fields filled
- [ ] Should save successfully

### View Items
- [ ] Saved items should appear in grid
- [ ] Should show title and icon
- [ ] Should show username (if provided)
- [ ] Password should be hidden (dots)
- [ ] URL should be clickable link
- [ ] Notes should be visible

### Edit Item
- [ ] Click "Edit" on an item
- [ ] Modal should open with existing data
- [ ] Change title → Save
- [ ] Should update in list
- [ ] Change password → Save
- [ ] Should update encrypted data
- [ ] Edit all fields → Save
- [ ] All changes should persist

### Delete Item
- [ ] Click "Delete" on an item
- [ ] Should show confirmation dialog
- [ ] Click cancel → Item should remain
- [ ] Click delete again
- [ ] Confirm → Item should be removed
- [ ] Should disappear from list

### Password Visibility Toggle
- [ ] Password should be hidden by default
- [ ] Click eye icon
- [ ] Password should be visible
- [ ] Click eye-off icon
- [ ] Password should be hidden again

### Copy Username/Password
- [ ] Click copy icon next to username
- [ ] Should show checkmark
- [ ] Paste → Should be username
- [ ] Click copy icon next to password
- [ ] Should show checkmark
- [ ] Paste → Should be password
- [ ] Wait 15 seconds → Should auto-clear

---

## 4. Search & Filter Tests

### Search by Title
- [ ] Add items with different titles
- [ ] Type partial title in search
- [ ] Should filter matching items
- [ ] Clear search → Should show all items

### Search by Username
- [ ] Type username in search
- [ ] Should filter matching items

### Search by URL
- [ ] Type URL in search
- [ ] Should filter matching items

### Search by Notes
- [ ] Type note content in search
- [ ] Should filter matching items

### Case Insensitive
- [ ] Search with UPPERCASE
- [ ] Should still match lowercase items

### No Results
- [ ] Search for non-existent text
- [ ] Should show "No items match your search"

### Clear Search
- [ ] Clear search field
- [ ] Should show all items again

---

## 5. Encryption Verification Tests

### Network Inspection
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Create a new vault item
- [ ] Check POST request to `/api/vault`
- [ ] Request payload should contain:
  - `encryptedData`: Base64 string
  - `iv`: Hex string
- [ ] Should NOT contain plaintext password

### Database Inspection
- [ ] Connect to MongoDB (Compass or CLI)
- [ ] View `vaultitems` collection
- [ ] Documents should have:
  - `encryptedData`: Long encrypted string
  - `iv`: Hex string
- [ ] Should NOT see plaintext data

### localStorage Inspection
- [ ] Open DevTools → Application → Local Storage
- [ ] Should see:
  - `token`: JWT token
  - `masterKey`: Hex string (derived key)
- [ ] Should NOT see plaintext passwords

### Cross-Account Isolation
- [ ] Create Account A
- [ ] Add vault items
- [ ] Logout
- [ ] Create Account B
- [ ] Add different vault items
- [ ] Should only see Account B's items
- [ ] Login as Account A
- [ ] Should only see Account A's items

---

## 6. Security Tests

### Session Persistence
- [ ] Login
- [ ] Reload page
- [ ] Should remain logged in
- [ ] Close browser
- [ ] Open browser → Navigate to app
- [ ] Should remain logged in

### Token Expiration
- [ ] Login (token expires in 7 days)
- [ ] Wait or manually expire token
- [ ] Make API request
- [ ] Should redirect to login

### Invalid Master Password
- [ ] Create account with Password A
- [ ] Add vault items
- [ ] Logout
- [ ] Login with Password B (wrong)
- [ ] Should fail authentication

### Clipboard Auto-Clear
- [ ] Copy a password
- [ ] Immediately paste → Should work
- [ ] Wait exactly 15 seconds
- [ ] Paste again → Should be empty

### XSS Prevention
- [ ] Add item with title: `<script>alert('XSS')</script>`
- [ ] Should display as text, not execute
- [ ] Add note with HTML tags
- [ ] Should display as text

---

## 7. UI/UX Tests

### Responsive Design
- [ ] Resize browser to mobile size (375px)
- [ ] Should adapt layout
- [ ] All buttons should be accessible
- [ ] Forms should be usable
- [ ] Test on actual mobile device

### Dark Mode (Pure Black)
- [ ] Check background color is #000000
- [ ] Not shades of blue
- [ ] Consistent throughout app

### Loading States
- [ ] Network throttling (DevTools)
- [ ] Should show loading indicators
- [ ] Buttons should disable while loading

### Error Handling
- [ ] Stop backend server
- [ ] Try to save item
- [ ] Should show error message
- [ ] Try to login
- [ ] Should show error message

### Empty States
- [ ] New account with no items
- [ ] Should show "Your vault is empty"
- [ ] After adding items, message disappears

### Icons & Visuals
- [ ] All icons should render
- [ ] Initials should show in vault cards
- [ ] Colors should be consistent

---

## 8. Performance Tests

### Load Time
- [ ] Clear cache
- [ ] Load app
- [ ] Should load in < 3 seconds
- [ ] Check Lighthouse score (target: 90+)

### Large Vault
- [ ] Add 50+ items
- [ ] Should render smoothly
- [ ] Search should be instant
- [ ] Scroll should be smooth

### Network Conditions
- [ ] Test on slow 3G (DevTools)
- [ ] Should still be usable
- [ ] Loading states should appear

---

## 9. Cross-Browser Tests

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 10. Integration Tests

### Complete User Flow
1. [ ] Sign up
2. [ ] Generate password
3. [ ] Copy generated password
4. [ ] Add new vault item with copied password
5. [ ] Search for item
6. [ ] View item details
7. [ ] Copy password from vault
8. [ ] Edit item
9. [ ] Add another item
10. [ ] Search and filter
11. [ ] Delete item
12. [ ] Logout
13. [ ] Login again
14. [ ] Verify items are still there
15. [ ] Logout

---

## Automated Testing Commands

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests (if implemented)
```bash
npm run test:e2e
```

---

## Test Data

### Sample Accounts
```
Email: test@example.com
Password: test123456

Email: demo@example.com
Password: demo123456
```

### Sample Vault Items
```json
{
  "title": "Gmail",
  "username": "user@gmail.com",
  "password": "SuperSecret123!",
  "url": "https://mail.google.com",
  "notes": "Personal email account"
}

{
  "title": "GitHub",
  "username": "developer",
  "password": "GitH@bPass2024",
  "url": "https://github.com",
  "notes": "Main development account"
}

{
  "title": "Banking",
  "username": "customer123",
  "password": "Bank$ecure99",
  "url": "https://bank.example.com",
  "notes": "Online banking - 2FA enabled"
}
```

---

## Bug Reporting Template

```markdown
**Bug Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- App Version: 1.0.0

**Screenshots:**
[Attach if relevant]

**Console Errors:**
[Paste any errors from browser console]
```

---

## Performance Benchmarks

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **API Response Time**: < 500ms
- **Search Filter**: < 100ms

---

## Security Audit Checklist

- [ ] All API endpoints require authentication
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT tokens have expiration
- [ ] Client-side encryption implemented
- [ ] No sensitive data in logs
- [ ] HTTPS enforced in production
- [ ] CORS configured correctly
- [ ] Input validation on all forms
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection in place

---

**✅ Testing Complete!** If all checks pass, your SecureVault is ready for production!
