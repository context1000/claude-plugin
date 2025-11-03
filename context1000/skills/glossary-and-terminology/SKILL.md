---
name: glossary-and-terminology-harmonizer
description: Maintains consistent terminology across documentation. Detects synonyms/ambiguities, builds glossary, enforces inclusive language. Follows Google's "write for a global audience" principles.
allowed-tools: Read, Grep, Glob, Bash
---

# Glossary & Terminology Harmonizer

## Overview

This skill ensures consistent, clear, and inclusive terminology across all documentation, making it accessible to a global audience.

## Core Principles

### 1. Consistency

Use the same term throughout all documentation. Don't vary for stylistic reasons.

❌ **Inconsistent**: "Clone the repo... After cloning the repository... Once you've cloned the codebase..."
✅ **Consistent**: "Clone the repository... After cloning the repository... Once you've cloned the repository..."

### 2. Clarity

Choose terms that are clear to a global audience, including non-native English speakers.

❌ **Unclear**: "Spin up a container"
✅ **Clear**: "Start a container" or "Create and start a container"

### 3. Inclusivity

Use inclusive, respectful terminology that welcomes all contributors.

❌ **Exclusive**: whitelist, blacklist, master/slave, guys
✅ **Inclusive**: allowlist, denylist, primary/replica, everyone/folks/team

## Terminology Scan Workflow

### Step 1: Scan for Variations

```bash
# Find all documentation
docs=$(find docs .context1000 -name "*.md" -type f)

# Common variation patterns
grep -rh -i -o "\b(repo|repository)\b" $docs | sort | uniq -c
grep -rh -i -o "\b(k8s|kubernetes)\b" $docs | sort | uniq -c
grep -rh -i -o "\b(db|database)\b" $docs | sort | uniq -c
```

### Step 2: Detect Problematic Terms

```bash
# Non-inclusive terms
grep -rn -i "whitelist\|blacklist\|master/slave\|guys" docs/ .context1000/

# Ambiguous abbreviations
grep -rn -i "\bAPI\b\|\bCLI\b\|\bURL\b" docs/ .context1000/ | grep -v "defined"

# Jargon or idioms
grep -rn -i "easy\|simply\|just\|obviously\|clearly" docs/ .context1000/
```

### Step 3: Build Canonical Glossary

Create or update `docs/glossary.md` or `.context1000/glossary.md`:

```markdown
# Glossary

## A

### ADR (Architectural Decision Record)

A document capturing an important architectural decision along with its context and consequences.

**Usage**: Always capitalize as "ADR" on first use, then can use lowercase "adr" in casual references.

### API (Application Programming Interface)

A set of protocols and tools for building software applications.

**Usage**: Define on first use: "Application Programming Interface (API)". Use "API" thereafter.

**Related**: [API Design Standards](../.context1000/rules/api-design-standards.rules.md)

### Allowlist

A list of entities allowed access (preferred over deprecated "whitelist").

**Usage**: Always use "allowlist" instead of "whitelist".

**Deprecated terms**: whitelist

## B

### Backend

Server-side application logic and data management.

**Usage**: One word, not "back-end" or "back end".

**Related**: frontend

## C

### Cache

A hardware or software component that stores data for faster future access.

**Usage**: As verb "cache", as noun "cache" (not "caching layer" unless specifically referring to architecture).

**Related**: Redis, Memcached

### Circuit Breaker

A design pattern that prevents cascading failures in distributed systems.

**Usage**: Capitalize when referring to the pattern name, lowercase in general usage.

**Related**: [ADR-0043: Implement Circuit Breaker Pattern](../.context1000/decisions/adr/0043-circuit-breaker.adr.md)

## D

### Denylist

A list of entities denied access (preferred over deprecated "blacklist").

**Usage**: Always use "denylist" instead of "blacklist".

**Deprecated terms**: blacklist

### Deployment

The process of making software available for use.

**Usage**: Not "deploys" as a noun. Use "deployments" for plural.

## G

### gRPC (Google Remote Procedure Call)

A high-performance RPC framework.

**Usage**: lowercase "g", all other letters capitals: "gRPC". In code/commands, may appear as "grpc".

**Do not use**: GRPC, Grpc, G-RPC

**Related**: [ADR-0055: Use gRPC for Inter-Service Communication](../.context1000/decisions/adr/0055-grpc-inter-service.adr.md)

## K

### Kafka

An open-source distributed event streaming platform.

**Usage**: Always capitalize "Kafka" (proper noun).

**Related**: [ADR-0042: Adopt Kafka for Event Backbone](../.context1000/decisions/adr/0042-adopt-kafka.adr.md)

### Kubernetes

An open-source container orchestration platform.

**Usage**: Full name "Kubernetes" in documentation. In code/commands, "kubectl" or namespace "k8s" is acceptable.

**Do not use**: "K8s" or "k8s" in prose (use in code only)

## M

### Microservice

An architectural style structuring an application as a collection of loosely coupled services.

**Usage**: One word: "microservice", not "micro-service" or "micro service".

## P

### Primary/Replica

Terms for database replication roles.

**Usage**: Use "primary/replica" instead of deprecated "master/slave".

**Deprecated terms**: master/slave

## R

### Repository

A storage location for software packages or source code.

**Usage**: Use full word "repository" in documentation. In code/commands, "repo" is acceptable.

**Do not use**: "repo" in prose (except when referring to command `git repo`)

### REST (Representational State Transfer)

An architectural style for distributed hypermedia systems.

**Usage**: All caps "REST" when used as acronym. Define on first use.

**Related**: RESTful API

### RFC (Request for Comments)

A proposal document for significant changes requiring team input.

**Usage**: Always capitalize "RFC".

**Related**: [RFC Process Guide](../guides/rfc-process.guide.md)

## S

### Service

A self-contained unit of functionality in a microservices architecture.

**Usage**: Lowercase unless part of proper name: "user service", but "User Service API".

## T

### Terminal

A command-line interface for interacting with the operating system.

**Usage**: Prefer "terminal" over "shell", "console", or "command prompt" for consistency.

**Acceptable variations**: "command line", "command-line interface (CLI)"
```

