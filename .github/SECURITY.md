# Security policy

## Supported versions

Security fixes are applied to the latest published release.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature under **Security → Advisories → Report a vulnerability**. Do not open a public issue for an unpatched vulnerability.

Include affected versions, impact, reproduction steps, and any suggested mitigation. Remove personal notes and credentials from reports. Maintainers should acknowledge a report within seven days and coordinate disclosure after a fix is available.

## Release trust

GitHub Actions builds release artifacts from version tags. Until code-signing credentials are configured, operating systems may identify downloads as unsigned. Release signing is tracked as a publication task and is not bypassed by the application.
