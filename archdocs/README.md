# Archdocs Plugin - Architecture Documentation System

A Claude Code plugin for creating and maintaining architectural documentation in the `.context1000` format.

## Architecture

### Two-Agent System

The plugin uses a strict separation of concerns between two specialized agents:

#### 1. **context1000-architect** (Analysis & Proposal)

- **Role**: Analyzes codebase architecture and proposes documentation
- **Tools**: `Read`, `Grep`, `Glob`, `SlashCommand`
- **Constraints**:
  - ❌ Cannot create files directly (`Write`, `Edit` blocked by hook)
  - ❌ Cannot use `Bash` for file creation in `.context1000/`
  - ✅ Must use slash commands for all document creation
  - ✅ Only analyzes and proposes
- **Output**: Proposals and slash command invocations

#### 2. **context1000-documentation-writer** (Validation & Refinement)

- **Role**: Validates and maintains documentation consistency
- **Tools**: `Read`, `Grep`, `Glob`, `Edit`
- **Constraints**:
  - ✅ Can edit existing files in `.context1000/` only
  - ❌ Cannot create new files
  - ❌ Cannot use slash commands
- **Output**: Validation reports and minimal edits

### Workflow

```text
User Request
    ↓
┌─────────────────────────────────┐
│ context1000-architect           │
│ • Analyzes codebase             │
│ • Proposes documentation        │
│ • Invokes slash commands        │
└─────────────┬───────────────────┘
              ↓
    Slash Commands Create Files
    (.context1000/guides/*, etc.)
              ↓
┌─────────────────────────────────┐
│ context1000-documentation-writer│
│ • Validates structure           │
│ • Checks frontmatter            │
│ • Enforces word limits          │
│ • Fixes cross-references        │
└─────────────────────────────────┘
```

