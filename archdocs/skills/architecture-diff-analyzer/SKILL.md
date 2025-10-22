---
name: Architecture Diff Analyzer
description: Analyzes major changes (modules/directories/infrastructure) and recommends appropriate artifact types (ADR, RULE, or GUIDE). Trigger automatically when "major refactor", "service extraction", or "infra change" are mentioned.
allowed-tools: Read, Grep, Glob, Bash
---

# Architecture Diff Analyzer

## Instructions

### 1. Analyze Change Scope

Generate an overview of changes at the directory level:

```bash
# Get directory-level change statistics
git diff --dirstat=files,0 HEAD~30..HEAD

# Get file counts by directory
git diff --name-only HEAD~30..HEAD | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn

# Identify new directories (potential service extraction)
git diff --name-status HEAD~30..HEAD | grep "^A" | cut -f2 | sed 's|/[^/]*$||' | sort -u
```

### 2. Classify Artifact Type

Determine which architectural artifact is needed:

#### ADR (Architectural Decision Record)

**Use when**:

- Strategic technology choice
- Architectural pattern introduction/change
- System-wide trade-offs
- Cross-cutting concerns (security, scalability, reliability)
- Technology stack changes

**Examples**:

- "Switch from monolith to microservices"
- "Adopt event-driven architecture"
- "Choose between SQL and NoSQL"
- "Implement multi-region deployment"

#### RULE (Architecture Rule)

**Use when**:

- Team conventions and standards
- Code style and structure requirements
- Technology usage constraints
- Quality gates and thresholds
- Mandatory practices

**Examples**:

- "All services must expose health endpoints"
- "Use structured logging with correlation IDs"
- "API responses must follow JSON:API spec"
- "Maximum cyclomatic complexity: 10"

#### GUIDE (Architecture Guide)

**Use when**:

- Repeatable procedures and workflows
- "How-to" documentation
- Migration patterns
- Template implementations
- Onboarding processes

**Examples**:

- "How to create a new microservice"
- "Database migration procedure"
- "CI/CD pipeline setup guide"
- "Monitoring integration guide"

### 3. Invoke Appropriate Command

#### For ADR

```bash
/archdocs/adr "<Title>" --status proposed --template madr --scope <area>
```

**Scope options**: `platform`, `backend`, `frontend`, `infrastructure`, `data`, `security`, `<service-name>`

#### For RULE

```bash
/archdocs/rule "<Rule Title>" --severity <level> --scope <area>
```

**Severity levels**:

- `required`: Must follow, build fails if violated
- `warn`: Should follow, warnings generated
- `info`: Recommended practice, informational

#### For GUIDE

```bash
/archdocs/guide "<Guide Title>" --audience <target>
```

**Audience options**: `backend`, `frontend`, `infra`, `data`, `qa`, `all`

### 4. Check for Duplicates

Before creating any artifact, search for existing ones:

```bash
# Search ADRs
grep -r -i "<topic>" docs/adr/ .context1000/decisions/adr/ 2>/dev/null

# Search RULEs
grep -r -i "<topic>" docs/rules/ .context1000/architecture/rules/ 2>/dev/null

# Search GUIDEs
grep -r -i "<topic>" docs/guides/ .context1000/architecture/guides/ 2>/dev/null
```

### 5. Cross-Reference Related Artifacts

When creating an artifact, link to related documentation:

- ADRs that informed the decision
- RULEs that enforce the decision
- GUIDEs that implement the decision
- RFCs that proposed the change

## Analysis Patterns

### Pattern 1: Service Extraction

**Indicators**:

```bash
# New service directory structure
services/new-service/
├── src/
├── tests/
├── Dockerfile
└── README.md

# Infrastructure changes
terraform/services/new-service/
├── main.tf
├── variables.tf
└── outputs.tf
```

**Recommended Artifacts**:

1. **ADR**: "Extract [Service Name] from Monolith"
   - Context: Why extract this service?
   - Decision: Service boundaries and responsibilities
   - Consequences: Operational complexity vs. scalability

2. **RULE**: "Service Communication Standards"
   - All services must use gRPC for internal communication
   - REST APIs for external interfaces only

3. **GUIDE**: "Service Extraction Procedure"
   - Step-by-step migration process
   - Data migration strategy
   - Rollback plan

### Pattern 2: Infrastructure Migration

**Indicators**:

```bash
# Cloud provider changes
- aws/
+ gcp/

# Container orchestration shift
- docker-compose.yml
+ k8s/
  ├── deployments/
  ├── services/
  └── configmaps/
```

**Recommended Artifacts**:

1. **ADR**: "Migrate from AWS to GCP" or "Adopt Kubernetes"
   - Cost analysis
   - Feature comparison
   - Migration risks

