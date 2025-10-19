# Create Guide Command

Create a new technical guide document in the context1000 documentation structure.

## Instructions

You are a technical documentation assistant. When this command is invoked:

1. **Parse the guide title** from the user's input
2. **Create the guide file** with the naming convention: `guides/{category}/{title-slug}.md`
3. **Prompt for category** if not specified (e.g., development, deployment, architecture, operations)
4. **Populate the guide template** with the following structure:

```markdown
# {Title}

**Category:** {Category}
**Last Updated:** {YYYY-MM-DD}
**Maintainer:** {Git user name or prompt for maintainer}

## Overview

Brief description of what this guide covers and who it's for.

## Prerequisites

* Prerequisite 1
* Prerequisite 2
* Required knowledge or tools

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)

## Section 1

Detailed explanation with examples.

### Subsection

Step-by-step instructions or conceptual explanations.

```language
// Code examples with proper syntax highlighting
```

## Section 2

Continue with logical flow of the guide.

## Best Practices

* Best practice 1
* Best practice 2
* Common pitfalls to avoid

## Troubleshooting

### Common Issue 1

**Problem:** Description of the issue

**Solution:** How to resolve it

### Common Issue 2

**Problem:** Description of the issue

**Solution:** How to resolve it

## Related Resources

* [Related Guide 1](../path/to/guide.md)
* [Related Guide 2](../path/to/guide.md)
* External documentation links

## Changelog

* **{YYYY-MM-DD}:** Initial version
```

## Usage Examples

```
/create-guide Getting started with microservices
/create-guide Database migration best practices --category=development
/create-guide Kubernetes deployment guide --category=deployment
```

## Categories

Common guide categories:
- **development** - Development practices, coding standards, workflows
- **deployment** - Deployment procedures, CI/CD, infrastructure
- **architecture** - System design, patterns, architectural decisions
- **operations** - Monitoring, incident response, maintenance
- **security** - Security practices, authentication, authorization
- **testing** - Testing strategies, frameworks, best practices

## Behavior

1. Check if `/guides` directory exists, create if needed
2. Prompt for category if not provided in the command
3. Create category subdirectory if it doesn't exist
4. Convert the title to a URL-friendly slug (lowercase, hyphens)
5. Create the file with the template
6. Try to get the git user name for the maintainer field, otherwise prompt
7. Confirm creation and provide the file path to the user

## Output Format

After creating the guide, display:
```
✓ Created Guide: {Title}
  Location: guides/{category}/{title-slug}.md
  Category: {category}

Next steps:
1. Fill in the overview and prerequisites
2. Structure the content with clear sections
3. Add code examples and diagrams as needed
4. Review and update regularly to keep it current
```
