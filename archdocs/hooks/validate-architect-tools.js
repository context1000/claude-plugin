#!/usr/bin/env node

/**
 * PreToolUse Hook: Enforce strict tool usage for context1000-architect agent
 *
 * Purpose: Guide the architect agent to use slash commands for documentation
 * creation instead of directly using Write/Edit/Bash tools.
 *
 * Blocks (only for architect agent):
 * - Write tool usage on .context1000 paths (must use slash commands instead)
 * - Edit tool usage on .context1000 paths (documentation-writer handles edits)
 * - Bash commands that create files/directories in .context1000
 *
 * Allows:
 * - All operations when inside a slash command execution
 * - All operations from context1000-documentation-writer agent
 * - SlashCommand tool (required for document creation)
 * - Read, Grep, Glob (for analysis)
 *
 * Input: JSON via stdin (PreToolUse event format)
 * Output:
 *   - Exit code 0: Allow (success)
 *   - JSON to stdout with permission decision (allow/deny)
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

    // DEBUG: Log input structure for debugging
    try {
      fs.writeFileSync('/tmp/hook-debug.json', JSON.stringify(input, null, 2));
    } catch (e) {
      // Ignore write errors
    }

    // Extract relevant fields
    const toolName = input.tool_name;
    const toolInput = input.tool_input || {};

    // Check if we're inside a slash command execution by examining:
    // 1. Environment variables that might be set
    // 2. Conversation state from input
    // 3. Recent messages in conversation_messages array

    const conversationMessages = input.conversation_messages || [];
    const lastMessages = conversationMessages.slice(-10); // Check last 10 messages

    // Check if we're inside a slash command execution
    const isInsideSlashCommand = lastMessages.some(msg => {
      if (!msg || !msg.content) return false;

      const contentStr = Array.isArray(msg.content)
        ? msg.content.map(c => typeof c === 'string' ? c : c.text || '').join(' ')
        : String(msg.content);

      return contentStr.includes('<command-message>') &&
             contentStr.includes('/archdocs:create-');
    });

    // Check if we're inside the documentation-writer agent (not architect)
    const isDocumentationWriter = lastMessages.some(msg => {
      if (!msg || !msg.content) return false;

      const contentStr = Array.isArray(msg.content)
        ? msg.content.map(c => typeof c === 'string' ? c : c.text || '').join(' ')
        : String(msg.content);

      return contentStr.includes('context1000-documentation-writer') ||
             contentStr.includes('Documentation Writer Agent');
    });

    // If inside slash command or documentation-writer agent, allow all operations
    if (isInsideSlashCommand || isDocumentationWriter) {
      allowTool();
      return;
    }

    // Only block operations from the architect agent trying to directly modify files
    // This allows slash commands and other agents to work normally

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
