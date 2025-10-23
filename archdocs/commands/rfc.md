---
description: Create a Request for Comments (RFC) document in the context1000 documentation structure
argument-hint: "<title>" [--status draft|review|accepted|rejected]
---

# Create RFC Command

Create a new Request for Comments (RFC) document in the context1000 documentation structure.

## Instructions

When this slash command is invoked, Claude should:

1. **Parse the RFC title** from the conversation context
2. **Create the directory structure** if it doesn't exist: `.context1000/decisions/rfc/`
3. **Generate slug**: Convert title to lowercase-kebab-case
4. **Create the RFC file** at `.context1000/decisions/rfc/{slug}.rfc.md` with proper frontmatter and template
5. **Report success** with the file path

**IMPORTANT: Keep all documentation EXTREMELY concise. Maximum limits:**

- **Summary**: 2-3 sentences max (50 words)
- **Context and problem**: 3-5 bullet points (75 words)
- **Proposed solution**: 3-5 bullet points (100 words)
- **Alternatives**: 2-3 options, one sentence each (50 words)
- **Impact**: 3-5 bullet points (75 words)
- **Implementation plan**: 3-4 milestones, one sentence each (50 words)
- **Success metrics**: 2-3 metrics (25 words)
- **Risks**: 3-5 items (50 words)
- **Total document**: aim for 400-500 words maximum
- Pure signal, no filler.

## Argument Parsing

Parse command arguments as follows:

- **Title**: `$1` or all text before first `--` flag (required)
- **--status**: Optional status (draft|review|accepted|rejected|deprecated). Default: `draft`

Examples:

```bash
/archdocs:rfc "Introduce new authentication system"
/archdocs:rfc "Event backbone for platform" --status review
/archdocs:rfc "Add multi-tenancy support" --status draft
```

## File Template

Create the RFC file at `.context1000/decisions/rfc/{slug}.rfc.md` with this structure:

```markdown
---
name: {title-slug} # Unique identifier for the RFC
title: {Title} # Human-readable title
status: draft # accepted, rejected, draft, review, deprecated
tags: [] # Categorization tags
related: # Cross-references to related documents (one or many)
  rfcs: [] # Related RFCs by name
  adrs: [] # Related ADRs by name
  rules: [] # Related rules by name
  guides: [] # Related guides by name
  projects: [] # Related projects by name
---

## Summary

[2-3 sentences: who needs this, what changes, why now.]

## Context and problem

- [Current limitation 1]
- [Current limitation 2]
- [Impact scope]

## Proposed solution

- [Core idea in 1 sentence]
- [Key technical detail 1]
- [Key technical detail 2]

## Alternatives

- **Option A**: [Why not]
- **Option B**: [Why not]

## Impact

- **Performance**: [Brief note]
- **Compatibility**: [Brief note]
- **Security**: [Brief note if relevant]

## Implementation plan

- **M1**: [Milestone 1 - estimate]
- **M2**: [Milestone 2 - estimate]
- **M3**: [Milestone 3 - estimate]
- **Rollback**: [One sentence]

## Success metrics

- [Metric 1: threshold/date]
- [Metric 2: threshold/date]

## Risks and open questions

- [Risk/question 1]
- [Risk/question 2]
```

## Implementation Steps

Follow these steps to create the RFC:

1. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/decisions/rfc)`
2. **Convert title to slug**: "Add Multi-Tenancy Support" → "add-multi-tenancy-support"
3. **Create file**: Use `Write` tool with path `.context1000/decisions/rfc/{slug}.rfc.md`
4. **Populate content**: Include frontmatter (name, title, status: draft, tags, related) and template sections
5. **Verify**: Use `Read` tool to confirm file was created correctly
6. **Report**: Display success message with file path

## Status Values

RFCs use these status values:

- **draft:** Initial proposal being written
- **review:** Under team review and discussion
- **accepted:** Approved and ready for implementation
- **rejected:** Proposal not accepted
- **deprecated:** No longer relevant or superseded

## Output Format

After creating the RFC, display:

```
✓ Created RFC: {Title}
  Location: .context1000/decisions/rfc/{title-slug}.rfc.md
  Name: {title-slug}
  Status: draft

Next steps:
1. Write a one-paragraph summary of who needs it and what changes
2. Document the context, problem, and proposed solution
3. List alternatives, impact, and implementation plan
4. Add success metrics and identify risks/open questions
5. Add relevant tags and related documents in the frontmatter
6. Update status to 'accepted' or 'rejected' when finalized
```

## RFC Structure Guidelines

### Summary Section

Brief overview answering:

- Who needs this feature/change?
- What is being proposed?
- Why is this needed now?

### Context and Problem

Document:

- Current limitations or pain points
- Business or technical drivers
- Scope of impact

### Proposed Solution

Describe:

- Core technical approach
- Key architectural components
- Integration points
- Non-goals (what's explicitly out of scope)

### Alternatives

List 2-3 alternative approaches considered and why they were not chosen.

### Impact Analysis

Consider:

- Performance implications
- Backward compatibility
- Security considerations
- Operational complexity
- Team/resource requirements

### Implementation Plan

Break into milestones with:

- Clear deliverables
- Time estimates
- Dependencies
- Rollback strategy

### Success Metrics

Define measurable outcomes:

- Performance targets
- Adoption metrics
- Quality indicators
- Timeline goals

## Best Practices

- Keep it short and practical - avoid unnecessary background
- Focus on technical design decisions
- Include diagrams where helpful (use Mermaid or ASCII)
- Link to related ADRs, specs, or issues
- Update status as RFC progresses through review
- When accepted, consider creating an ADR via `/archdocs:adr` to record the final decision
- Use sentence case for headings
- Be objective and factual
