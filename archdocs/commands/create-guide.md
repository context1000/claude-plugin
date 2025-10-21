# Create Guide Command

Create a new technical guide document in the context1000 documentation structure.

## Instructions

When this slash command is invoked, Claude should:

1. **Parse the guide title** from the conversation context (user's most recent message or command invocation)
2. **Create the directory structure** if it doesn't exist: `.context1000/guides/`
3. **Generate slug**: Convert title to lowercase-kebab-case (e.g., "Working with InstantDB" → "working-with-instantdb")
4. **Create the guide file** at `.context1000/guides/{slug}.guide.md` with proper frontmatter and template
5. **Report success** with the file path

**IMPORTANT: Keep guides EXTREMELY concise and practical. Maximum limits:**

- **Each section**: max 5-7 bullet points or 100-150 words
- **Total guide**: aim for 300-500 words maximum (2-4 sections)
- **Code examples**: small snippets only (5-15 lines), heavily commented
- Use bullet points and numbered lists. Avoid long paragraphs.
- Each point: 1-2 sentences max. Focus on actionable steps.
- No background/theory unless absolutely essential.

## File Template

Create the guide file at `.context1000/guides/{slug}.guide.md` with this structure:

```markdown
---
name: {title-slug} # Unique identifier for the guide
title: {Title} # Human-readable title
tags: [] # Categorization tags
related: # Cross-references to related documents (one or many)
  rfcs: [] # Related RFCs by name
  adrs: [] # Related ADRs by name
  rules: [] # Related rules by name
  guides: [] # Related guides by name
  projects: [] # Related projects by name
---

# {Title}

## Prerequisites

- [Requirement 1]
- [Requirement 2]

## Steps

1. [Action 1 - brief explanation]
2. [Action 2 - brief explanation]
3. [Action 3 - brief explanation]

## Common Issues

- **Issue**: [Problem] → **Solution**: [Fix]
- **Issue**: [Problem] → **Solution**: [Fix]
```

## Usage Examples

```
/create-guide Getting started with microservices
/create-guide Database migration best practices
/create-guide Kubernetes deployment guide --subdirectory=deployment
```

## Organization

Guides can be organized:

- **Flat structure:** Store directly in `.context1000/guides/{title-slug}.guide.md`
- **Subdirectories:** Group related guides in subdirectories like `.context1000/guides/deployment/{title-slug}.guide.md`

Use tags in the frontmatter for categorization rather than relying only on directory structure.

## Implementation Steps

Follow these steps to create the guide:

1. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/guides)`
2. **Convert title to slug**: "Working with InstantDB" → "working-with-instantdb"
3. **Create file**: Use `Write` tool with path `.context1000/guides/{slug}.guide.md`
4. **Populate content**: Include frontmatter (name, title, tags, related) and template sections
5. **Verify**: Use `Read` tool to confirm file was created correctly
6. **Report**: Display success message with file path

**Note**: If subdirectory is mentioned (e.g., "deployment/..."), create nested path `.context1000/guides/{subdir}/{slug}.guide.md`

## Output Format

After creating the guide, display:

```
✓ Created Guide: {Title}
  Location: .context1000/guides/{title-slug}.guide.md
  Name: {title-slug}

Next steps:
1. Write clear, organized content in sections
2. Add code examples and explanations as needed
3. Add relevant tags for categorization (development, deployment, etc.)
4. Link related documents in the frontmatter
5. Review and update regularly to keep it current
```
