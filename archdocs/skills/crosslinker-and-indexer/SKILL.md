---
name: Crosslinker & Indexer
description: Discovers unlinked artifacts and creates cross-references between ADRs, RFCs, Guides, and Rules. Updates indexes and tables of contents. Activate when new documents are added to docs/.
allowed-tools: Read, Grep, Glob, Bash
---

# Crosslinker & Indexer

## Overview

This skill maintains the web of relationships between architectural documentation artifacts, ensuring discoverability and traceability.

## Cross-Linking Strategy

### Artifact Relationships

```
RFC (Proposal)
  ↓ accepted
ADR (Decision Record)
  ↓ implements
RULE (Standards/Constraints)
  ↓ operationalizes
GUIDE (How-To/Tutorial)
```

**Reverse links are equally important**:
- GUIDE → references RULE
- RULE → derives from ADR
- ADR → documents decision from RFC

## Discovery Process

### Step 1: Scan Artifact Directories
```bash
# Find all architectural artifacts
find docs .context1000 -type f \( -name "*.adr.md" -o -name "*.rfc.md" -o -name "*.guide.md" -o -name "*.rules.md" \) 2>/dev/null

# Get recently added/modified files
git diff --name-only HEAD~10..HEAD | grep -E "\.(adr|rfc|guide|rules)\.md$"
```

### Step 2: Extract Metadata
For each artifact, extract:
- **Title**: First `#` heading
- **ID/Number**: Filename prefix or frontmatter
- **Status**: (for ADR/RFC)
- **Scope/Area**: Frontmatter or content analysis
- **Related terms**: Key technologies, services, concepts

```bash
# Extract title
head -50 <file> | grep "^# " | head -1

# Extract frontmatter
sed -n '/^---$/,/^---$/p' <file>

# Search for explicit links
grep -E "\[.*\]\(.*\.(adr|rfc|guide|rules)\.md\)" <file>
```

### Step 3: Identify Relationships
Use keyword matching and semantic analysis:

#### RFC → ADR Linkage
```bash
# Find accepted RFCs
grep -l "status: accepted\|Status: Accepted" docs/rfc/*.md .context1000/decisions/rfc/*.md

# For each accepted RFC, check if ADR exists
rfc_id=$(basename <rfc-file> .md | grep -o "^[0-9]*")
grep -r "RFC.*$rfc_id\|rfc-$rfc_id" docs/adr/ .context1000/decisions/adr/
```

**Trigger**: If accepted RFC has no corresponding ADR → recommend creation:
```bash
/archdocs:adr "Record Decision from RFC-<ID>: <Title>" --status accepted --template madr --scope <area>
```

#### ADR → RULE Linkage
Rules often enforce decisions made in ADRs.

**Pattern matching**:
- ADR mentions: "must", "required", "shall", "convention", "standard"
- RULE scope matches ADR scope
- Technology/topic overlap

```bash
# Find ADRs with enforcement language
grep -l "must\|required\|shall\|standard" docs/adr/*.adr.md .context1000/decisions/adr/*.adr.md

# Check if corresponding RULE exists
grep -r "<technology-from-adr>" docs/rules/ .context1000/rules/
```

**Trigger**: If ADR specifies standards but no RULE exists → recommend:
```bash
/archdocs:rule "<Standard from ADR>" --severity required --scope <area>
```

#### ADR/RULE → GUIDE Linkage
Guides implement decisions and rules.

**Pattern matching**:
- GUIDE mentions technology/service from ADR
- GUIDE shows "how to" implement RULE
- Topic/scope overlap

```bash
# Find guides related to an ADR topic
adr_topic="kafka"  # extracted from ADR
grep -l -i "$adr_topic" docs/guides/*.guide.md .context1000/guides/*.guide.md
```

**Action**: Add bidirectional links if missing.

### Step 4: Propose Link Additions

When missing links are found, propose specific additions:

#### Add Link to ADR
```markdown
## Links

- Source RFC: [RFC-0023: Adopt Kafka for Event Backbone](../rfc/0023-adopt-kafka.md)
- Related Rules: [RULE: Kafka Topic Naming Convention](../../rules/kafka-topic-naming.rules.md)
- Implementation Guides:
  - [Migrate Service to Kafka](../../guides/migrate-to-kafka.guide.md)
  - [Configure Kafka for Production](../../guides/kafka-production-config.guide.md)
- Supersedes: [ADR-0015: Message Queue Strategy](0015-message-queue-strategy.md)
- Superseded by: (none)
```

#### Add Link to GUIDE
```markdown
## Related Documentation

- [ADR-0042: Adopt Kafka for Event Backbone](../.context1000/decisions/adr/0042-adopt-kafka.adr.md)
- [RULE: Kafka Topic Naming Convention](../.context1000/rules/kafka-topic-naming.rules.md)
- [Kafka Configuration Reference](../reference/kafka-config.md)
```

