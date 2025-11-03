---
name: rfc-to-adr-linker
description: Links accepted RFCs to corresponding ADRs. Use when RFCs are mentioned, status changes occur, or decisions are made through the RFC process.
allowed-tools: Read, Grep, Glob, Bash
---

# RFC→ADR Linker

## Instructions

### 1. Find Accepted RFCs

Search for RFCs that have been accepted or approved:

```bash
# Search in common RFC locations
grep -R -n -E "^(Status:\\s*Accepted|Status:\\s*Approved)" docs/rfc/ .context1000/decisions/rfc/ 2>/dev/null

# Also check for status in frontmatter
grep -R -l "status: accepted\|status: approved" docs/rfc/ .context1000/decisions/rfc/ 2>/dev/null
```

### 2. Verify ADR Existence

For each accepted RFC:

1. **Extract RFC metadata**: ID, title, key decisions
2. **Search for corresponding ADR** by:
   - RFC ID reference
   - Similar title/slug
   - Cross-references in existing ADRs

```bash
# Search for RFC references in ADRs
grep -R -i "rfc-<ID>\|rfc <ID>\|from RFC <ID>" docs/adr/ .context1000/decisions/adr/ 2>/dev/null
```

### 3. Create Missing ADRs

If no corresponding ADR exists for an accepted RFC:

1. **Read the RFC** to extract:

   - Core decision and rationale
   - Trade-offs and alternatives considered
   - Key decision drivers
   - Implementation impact

2. **Generate ADR title**: `"Record Decision from RFC-<ID>: <Concise Title>"`

3. **Invoke the creation command**:

   ```
   /context1000/adr "Record Decision from RFC-<ID>: <Concise Title>" --status accepted --template madr --scope <area>
   ```

4. **Include in ADR content**:
   - Link to source RFC
   - RFC decision summary
   - Key trade-offs from RFC
   - Implementation timeline/status
   - Related architectural decisions

### 4. Link Existing ADRs

If an ADR already exists but lacks RFC linkage:

1. **Check cross-references** in both documents
2. **Verify ADR index** (`docs/adr/index.md` or `.context1000/decisions/adr/index.md`)
3. **Propose updates** to:
   - Add RFC link in ADR "Links" section
   - Add ADR reference in RFC "Related Decisions" section
   - Update index with cross-reference

### 5. Maintain Bidirectional Links

Ensure both RFC and ADR reference each other:

**In ADR**:

```markdown
## Links

- Source RFC: [RFC-0023: Adopt Kafka for Event Backbone](../rfc/0023-adopt-kafka.md)
- Supersedes: [ADR-0015: Message Queue Strategy](0015-message-queue-strategy.md)
```

**In RFC** (propose update):

```markdown
## Related Decisions

- [ADR-0042: Record Decision from RFC-0023](../adr/0042-record-decision-from-rfc-0023.md)
```

## Example Workflows

### Scenario 1: Accepted RFC without ADR

```
Found: docs/rfc/0023-adopt-kafka.md (Status: Accepted)
Checked: No corresponding ADR exists

Action: Create ADR linking to RFC-0023
Command: /context1000/adr "Record Decision from RFC-0023: Adopt Kafka for Event Backbone" --status accepted --template madr --scope platform

Content Summary:
- Context: Need for scalable event-driven architecture (from RFC-0023)
- Decision: Kafka chosen over RabbitMQ and AWS SNS/SQS
- Trade-offs: Operational complexity vs. throughput and replay capabilities
- Consequences: Team training needed, new monitoring requirements
- Link: RFC-0023 for detailed analysis
```

### Scenario 2: Multiple RFCs Accepted in Batch

```
Found: 3 accepted RFCs in recent commits
- RFC-0045: API Gateway Strategy (Accepted)
- RFC-0046: Observability Stack (Accepted)
- RFC-0047: Database Sharding Approach (Accepted)

Actions:
1. /context1000/adr "Record Decision from RFC-0045: Implement Kong API Gateway" --status accepted --template madr --scope infrastructure
2. /context1000/adr "Record Decision from RFC-0046: Adopt OpenTelemetry for Observability" --status accepted --template madr --scope platform
3. /context1000/adr "Record Decision from RFC-0047: Horizontal Sharding for User Database" --status accepted --template madr --scope data
```

### Scenario 3: ADR Exists but Missing RFC Link

```
Found: RFC-0031 (Accepted) mentions migration to microservices
Found: ADR-0052 titled "Microservices Architecture Adoption"
Issue: ADR-0052 doesn't reference RFC-0031

Action: Propose update to ADR-0052
- Add link to RFC-0031 in "Links" section
- Add note: "Based on analysis from RFC-0031"
- Update ADR index to show RFC→ADR relationship
```

## Quality Guidelines

### Timing

- **Trigger on RFC status change**: When RFC moves to "Accepted" or "Approved"
- **Batch processing**: When multiple RFCs are accepted, create ADRs in logical order
- **Retroactive linking**: Periodically scan for orphaned accepted RFCs

### Content Mapping

Map RFC sections to ADR sections:

- RFC "Problem Statement" → ADR "Context and Problem Statement"
- RFC "Proposed Solution" → ADR "Decision Outcome"
- RFC "Alternatives Considered" → ADR "Considered Options"
- RFC "Impact Analysis" → ADR "Consequences"

### Avoid Duplication

- Don't duplicate entire RFC content in ADR
- ADR should summarize the decision with link to RFC for details
- Focus ADR on the final decision and its architectural implications

## Integration Points

- **With Detect ADR Opportunities**: RFC acceptance is a strong ADR trigger
- **With Architecture Diff Analyzer**: Coordinate when RFC drives major refactoring
- **With Doc Style Enforcer**: Ensure generated ADRs follow template standards

## References

- RFC process documentation: [RFC Template](../../commands/create-rfc.md)
- ADR template: [ADR Template](../../commands/create-adr.md)
- Cross-referencing practices: <https://adr.github.io/>
