---
description: Create a development or architectural rule document in the context1000 documentation structure
argument-hint: "<title>" [--severity info|warn|required]
---

# Create Rule Command

Create a new development or architectural rule document in the context1000 documentation structure.

## Instructions

**IMPORTANT: Always check for existing documentation before creating new files.**

When this slash command is invoked, Claude should:

1. **Search for existing rules**: Check `.context1000/rules/` for similar documentation
   - List all existing rule files using `Glob` tool
   - Search content for similar topics using `Grep` tool
   - If found, ask user: "Found similar rule(s): [list]. Update existing or create new?"
2. **Parse the rule title** from the conversation context
3. **Create the directory structure** if it doesn't exist: `.context1000/rules/`
4. **Generate slug**: Convert title to lowercase-kebab-case
5. **Create/update the rule file** at `.context1000/rules/{slug}.rules.md` with proper frontmatter and template
6. **Report success** with the file path

**IMPORTANT: Keep rules EXTREMELY brief and actionable. Maximum limits:**

- **Rule statement**: 1-2 sentences (25 words)
- **Requirements list**: 3-7 numbered items max
- **Each requirement**: 1 sentence, clear and specific
- **Total document**: aim for 100-200 words maximum
- No explanations or justifications - just requirements.
- If context needed, reference related ADR/RFC instead.

## Argument Parsing

Parse command arguments as follows:

- **Title**: `$1` or all text before first `--` flag (required)
- **--severity**: Optional severity level (info|warn|required). Default: `required`

Examples:

```bash
/archdocs:rule "All API endpoints must use authentication"
/archdocs:rule "Database queries must use prepared statements" --severity required
/archdocs:rule "Components must have unit tests" --severity warn
/archdocs:rule "Inclusive terminology in code & docs" --severity required
```

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

## Implementation Steps

Follow these steps to create or update the rule:

1. **Check for existing documentation**: Search `.context1000/` directory for similar rules
   - Use `Glob` tool with pattern `.context1000/**/*.rules.md` to find all existing rules
   - Use `Grep` tool to search for similar titles or topics in rule files
   - Use `Read` tool to examine potentially related rules
2. **Determine action**: If similar documentation exists:
   - Ask user whether to update existing rule or create new one
   - If updating: proceed to step 6 (use Edit tool)
   - If creating new: proceed to step 3
3. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/rules)`
4. **Convert title to slug**: "All APIs Must Use Authentication" → "all-apis-must-use-authentication"
5. **Create file**: Use `Write` tool with path `.context1000/rules/{slug}.rules.md`
6. **Populate/update content**: Include frontmatter (name, title, tags, related) and template sections
7. **Verify**: Use `Read` tool to confirm file was created/updated correctly
8. **Report**: Display success message with file path

## Tags

Common rule tags (use in frontmatter):

- **security** - Security-related rules and requirements
- **performance** - Performance and optimization rules
- **code-quality** - Code style, structure, and maintainability
- **architecture** - Architectural patterns and constraints
- **testing** - Testing requirements and standards
- **deployment** - Deployment and release rules
- **documentation** - Documentation requirements
- **accessibility** - Accessibility and inclusive design
- **best-practices** - General best practices

## Output Format

After creating the rule, display:

```text
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

## Rule Structure Guidelines

### Rule Statement

One clear sentence that:

- States the requirement unambiguously
- Explains the purpose briefly
- Is verifiable/measurable

### Requirements List

Numbered list of specific, actionable requirements:

- Each requirement is one sentence
- Uses clear, imperative language
- Is specific enough to verify compliance
- Avoids ambiguous terms like "usually", "generally"

### Scope Definition

Clarify application:

- **New projects**: Applies only to new code/projects
- **Existing code**: Must be retrofitted to existing code
- **Both**: Applies universally
- **Specific areas**: Frontend only, backend only, etc.

## Severity Levels

Use these severity classifications:

- **info**: Informational guidance, not enforced
- **warn**: Recommended but not required, violations should be justified
- **required**: Mandatory, violations must be fixed

## Best Practices

- Keep rules concise and actionable
- Make rules verifiable (can be checked/tested)
- Link to related ADRs that explain the "why"
- Link to guides that explain the "how"
- Add automated enforcement when possible (linters, CI checks)
- Use clear, unambiguous language
- Avoid mixing rules with explanations
- Update rules when standards change
- Mark deprecated rules clearly (don't delete them)

## Enforcement

Where possible, add information about:

- **Automated checks**: Linters (ESLint, Vale, etc.), CI/CD checks
- **Review process**: Code review checklist items
- **Tooling**: Links to tools that help verify compliance
- **Exception process**: How to request exceptions if needed

## Examples of Good Rules

### Example 1: Security Rule

```markdown
# All API endpoints must use authentication

API endpoints must verify user identity to prevent unauthorized access.

**Requirements:**

1. All API routes must use JWT or session-based authentication
2. Public endpoints must be explicitly marked with @Public decorator
3. Authentication middleware must run before business logic
4. Failed authentication must return 401 status code

**Applies to**: All backend services
```

### Example 2: Code Quality Rule

```markdown
# Components must have unit tests

All React components must include unit tests to ensure maintainability and prevent regressions.

**Requirements:**

1. Each component file must have a corresponding .test.tsx file
2. Tests must cover all props and user interactions
3. Test coverage must be at least 80% for component logic
4. Tests must run successfully in CI pipeline

**Applies to**: New components (existing components: gradually migrate)
```

### Example 3: Documentation Rule

```markdown
# Use inclusive terminology in code and documentation

Code and documentation must use inclusive language that respects all users and contributors.

**Requirements:**

1. Use "allowlist/denylist" instead of "whitelist/blacklist"
2. Use "primary/replica" instead of "master/slave"
3. Use "main" as default git branch name
4. Run Vale linter with inclusive language rules before commit

**Applies to**: All code and documentation
```

## Anti-Patterns to Avoid

Don't create rules that are:

- **Too vague**: "Code should be clean and maintainable"
- **Not verifiable**: "Use best judgment when architecting"
- **Too prescriptive**: "Always use exactly 42 lines per function"
- **Mixing concerns**: Combining security + performance + style rules
- **Lacking rationale**: No link to ADR or explanation of why

## Related Commands

- Use `/archdocs:adr` to document WHY a rule exists
- Use `/archdocs:guide` to document HOW to follow a rule
- Use `/archdocs:rfc` to propose new rules or rule changes