#### Add Link to RULE
```markdown
## Rationale

This rule enforces the decision made in [ADR-0042: Adopt Kafka for Event Backbone](../decisions/adr/0042-adopt-kafka.adr.md).

## Implementation Guides

- [Configure Kafka Topics](../guides/configure-kafka-topics.guide.md)
```

## Indexing

### Index Types

#### 1. ADR Index
**Location**: `docs/adr/index.md` or `.context1000/decisions/adr/index.md`

**Format**:
```markdown
# Architectural Decision Records

## Active Decisions

| ID | Title | Status | Date | Scope |
|----|-------|--------|------|-------|
| [0056](0056-event-sourcing-audit-log.adr.md) | Adopt Event Sourcing for Audit Log | Accepted | 2025-01-20 | platform |
| [0055](0055-grpc-inter-service.adr.md) | Use gRPC for Inter-Service Communication | Accepted | 2025-01-15 | infrastructure |

## Superseded Decisions

| ID | Title | Superseded By | Date |
|----|-------|---------------|------|
| [0015](0015-message-queue-strategy.adr.md) | Message Queue Strategy | ADR-0042 | 2024-03-10 |

## By Topic

### Infrastructure
- [ADR-0055: Use gRPC for Inter-Service Communication](0055-grpc-inter-service.adr.md)
- [ADR-0042: Adopt Kafka for Event Backbone](0042-adopt-kafka.adr.md)

### Data & Storage
- [ADR-0056: Adopt Event Sourcing for Audit Log](0056-event-sourcing-audit-log.adr.md)

### Security
- [ADR-0048: Implement Zero-Trust Security Model](0048-zero-trust-security.adr.md)
```

#### 2. RFC Index
**Location**: `docs/rfc/index.md` or `.context1000/decisions/rfc/index.md`

**Format**:
```markdown
# Requests for Comments

## Active RFCs

| ID | Title | Status | Author | Related ADR |
|----|-------|--------|--------|-------------|
| [0025](0025-observability-stack.md) | Observability Stack | Review | @alice | - |
| [0024](0024-api-gateway.md) | API Gateway Strategy | Draft | @bob | - |

## Accepted RFCs

| ID | Title | Decision Date | Related ADR |
|----|-------|---------------|-------------|
| [0023](0023-adopt-kafka.md) | Adopt Kafka for Event Backbone | 2025-01-10 | [ADR-0042](../adr/0042-adopt-kafka.adr.md) |

## Rejected RFCs

| ID | Title | Rejection Date | Reason |
|----|-------|----------------|--------|
| [0020](0020-nosql-migration.md) | Migrate to NoSQL | 2024-12-15 | Cost/complexity trade-off unfavorable |
```

#### 3. Guides Index
**Location**: `docs/guides/index.md` or `.context1000/guides/index.md`

**Format**:
```markdown
# Developer Guides

## Tutorials (Learning-Oriented)

- [Your First Microservice](tutorial-first-microservice.guide.md)
- [Getting Started with Kafka](tutorial-kafka-basics.guide.md)

## How-To Guides (Task-Oriented)

### Infrastructure
- [Deploy to Kubernetes](how-to-deploy-kubernetes.guide.md)
- [Configure Load Balancing](how-to-configure-load-balancing.guide.md)

### Data & Messaging
- [Migrate from RabbitMQ to Kafka](how-to-migrate-to-kafka.guide.md)
- [Set up Database Replication](how-to-setup-db-replication.guide.md)

### Security
- [Implement OAuth 2.0](how-to-implement-oauth.guide.md)
```

#### 4. Rules Index
**Location**: `docs/rules/index.md` or `.context1000/rules/index.md`

**Format**:
```markdown
# Architecture Rules

## Required (Enforced)

| Rule | Scope | Enforcement | Related ADR |
|------|-------|-------------|-------------|
| [API Design Standards](api-design-standards.rules.md) | backend | Linter | [ADR-0030](../adr/0030-api-standards.adr.md) |
| [Service Health Checks](service-health-checks.rules.md) | platform | CI/CD | [ADR-0045](../adr/0045-observability.adr.md) |

## Warnings (Should Follow)

| Rule | Scope | Related ADR |
|------|-------|-------------|
| [Structured Logging](structured-logging.rules.md) | all | [ADR-0045](../adr/0045-observability.adr.md) |

## Informational (Recommended)

| Rule | Scope | Related ADR |
|------|-------|-------------|
| [Code Review Guidelines](code-review-guidelines.rules.md) | all | - |
```

### Index Update Workflow

```bash
# 1. Scan for new/modified artifacts
new_files=$(git diff --name-only HEAD~5..HEAD | grep -E "\.(adr|rfc|guide|rules)\.md$")

# 2. For each new file, extract metadata
for file in $new_files; do
  title=$(head -50 "$file" | grep "^# " | head -1 | sed 's/^# //')
  # Extract other metadata...
done

# 3. Update appropriate index
# Recommend edit to index.md files
```

**IMPORTANT**: Indexes should be updated via Edit tool, NOT by creating new artifacts.

## Link Validation