## Harmonization Process

### Step 1: Identify Canonical Terms

For each concept, choose ONE canonical term:

| Concept                 | Canonical Term  | Avoid                             |
| ----------------------- | --------------- | --------------------------------- |
| Source code storage     | repository      | repo, codebase, source            |
| Container orchestration | Kubernetes      | K8s, k8s (in prose)               |
| Remote procedure call   | gRPC            | GRPC, Grpc                        |
| Access control (allow)  | allowlist       | whitelist                         |
| Access control (deny)   | denylist        | blacklist                         |
| Database roles          | primary/replica | master/slave                      |
| Command interface       | terminal        | shell, console, command prompt    |
| Service logic (server)  | backend         | back-end, back end, server-side   |
| Service logic (client)  | frontend        | front-end, front end, client-side |

### Step 2: Perform Mass Updates

```bash
# Example: Standardize "repository" usage
# Find all variations
grep -rn "\brepo\b" docs/ .context1000/ | grep -v "git.*repo\|npm.*repo"

# For each file, propose replacement
# (Use Edit tool, not sed, to update files)
```

### Step 3: Create RULE for Mandatory Terms

When terminology is critical:

```bash
/context1000:rule "Inclusive Terminology Standards" --severity required --scope all
```

Example RULE content:

```markdown
# Inclusive Terminology Standards

## Rationale

Ensure documentation is welcoming and clear for a global, diverse audience.

## Required Terms

| Use              | Instead of                        |
| ---------------- | --------------------------------- |
| allowlist        | whitelist                         |
| denylist         | blacklist                         |
| primary/replica  | master/slave                      |
| stop/terminate   | kill (except Unix signal context) |
| placeholder text | dummy text                        |

## Enforcement

- Pre-commit hook checks for deprecated terms
- CI/CD pipeline fails on prohibited terms
- Linter rules configured

## Exceptions

- Historical references in ADRs (mark as deprecated)
- Direct quotes from external sources
- Code/API names we don't control (document alternative terms)
```

## Common Terminology Issues

### Issue 1: Jargon and Idioms

❌ **Problematic**: "It's a piece of cake to set up."
✅ **Better**: "Setting up is straightforward."

❌ **Problematic**: "Simply configure the API key."
✅ **Better**: "Configure the API key."

❌ **Problematic**: "This will blow up your application."
✅ **Better**: "This will cause the application to fail."

### Issue 2: Inconsistent Abbreviations

❌ **Inconsistent**:

- "The Postgres database..."
- "Connect to PostgreSQL..."
- "Using pg_dump..."

✅ **Consistent**:

- "The PostgreSQL database..." (full name on first use)
- "Connect to PostgreSQL..."
- "Using the `pg_dump` tool..." (command in code formatting)

### Issue 3: Ambiguous Pronouns

❌ **Ambiguous**: "The service connects to the database. It must be configured first."
(Which needs configuration? Service or database?)

✅ **Clear**: "The service connects to the database. You must configure the database first."

### Issue 4: Cultural References

❌ **Cultural**: "Hit a home run with this feature"
✅ **Universal**: "Succeed with this feature" or "This feature provides excellent results"

### Issue 5: Non-Inclusive Language

❌ **Non-inclusive**:

- "Sanity check the configuration"
- "The master branch..."
- "Whitelist these IPs"
- "Hey guys, check this out"

✅ **Inclusive**:

- "Verify the configuration" or "Validate the configuration"
- "The main branch..."
- "Add these IPs to the allowlist"
- "Everyone, check this out" or "Team, check this out"

## Glossary Maintenance

### Adding New Terms

When introducing new technology or concept:

1. **Define on first use**:

   ```markdown
   Use OpenTelemetry (OTel) for distributed tracing...
   ```

2. **Add to glossary**:

   ```markdown
   ### OpenTelemetry (OTel)

   An observability framework for cloud-native software.

   **Usage**: Define on first use. Abbreviation "OTel" acceptable after definition.

   **Related**: [ADR-0046: Adopt OpenTelemetry for Observability](...)
   ```

3. **Link to relevant documentation**:
   - ADR explaining the decision
   - GUIDE for implementation
   - RULE for usage standards

### Deprecating Terms

When phasing out terminology:

1. **Mark as deprecated in glossary**:

   ```markdown
   ### Whitelist ⚠️ DEPRECATED

   **Use instead**: allowlist

   **Deprecated since**: 2025-01-15
   **Will be removed**: 2025-04-15

   See [Inclusive Terminology Standards](...)
   ```

2. **Create migration guidance**:

   ```bash
   /context1000:guide "Migrate to Inclusive Terminology" --audience all
   ```

3. **Update all documentation**:
   - Use Edit tool to replace deprecated terms
   - Add deprecation notes where term appears in historical context

## Automated Checks

### Pre-Commit Hook

Create `.git/hooks/pre-commit` or CI check:

```bash
#!/bin/bash

# Check for non-inclusive terms
if git diff --cached --name-only | grep '\.md$' | xargs grep -i 'whitelist\|blacklist\|master.*slave'; then
  echo "Error: Non-inclusive terminology detected"
  echo "Please use: allowlist/denylist, primary/replica"
  exit 1
fi

# Check for undefined acronyms
# (More complex - would need context to know if it's first use)
```

### Linter Configuration

If using a documentation linter (e.g., Vale, alex):

```yaml
# .vale.ini
[*.md]
BasedOnStyles = Google, Inclusive

# Custom rules
Google.Acronyms = YES
Inclusive.Terms = YES
```

## Integration Points

- **With Google Style Editor**: Terminology consistency is part of style
- **With Diátaxis Classifier**: Ensure terms defined in reference, used consistently in guides
- **With API Reference Extractor**: API terminology must match glossary
- **With Example Upgrader**: Code comments should use canonical terms

## Quality Checklist

- [ ] Glossary file exists and is up-to-date
- [ ] All acronyms defined on first use
- [ ] No deprecated/non-inclusive terms in new documentation
- [ ] Consistent term usage across all documents
- [ ] Technical terms link to glossary
- [ ] Glossary entries link to relevant ADR/RULE/GUIDE
- [ ] Abbreviation usage follows guidelines
- [ ] No jargon or idioms that don't translate
- [ ] Clear antecedents for all pronouns

## References

- Google Developer Documentation Style Guide (Word List): https://developers.google.com/style/word-list
- Microsoft Style Guide (Bias-Free Communication): https://docs.microsoft.com/en-us/style-guide/bias-free-communication
- Inclusive Naming Initiative: https://inclusivenaming.org/
- Write the Docs (Style Guides): https://www.writethedocs.org/guide/writing/style-guides/
- Alex (Linter for Inclusive Writing): https://alexjs.com/
