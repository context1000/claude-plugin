---
name: API Reference Extractor
description: Generates reference documentation from source code, CLI tools, and configuration schemas. Focuses on facts only - signatures, parameters, return values, error codes. No explanations or how-tos (Diátaxis reference quadrant).
allowed-tools: Read, Grep, Glob, Bash
---

# API Reference Extractor

## Overview

This skill extracts structured reference documentation following the Diátaxis framework's **Reference** quadrant: pure facts, no opinions, no procedures.

## Diátaxis Reference Principles

Reference documentation is:

- ✅ **Information-oriented**: Describes "what is"
- ✅ **Factual and accurate**: No opinions or recommendations
- ✅ **Structured**: Like a dictionary or encyclopedia
- ✅ **Complete**: Covers all options, parameters, codes
- ❌ **NOT instructional**: No "how to" steps
- ❌ **NOT explanatory**: No "why" or rationale

## Reference Types

### 1. API Reference

**Sources**: OpenAPI/Swagger specs, source code, GraphQL schemas
**Content**:

- Endpoint URLs and methods
- Request parameters (path, query, body)
- Request/response schemas
- Status codes
- Authentication requirements
- Rate limits

### 2. CLI Reference

**Sources**: CLI tools, --help output, argument parsers
**Content**:

- Commands and subcommands
- Flags and options
- Arguments
- Exit codes
- Environment variables
- Configuration files

### 3. Configuration Reference

**Sources**: Config schemas, JSON Schema, YAML specs
**Content**:

- Configuration keys
- Data types and formats
- Default values
- Valid ranges/options
- Required vs. optional
- Nested structure

### 4. Error Reference

**Sources**: Error code definitions, exception classes
**Content**:

- Error codes/names
- HTTP status codes
- Error messages
- Error categories
- Exit codes

## Extraction Workflow

### Step 1: Identify Sources

```bash
# Find API specifications
find . -name "openapi.yaml" -o -name "swagger.json" -o -name "*.graphql"

# Find CLI entry points
grep -r "argparse\|cobra\|clap\|commander" --include="*.py" --include="*.go" --include="*.rs" --include="*.js"

# Find configuration schemas
find . -name "config.schema.json" -o -name "*config.yaml" -o -name "*.toml"

# Find error definitions
grep -r "class.*Error\|const.*ERROR\|enum.*Error" --include="*.py" --include="*.js" --include="*.go"
```

### Step 2: Extract Structured Data

#### API Endpoints (from OpenAPI)

```bash
# If OpenAPI spec exists
if [ -f "openapi.yaml" ]; then
  # Extract endpoints
  grep "^\s*/" openapi.yaml
  # Extract schemas
  sed -n '/components:/,/^[^ ]/p' openapi.yaml
fi
```

#### CLI Commands (from --help)

```bash
# Get help output
<cli-tool> --help > cli-help.txt

# Extract commands
grep "^\s*[a-z-]*\s\+[A-Z]" cli-help.txt

# Extract flags
grep "^\s*-" cli-help.txt
```

#### Configuration (from schema)

```bash
# If JSON Schema exists
if [ -f "config.schema.json" ]; then
  # Extract property definitions
  grep -A 5 '"properties":' config.schema.json
fi
```

### Step 3: Structure Reference Document

#### API Reference Template

```markdown
# <Service Name> API Reference

## Authentication

[Describe auth method: API key, OAuth, JWT]

## Base URL
```

<https://api.example.com/v1>

````

## Rate Limiting

[Requests per minute/hour]

## Endpoints

### GET /users

Retrieves a list of users.

#### Parameters

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of results (default: 10, max: 100) |
| `offset` | integer | No | Number of results to skip (default: 0) |
| `sort` | string | No | Sort field (options: `name`, `created_at`) |

#### Response

**Status: 200 OK**

```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "created_at": "ISO 8601 datetime"
    }
  ],
  "total": "integer"
}
````

#### Error Responses

| Status | Description           |
| ------ | --------------------- |
| 400    | Invalid parameters    |
| 401    | Unauthorized          |
| 429    | Rate limit exceeded   |
| 500    | Internal server error |

### POST /users

Creates a new user.

#### Parameters

**Body Parameters**:

| Parameter | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| `name`    | string | Yes      | User's full name (max 100 chars)                  |
| `email`   | string | Yes      | User's email address (must be valid email format) |

#### Request Example

```json
{
  "name": "Alice Smith",
  "email": "alice@example.com"
}
```

#### Response

**Status: 201 Created**

```json
{
  "id": "usr_1234567890",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "created_at": "2025-01-22T10:30:00Z"
}
```

#### Error Responses

| Status | Description           |
| ------ | --------------------- |
| 400    | Invalid request body  |
| 409    | User already exists   |
| 429    | Rate limit exceeded   |
| 500    | Internal server error |

## Error Codes

| Code              | HTTP Status | Description                       |
| ----------------- | ----------- | --------------------------------- |
| `invalid_request` | 400         | Request validation failed         |
| `unauthorized`    | 401         | Missing or invalid authentication |
| `forbidden`       | 403         | Insufficient permissions          |
| `not_found`       | 404         | Resource not found                |
| `conflict`        | 409         | Resource already exists           |
| `rate_limited`    | 429         | Too many requests                 |
| `server_error`    | 500         | Internal server error             |

````

#### CLI Reference Template
```markdown
# <CLI Tool> Command Reference

