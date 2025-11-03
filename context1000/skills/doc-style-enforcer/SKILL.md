---
name: context1000-style-enforcer
description: Ensures architectural artifacts are created ONLY through /context1000/* commands and conform to templates (MADR/Nygard). Activate when detecting direct edits to docs/adr|rfc|rule|guide directories.
allowed-tools: Read, Grep, Glob, Bash
---

# context1000 Style Enforcer

## Instructions

### 1. Monitor Artifact Directories

Watch for changes in architectural documentation directories:

```bash
# Get recently modified files in artifact directories
git diff --name-only HEAD | grep -E "(docs|\.context1000)/(adr|rfc|rule|guide)/"

# Check for uncommitted changes
git status --porcelain | grep -E "^\s*[AM]\s.*(adr|rfc|rule|guide)/"
```

### 2. Validate Creation Method

For each changed artifact file, verify it was created through proper channels:

#### Check for Command Signatures

Valid artifacts should have:

- **Frontmatter with metadata**: status, date, scope, template
- **Standard structure**: Based on MADR, Nygard, or custom templates
- **Proper naming**: Date-prefixed or sequential numbering

```bash
# Check for frontmatter in ADRs
head -20 <adr-file> | grep -E "^(status:|date:|scope:|template:)"

# Check for required sections
grep -E "^##\s+(Context|Decision|Consequences|Status)" <adr-file>
```

### 3. Detect Manual Edits

Identify files created or modified without using slash commands:

**Red Flags**:

- Missing or incomplete frontmatter
- Non-standard file naming (not following `YYYYMMDD-title.md` or `####-title.md`)
- Missing required sections
- Inconsistent formatting
- No command generation metadata

### 4. Validate Template Compliance

#### ADR (Architectural Decision Record)

**Required Sections** (MADR/Nygard):

- Title with format: "# ADR-#### or # Title"
- Status: `proposed | accepted | deprecated | superseded`
- Context and Problem Statement
- Decision Drivers (MADR) or Forces (Nygard)
- Considered Options
- Decision Outcome
- Consequences (Positive and Negative)
- Links (optional but recommended)

**Validation**:

```bash
# Check ADR structure
sections_found=0
for section in "Context" "Decision" "Consequences" "Status"; do
  grep -q "^##.*$section" "$adr_file" && ((sections_found++))
done
[ $sections_found -ge 3 ] || echo "Missing required sections"
```

#### RFC (Request for Comments)

**Required Sections**:

- Title and RFC number
- Status: `draft | review | accepted | rejected`
- Authors
- Motivation
- Proposed Design
- Alternatives Considered
- Impact Analysis
- References

**Validation**:

```bash
# Check RFC structure
grep -q "^##.*Motivation" "$rfc_file" || echo "Missing Motivation section"
grep -q "^##.*Design" "$rfc_file" || echo "Missing Design section"
grep -q "^##.*Alternatives" "$rfc_file" || echo "Missing Alternatives section"
```

#### RULE (Architecture Rule)

**Required Elements**:

- Rule ID and title
- Severity: `required | warn | info`
- Scope: Areas affected
- Rationale: Why this rule exists
- Enforcement: How it's checked
- Exceptions: When rule doesn't apply (optional)

**Validation**:

```bash
# Check RULE structure
grep -q "^severity:" "$rule_file" || echo "Missing severity level"
grep -q "^##.*Rationale" "$rule_file" || echo "Missing Rationale section"
```

#### GUIDE (Architecture Guide)

**Required Elements**:

- Title and purpose
- Audience: Target team/role
- Prerequisites (if any)
- Step-by-step instructions
- Examples
- Related documentation links

**Validation**:

```bash
# Check GUIDE structure
grep -q "^audience:" "$guide_file" || echo "Missing audience specification"
grep -q "^##.*Step" "$guide_file" || echo "Missing procedural steps"
```

### 5. Provide Correction Guidance

When non-compliant artifacts are detected:

1. **Alert politely** about the deviation:

   ```
   ⚠️ Detected direct edit to architectural artifact:
   File: docs/adr/0042-new-decision.md
   Issue: Missing required sections and frontmatter
   ```

2. **Suggest proper command**:

   ```
   Please create ADRs using:
   /context1000/adr "<Title>" --status proposed --template madr --scope <area>
   ```

3. **List specific issues**:

   - Missing sections: Context, Consequences
   - Invalid frontmatter: status field not in allowed values
   - Improper naming: Should be YYYYMMDD-kebab-case.md

4. **Offer regeneration**:

   ```
   I can help regenerate this ADR properly. Would you like me to:
   1. Extract your content
   2. Recreate via /context1000/adr with proper structure
   3. Preserve your original content in appropriate sections
   ```

### 6. Enforce Naming Conventions

#### ADR Naming

- **Date-based**: `YYYYMMDD-descriptive-title.md`
- **Sequential**: `####-descriptive-title.md` (four digits)
- **Lowercase with hyphens**: No spaces, underscores, or special chars

```bash
# Validate ADR filename
if [[ ! "$filename" =~ ^[0-9]{8}-[a-z0-9-]+\.md$ ]] && \
   [[ ! "$filename" =~ ^[0-9]{4}-[a-z0-9-]+\.md$ ]]; then
  echo "Invalid ADR filename: $filename"
  echo "Expected: YYYYMMDD-title.md or ####-title.md"
fi
```

#### RFC Naming

- **Sequential with leading zeros**: `####-title.md`
- Example: `0023-adopt-kafka.md`

#### RULE Naming

- **Category-based**: `<category>-<rule-name>.md`
- Example: `api-design-rest-conventions.md`

#### GUIDE Naming

- **Descriptive**: `how-to-<action>.md` or `<topic>-guide.md`
- Example: `how-to-create-microservice.md` or `database-migration-guide.md`

## Enforcement Levels

### Level 1: Warning (Default)

- Detect non-compliance
- Provide friendly guidance
- Suggest corrections
- Do not block operations

### Level 2: Strict (via Hook)

- Reject commits with non-compliant artifacts
- Require creation through commands
- Enforce template compliance
- Return error messages with fix instructions

### Level 3: Auto-Fix (Optional)

- Automatically restructure non-compliant files
- Add missing sections with placeholders
- Normalize naming
- Preserve original content

## Example Workflows

### Scenario 1: Manual ADR Creation Detected

```
Detected: docs/adr/new-decision.md (manually created)

Validation Results:
❌ Missing frontmatter (status, date, scope)
❌ Missing "Decision Drivers" section
❌ Filename not date-prefixed
✓ Has Context and Consequences sections

Recommendation:
The content is partially valid. I can help recreate it properly:

/context1000/adr "New Decision" --status proposed --template madr --scope platform

This will:
1. Generate proper frontmatter
2. Add missing "Decision Drivers" section
3. Apply correct filename: 20250122-new-decision.md
4. Preserve your Context and Consequences content

Would you like me to proceed?
```

### Scenario 2: Incomplete RFC Detected

```
Detected: docs/rfc/use-graphql.md

Validation Results:
❌ Missing "Alternatives Considered" section
❌ Status field has invalid value: "done" (should be: draft|review|accepted|rejected)
❌ Missing RFC number in filename
✓ Has Motivation and Design sections

Recommendation:
Please recreate this RFC using:

/context1000/rfc "Use GraphQL" --status accepted

Then add the Alternatives Considered section to explain why GraphQL was chosen over REST or gRPC.
```

### Scenario 3: Batch Validation

```
Checking all architectural artifacts...

Scanned:
- 45 ADRs: 43 valid, 2 issues
- 12 RFCs: 11 valid, 1 issue
- 18 RULEs: 18 valid ✓
- 8 GUIDEs: 8 valid ✓

Issues Found:
1. docs/adr/0012-old-decision.md: Missing Consequences section
2. docs/adr/0023-another.md: Status "implemented" not valid (use "accepted")
3. docs/rfc/0005-proposal.md: Missing Alternatives section

Recommendation:
Run compliance fix for the 3 issues above?
```

### Scenario 4: Index Synchronization

```
Checking indexes...

Found: docs/adr/0056-new-decision.md (created today)
Issue: Not listed in docs/adr/index.md

Action: Update index with new entry
- Title: "Adopt Event Sourcing for Audit Log"
- Status: Proposed
- Date: 2025-01-22
- Scope: platform

Recommendation:
Add entry to index or regenerate index from directory scan?
```

## Quality Guidelines

### Be Helpful, Not Blocking

- Primary goal is to educate, not punish
- Provide clear, actionable feedback
- Offer to fix issues automatically when possible

### Preserve Work

- Never delete user-created content
- Always offer migration path
- Back up original files before auto-fixes

### Consistent Enforcement

- Apply same standards across all artifact types
- Document exceptions clearly
- Update templates as standards evolve

### Integration with Workflow

- Run validation on pre-commit (via hooks)
- Periodic full-repo scans
- CI/CD integration for automated checks

## Integration Points

- **With Detect ADR Opportunities**: Ensure detected opportunities use proper commands
- **With RFC→ADR Linker**: Validate linked artifacts for template compliance
- **With Architecture Diff Analyzer**: Ensure recommended artifacts follow standards
- **With Hooks System**: Coordinate with pre-commit hooks for strict enforcement

## Configuration

### Enable Strict Mode (via Hook)

Create or update `hooks/hooks.json`:

```json
{
  "pre-tool-use": {
    "Write": "./hooks/validate-context1000-write.js",
    "Edit": "./hooks/validate-context1000-edit.js"
  }
}
```

### Customize Templates

Templates can be customized in:

- `.context1000/templates/adr-madr.md`
- `.context1000/templates/adr-nygard.md`
- `.context1000/templates/rfc-standard.md`
- `.context1000/templates/rule-standard.md`
- `.context1000/templates/guide-standard.md`

## References

- MADR Template: <https://adr.github.io/madr/>
- Nygard ADR: <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- Documentation standards: <https://www.writethedocs.org/>
- Arc42 architecture docs: <https://arc42.org/>
