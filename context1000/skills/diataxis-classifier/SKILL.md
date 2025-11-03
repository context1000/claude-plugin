---
name: diataxis-classifier
description: Classifies documentation by Diátaxis framework (tutorial/how-to/reference/explanation) and recommends the appropriate artifact type (GUIDE/RULE/REF). Activate when phrases like "write docs", "explain", or "how to do" appear.
allowed-tools: Read, Grep, Glob, Bash
---

# Diátaxis Classifier

## Overview

The [Diátaxis framework](https://diataxis.fr/) divides documentation into four distinct types based on purpose and audience. This skill analyzes content and recommends the correct documentation artifact type.

## The Four Quadrants

### 1. Tutorial (Learning-Oriented)

**Purpose**: Teach newcomers through a structured learning journey
**Characteristics**:

- Step-by-step instructions for beginners
- Complete, reproducible example from start to finish
- Provides context and explanation at each step
- Safe environment to learn by doing
- Success is measured by completion

**Audience**: Beginners, first-time users, learners

**Example titles**:

- "Your First Microservice: A Complete Walkthrough"
- "Getting Started with Event-Driven Architecture"
- "Build Your First gRPC Service in 30 Minutes"

### 2. How-To Guide (Task-Oriented)

**Purpose**: Show practitioners how to solve specific problems
**Characteristics**:

- Focused on a specific goal or task
- Assumes existing knowledge
- Minimal explanation, maximum action
- Can be followed in any order
- Success is measured by task completion

**Audience**: Practitioners actively working, intermediate users

**Example titles**:

- "How to Migrate from RabbitMQ to Kafka"
- "How to Configure Circuit Breakers in Production"
- "How to Implement Request Tracing with OpenTelemetry"

### 3. Reference (Information-Oriented)

**Purpose**: Provide factual, technical descriptions
**Characteristics**:

- Accurate, complete, authoritative
- Structured like a dictionary or encyclopedia
- No opinions or recommendations
- Describes "what is" not "how to"
- Machine-readable structure (APIs, schemas, configs)

**Audience**: Anyone who needs facts, lookups

**Example titles**:

- "gRPC Service API Reference"
- "Configuration Schema Reference"
- "CLI Command Reference"
- "Error Codes and Exit Status"

### 4. Explanation (Understanding-Oriented)

**Purpose**: Clarify concepts and provide context
**Characteristics**:

- Explores "why" and background
- Discusses alternatives and trade-offs
- Provides historical context
- Makes connections between topics
- Success is measured by understanding

**Audience**: Anyone seeking deeper understanding

**Example titles**:

- "Understanding Event Sourcing vs. Event Streaming"
- "Why We Chose Kubernetes Over AWS ECS"
- "The Rationale Behind Our Microservices Architecture"

## Classification Instructions

### Step 1: Analyze Content Intent

Ask these questions:

1. **Is it teaching a complete skill to beginners?** → Tutorial
2. **Is it solving a specific practical problem?** → How-To
3. **Is it purely factual without opinions?** → Reference
4. **Is it explaining concepts or rationale?** → Explanation

### Step 2: Identify Key Indicators

**Tutorial Indicators**:

- "Let's build...", "In this tutorial..."
- Complete working example from scratch
- Each step builds on previous
- Encourages experimentation

**How-To Indicators**:

- "How to...", "Steps to..."
- Assumes pre-existing setup
- Focused on single outcome
- Minimal explanation

**Reference Indicators**:

- Lists, tables, API signatures
- Parameters, return values, error codes
- No imperative instructions
- Alphabetical or logical ordering

**Explanation Indicators**:

- "Why...", "Understanding...", "Background..."
- Comparative analysis
- Historical context
- Trade-offs discussion

### Step 3: Map to Artifact Type

#### Tutorial → GUIDE

```bash
/context1000:guide "<Tutorial Title>" --audience <beginners|all>
```

**Structure recommendation**:

```markdown
## Prerequisites

## What You'll Build

## Step 1: Setup

## Step 2: Core Implementation

## Step 3: Testing

## Step 4: Deployment

## What You Learned

## Next Steps
```

#### How-To → GUIDE

```bash
/context1000:guide "<How to Do Task>" --audience <backend|frontend|infra>
```

**Structure recommendation**:

```markdown
## Goal

## Prerequisites

## Steps

1. [Action 1]
2. [Action 2]
3. [Action 3]

## Verification

## Troubleshooting

## Related Guides
```

#### Reference → Update existing or propose RULE

If reference is a standard that must be followed:

```bash
/context1000:rule "<Standard Name>" --severity required --scope <area>
```

Otherwise, suggest updating existing reference documentation or create a dedicated reference file in `docs/reference/`.

**Structure recommendation**:

```markdown
## Syntax

## Parameters

## Return Values / Exit Codes

## Examples (minimal, valid)

## See Also
```

#### Explanation → Link to ADR/RFC

Explanations often belong in:

- ADR "Context and Problem Statement" section
- ADR "Decision Drivers" section
- RFC "Motivation" section
- Standalone explanation document in `docs/explanations/`

Consider creating or linking to:

```bash
/context1000:adr "<Decision Title>" --status <status> --template madr --scope <area>
```

## Classification Workflow

### Input Analysis

```bash
# Read the content to classify
Read <file-path>

# Search for indicators
grep -E "(tutorial|how to|reference|why we|understanding)" <file-path> -i

# Check document structure
grep "^#" <file-path>  # Extract headings
```

### Decision Tree

```
Is it step-by-step for beginners?
├─ Yes → Tutorial → /context1000:guide (audience: beginners)
└─ No
   ├─ Is it solving a specific task?
   │  ├─ Yes → How-To → /context1000:guide (audience: role-specific)
   │  └─ No
   │     ├─ Is it pure facts/API/config?
   │     │  ├─ Yes → Reference → Update docs/reference/ or create RULE
   │     │  └─ No
   │     │     └─ Is it explaining concepts/rationale?
   │     │        └─ Yes → Explanation → Link to/from ADR/RFC
```

## Example Classifications

### Example 1: Broker Migration Content

```
Content: "Steps to migrate your message broker from RabbitMQ to Kafka
in the billing service, including data migration and configuration updates."

Analysis:
- Keyword: "Steps to migrate" → Task-oriented
- Assumes existing system → Not beginner tutorial
- Specific goal → Not explanation
- Not pure facts → Not reference

Classification: How-To Guide
Recommendation: /context1000:guide "Migrate from RabbitMQ to Kafka in Billing Service" --audience backend

Structure:
## Goal: Migrate billing service message broker
## Prerequisites: RabbitMQ currently running, Kafka cluster available
## Steps:
  1. Deploy Kafka cluster
  2. Configure Kafka topics
  3. Update service configuration
  4. Dual-write migration phase
  5. Switch consumers to Kafka
  6. Decommission RabbitMQ
## Verification: Check message flow in Kafka
## Rollback Plan
```

### Example 2: gRPC Concepts

```
Content: "Understanding gRPC: why we chose it for inter-service communication,
comparing HTTP/2 features, streaming capabilities, and trade-offs vs REST."

Analysis:
- Keyword: "Understanding", "why we chose" → Understanding-oriented
- Discusses rationale and trade-offs → Not procedural
- Comparative analysis → Explanation

Classification: Explanation
Recommendation: This content belongs in an ADR

Action: Check if ADR exists for gRPC adoption:
grep -r "grpc\|gRPC" .context1000/decisions/adr/ docs/adr/

If no ADR exists:
/context1000:adr "Adopt gRPC for Inter-Service Communication" --status accepted --template madr --scope platform

Then link this explanation to ADR's "Context and Problem Statement" section.
```

### Example 3: API Documentation

```
Content: "User Service API endpoints: GET /users, POST /users, DELETE /users/{id}.
Parameters, response codes, authentication requirements."

Analysis:
- Pure facts: endpoints, parameters, codes → Information-oriented
- No instructions or explanations → Reference
- Structured like a dictionary → Reference

Classification: Reference
Recommendation: Update docs/reference/user-service-api.md

If this represents a required API standard:
/context1000:rule "User Service API Standards" --severity required --scope backend

Structure:
## Endpoints
  ### GET /users
    - Parameters: ...
    - Response: ...
    - Status Codes: ...
  ### POST /users
    - ...
## Authentication
## Rate Limiting
## Error Responses
```

### Example 4: Kubernetes Setup Tutorial

```
Content: "Your first Kubernetes deployment: In this tutorial, we'll deploy
a simple web app to Kubernetes, step by step, explaining each concept along the way."

Analysis:
- Keyword: "Your first", "tutorial", "step by step" → Learning-oriented
- For beginners → Tutorial
- Complete example from scratch → Tutorial
- Explains concepts along the way → Tutorial

Classification: Tutorial
Recommendation: /context1000:guide "Your First Kubernetes Deployment" --audience all

Structure:
## What You'll Learn
- Kubernetes pods, deployments, services
- kubectl basics
- Container deployment workflow

## Prerequisites
- kubectl installed
- Access to a Kubernetes cluster (minikube or cloud)

## Step 1: Create a Simple Web App
[Complete code example]

## Step 2: Containerize the App
[Dockerfile walkthrough]

## Step 3: Write Kubernetes Manifests
[Explain deployment.yaml]

## Step 4: Deploy to Kubernetes
[kubectl apply commands with explanation]

## Step 5: Access Your App
[Port forwarding and service exposure]

## What You Built
Summary and next learning steps

## Next Steps
- [How-To: Configure Production Deployments]
- [Reference: kubectl Command Reference]
```

## Multi-Type Content

Sometimes content spans multiple types. In this case:

1. **Split the content** into separate documents:

   - Tutorial: Complete beginner walkthrough
   - How-To: Quick task-specific guides
   - Reference: API/config facts
   - Explanation: Background and rationale

2. **Link between them**:

   ```markdown
   ## See Also

   - [Tutorial: Getting Started with Feature Flags](../guides/tutorial-feature-flags.md)
   - [How-To: Implement Feature Flags in Express.js](../guides/how-to-feature-flags-express.md)
   - [Reference: Feature Flag API](../reference/feature-flag-api.md)
   - [ADR-0034: Adopt Unleash for Feature Management](../.context1000/decisions/adr/0034-adopt-unleash.md)
   ```

3. **Create each via appropriate command**:

   ```bash
   /context1000:guide "Getting Started with Feature Flags" --audience all
   /context1000:guide "Implement Feature Flags in Express.js" --audience backend
   # Reference goes in docs/reference/
   /context1000:adr "Adopt Unleash for Feature Management" --status accepted --template madr --scope platform
   ```

## Quality Checklist

Before recommending an artifact type, verify:

- [ ] Content clearly fits ONE primary Diátaxis quadrant
- [ ] Recommended artifact aligns with content purpose
- [ ] Structure template matches the Diátaxis type
- [ ] Target audience is correctly identified
- [ ] Related documents are identified for cross-linking
- [ ] Creation command uses proper `/context1000:*` format

## Integration Points

- **With Google Style Editor**: After classification, apply style guidelines
- **With Crosslinker**: Link classified documents to related artifacts
- **With Example Upgrader**: Ensure examples in tutorials/how-tos are current
- **With API Reference Extractor**: Generate reference sections from code

## References

- Diátaxis Framework: <https://diataxis.fr/>
- Four types explained: <https://diataxis.fr/tutorials-how-to/>
- Google Season of Docs case study: <https://diataxis.fr/adoption/>
- "Good Docs Project" templates based on Diátaxis: <https://thegooddocsproject.dev/>
