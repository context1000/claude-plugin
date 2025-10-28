---
name: Detect ADR Opportunities
description: Identifies architectural decision opportunities during code reviews and changes. Use proactively when reviewing git diffs, commits, or mentions of database migrations, message brokers, caching, protocols, or NFRs (reliability, scalability, security).
allowed-tools: Read, Grep, Glob, Bash
---

# Detect ADR Opportunities

## Instructions

### 1. Focus on Architectural Decision Triggers

Watch for these key indicators:

- **Technology changes**: Database switches (Postgres, MySQL, Mongo, Redis), message brokers (Kafka, RabbitMQ), cache layers, event buses, protocols (gRPC/REST), major libraries/frameworks
- **Non-functional requirements**: Performance, reliability, security, compliance, scalability
- **Architectural patterns**: Circuit breakers, feature flags, service mesh, API gateways, observability (OpenTelemetry)

### 2. Analyze Git Context

When reviewing changes:

```bash
# Get recent changed files
git diff --name-only HEAD~50..HEAD | sort -u

# Search for architectural triggers in changed files
grep -R -n -E "(kafka|rabbitmq|redis|postgres|mongodb|grpc|rest api|otel|opentelemetry|feature flag|circuit breaker|service mesh|api gateway|load balanc|rate limit)" <files>
```

### 3. Identify ADR-Worthy Changes

An ADR is needed when:

- A technology choice impacts multiple components or teams
- There are clear trade-offs between options
- The decision has long-term consequences
- Non-functional requirements are significantly affected
- Architectural boundaries or patterns are introduced/modified

### 4. Propose ADR Creation

When an architectural decision is identified:

1. **Draft a brief proposal** using MADR/Nygard structure:

   - **Context**: What is the architectural issue or change?
   - **Forces**: What constraints, requirements, or trade-offs exist?
   - **Options**: What alternatives were considered?
   - **Decision drivers**: What factors influenced the choice?

2. **Generate canonical ADR name**: `YYYYMMDD-<kebab-case-title>`

3. **Invoke the slash command**:

   ```
   /context1000/adr "<Title>" --status proposed --template madr --scope <area> --id auto
   ```

4. **Prepare ADR skeleton** with these sections:
   - Context and Problem Statement
   - Decision Drivers
   - Considered Options
   - Decision Outcome
   - Consequences (positive and negative)
   - Links to related ADRs/RFCs

### 5. Quality Guidelines

- **Link to RFCs**: If an RFC exists, check its status and propose linking it to the ADR
- **Filter noise**: Dependency updates without architectural property changes don't require ADRs
- **Check for duplicates**: Search existing ADRs before proposing new ones:

  ```bash
  grep -r -i "<topic>" docs/adr/ .context1000/decisions/adr/
  ```

## Example Workflow

### Scenario: Migration from HTTP to gRPC

```
Detected: Service X migrating from HTTP REST to gRPC for inter-service communication.

Analysis:
- Context: Need for better performance, type safety, and streaming capabilities
- Forces: Team expertise, tooling support, backward compatibility
- Options: HTTP/2, gRPC, GraphQL
- Decision drivers: Performance requirements, type safety, bi-directional streaming

Proposal: Create ADR
Title: "Adopt gRPC for Inter-Service Communication in Service X"
Command: /context1000/adr "Adopt gRPC for Inter-Service Communication in Service X" --status proposed --template madr --scope service-x
```

### Scenario: Introducing Redis Cache Layer

```
Detected: Addition of Redis as caching layer between API and database.

Analysis:
- Context: Database query performance degradation under load
- Forces: Cost, operational complexity, cache invalidation strategy
- Options: In-memory cache, Redis, Memcached
- Decision drivers: Persistence requirements, distributed architecture, eviction policies

Proposal: Create ADR
Title: "Introduce Redis for API Response Caching"
Command: /context1000/adr "Introduce Redis for API Response Caching" --status proposed --template madr --scope platform
```

## Integration Points

- **With RFC→ADR Linker**: If an RFC drove this decision, link them
- **With Architecture Diff Analyzer**: For large-scale changes, coordinate artifact types
- **With Doc Style Enforcer**: Ensure created ADRs follow template standards

## References

- MADR (Markdown Architectural Decision Records): <https://adr.github.io/madr/>
- Michael Nygard's ADR format: <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- Architecture decision practices: <https://github.com/joelparkerhenderson/architecture-decision-record>
