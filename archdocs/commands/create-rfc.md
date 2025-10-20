# Create RFC Command

Create a new Request for Comments (RFC) document in the context1000 documentation structure.

## Instructions

You are an RFC documentation assistant. When this command is invoked:

**IMPORTANT: Keep all documentation concise and to the point. Avoid verbosity. Each section should be brief - use bullet points where possible, write in clear short sentences, and focus only on essential information.**

1. **Check for .context1000 directory** - If `.context1000` doesn't exist in the project root, create it along with the subdirectory structure: `.context1000/decisions/rfc/`
2. **Parse the RFC title** from the user's input
3. **Create the RFC file** with the naming convention: `.context1000/decisions/rfc/{title-slug}.rfc.md`
4. **Populate the RFC template** with the following structure:

```markdown
---
name: {title-slug} # Unique identifier for the RFC
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

## Summary

Who needs it and what changes in one paragraph.

## Context and problem

Current behavior/limitations, scope of impact.

## Proposed solution

- Architectural idea (1-3 bullet points).
- API/contracts (brief, code block if necessary).
- Data/schema/migrations (one-two sentences).

## Alternatives

Why not X and Y (one sentence per alternative).

## Impact

- Performance/cost
- Compatibility/migrations
- Security/privacy

## Implementation plan

Milestones with estimates: M1, M2, M3. Rollback plan in one sentence.

## Success metrics

How we will understand what worked (numbers/threshold/date).

## Risks and open questions

A short list
```

## Usage Examples

```
/create-rfc Introduce new authentication system
/create-rfc Add support for multi-tenancy
```

## Behavior

1. Check if `.context1000` directory exists in the project root, create if needed
2. Check if `.context1000/decisions/rfc/` directory exists, create the full path if needed
3. Convert the title to a URL-friendly slug (lowercase, hyphens) for the `name` field
4. Create the file with naming format: `{title-slug}.rfc.md` in `.context1000/decisions/rfc/`
5. Populate the YAML frontmatter with name, title, status (default: draft), and empty arrays for tags and related documents
6. Confirm creation and provide the file path to the user

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
