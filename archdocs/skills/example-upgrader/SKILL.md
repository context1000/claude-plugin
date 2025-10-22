---
name: Example Upgrader
description: Improves and validates code examples - minimization, SDK/version updates, consistent formatting, and verification that examples compile/run. Activate when reviewing documentation with code snippets.
allowed-tools: Read, Grep, Glob, Bash
---

# Example Upgrader

## Overview

This skill ensures code examples in documentation are current, correct, minimal, and follow consistent style.

## Quality Standards for Examples

### 1. Minimal and Focused
Examples should demonstrate ONE concept clearly:

❌ **Too complex**:
```javascript
// Bad: Too many concerns in one example
const express = require('express');
const winston = require('winston');
const prometheus = require('prom-client');
const app = express();

// Configure logging
const logger = winston.createLogger({...});

// Configure metrics
const register = new prometheus.Register();
const httpRequestDuration = new prometheus.Histogram({...});

// Configure middleware
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => end());
  next();
});

// Business logic
app.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({error: 'Internal error'});
  }
});

app.listen(3000);
```

✅ **Focused**:
```javascript
// Good: Demonstrates one concept - basic Express endpoint
const express = require('express');
const app = express();

app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.listen(3000);
```

### 2. Complete and Runnable
Examples should be complete enough to work:

❌ **Incomplete**:
```python
# Bad: Where do these come from?
result = calculate_total(items)
send_email(user, result)
```

✅ **Complete**:
```python
# Good: Shows imports and context
from billing import calculate_total
from notifications import send_email

items = [
    {"price": 10.00, "quantity": 2},
    {"price": 5.50, "quantity": 1}
]
total = calculate_total(items)
send_email(user="admin@example.com", total=total)
```

### 3. Current SDK/Library Versions
Examples should use recent, non-deprecated APIs:

❌ **Outdated**:
```javascript
// Bad: request library deprecated since 2020
const request = require('request');
request('http://api.example.com', (error, response, body) => {
  console.log(body);
});
```

✅ **Current**:
```javascript
// Good: Using fetch (Node 18+) or modern alternatives
const response = await fetch('https://api.example.com');
const data = await response.json();
console.log(data);
```

### 4. Consistent Formatting
Examples should follow language-specific conventions:

✅ **Python** (PEP 8):
- 4 spaces for indentation
- snake_case for variables/functions
- Type hints where helpful

✅ **JavaScript** (Standard/Prettier):
- 2 spaces for indentation
- camelCase for variables/functions
- const/let, not var

✅ **Go** (gofmt):
- Tabs for indentation
- camelCase for exported names

### 5. Realistic but Safe
Examples should be realistic without exposing credentials:

❌ **Unsafe**:
```bash
# Bad: Real credentials in example
export API_KEY="sk_live_51Hxyz123456789"
```

✅ **Safe**:
```bash
# Good: Placeholder that's obviously fake
export API_KEY="<your-api-key>"
# or
export API_KEY="sk_test_placeholder123"
```

## Upgrade Workflow

### Step 1: Find Examples in Documentation

```bash
# Find all code blocks in markdown files
find docs .context1000 -name "*.md" -type f -exec grep -l '```' {} \;

# Extract code blocks from a file
sed -n '/```/,/```/p' <file>
```

### Step 2: Analyze Each Example

For each code example, check:

1. **Language/framework version**
   - What version is this example targeting?
   - Is it current? (within last 2 major versions)

2. **API usage**
   - Are any APIs deprecated?
   - Are there newer, better alternatives?

3. **Completeness**
   - Can this example run as-is?
   - Are imports/dependencies shown?

4. **Clarity**
   - Is the example focused on one concept?
   - Is it the minimal code to demonstrate the point?

5. **Style**
   - Does it follow language conventions?
   - Is formatting consistent?

### Step 3: Validate Examples

Where possible, actually run or compile examples:

#### JavaScript/TypeScript
```bash
# Extract example to temp file
cat > /tmp/example.js << 'EOF'
<example-code>
EOF

# Check syntax
node --check /tmp/example.js

# Run with --dry-run if available
node /tmp/example.js
```

#### Python
```bash
# Extract to temp file
cat > /tmp/example.py << 'EOF'
<example-code>
EOF

