# Create Rule Command

Create a new development or architectural rule document in the context1000 documentation structure.

## Instructions

You are a rules documentation assistant. When this command is invoked:

1. **Parse the rule title** from the user's input
2. **Generate the next rule number** by checking existing rules in the `/rules` directory
3. **Create the rule file** with the naming convention: `rules/RULE-{number}-{title-slug}.md`
4. **Populate the rule template** with the following structure:

```markdown
# RULE-{number}: {Title}

**Status:** Active
**Category:** {Category}
**Severity:** {Critical|High|Medium|Low}
**Created:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}

## Rule Statement

Clear, concise statement of the rule in one or two sentences.

## Rationale

Why does this rule exist? What problems does it prevent? What benefits does it provide?

## Scope

Where does this rule apply?
* Languages: (e.g., TypeScript, Python, Go)
* Components: (e.g., Frontend, Backend, Infrastructure)
* Environments: (e.g., Production, Staging, Development)

## The Rule

### MUST
* Mandatory requirement 1
* Mandatory requirement 2

### MUST NOT
* Prohibited action 1
* Prohibited action 2

### SHOULD
* Recommended practice 1
* Recommended practice 2

### SHOULD NOT
* Discouraged practice 1
* Discouraged practice 2

## Examples

### Good Example ✓

```language
// Example of code that follows the rule
```

**Why this is good:** Explanation of what makes this compliant.

### Bad Example ✗

```language
// Example of code that violates the rule
```

**Why this is bad:** Explanation of what makes this non-compliant.

## Exceptions

Circumstances under which this rule may be waived:
* Exception case 1
* Exception case 2

To request an exception, document the rationale and get approval from [team/person].

## Enforcement

How is this rule enforced?
* Automated: (e.g., linter, CI check, pre-commit hook)
* Manual: (e.g., code review, architecture review)
* Tool: (e.g., ESLint, SonarQube, custom script)

## Related Rules

* [RULE-XXX: Related Rule Title](./RULE-XXX-related-rule.md)

## References

* Link to related ADRs, RFCs, or external documentation
* Standards or specifications this rule is based on

## Changelog

* **{YYYY-MM-DD}:** Initial version
```

## Usage Examples

```
/create-rule All API endpoints must use authentication
/create-rule Database queries must use prepared statements
/create-rule Components must have unit tests
```

## Categories

Common rule categories:
- **security** - Security-related rules and requirements
- **performance** - Performance and optimization rules
- **code-quality** - Code style, structure, and maintainability
- **architecture** - Architectural patterns and constraints
- **testing** - Testing requirements and standards
- **deployment** - Deployment and release rules
- **documentation** - Documentation requirements

## Severity Levels

- **Critical:** Must be followed without exception, violations block deployment
- **High:** Strongly enforced, exceptions require explicit approval
- **Medium:** Recommended practice, violations flagged in review
- **Low:** Guidelines and suggestions, team discretion

## Behavior

1. Check if `/rules` directory exists, create if needed
2. Scan existing rules to determine the next sequential number (e.g., RULE-001, RULE-002)
3. Prompt for category and severity if not provided
4. Convert the title to a URL-friendly slug (lowercase, hyphens)
5. Create the file with the template
6. Confirm creation and provide the file path to the user

## Output Format

After creating the rule, display:
```
✓ Created RULE-{number}: {Title}
  Location: rules/RULE-{number}-{title-slug}.md
  Category: {category}
  Severity: {severity}

Next steps:
1. Write a clear, enforceable rule statement
2. Provide rationale and examples
3. Set up automated enforcement if possible
4. Communicate the rule to the team
```
