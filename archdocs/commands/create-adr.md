# Create ADR Command

Create a new Architecture Decision Record (ADR) document in the context1000 documentation structure.

## Instructions

When this slash command is invoked, Claude should:

1. **Parse the ADR title** from the conversation context
2. **Create the directory structure** if it doesn't exist: `.context1000/decisions/adr/`
3. **Generate slug**: Convert title to lowercase-kebab-case
4. **Create the ADR file** at `.context1000/decisions/adr/{slug}.adr.md` with proper frontmatter and template
5. **Report success** with the file path

**IMPORTANT: Keep all documentation EXTREMELY concise. Maximum limits:**

- **Context section**: max 3-5 bullet points or 100 words
- **Decision section**: max 3-5 bullet points or 100 words
- **Consequences section**: max 5-7 bullet points (2-3 positive, 2-3 negative, 1-2 risks)
- **Total document**: aim for 200-300 words maximum
- Use bullet points, not paragraphs. Each bullet: 1-2 short sentences max.
- No filler words, no verbose explanations. Pure signal.

## File Template

Create the ADR file at `.context1000/decisions/adr/{slug}.adr.md` with this structure:

```markdown
---
name: {title-slug} # Unique identifier for the ADR
title: {Title} # Human-readable title
status: draft # accepted, rejected, draft
tags: [] # Categorization tags
related: # Cross-references to related documents (one or many)
  rfcs: [] # Related RFCs by name
  adrs: [] # Related ADRs by name
  rules: [] # Related rules by name
  guides: [] # Related guides by name
  projects: [] # Related projects by name
---

# {Title}

## Context

- [Bullet 1: Current situation/problem]
- [Bullet 2: Why this matters]
- [Bullet 3: Key constraint or requirement]

## Decision

- [Bullet 1: What we decided]
- [Bullet 2: Key technical approach]
- [Bullet 3: Implementation note]

## Consequences

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

**Risks:**
- [Risk 1]
```

## Usage Examples

```
/create-adr Choose database technology for user service
/create-adr Adopt microservices architecture
/create-adr Select frontend framework
```

## Implementation Steps

Follow these steps to create the ADR:

1. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/decisions/adr)`
2. **Convert title to slug**: "Choose Database Technology" → "choose-database-technology"
3. **Create file**: Use `Write` tool with path `.context1000/decisions/adr/{slug}.adr.md`
4. **Populate content**: Include frontmatter (name, title, status: draft, tags, related) and template sections
5. **Verify**: Use `Read` tool to confirm file was created correctly
6. **Report**: Display success message with file path

## Status Values

ADRs use these status values:

- **draft:** Under discussion or being written
- **accepted:** Decision has been made and approved
- **rejected:** Decision was considered but not accepted

## Output Format

After creating the ADR, display:

```
✓ Created ADR: {Title}
  Location: .context1000/decisions/adr/{title-slug}.adr.md
  Name: {title-slug}
  Status: draft

Next steps:
1. Document the context that motivates this decision
2. Describe the decision being made
3. Explain the consequences of this change
4. Add relevant tags and related documents in the frontmatter
5. Update status to 'accepted' or 'rejected' when finalized
```
