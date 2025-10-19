# Create Rule Command

Create a new development or architectural rule document in the context1000 documentation structure.

## Instructions

You are a rules documentation assistant. When this command is invoked:

1. **Check for .context1000 directory** - If `.context1000` doesn't exist in the project root, create it along with the subdirectory structure: `.context1000/rules/`
2. **Parse the rule title** from the user's input
3. **Create the rule file** with the naming convention: `.context1000/rules/{title-slug}.rules.md`
4. **Populate the rule template** with the following structure:

```markdown
---
name: {title-slug} # Unique identifier for the rule
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

[Write the rule content here. Keep it concise and actionable.]

For all new projects and when updating existing ones:

1. [First requirement or guideline]
2. [Second requirement or guideline]
3. [Third requirement or guideline]
```

## Usage Examples

```
/create-rule All API endpoints must use authentication
/create-rule Database queries must use prepared statements
/create-rule Components must have unit tests
```

## Tags

Common rule tags (use in frontmatter):
- **security** - Security-related rules and requirements
- **performance** - Performance and optimization rules
- **code-quality** - Code style, structure, and maintainability
- **architecture** - Architectural patterns and constraints
- **testing** - Testing requirements and standards
- **deployment** - Deployment and release rules
- **documentation** - Documentation requirements

## Behavior

1. Check if `.context1000` directory exists in the project root, create if needed
2. Check if `.context1000/rules/` directory exists, create the full path if needed
3. Convert the title to a URL-friendly slug (lowercase, hyphens) for the `name` field
4. Create the file with naming format: `{title-slug}.rules.md` in `.context1000/rules/`
5. Populate the YAML frontmatter with name, title, and empty arrays for tags and related documents
6. Confirm creation and provide the file path to the user

## Output Format

After creating the rule, display:
```
✓ Created Rule: {Title}
  Location: .context1000/rules/{title-slug}.rules.md
  Name: {title-slug}

Next steps:
1. Write concise, actionable rule content
2. List specific requirements or guidelines (numbered list)
3. Add relevant tags for categorization (security, testing, etc.)
4. Link related documents in the frontmatter
5. Communicate the rule to the team
```