# Check syntax
python -m py_compile /tmp/example.py

# Run
python /tmp/example.py
```

#### Go
```bash
# Check formatting
echo '<example-code>' | gofmt -d

# Check compilation (requires proper package)
go build /tmp/example.go
```

#### Shell/Bash
```bash
# Check syntax
bash -n /tmp/example.sh

# ShellCheck for best practices
shellcheck /tmp/example.sh
```

### Step 4: Upgrade Outdated Examples

#### Version Updates
Document current versions and update examples:

**Before**:
```javascript
// Using gRPC 1.24.x (2019)
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('service.proto', {
  keepCase: true,
  longs: String,
  enums: String
});
```

**After**:
```javascript
// Using @grpc/grpc-js 1.10.x (2024)
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('service.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true
});
```

**Changelog note in doc**:
```markdown
**Note**: This example uses `@grpc/grpc-js` v1.10. If you're using an older version, see the [migration guide](link).
```

#### API Deprecation Updates

**Before** (deprecated API):
```python
# Old: pandas.append() deprecated in 2.0
import pandas as pd
df = pd.DataFrame({'a': [1, 2]})
df = df.append({'a': 3}, ignore_index=True)
```

**After** (current API):
```python
# New: Use pd.concat() instead
import pandas as pd
df = pd.DataFrame({'a': [1, 2]})
new_row = pd.DataFrame({'a': [3]})
df = pd.concat([df, new_row], ignore_index=True)
```

#### Minimization

**Before** (too verbose):
```go
// Too much boilerplate for a basic example
package main

import (
    "context"
    "fmt"
    "log"
    "time"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
    pb "github.com/example/proto"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    conn, err := grpc.DialContext(ctx, "localhost:50051",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithBlock())
    if err != nil {
        log.Fatalf("Failed to connect: %v", err)
    }
    defer conn.Close()

    client := pb.NewUserServiceClient(conn)

    req := &pb.GetUserRequest{UserId: "123"}
    resp, err := client.GetUser(ctx, req)
    if err != nil {
        log.Fatalf("GetUser failed: %v", err)
    }

    fmt.Printf("User: %s\n", resp.Name)
}
```

**After** (focused on core concept):
```go
// Demonstrates basic gRPC client call
conn, _ := grpc.Dial("localhost:50051", grpc.WithInsecure())
defer conn.Close()

client := pb.NewUserServiceClient(conn)
resp, _ := client.GetUser(context.Background(), &pb.GetUserRequest{
    UserId: "123",
})
fmt.Println(resp.Name)

// Note: Error handling omitted for brevity. In production, check all errors.
```

### Step 5: Document Breaking Changes

When upgrading examples that introduce breaking changes, document the migration:

```markdown
## Code Examples

The following examples use Kafka client v3.x. If you're using v2.x, note these differences:

| v2.x | v3.x |
|------|------|
| `KafkaConsumer()` | `Consumer()` |
| `subscribe([topic])` | `subscribe(topics=[topic])` |
| `poll(timeout_ms)` | `poll(timeout)` |

For full migration guide, see [Kafka Client Migration](../guides/kafka-client-migration.md).

### Basic Consumer Example (v3.x)

\```python
from kafka import Consumer

consumer = Consumer(
    bootstrap_servers=['localhost:9092'],
    group_id='my-group'
)
consumer.subscribe(topics=['my-topic'])

for message in consumer:
    print(message.value)
\```
```

## Integration with Documentation

### Update Guides
When examples change significantly:

```bash
# If new procedure is needed
/archdocs:create-guide "Migrate to <New API> from <Old API>" --audience <role>
```

### Update Rules
When new best practices emerge:

```bash
# If new standard should be enforced
/archdocs:create-rule "Use <Current API> for <Purpose>" --severity warn --scope <area>
```

### Link from Examples
Reference relevant documentation from examples:

```markdown
\```javascript
// Basic Kafka producer example
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'events',
  messages: [{ value: 'Hello Kafka' }]
});
\```

For production configuration, see:
- [RULE: Kafka Producer Settings](../.context1000/rules/kafka-producer-settings.rules.md)
- [GUIDE: Configure Kafka for Production](../guides/kafka-production-config.guide.md)
```

