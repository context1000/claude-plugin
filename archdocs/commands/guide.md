---
description: Create a technical guide document in the context1000 documentation structure
argument-hint: "<title>" [--audience backend|frontend|infra]
---

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

## Argument Parsing

Parse command arguments as follows:

- **Title**: `$1` or all text before first `--` flag (required)
- **--audience**: Optional target audience (backend|frontend|infra|all). Default: `all`

Examples:

```bash
/archdocs:guide "Getting started with microservices"
/archdocs:guide "Database migration best practices" --audience backend
/archdocs:guide "Kubernetes deployment guide" --audience infra
/archdocs:guide "Working with InstantDB" --audience frontend
```

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

## Implementation Steps

Follow these steps to create the guide:

1. **Ensure directory exists**: Use `Bash(mkdir -p .context1000/guides)`
2. **Convert title to slug**: "Working with InstantDB" → "working-with-instantdb"
3. **Create file**: Use `Write` tool with path `.context1000/guides/{slug}.guide.md`
4. **Populate content**: Include frontmatter (name, title, tags, related) and template sections
5. **Verify**: Use `Read` tool to confirm file was created correctly
6. **Report**: Display success message with file path

## Organization

All guides are stored in the flat structure:

- `.context1000/guides/{title-slug}.guide.md`

Use tags in the frontmatter for categorization and grouping related guides.

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

## Guide Structure Guidelines

### Overview Section

Brief introduction covering:

- What this guide accomplishes
- Who should use it
- Expected outcome/deliverable
- Estimated time (if applicable)

### Prerequisites Section

Clear, itemized list of:

- Required tools and their versions
- Access requirements (accounts, permissions)
- Knowledge prerequisites
- Links to setup guides if needed

### Steps Section

Numbered, sequential instructions:

- Each step is actionable and clear
- Include commands or code examples
- Show expected outputs
- Add validation checks ("verify this worked by...")
- Use imperative mood ("Install X", "Configure Y")

### Code Examples

For each code snippet:

- Keep examples minimal (5-15 lines)
- Add inline comments for clarity
- Show realistic, working examples
- Indicate file paths/locations
- Use proper syntax highlighting

### Validation/Testing Section

How to verify success:

- Expected outputs or results
- Test commands to run
- Success criteria
- What to check for

### Troubleshooting Section

Common issues and solutions:

- **Issue**: Brief description → **Solution**: How to fix
- Include error messages if relevant
- Link to related debugging guides

### Next Steps/Related Resources

Links to:

- Related RULEs (requirements to follow)
- Related ADRs (context on why things work this way)
- Advanced guides
- External documentation

## Tags

Common guide tags (use in frontmatter):

- **development** - Development setup and workflows
- **deployment** - Deployment and operations
- **testing** - Testing strategies and tools
- **debugging** - Troubleshooting and debugging
- **frontend** - Frontend-specific guides
- **backend** - Backend-specific guides
- **infrastructure** - Infrastructure and DevOps
- **database** - Database operations
- **api** - API integration and usage
- **security** - Security implementation
- **quickstart** - Quick start guides
- **tutorial** - Step-by-step tutorials

## Best Practices

- Focus on practical, actionable content
- Use consistent formatting throughout
- Include real, tested examples
- Keep language simple and clear
- Use sentence case for headings
- Add "last tested" or "last updated" date in frontmatter
- Link to official documentation for detailed info
- Organize with clear hierarchy (H2, H3 headings)
- Use code blocks with language specification
- Add links to related guides, ADRs, and rules

## Guide Types and Structures

### How-to Guide (Task-oriented)

Structure:

1. Goal statement (what you'll accomplish)
2. Prerequisites
3. Step-by-step instructions
4. Verification/testing
5. Troubleshooting

Example: "How to deploy a microservice to Kubernetes"

### Tutorial (Learning-oriented)

Structure:

1. Learning objectives
2. Prerequisites
3. Step-by-step lessons with explanations
4. Exercises or checkpoints
5. Summary and next steps

Example: "Introduction to event-driven architecture"

### Setup Guide (Configuration-focused)

Structure:

1. Overview of what's being set up
2. Prerequisites
3. Installation steps
4. Configuration
5. Verification
6. Common issues

Example: "Setting up local development environment"

## Anti-Patterns to Avoid

Don't create guides that:

- **Mix concerns**: Combine setup + usage + troubleshooting in confusing ways
- **Lack specifics**: "Configure the system appropriately" without details
- **Are outdated**: Include old versions, deprecated APIs
- **Skip validation**: Don't tell users how to verify success
- **Assume too much**: Skip important prerequisite knowledge
- **Are too theoretical**: Explain concepts without practical steps

## Related Commands

- Use `/archdocs:adr` to document architectural decisions that inform the guide
- Use `/archdocs:rule` to document requirements that guides should follow
- Use `/archdocs:rfc` when proposing significant changes to documented processes

## Example Guide: Database Migration

```markdown
---
name: postgres-to-mysql-migration
title: Migrate from PostgreSQL to MySQL
tags: [database, migration, backend]
related:
  adrs: [use-mysql-for-analytics]
  guides: [database-backup-restore]
---

# Migrate from PostgreSQL to MySQL

## Prerequisites

- PostgreSQL database with data to migrate
- MySQL server installed and running
- `pgloader` tool installed (`brew install pgloader`)
- Database credentials for both source and target

## Steps

1. **Create MySQL target database**

   ```bash
   mysql -u root -p -e "CREATE DATABASE target_db CHARACTER SET utf8mb4;"
   ```

2. **Export PostgreSQL schema**

   ```bash
   pg_dump -s -h localhost -U postgres source_db > schema.sql
   ```

3. **Run pgloader migration**

   ```bash
   pgloader postgresql://user:pass@localhost/source_db \
            mysql://user:pass@localhost/target_db
   ```

   Expect: Progress bar showing table migration, typically 5-10 min for moderate databases.

4. **Verify data integrity**

   ```bash
   # Check row counts match
   psql -U postgres -d source_db -c "SELECT COUNT(*) FROM users;"
   mysql -u root -p target_db -e "SELECT COUNT(*) FROM users;"
   ```

## Common Issues

- **Issue**: Foreign key constraint errors → **Solution**: Migrate in order of dependencies, disable constraints temporarily
- **Issue**: Character encoding problems → **Solution**: Ensure MySQL uses utf8mb4 charset
- **Issue**: Data type mismatches → **Solution**: Review pgloader's type mapping, adjust schema manually

## Next Steps

- [Guide: MySQL Performance Tuning](./mysql-performance-tuning.guide.md)
- [ADR: Use MySQL for Analytics](../.context1000/decisions/adr/use-mysql-for-analytics.adr.md)
- [Rule: Database Backups Required](./.context1000/rules/database-backups-required.rules.md)
