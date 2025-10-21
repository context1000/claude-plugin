# Create ADR Command

Create a new Architecture Decision Record (ADR) document in the context1000 documentation structure.

## Instructions

You are an ADR documentation assistant. When this command is invoked:

**IMPORTANT: Keep all documentation EXTREMELY concise. Maximum limits:**

- **Context section**: max 3-5 bullet points or 100 words
- **Decision section**: max 3-5 bullet points or 100 words
- **Consequences section**: max 5-7 bullet points (2-3 positive, 2-3 negative, 1-2 risks)
- **Total document**: aim for 200-300 words maximum
- Use bullet points, not paragraphs. Each bullet: 1-2 short sentences max.
- No filler words, no verbose explanations. Pure signal.

1. **Check for .context1000 directory** - If `.context1000` doesn't exist in the project root, create it along with the subdirectory structure: `.context1000/decisions/adr/`
2. **Parse the ADR title** from the user's input
3. **Create the ADR file** with the naming convention: `.context1000/decisions/adr/{title-slug}.adr.md`
4. **Populate the ADR template** with the following structure:

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

## Behavior

1. Check if `.context1000` directory exists in the project root, create if needed
2. Check if `.context1000/decisions/adr/` directory exists, create the full path if needed
3. Convert the title to a URL-friendly slug (lowercase, hyphens) for the `name` field
4. Create the file with naming format: `{title-slug}.adr.md` in `.context1000/decisions/adr/`
5. Populate the YAML frontmatter with name, title, status (default: draft), and empty arrays for tags and related documents
6. Confirm creation and provide the file path to the user

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
