#!/usr/bin/env node

/**
 * PreToolUse Hook: Enforce strict tool usage for context1000-architect agent
 *
 * Blocks:
 * - Write tool usage (architect must never create files directly)
 * - Edit tool usage (architect must never modify files directly)
 * - Bash tool usage for file/directory creation
 *
 * Allows:
 * - SlashCommand tool (required for document creation)
 * - Read, Grep, Glob (for analysis)
 *
 * Input: JSON via stdin (PreToolUse event format)
 * Output:
 *   - Exit code 0: Allow (success)
 *   - Exit code 2: Block (stderr message fed to Claude)
 *   - JSON to stdout for permission decisions
 */

const fs = require('fs');

// Read stdin
let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData);

    // Extract relevant fields
    const toolName = input.tool_name;
    const toolInput = input.tool_input || {};

    // Determine if this is from context1000-architect
    // Note: We need to check if the current context involves the architect agent
    // For now, we'll apply rules based on tool patterns that architect shouldn't use

    // Check if this is Write tool
    if (toolName === 'Write') {
      // Check if the file path is in .context1000/ (architect creating docs directly)
      const filePath = toolInput.file_path || '';
      if (filePath.includes('.context1000')) {
        blockTool(toolName, `🚫 BLOCKED: Cannot use Write tool to create .context1000 documentation directly.

You must use SlashCommand tool to invoke:
  /archdocs:create-guide "<topic>"
  /archdocs:create-rule "<name>"
  /archdocs:create-adr "<title>"
  /archdocs:create-rfc "<title>"

Example:
  SlashCommand tool with command: "/archdocs:create-guide \\"InstantDB integration\\""

The slash command will create the file in the correct location with correct structure.`);
        return;
      }
    }

    // Check if this is Edit tool on .context1000 files
    if (toolName === 'Edit') {
      const filePath = toolInput.file_path || '';
      if (filePath.includes('.context1000') && !filePath.includes('context1000-documentation-writer')) {
        blockTool(toolName, `🚫 BLOCKED: Cannot use Edit tool on .context1000 documentation.

Architecture analysis should CREATE new documents via SlashCommand, not edit existing ones.
File modifications in .context1000/ are handled by context1000-documentation-writer agent.

Use SlashCommand tool to CREATE new documents via /archdocs:create-* commands.`);
        return;
      }
    }

    // Check if this is dangerous Bash command
    if (toolName === 'Bash') {
      const command = toolInput.command || '';
      const dangerousPatterns = [
        { pattern: /mkdir.*\.context1000/i, desc: 'mkdir on .context1000' },
        { pattern: /touch.*\.context1000/i, desc: 'touch on .context1000' },
        { pattern: /echo\s+[^|]*>.*\.context1000/i, desc: 'echo redirect to .context1000' },
        { pattern: /cat\s+.*>.*\.context1000/i, desc: 'cat redirect to .context1000' },
      ];

      for (const { pattern, desc } of dangerousPatterns) {
        if (pattern.test(command)) {
          blockTool(toolName, `🚫 BLOCKED: Cannot use Bash for file/directory creation in .context1000/.

Blocked command: ${command}
Reason: ${desc}

You must use SlashCommand tool with /archdocs:create-* commands to create documentation.
Bash is only allowed for read-only operations.`);
          return;
        }
      }
    }

    // Allow all other cases
    allowTool();

  } catch (error) {
    // On parse error, allow by default (fail open)
    console.error(`Hook error: ${error.message}`);
    process.exit(0);
  }
});

/**
 * Block the tool with a message to Claude
 */
function blockTool(toolName, message) {
  // Output JSON with deny decision
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: message
    }
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

/**
 * Allow the tool
 */
function allowTool() {
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow'
    }
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}
