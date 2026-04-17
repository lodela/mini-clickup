# Security Policy - Mini ClickUp

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Mini ClickUp seriously. If you believe you've found a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for the vulnerability
2. Email your findings to: security@miniclickup.com (placeholder)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Initial Response:** Within 48 hours
- **Status Update:** Within 5 business days
- **Resolution Timeline:** Depends on severity (see below)

### Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach, authentication bypass | 24 hours |
| High     | Privilege escalation, XSS | 48 hours |
| Medium   | Information disclosure | 5 business days |
| Low      | Minor security improvements | Next release |

## Security Best Practices

### For Users

1. **Use strong passwords** (min 8 characters, mixed case, numbers)
2. **Enable 2FA** when available
3. **Keep your browser updated**
4. **Don't share your API tokens**
5. **Review active sessions** regularly

### For Developers

1. **Never commit secrets** (use environment variables)
2. **Validate all inputs** (we use Zod)
3. **Use parameterized queries** (Mongoose handles this)
4. **Keep dependencies updated**
5. **Follow OWASP Top 10 guidelines**

## Security Measures

### Implemented

- ✅ Password hashing with bcrypt (cost 12)
- ✅ JWT authentication with short expiration
- ✅ HttpOnly + Secure cookies
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ XSS protection headers

### Planned

- 🔄 Two-factor authentication (2FA)
- 🔄 Session management dashboard
- 🔄 Security audit logging
- 🔄 Automated dependency updates (Dependabot)
- 🔄 Security scanning in CI/CD

## Known Limitations

- Token rotation is in-memory (not persistent in MVP)
- Rate limiting is per-IP (not per-user)
- No brute force protection on login (coming soon)

## Security Audit

Last security audit: N/A (planned for v0.2.0)

## Contact

For security-related questions, please contact:
- Email: security@miniclickup.com (placeholder)
- GitHub: Use private vulnerability reporting

---

**Last Updated:** 2026-03-17
**Version:** 0.1.0
