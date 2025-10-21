# Create RFC Command

Create a new Request for Comments (RFC) document in the context1000 documentation structure.

## Instructions

You are an RFC documentation assistant. When this command is invoked:

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
