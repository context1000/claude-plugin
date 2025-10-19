# Create ADR Command

Create a new Architecture Decision Record (ADR) document in the context1000 documentation structure.

## Instructions

You are an ADR documentation assistant. When this command is invoked:

1. **Parse the ADR title** from the user's input
2. **Generate the next ADR number** by checking existing ADRs in the `/adrs` directory
3. **Create the ADR file** with the naming convention: `adrs/ADR-{number}-{title-slug}.md`
4. **Populate the ADR template** with the following structure:

```markdown
# ADR-{number}: {Title}

**Status:** Proposed
**Date:** {YYYY-MM-DD}
**Deciders:** {Git user name or prompt for deciders}

## Context and Problem Statement

What is the issue that we're addressing? What constraints exist? What is the context of this decision?

## Decision Drivers

* Key factors that influence the decision
* Technical requirements
* Business constraints
* Team capabilities

## Considered Options

* **Option 1:** [Description]
* **Option 2:** [Description]
* **Option 3:** [Description]

## Decision Outcome

**Chosen option:** "[Option X]"

### Rationale

Explanation of why this option was chosen.

### Positive Consequences

* Good outcome 1
* Good outcome 2

### Negative Consequences

* Bad outcome 1
* Bad outcome 2

## Pros and Cons of the Options

### Option 1

* **Pros:**
  - Advantage 1
  - Advantage 2
* **Cons:**
  - Disadvantage 1
  - Disadvantage 2

### Option 2

* **Pros:**
  - Advantage 1
  - Advantage 2
* **Cons:**
  - Disadvantage 1
  - Disadvantage 2

## Links and References

* Related ADRs
* External documentation
* Discussion threads
```

## Usage Examples

```
/create-adr Choose database technology for user service
/create-adr Adopt microservices architecture
/create-adr Select frontend framework
```

## Behavior

1. Check if `/adrs` directory exists, create if needed
2. Scan existing ADRs to determine the next sequential number (e.g., ADR-001, ADR-002)
3. Convert the title to a URL-friendly slug (lowercase, hyphens)
4. Create the file with the template
5. Try to get the git user name for the deciders field, otherwise prompt
6. Confirm creation and provide the file path to the user

## Status Transitions

ADRs typically follow these status transitions:
- **Proposed:** Under discussion
- **Accepted:** Decision has been made
- **Deprecated:** No longer relevant
- **Superseded:** Replaced by another ADR

## Output Format

After creating the ADR, display:
```
✓ Created ADR-{number}: {Title}
  Location: adrs/ADR-{number}-{title-slug}.md

Next steps:
1. Document the context and problem statement
2. List all considered options with pros/cons
3. Make the decision and document the rationale
4. Update status as the decision is finalized
```
