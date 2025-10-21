# Create Rule Command

Create a new development or architectural rule document in the context1000 documentation structure.

## Instructions

When this slash command is invoked, Claude should:

1. **Parse the rule title** from the conversation context
2. **Create the directory structure** if it doesn't exist: `.context1000/rules/`
3. **Generate slug**: Convert title to lowercase-kebab-case
4. **Create the rule file** at `.context1000/rules/{slug}.rules.md` with proper frontmatter and template
5. **Report success** with the file path

**IMPORTANT: Keep rules EXTREMELY brief and actionable. Maximum limits:**

- **Rule statement**: 1-2 sentences (25 words)
- **Requirements list**: 3-7 numbered items max
- **Each requirement**: 1 sentence, clear and specific
- **Total document**: aim for 100-200 words maximum
- No explanations or justifications - just requirements.
- If context needed, reference related ADR/RFC instead.

## File Template

Create the rule file at `.context1000/rules/{slug}.rules.md` with this structure:

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

[One sentence stating the rule and its purpose.]

**Requirements:**

1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

**Applies to**: [Scope: new projects / existing code / both]
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

## Implementation Steps

Follow these steps to create the rule:

1. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/rules)`
2. **Convert title to slug**: "All APIs Must Use Authentication" → "all-apis-must-use-authentication"
3. **Create file**: Use `Write` tool with path `.context1000/rules/{slug}.rules.md`
4. **Populate content**: Include frontmatter (name, title, tags, related) and template sections
5. **Verify**: Use `Read` tool to confirm file was created correctly
6. **Report**: Display success message with file path

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
