# Create RFC Command

Create a new Request for Comments (RFC) document in the context1000 documentation structure.

## Instructions

You are an RFC documentation assistant. When this command is invoked:

1. **Parse the RFC title** from the user's input
2. **Generate the next RFC number** by checking existing RFCs in the `/rfcs` directory
3. **Create the RFC file** with the naming convention: `rfcs/RFC-{number}-{title-slug}.md`
4. **Populate the RFC template** with the following structure:

```markdown
# RFC-{number}: {Title}

**Status:** Draft
**Created:** {YYYY-MM-DD}
**Author:** {Git user name or prompt for author}

## Summary

Brief one-paragraph summary of the proposal.

## Motivation

Why are we doing this? What use cases does it support? What problems does it solve?

## Detailed Design

This is the bulk of the RFC. Explain the design in enough detail for somebody familiar with the system to understand, and for somebody familiar with the implementation to implement.

This should get into specifics and corner-cases, and include examples of how the feature is used.

## Alternatives

What other designs have been considered? What is the impact of not doing this?

## Adoption Strategy

How will existing users adopt this feature? Is this a breaking change?

## Unresolved Questions

What parts of the design are still to be determined?

## References

- Related documents or resources
```

## Usage Examples

```
/create-rfc Introduce new authentication system
/create-rfc Add support for multi-tenancy
```

## Behavior

1. Check if `/rfcs` directory exists, create if needed
2. Scan existing RFCs to determine the next sequential number (e.g., RFC-001, RFC-002)
3. Convert the title to a URL-friendly slug (lowercase, hyphens)
4. Create the file with the template
5. Try to get the git user name for the author field, otherwise prompt
6. Confirm creation and provide the file path to the user

## Output Format

After creating the RFC, display:
```
✓ Created RFC-{number}: {Title}
  Location: rfcs/RFC-{number}-{title-slug}.md

Next steps:
1. Fill in the RFC sections with detailed information
2. Share with the team for discussion
3. Update status as the RFC progresses (Draft → Proposed → Accepted → Implemented)
```