## Installation

[Installation instructions - link to guide]

## Synopsis

````

<tool> [global-options] <command> [command-options] [arguments]

```

## Global Options

| Flag | Description |
|------|-------------|
| `-h, --help` | Show help message |
| `-v, --version` | Show version |
| `--config <path>` | Path to config file (default: `~/.tool/config`) |
| `--verbose` | Enable verbose output |

## Commands

### create

Creates a new resource.

**Usage**:
```

<tool> create [options] <resource-type> <name>

````

**Arguments**:

| Argument | Description |
|----------|-------------|
| `<resource-type>` | Type of resource (options: `service`, `database`, `queue`) |
| `<name>` | Name of the resource |

**Options**:

| Flag | Description |
|------|-------------|
| `--region <region>` | Deployment region (default: `us-east-1`) |
| `--size <size>` | Resource size (options: `small`, `medium`, `large`) |
| `--tags <key=value>` | Resource tags (can be repeated) |

**Examples**:
```bash
<tool> create service my-api --region us-west-2 --size medium
<tool> create database users-db --tags env=prod --tags team=backend
````

**Exit Codes**:

| Code | Description             |
| ---- | ----------------------- |
| 0    | Success                 |
| 1    | Invalid arguments       |
| 2    | Resource already exists |
| 3    | API error               |

### delete

Deletes a resource.

**Usage**:

```
<tool> delete [options] <resource-type> <name>
```

**Arguments**:

| Argument          | Description          |
| ----------------- | -------------------- |
| `<resource-type>` | Type of resource     |
| `<name>`          | Name of the resource |

**Options**:

| Flag      | Description              |
| --------- | ------------------------ |
| `--force` | Skip confirmation prompt |

**Examples**:

```bash
<tool> delete service my-api
<tool> delete database old-db --force
```

### list

Lists resources.

**Usage**:

```
<tool> list [options] <resource-type>
```

**Arguments**:

| Argument          | Description                                       |
| ----------------- | ------------------------------------------------- |
| `<resource-type>` | Type of resource (optional: lists all if omitted) |

**Options**:

| Flag                | Description                                      |
| ------------------- | ------------------------------------------------ |
| `--region <region>` | Filter by region                                 |
| `--output <format>` | Output format (options: `table`, `json`, `yaml`) |

**Examples**:

```bash
<tool> list service
<tool> list --output json
```

## Environment Variables

| Variable           | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `TOOL_API_KEY`     | API authentication key                                    |
| `TOOL_CONFIG_PATH` | Path to configuration file                                |
| `TOOL_LOG_LEVEL`   | Logging level (options: `debug`, `info`, `warn`, `error`) |

## Configuration File

**Location**: `~/.tool/config`

**Format**: YAML

```yaml
api_key: <your-api-key>
default_region: us-east-1
log_level: info
```

## Exit Codes

| Code | Description                |
| ---- | -------------------------- |
| 0    | Success                    |
| 1    | Invalid arguments or usage |
| 2    | Resource conflict          |
| 3    | API error                  |
| 4    | Configuration error        |
| 125  | Tool internal error        |

````

#### Configuration Reference Template
```markdown
# <Service> Configuration Reference

## Configuration File Location

- **Default**: `/etc/<service>/config.yaml`
- **Override via**: `--config` flag or `SERVICE_CONFIG_PATH` environment variable

## Configuration Format

YAML format. All keys are optional unless marked as required.

## Top-Level Keys

### server

Server configuration.

**Type**: Object

**Example**:
```yaml
server:
  host: 0.0.0.0
  port: 8080
  timeout: 30s
````

#### server.host

Hostname or IP address to bind to.

- **Type**: string
- **Required**: No
- **Default**: `0.0.0.0`
- **Example**: `localhost`, `192.168.1.10`

#### server.port

Port number to listen on.

- **Type**: integer
- **Required**: No
- **Default**: `8080`
- **Range**: 1-65535
- **Example**: `3000`, `8443`

#### server.timeout

Request timeout duration.

- **Type**: duration string
- **Required**: No
- **Default**: `30s`
- **Format**: `<number><unit>` where unit is `s` (seconds), `m` (minutes), `h` (hours)
- **Example**: `10s`, `5m`, `1h`

### database

Database connection configuration.

**Type**: Object

**Required**: Yes

**Example**:

```yaml
database:
  host: localhost
  port: 5432
  name: myapp
  user: dbuser
  password: dbpass
  max_connections: 10
```

#### database.host

Database server hostname.

- **Type**: string
- **Required**: Yes
- **Example**: `localhost`, `db.example.com`

#### database.port

Database server port.

- **Type**: integer
- **Required**: No
- **Default**: `5432` (PostgreSQL), `3306` (MySQL)

#### database.name

Database name.

- **Type**: string
- **Required**: Yes

#### database.user

Database username.

- **Type**: string
- **Required**: Yes

#### database.password

Database password.

- **Type**: string
- **Required**: Yes
- **Security**: Store in environment variable or secrets manager

#### database.max_connections

Maximum number of database connections in pool.

- **Type**: integer
- **Required**: No
- **Default**: `10`
- **Range**: 1-100

### logging

Logging configuration.

**Type**: Object

**Example**:

```yaml
logging:
  level: info
  format: json
  output: stdout