## Example Upgrade Patterns

### Pattern 1: SDK Version Bump

**Scenario**: Upgrade gRPC examples from v1.24 to v1.63

**Process**:
1. Identify all gRPC examples:
   ```bash
   grep -r "require('grpc')" docs/ .context1000/
   ```

2. Check for breaking changes in release notes:
   - gRPC v1.50: Switched to `@grpc/grpc-js` as default
   - No major API changes in core usage

3. Update examples:
   - Replace `require('grpc')` with `require('@grpc/grpc-js')`
   - Test each example

4. Add version note to affected documents

5. Create migration guide if needed:
   ```bash
   /archdocs:create-guide "Migrate gRPC Client to v1.63" --audience backend
   ```

### Pattern 2: Deprecated API Replacement

**Scenario**: Express.js `bodyParser` middleware deprecated

**Before**:
```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.json());
```

**After**:
```javascript
// bodyParser is now built into Express
app.use(express.json());
```

**Document change**:
```markdown
**Breaking Change** (Express 4.16+): `body-parser` middleware is now built-in.

\```javascript
// Old (deprecated)
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// New (Express 4.16+)
app.use(express.json());
\```

If you're using Express < 4.16, you must install `body-parser` separately.
```

### Pattern 3: Style Normalization

**Scenario**: Inconsistent Python formatting across examples

**Process**:
1. Extract all Python examples to temp files
2. Run `black` formatter on each:
   ```bash
   black /tmp/example.py
   ```
3. Update examples in documentation
4. Add style note:
   ```markdown
   **Note**: All Python examples follow [PEP 8](https://pep8.org/) and are formatted with [Black](https://black.readthedocs.io/).
   ```

### Pattern 4: Completeness Improvement

**Before** (incomplete):
```python
# Incomplete: Where does user come from?
result = billing.charge(user, amount)
```

**After** (complete):
```python
# Complete working example
from billing import BillingService, User

# Initialize service
billing = BillingService(api_key="<your-api-key>")

# Create user object
user = User(id="usr_123", email="user@example.com")

# Charge user
result = billing.charge(user=user, amount=99.99, currency="USD")
print(f"Charge successful: {result.transaction_id}")
```

## Quality Checklist

For each code example:

- [ ] Uses current SDK/library version (within 2 major versions)
- [ ] No deprecated APIs
- [ ] Minimal and focused (demonstrates one concept)
- [ ] Complete and runnable (or clearly marked as pseudo-code)
- [ ] Follows language-specific style conventions
- [ ] Syntax validated (linted/compiled)
- [ ] Credentials/secrets are placeholders
- [ ] Includes imports/dependencies
- [ ] Has explanatory comments where helpful
- [ ] Links to relevant GUIDE/RULE/ADR for production usage

## Validation Commands

### JavaScript/TypeScript
```bash
# Syntax check
node --check <file>.js
npx tsc --noEmit <file>.ts

# Lint
npx eslint <file>.js
```

### Python
```bash
# Syntax check
python -m py_compile <file>.py

# Style check
black --check <file>.py
flake8 <file>.py
```

### Go
```bash
# Format check
gofmt -d <file>.go

# Lint
golangci-lint run <file>.go

# Build
go build <file>.go
```

### Bash
```bash
# Syntax check
bash -n <file>.sh

# Lint
shellcheck <file>.sh
```

### YAML
```bash
# Validate
yamllint <file>.yaml
```

### JSON
```bash
# Validate
jq empty <file>.json
```

## Integration Points

- **With Diátaxis Classifier**: Tutorials need more complete examples; how-tos can be more focused
- **With Google Style Editor**: Code comments should follow style guide
- **With API Reference Extractor**: Reference examples are minimal; guide examples are complete
- **With Glossary**: Use consistent terminology in code comments

## References

- Google Developer Documentation Style Guide (Code Samples): https://developers.google.com/style/code-samples
- Write the Docs - Code Examples: https://www.writethedocs.org/guide/writing/code-examples/
- PEP 8 (Python): https://pep8.org/
- Effective Go: https://golang.org/doc/effective_go
- JavaScript Standard Style: https://standardjs.com/
