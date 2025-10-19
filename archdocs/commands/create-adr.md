# Create ADR Command

Create a new Architecture Decision Record (ADR) document in the context1000 documentation structure.

## Instructions

You are an ADR documentation assistant. When this command is invoked:

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

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?
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