```

#### logging.level

Log level threshold.

- **Type**: string
- **Required**: No
- **Default**: `info`
- **Options**: `debug`, `info`, `warn`, `error`

#### logging.format

Log output format.

- **Type**: string
- **Required**: No
- **Default**: `text`
- **Options**: `text`, `json`

#### logging.output

Log output destination.

- **Type**: string
- **Required**: No
- **Default**: `stdout`
- **Options**: `stdout`, `stderr`, or file path

## Complete Example

```yaml
server:
  host: 0.0.0.0
  port: 8080
  timeout: 30s

database:
  host: db.example.com
  port: 5432
  name: production
  user: app_user
  password: ${DB_PASSWORD} # from environment variable
  max_connections: 20

logging:
  level: info
  format: json
  output: /var/log/service.log
```

## Environment Variable Substitution

Configuration values can reference environment variables using `${VAR_NAME}` syntax:

```yaml
database:
  password: ${DB_PASSWORD}
  host: ${DB_HOST:-localhost} # with default value
```

````

### Step 4: Validate Accuracy

Reference documentation must be **100% accurate**:

```bash
# Validate API examples
curl -X GET "https://api.example.com/v1/users?limit=10"

# Validate CLI examples
<cli-tool> create service test --region us-east-1

# Validate configuration
<tool> --config config.yaml --validate
````

### Step 5: Keep It Minimal

Reference should be **dry and factual**:

❌ **Avoid explanations**:

```markdown
The `timeout` parameter is really important because long-running requests
can cause problems in production. You should set this based on your needs.
```

✅ **Just the facts**:

```markdown
#### server.timeout

Request timeout duration.

- **Type**: duration string
- **Default**: `30s`
- **Format**: `<number><unit>` (s=seconds, m=minutes, h=hours)
```

❌ **Avoid procedures**:

```markdown
To configure the database:

1. Open the config file
2. Find the database section
3. Set the host to your database server
```

✅ **Structure only**:

```markdown
### database.host

Database server hostname.

- **Type**: string
- **Required**: Yes
```

## Creating Reference Documentation

### When to Create a GUIDE

If reference documentation needs accompanying procedures:

```bash
/context1000:guide "<Service> API Integration" --audience backend
```

Link from reference to guide:

```markdown
## See Also

- [How to Integrate with User Service API](../guides/user-service-integration.guide.md)
```

### When to Create a RULE

If reference describes required standards:

```bash
/context1000:rule "API Response Format Standards" --severity required --scope backend
```

### When Reference Lives in docs/reference/

For pure reference material that doesn't fit ADR/RULE/GUIDE:

Create or update files in `docs/reference/`:

- `docs/reference/api/<service>-api.md`
- `docs/reference/cli/<tool>-cli.md`
- `docs/reference/config/<service>-config.md`
- `docs/reference/errors/<service>-errors.md`

**Do NOT use `/context1000:*` slash commands for these** - use Edit tool to update existing reference files.

## Example Extraction

### Scenario: Extract CLI Reference from --help

```bash
# Step 1: Get help output
./billingctl --help > /tmp/billingctl-help.txt

# Step 2: Parse structure
grep "^Commands:" -A 100 /tmp/billingctl-help.txt

# Step 3: Extract for each command
./billingctl invoice --help
./billingctl payment --help
./billingctl report --help

# Step 4: Structure in reference format
# (See CLI Reference Template above)

# Step 5: Create or update reference file
# If docs/reference/cli/billingctl.md exists:
#   Use Edit tool to update
# If it doesn't exist:
#   Consider creating via GUIDE if it includes usage instructions
#   /context1000:guide "billingctl CLI Reference" --audience backend
```

## Quality Checklist

Reference documentation should be:

- [ ] Factual only (no opinions or explanations)
- [ ] Complete (all parameters/options/codes documented)
- [ ] Accurate (validated against actual implementation)
- [ ] Structured (tables, consistent format)
- [ ] Minimal (no unnecessary prose)
- [ ] Up-to-date (matches current version)
- [ ] Searchable (good heading structure)
- [ ] Linked (to guides for "how to", ADRs for "why")

## Integration Points

- **With Diátaxis Classifier**: Enforce reference = facts only
- **With Google Style Editor**: Format tables and code examples
- **With Crosslinker**: Link reference to related guides and ADRs
- **With Example Upgrader**: Ensure code examples are current and valid

## References

- Diátaxis Reference documentation: <https://diataxis.fr/reference/>
- OpenAPI Specification: <https://swagger.io/specification/>
- JSON Schema: <https://json-schema.org/>
- Stripe API Reference (excellent example): <https://stripe.com/docs/api>
- Kubernetes API Reference (comprehensive example): <https://kubernetes.io/docs/reference/>
