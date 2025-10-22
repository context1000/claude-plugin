---
name: Release Notes Summarizer
description: Generates release notes from git log/PRs, groups by themes (features/fixes/breaking), links to relevant GUIDE/RULE/ADR. Activate when preparing releases or analyzing version changes.
allowed-tools: Read, Grep, Glob, Bash
---

# Release Notes Summarizer

## Overview

This skill generates structured, actionable release notes by analyzing git history, pull requests, and linking changes to relevant documentation.

## Release Notes Structure

```markdown
# Release v1.12.0 - 2025-01-22

## Highlights

- Added support for gRPC streaming APIs
- Improved caching performance by 40%
- **Breaking**: OAuth token format changed

## Features

### gRPC Streaming Support
Added bidirectional streaming capability for real-time updates.

- **Related ADR**: [ADR-0055: Use gRPC for Inter-Service Communication](../.context1000/decisions/adr/0055-grpc-inter-service.adr.md)
- **Migration Guide**: [Implement gRPC Streaming](../guides/implement-grpc-streaming.guide.md)
- Pull requests: #234, #245

### Caching Layer Performance
Optimized Redis cache with connection pooling and pipelining.

- **Related ADR**: [ADR-0048: Introduce Redis for API Response Caching](../.context1000/decisions/adr/0048-redis-caching.adr.md)
- Pull requests: #239

## Bug Fixes

- Fixed memory leak in WebSocket connections (#242)
- Corrected timezone handling in date filters (#247)
- Resolved race condition in cache invalidation (#251)

## Breaking Changes

### OAuth Token Format Change

⚠️ **Action Required**

OAuth tokens now use JWT format instead of opaque tokens.

- **What changed**: Token format changed from random strings to JWT
- **Why**: Enable stateless validation and include claims
- **Migration**: [Migrate to JWT Tokens](../guides/migrate-to-jwt-tokens.guide.md)
- **Related RULE**: [RULE: JWT Token Standards](../.context1000/rules/jwt-token-standards.rules.md)
- Pull request: #235

**Migration checklist**:
- [ ] Update token validation logic
- [ ] Add JWT library dependency
- [ ] Configure signing keys
- [ ] Test with existing clients

## Security Updates

- Updated OpenSSL to 3.1.4 (CVE-2024-xxxx)
- Implemented rate limiting on auth endpoints

## Deprecations

- `POST /v1/auth/token` endpoint deprecated, use `POST /v2/auth/token`
- Will be removed in v2.0.0 (est. Q2 2025)

## Documentation

- Added [Kafka Integration Guide](../guides/kafka-integration.guide.md)
- Updated [API Reference](../reference/api.md) with new endpoints
- New [RULE: Service Naming Conventions](../.context1000/rules/service-naming.rules.md)

## Contributors

Thank you to all contributors: @alice, @bob, @charlie
```

## Data Collection

### Step 1: Get Changes Since Last Release

```bash
# Get last release tag
last_tag=$(git describe --tags --abbrev=0)

# Get commits since last release
git log $last_tag..HEAD --oneline

# Get PR numbers from commit messages
git log $last_tag..HEAD --oneline | grep -oE "#[0-9]+" | sort -u
```

### Step 2: Categorize Changes

Use commit message conventions (Conventional Commits):

```bash
# Features
git log $last_tag..HEAD --oneline | grep "^[a-f0-9]* feat:"

# Fixes
git log $last_tag..HEAD --oneline | grep "^[a-f0-9]* fix:"

# Breaking changes
git log $last_tag..HEAD --oneline | grep "BREAKING CHANGE"

# Security
git log $last_tag..HEAD --oneline | grep "^[a-f0-9]* security:"
```

### Step 3: Link to Documentation

For each significant change:

```bash
# Find related ADRs
change_topic="grpc"
grep -r -l "$change_topic" .context1000/decisions/adr/*.adr.md docs/adr/*.adr.md

# Find related GUIDEs
grep -r -l "$change_topic" .context1000/guides/*.guide.md docs/guides/*.guide.md

# Find related RULEs
grep -r -l "$change_topic" .context1000/rules/*.rules.md docs/rules/*.rules.md
```

## Breaking Change Detection

### Automatic Detection

```bash
# API changes
git diff $last_tag..HEAD -- "*/api/*" "*/routes/*" | grep -E "^-.*@.*route|^-.*export.*function"

# Configuration changes
git diff $last_tag..HEAD -- "*.config.*" "*.schema.*"

# Database migrations with DROP or ALTER
git diff $last_tag..HEAD -- "*/migrations/*" | grep -E "DROP |ALTER |REMOVE "
```

### Manual Review Triggers

Flag for manual review:
- Changes in `package.json` `peerDependencies`
- Removal of public APIs/functions
- Changes in error codes or response formats
- Environment variable removals

## Creating Missing Documentation

### When Breaking Change Lacks GUIDE

```bash
/archdocs:create-guide "Migrate from <old> to <new>" --audience <affected-teams>
```

### When New Feature Lacks RULE

```bash
/archdocs:create-rule "<Feature> Usage Standards" --severity warn --scope <area>
```

### When Architectural Change Lacks ADR

```bash
/archdocs:create-adr "Record Decision: <Change>" --status accepted --template madr --scope <area>
```

## Example Workflows

### Scenario 1: Quarterly Release

```bash
# Collect changes
git log v1.11.0..v1.12.0 --oneline --no-merges

# Categorize
Features: 15 commits
Fixes: 23 commits
Breaking: 2 commits

# Identify undocumented breaking changes
Breaking Change: OAuth token format (has migration guide ✓)
Breaking Change: Database connection pool config (no guide ❌)

# Create missing documentation
/archdocs:create-guide "Migrate Database Connection Pool Config" --audience backend
/archdocs:create-rule "Database Connection Pool Standards" --severity required --scope backend

# Generate release notes with links
```

### Scenario 2: Hotfix Release

```bash
# Minimal release notes for v1.11.1
Changes:
- Fixed critical security vulnerability in auth module (CVE-2025-xxxx)
- Updated dependencies

Action Required:
- Deploy immediately
- See [Security Advisory](link) for details
```

### Scenario 3: Major Version (v2.0.0)

```bash
# Comprehensive breaking changes section
Breaking Changes: 12 identified

For each:
1. Verify migration guide exists
2. Create RULE for new standard if applicable
3. Link to ADR explaining rationale
4. Provide code examples (before/after)
5. Estimate migration effort
```

## Quality Checklist

- [ ] All categories present (Features, Fixes, Breaking, Security)
- [ ] Breaking changes have migration guides
- [ ] New features link to relevant ADRs
- [ ] New standards link to relevant RULEs
- [ ] Security updates include CVE numbers if applicable
- [ ] Contributors acknowledged
- [ ] Deprecations include removal timeline
- [ ] Action-required items clearly marked
- [ ] Code examples for breaking changes
- [ ] Migration checklists provided

## Integration Points

- **With Crosslinker**: Ensure all links are valid and bidirectional
- **With Diátaxis Classifier**: Migration content should be How-To guides
- **With Architecture Diff Analyzer**: Major releases may need ADR/RULE/GUIDE triage

## References

- Keep a Changelog: https://keepachangelog.com/
- Conventional Commits: https://www.conventionalcommits.org/
- Semantic Versioning: https://semver.org/
- GitHub Release Notes: https://docs.github.com/en/repositories/releasing-projects-on-github
