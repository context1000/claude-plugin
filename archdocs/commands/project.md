---
description: Create a new project in the context1000 documentation structure
argument-hint: "<projectName>"
---

# Create Project Command

Create a new project with the standard context1000 documentation structure.

## Instructions

**IMPORTANT: Always check for existing projects before creating new ones.**

When this slash command is invoked, Claude should:

1. **Search for existing projects**: Check `.context1000/projects/` for existing projects
   - List all existing project directories using `Glob` tool
   - If project with same name exists, inform user and ask if they want to proceed
2. **Parse the project name** from the command arguments
3. **Create the project structure** with the following directories:
   - `.context1000/projects/{projectName}/`
   - `.context1000/projects/{projectName}/decisions/adr/`
   - `.context1000/projects/{projectName}/decisions/rfc/`
   - `.context1000/projects/{projectName}/guides/`
   - `.context1000/projects/{projectName}/rules/`
4. **Create project.md file** with proper frontmatter and template
5. **Report success** with the created structure

**IMPORTANT: Projects are single-level only. Do NOT create subdirectories inside projects.**

## Argument Parsing

Parse command arguments as follows:

- **Project Name**: `$1` (required) - The name of the project to create

Examples:

```bash
/archdocs:project "my-service"
/archdocs:project "frontend-app"
/archdocs:project "data-pipeline"
```

## Project Structure

The command creates the following structure:

```
.context1000/projects/{projectName}/
├── decisions/
│   ├── adr/          # Architecture Decision Records for this project
│   └── rfc/          # RFCs specific to this project
├── guides/           # How-to guides for this project
├── rules/            # Rules and standards for this project
└── project.md        # Project overview and metadata
```

## project.md Template

Create the project.md file at `.context1000/projects/{projectName}/project.md` with this structure:

```markdown
---
name: {projectName} # Unique identifier for the project
title: {ProjectName} # Human-readable title
tags: [] # Categorization tags
repository: "" # Project repository URL
related: # Cross-references to related documents (one or many)
  rfcs: [] # Related RFCs by name
  adrs: [] # Related ADRs by name
  rules: [] # Related rules by name
  guides: [] # Related guides by name
  projects: [] # Related projects by name
---

# {ProjectName}

[Brief description of the project - 2-3 sentences maximum]
```

## Implementation Steps

Follow these steps to create the project:

1. **Check for existing projects**: Search `.context1000/projects/` for existing projects
   - Use `Glob` tool with pattern `.context1000/projects/*/project.md`
   - Extract project names from paths
   - Check if the requested project name already exists
2. **Validate project name**: Ensure it follows naming conventions (lowercase-kebab-case recommended)
3. **Create directory structure**: Use `Bash(mkdir -p)` to create all directories:

   ```bash
   mkdir -p .context1000/projects/{projectName}/decisions/adr
   mkdir -p .context1000/projects/{projectName}/decisions/rfc
   mkdir -p .context1000/projects/{projectName}/guides
   mkdir -p .context1000/projects/{projectName}/rules
   ```

4. **Create project.md**: Use `Write` tool with the template above
5. **Verify**: Use `Bash(tree)` to display the created structure
6. **Report**: Display success message with project path and structure

## Output Format

After creating the project, display:

```text
✓ Created project: {ProjectName}
  Location: .context1000/projects/{projectName}/

Project structure:
.context1000/projects/{projectName}/
├── decisions/
│   ├── adr/
│   └── rfc/
├── guides/
├── rules/
└── project.md

Next steps:
1. Edit project.md to add project overview and metadata
2. Use /archdocs:adr to create architecture decisions for this project
3. Use /archdocs:rfc to create proposals for this project
4. Use /archdocs:guide to create how-to documentation
5. Use /archdocs:rule to create project-specific rules
```

## Best Practices

- Use lowercase-kebab-case for project names (e.g., "user-service", "payment-api")
- Keep project names concise and descriptive
- Document project metadata in project.md frontmatter
- Link related documentation using the `related` section in frontmatter
- Use project-scoped documentation for decisions specific to this project
- Reference global ADRs/RFCs from `.context1000/decisions/` when they apply organization-wide

## Project Naming Conventions

Good project names:

- `user-authentication-service`
- `frontend-web-app`
- `data-processing-pipeline`
- `mobile-ios-app`

Avoid:

- Spaces: "my project" ❌
- Special characters: "project_#1" ❌
- CamelCase: "MyProject" ❌ (use kebab-case instead)