### Check for Broken Links
```bash
# Find all markdown links
grep -r -h -o "\[.*\]([^)]*)" docs/ .context1000/ | sed 's/.*(\([^)]*\)).*/\1/' | sort -u

# For each link, check if target exists
for link in $links; do
  # Resolve relative path
  target="<base-path>/$link"
  [ -f "$target" ] || echo "Broken link: $link"
done
```

### Check for Orphaned Documents
```bash
# Find documents with no incoming links
all_docs=$(find docs .context1000 -name "*.md")
for doc in $all_docs; do
  incoming_links=$(grep -r -l "$(basename $doc)" docs/ .context1000/ 2>/dev/null | wc -l)
  [ $incoming_links -eq 0 ] && echo "Orphaned: $doc"
done
```

## Cross-Linking Patterns

### Pattern 1: RFC Accepted → Create ADR
```
Detected: RFC-0023 status changed to "Accepted"
Action:
1. Check if ADR exists referencing RFC-0023
2. If not: /archdocs:adr "Record Decision from RFC-0023: Adopt Kafka" --status accepted --template madr --scope platform
3. Update RFC-0023 to link to new ADR
4. Update ADR index
```

### Pattern 2: ADR Mentions Standards → Create RULE
```
Detected: ADR-0042 contains "All services must use Kafka for async messaging"
Action:
1. Check if RULE exists for Kafka usage standards
2. If not: /archdocs:rule "Kafka Usage Standards" --severity required --scope platform
3. Update RULE to reference ADR-0042
4. Update ADR-0042 to link to RULE
5. Update RULE index
```

### Pattern 3: RULE Without Guide → Create GUIDE
```
Detected: RULE "Kafka Topic Naming Convention" but no implementation guide
Action:
1. Check if GUIDE exists for Kafka topic creation
2. If not: /archdocs:guide "Configure Kafka Topics" --audience backend
3. Update GUIDE to reference RULE
4. Update RULE to link to GUIDE
5. Update GUIDE index
```

### Pattern 4: Guide References Outdated ADR
```
Detected: GUIDE "Migrate to Kafka" references ADR-0015 (superseded by ADR-0042)
Action:
1. Update GUIDE to reference ADR-0042 instead
2. Add note: "Previously documented in ADR-0015 (superseded)"
```

## Example Workflow

### Scenario: New ADR Created
```
Input: New file .context1000/decisions/adr/0057-api-gateway-kong.adr.md

Actions:
1. Extract metadata:
   - Title: "Adopt Kong as API Gateway"
   - Status: Accepted
   - Scope: infrastructure
   - Date: 2025-01-22

2. Search for related artifacts:
   - RFC: grep -r "api gateway\|kong" docs/rfc/ .context1000/decisions/rfc/
   - Found: RFC-0025 "API Gateway Strategy" (Accepted)
   - RULE: grep -r "api gateway" docs/rules/ .context1000/rules/
   - None found
   - GUIDE: grep -r "kong\|api gateway" docs/guides/ .context1000/guides/
   - None found

3. Propose cross-links:
   a) Add to ADR-0057:
      ## Links
      - Source RFC: [RFC-0025: API Gateway Strategy](../rfc/0025-api-gateway.md)

   b) Update RFC-0025:
      ## Related Decisions
      - [ADR-0057: Adopt Kong as API Gateway](../adr/0057-api-gateway-kong.adr.md)

   c) Recommend RULE creation:
      /archdocs:rule "API Gateway Usage Standards" --severity required --scope infrastructure

   d) Recommend GUIDE creation:
      /archdocs:guide "Configure Kong API Gateway" --audience infra

4. Update ADR index:
   Add row to "Active Decisions" table:
   | [0057](0057-api-gateway-kong.adr.md) | Adopt Kong as API Gateway | Accepted | 2025-01-22 | infrastructure |

5. Report:
   Cross-linking complete for ADR-0057:
   - Linked to RFC-0025 ✓
   - Added to ADR index ✓
   - Recommended RULE creation (pending)
   - Recommended GUIDE creation (pending)
```

## Quality Checklist

Before completing cross-linking:

- [ ] All accepted RFCs have corresponding ADRs
- [ ] ADRs with standards have corresponding RULEs
- [ ] RULEs have implementation GUIDEs
- [ ] All links use descriptive text (no "click here")
- [ ] Bidirectional links exist (A→B and B→A)
- [ ] Indexes are up to date
- [ ] No broken links
- [ ] No orphaned documents (except archived)
- [ ] Superseded ADRs marked and linked to replacement

## Integration Points

- **With Diátaxis Classifier**: Links should indicate document type
- **With Google Style Editor**: Link text follows style guidelines
- **With RFC→ADR Linker**: Primary mechanism for RFC-ADR linkage
- **With Detect ADR Opportunities**: Link newly detected ADRs
- **With Architecture Diff Analyzer**: Link ADR/RULE/GUIDE triads

## References

- Arc42 documentation structure: https://arc42.org/
- ADR linking practices: https://adr.github.io/
- Documentation as Code: https://www.writethedocs.org/guide/docs-as-code/