2. **RULE**: "Kubernetes Resource Requirements"
   - All deployments must define resource limits
   - Health checks required

3. **GUIDE**: "Kubernetes Deployment Guide"
   - Helm chart usage
   - ConfigMap and Secret management
   - Rolling update procedure

### Pattern 3: Database Changes

**Indicators**:

```bash
# Schema changes
migrations/
├── 001_add_sharding.sql
├── 002_partition_users.sql

# New database type
- services/cache/redis.conf
+ services/cache/memcached.conf
```

**Recommended Artifacts**:

1. **ADR**: "Implement Database Sharding" or "Switch to Memcached"
   - Scalability requirements
   - Data distribution strategy
   - Query pattern impact

2. **RULE**: "Database Access Patterns"
   - Direct database access prohibited from frontend
   - All queries through ORM

3. **GUIDE**: "Database Migration Procedure"
   - Schema migration steps
   - Data backfill process
   - Rollback strategy

### Pattern 4: API Changes

**Indicators**:

```bash
# API versioning
api/
├── v1/
└── v2/

# Protocol changes
- rest/
+ grpc/
```

**Recommended Artifacts**:

1. **ADR**: "Adopt gRPC for Internal APIs" or "API Versioning Strategy"
   - Performance requirements
   - Client compatibility
   - Evolution strategy

2. **RULE**: "API Design Standards"
   - RESTful conventions
   - Error response format
   - Rate limiting requirements

3. **GUIDE**: "API Development Guide"
   - Creating new endpoints
   - Version migration
   - Documentation requirements

## Example Workflows

### Scenario 1: Major Refactoring

```
Analysis:
$ git diff --dirstat=files,0 HEAD~30..HEAD
  45.0% services/billing/
  30.0% terraform/
  15.0% docs/
  10.0% shared/

Detected: Billing service extraction + infrastructure changes

Artifacts Needed:
1. ADR: "Extract Billing Service from Monolith"
   Command: /archdocs/adr "Extract Billing Service from Monolith" --status proposed --template madr --scope billing

2. GUIDE: "Service Migration Procedure"
   Command: /archdocs/guide "Service Migration Procedure" --audience backend

3. RULE: "Service Deployment Requirements"
   Command: /archdocs/rule "Service Deployment Requirements" --severity required --scope platform
```

### Scenario 2: Observability Enhancement

```
Analysis:
Changes in monitoring/, logging/, and tracing/ directories

Detected: Comprehensive observability stack implementation

Artifacts Needed:
1. ADR: "Adopt OpenTelemetry for Observability"
   Command: /archdocs/adr "Adopt OpenTelemetry for Observability" --status proposed --template madr --scope platform

2. RULE: "Telemetry Standards"
   Command: /archdocs/rule "Telemetry Standards" --severity warn --scope all

3. GUIDE: "Integrating OpenTelemetry in Services"
   Command: /archdocs/guide "Integrating OpenTelemetry in Services" --audience all
```

### Scenario 3: Security Hardening

```
Analysis:
Changes in auth/, security/, and multiple service configurations

Detected: Authentication and authorization overhaul

Artifacts Needed:
1. ADR: "Implement Zero-Trust Security Model"
   Command: /archdocs/adr "Implement Zero-Trust Security Model" --status proposed --template madr --scope security

2. RULE: "Authentication Requirements"
   Command: /archdocs/rule "Authentication Requirements" --severity required --scope security

3. GUIDE: "Implementing Service-to-Service Authentication"
   Command: /archdocs/guide "Implementing Service-to-Service Authentication" --audience backend
```

## Quality Guidelines

### Completeness

- Don't create artifacts in isolation
- Consider the full lifecycle: Decision (ADR) → Standards (RULE) → Implementation (GUIDE)

### Consistency

- Use consistent naming across related artifacts
- Cross-reference between ADR, RULE, and GUIDE
- Maintain traceability from decision to implementation

### Timeliness

- Create artifacts during the change, not after
- Update existing artifacts when changes affect them
- Archive superseded artifacts rather than deleting them

### Avoid Over-Documentation

- Not every code change needs all three artifact types
- Small changes may need only a RULE or GUIDE
- Reserve ADRs for truly architectural decisions

## Integration Points

- **With Detect ADR Opportunities**: Provides change triggers for ADR detection
- **With RFC→ADR Linker**: Links implementation changes to decision documents
- **With Doc Style Enforcer**: Ensures created artifacts follow standards

## References

- Architectural artifact types: <https://github.com/joelparkerhenderson/architecture-decision-record>
- Documentation-as-Code: <https://www.writethedocs.org/>
- MADR templates: <https://adr.github.io/madr/>
