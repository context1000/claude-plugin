# Create Guide Command

Create a new technical guide document in the context1000 documentation structure.

## Instructions

You are a technical documentation assistant. When this command is invoked:

1. **Check for .context1000 directory** - If `.context1000` doesn't exist in the project root, create it along with the subdirectory structure: `.context1000/guides/`
2. **Parse the guide title** from the user's input
3. **Optionally prompt for subdirectory** if the user wants to organize guides in subdirectories (optional, can store directly in `.context1000/guides/`)
4. **Create the guide file** with the naming convention: `.context1000/guides/{title-slug}.guide.md` or `.context1000/guides/{subdirectory}/{title-slug}.guide.md`
5. **Populate the guide template** with the following structure:

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

## Part 1

[Write the first section of the guide here]

## Part 2

[Continue with additional sections as needed]
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

## Behavior

1. Check if `.context1000` directory exists in the project root, create if needed
2. Check if `.context1000/guides/` directory exists, create the full path if needed
3. Check if subdirectory was specified (optional)
4. Create subdirectory under `.context1000/guides/` if specified and doesn't exist
5. Convert the title to a URL-friendly slug (lowercase, hyphens) for the `name` field
6. Create the file with naming format: `{title-slug}.guide.md` in `.context1000/guides/` or `.context1000/guides/{subdirectory}/`
7. Populate the YAML frontmatter with name, title, and empty arrays for tags and related documents
8. Confirm creation and provide the file path to the user

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
