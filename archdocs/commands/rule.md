---
description: Create a development or architectural rule document in the context1000 documentation structure
argument-hint: "<title>" [--severity info|warn|required] [--project <projectName>]
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
- **--project**: Optional project name. If specified, creates rule in `.context1000/projects/{projectName}/rules/`. If not specified, creates in `.context1000/rules/`

Examples:

```bash
# Root-level rules (organization-wide)
/archdocs:rule "All API endpoints must use authentication"
/archdocs:rule "Database queries must use prepared statements" --severity required
/archdocs:rule "Components must have unit tests" --severity warn
/archdocs:rule "Inclusive terminology in code & docs" --severity required

# Project-scoped rules
/archdocs:rule "Use TypeScript for all new files" --project frontend-app
/archdocs:rule "All mutations require transactions" --project user-service --severity required
```

## File Template

**File path depends on --project flag:**
- **Without --project**: `.context1000/rules/{slug}.rules.md` (root-level, organization-wide)
- **With --project**: `.context1000/projects/{projectName}/rules/{slug}.rules.md` (project-scoped)

Create the rule file with this structure:

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

1. **Parse --project flag**: Check if `--project <projectName>` was provided
   - If provided: set base path to `.context1000/projects/{projectName}/rules/`
   - If not provided: set base path to `.context1000/rules/`
2. **Validate project exists** (if --project specified):
   - Check if `.context1000/projects/{projectName}/project.md` exists
   - If not, inform user and suggest running `/archdocs:project "{projectName}"` first
3. **Check for existing documentation**: Search for similar rules in the target location
   - Use `Glob` tool with pattern `{basePath}/*.rules.md` to find all existing rules
   - Use `Grep` tool to search for similar titles or topics in rule files
   - Use `Read` tool to examine potentially related rules
4. **Determine action**: If similar documentation exists:
   - Ask user whether to update existing rule or create new one
   - If updating: proceed to step 8 (use Edit tool)
   - If creating new: proceed to step 5
5. **Ensure directory exists**: Use `Bash(mkdir -p {basePath})`
6. **Convert title to slug**: "All APIs Must Use Authentication" → "all-apis-must-use-authentication"
7. **Create file**: Use `Write` tool with path `{basePath}/{slug}.rules.md`
8. **Populate/update content**: Include frontmatter (name, title, tags, related) and template sections
   - **IMPORTANT**: If `--project` flag was specified, automatically add the project name to the `related.projects` field in frontmatter
   - Example: `related: { projects: [frontend-app] }` if `--project frontend-app` was used
9. **Verify**: Use `Read` tool to confirm file was created/updated correctly
10. **Report**: Display success message with file path and scope (root-level or project-scoped)

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
