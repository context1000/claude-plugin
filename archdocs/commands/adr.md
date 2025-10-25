---
description: Create an Architecture Decision Record (ADR) document in the context1000 documentation structure
argument-hint: "<title>" [--status draft|accepted|rejected] [--project <projectName>]
---

# Create ADR Command

Create a new Architecture Decision Record (ADR) document in the context1000 documentation structure.

## Instructions

**IMPORTANT: Always check for existing documentation before creating new files.**

When this slash command is invoked, Claude should:

1. **Search for existing ADRs**: Check `.context1000/decisions/adr/` for similar documentation
   - List all existing ADR files using `Glob` tool
   - Search content for similar topics using `Grep` tool
   - If found, ask user: "Found similar ADR(s): [list]. Update existing or create new?"
2. **Parse the ADR title** from the conversation context
3. **Create the directory structure** if it doesn't exist: `.context1000/decisions/adr/`
4. **Generate slug**: Convert title to lowercase-kebab-case
5. **Create/update the ADR file** at `.context1000/decisions/adr/{slug}.adr.md` with proper frontmatter and template
6. **Report success** with the file path

**IMPORTANT: Keep all documentation EXTREMELY concise. Maximum limits:**

- **Context section**: max 3-5 bullet points or 100 words
- **Decision section**: max 3-5 bullet points or 100 words
- **Consequences section**: max 5-7 bullet points (2-3 positive, 2-3 negative, 1-2 risks)
- **Total document**: aim for 200-300 words maximum
- Use bullet points, not paragraphs. Each bullet: 1-2 short sentences max.
- No filler words, no verbose explanations. Pure signal.

## Argument Parsing

Parse command arguments as follows:

- **Title**: `$1` or all text before first `--` flag (required)
- **--status**: Optional status value (draft|accepted|rejected). Default: `draft`
- **--scope**: Optional scope/area tag (e.g., platform, backend, frontend)
- **--id**: Optional ID assignment (auto|NNNN). Default: `auto`
- **--project**: Optional project name. If specified, creates ADR in `.context1000/projects/{projectName}/decisions/adr/`. If not specified, creates in `.context1000/decisions/adr/`

Examples:

```bash
# Root-level ADR (organization-wide)
/archdocs:adr "Choose database technology for user service"
/archdocs:adr "Adopt gRPC for inter-service calls" --status proposed
/archdocs:adr "Select frontend framework" --status draft --scope frontend

# Project-scoped ADR
/archdocs:adr "Choose authentication method" --project user-service
/archdocs:adr "API versioning strategy" --project mobile-app --status draft
```

## File Template

**File path depends on --project flag:**

- **Without --project**: `.context1000/decisions/adr/{slug}.adr.md` (root-level, organization-wide)
- **With --project**: `.context1000/projects/{projectName}/decisions/adr/{slug}.adr.md` (project-scoped)

Create the ADR file with this structure:

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

## Implementation Steps

Follow these steps to create or update the ADR:

1. **Parse --project flag**: Check if `--project <projectName>` was provided
   - If provided: set base path to `.context1000/projects/{projectName}/decisions/adr/`
   - If not provided: set base path to `.context1000/decisions/adr/`
2. **Validate project exists** (if --project specified):
   - Check if `.context1000/projects/{projectName}/project.md` exists
   - If not, inform user and suggest running `/archdocs:project "{projectName}"` first
3. **Check for existing documentation**: Search for similar ADRs in the target location
   - Use `Glob` tool with pattern `{basePath}/*.adr.md` to find all existing ADRs
   - Use `Grep` tool to search for similar titles or topics in ADR files
   - Use `Read` tool to examine potentially related ADRs
4. **Determine action**: If similar documentation exists:
   - Ask user whether to update existing ADR or create new one
   - If updating: proceed to step 8 (use Edit tool)
   - If creating new: proceed to step 5
5. **Ensure directory exists**: Use `Bash(mkdir -p {basePath})`
6. **Convert title to slug**: "Choose Database Technology" → "choose-database-technology"
7. **Create file**: Use `Write` tool with path `{basePath}/{slug}.adr.md`
8. **Populate/update content**: Include frontmatter (name, title, status: draft, tags, related) and template sections
9. **Verify**: Use `Read` tool to confirm file was created/updated correctly
10. **Report**: Display success message with file path and scope (root-level or project-scoped)

## Status Values

ADRs use these status values:

- **draft:** Under discussion or being written
- **accepted:** Decision has been made and approved
- **rejected:** Decision was considered but not accepted

## Output Format

After creating the ADR, display:

```text
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

## ADR Structure

The ADR follows a minimal MADR (Markdown Architectural Decision Records) format:

**Core sections (required):**

- **Context**: Current situation/problem - max 3-5 bullet points
- **Decision**: What we decided - max 3-5 bullet points
- **Consequences**: Positive, negative, and risks - max 5-7 bullet points

**Optional sections** (add if helpful):

- **Decision Drivers**: Forces influencing the decision
- **Considered Options**: Alternatives evaluated

## Best Practices

- Focus on the "why" behind decisions
- Document alternatives considered
- Include trade-offs and consequences
- Link to related technical specs, RFCs, or GitHub issues
- Be objective and factual
- Update status as decision evolves
- Use sentence case for headings (not Title Case)
- Keep it concise - aim for 200-300 words maximum
