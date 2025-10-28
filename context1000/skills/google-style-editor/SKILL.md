---
name: Google Style Editor
description: Edits documentation according to Google Developer Documentation Style Guide - tone, clarity, global audience, headings, lists, tables, and accessibility standards.
allowed-tools: Read, Grep, Glob, Bash
---

# Google Style Editor

## Overview

This skill applies the [Google Developer Documentation Style Guide](https://developers.google.com/style) principles to ensure documentation is clear, consistent, and accessible to a global audience.

## Core Principles

### 1. Write for a Global Audience

- Use simple, clear language
- Avoid idioms, colloquialisms, and cultural references
- Use standard American English spelling
- Define acronyms on first use
- Avoid humor that doesn't translate

### 2. Be Clear and Concise

- Use active voice
- Keep sentences short (aim for 20-25 words)
- One idea per sentence
- Remove unnecessary words
- Use present tense when possible

### 3. Be Consistent

- Use the same term throughout (don't vary for style)
- Follow standard capitalization rules
- Use consistent formatting
- Maintain parallel structure in lists

## Style Guidelines

### Voice and Tone

#### Use Active Voice

❌ **Avoid**: "The service is deployed by Kubernetes."
✅ **Prefer**: "Kubernetes deploys the service."

❌ **Avoid**: "The file can be edited using any text editor."
✅ **Prefer**: "You can edit the file using any text editor."

#### Use Second Person (You/Your)

❌ **Avoid**: "One should configure the API key before deploying."
✅ **Prefer**: "Configure the API key before you deploy."

❌ **Avoid**: "Developers must ensure that..."
✅ **Prefer**: "Ensure that you..."

#### Be Conversational but Professional

✅ **Good**: "To get started, clone the repository."
✅ **Good**: "You'll need to configure these settings."
❌ **Avoid**: "Simply clone the repo and you're golden!" (too casual)
❌ **Avoid**: "It is required that one clone the repository." (too formal)

### Terminology and Word Choice

#### Use Standard Technical Terms

✅ **Prefer**: terminal, command line
❌ **Avoid**: shell, console, command prompt (unless specifically referring to them)

✅ **Prefer**: repository
❌ **Avoid**: repo (except in code/commands like `git clone repo`)

✅ **Prefer**: Kubernetes
❌ **Avoid**: K8s, k8s (except in code/commands)

#### Define Acronyms on First Use

✅ **Good**: "An Architectural Decision Record (ADR) documents key decisions."
✅ **Good**: "Use gRPC (Google Remote Procedure Call) for inter-service communication."

#### Avoid Latin Abbreviations

❌ **Avoid**: e.g., i.e., etc., et al.
✅ **Prefer**: for example, that is, and so on, and others

### Headings and Structure

#### Use Descriptive, Task-Based Headings

✅ **Good**: "Configure authentication"
✅ **Good**: "Deploy to production"
❌ **Avoid**: "Configuration" (too vague)
❌ **Avoid**: "Deployment" (noun-based)

#### Follow Heading Hierarchy

- Use `#` for document title (only one per document)
- Use `##` for main sections
- Use `###` for subsections
- Don't skip levels (no `#` then `###`)

#### Use Sentence Case for Headings

✅ **Good**: "Set up your development environment"
❌ **Avoid**: "Set Up Your Development Environment"

Exceptions: Proper nouns and acronyms
✅ **Good**: "Configure Kafka topics"
✅ **Good**: "Set up OpenTelemetry tracing"

### Links

#### Use Descriptive Link Text

❌ **Avoid**: "Click [here](url) to see the guide."
❌ **Avoid**: "See [this page](url) for more information."
✅ **Prefer**: "See the [Kafka configuration guide](url)."
✅ **Prefer**: "For more information, see [Authentication methods](url)."

#### Link Text Should Make Sense Out of Context

✅ **Good**: "See [How to migrate to Kafka](url)"
❌ **Avoid**: "See [this guide](url)"

### Lists

#### Use Parallel Structure

✅ **Good**:

- Deploy the service
- Configure the database
- Test the endpoints

❌ **Avoid**:

- Deploy the service
- Database configuration
- You should test the endpoints

#### Introduce Lists with a Sentence

✅ **Good**: "To set up the service, complete these steps:"
❌ **Avoid**: Jumping directly to list without introduction

#### Choose the Right List Type

- **Numbered lists**: For sequential steps or priority order
- **Bulleted lists**: For unordered items
- **Definition lists**: For term/definition pairs (use tables or markdown definition lists)

### Tables

#### Use Tables for Comparison

✅ **Good use**: Comparing features, parameters, configurations
❌ **Avoid**: Using tables for lengthy prose or single-column data

#### Include Headers

Always include header row with clear column names.

✅ **Good**:

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `api_key` | string | Yes      | Your API key |

#### Keep Table Content Concise

- Use fragments, not full sentences
- Link to details rather than cramming into cells

### Code and Commands

#### Use Code Formatting

- Inline code: `` `variable` ``, `` `functionName()` ``
- Code blocks: Use fenced code blocks with language identifier

✅ **Good**:

```bash
kubectl apply -f deployment.yaml
```

✅ **Good**:

```javascript
const result = await fetchData();
```

#### Introduce Code Examples

✅ **Good**: "To deploy the service, run:"

```bash
kubectl apply -f service.yaml
```

❌ **Avoid**: Dropping code without context

#### Use Placeholders Consistently

✅ **Prefer**: `<project-id>`, `<api-key>`, `<username>`
❌ **Avoid**: Mixing styles: `{project-id}`, `PROJECT_ID`, `your-project`

Format: Angle brackets, lowercase, hyphens

```bash
gcloud projects create <project-id>
```

### Notices and Callouts

#### Use Standard Callout Types

- **Note**: Supplementary information
- **Caution**: Potential problems or important details
- **Warning**: Risk of data loss or security issues

✅ **Format**:

```markdown
**Note**: This feature is in beta.

**Caution**: Changing this setting affects all users.

**Warning**: This operation deletes all data permanently.
```

#### Start with the Callout Type

❌ **Avoid**: "You should note that this feature is in beta."
✅ **Prefer**: "**Note**: This feature is in beta."

### Accessibility

#### Use Descriptive Alt Text for Images

✅ **Good**: `![Architecture diagram showing three microservices](arch.png)`
❌ **Avoid**: `![diagram](arch.png)`

#### Don't Rely Solely on Color

When describing UI or diagrams, don't say "the red button" without additional context.
✅ **Good**: "Select the **Delete** button (marked in red)."

#### Use Proper Markdown Syntax

- Use `*` or `_` for emphasis, not CAPS
- Use headings for structure, not bold text
- Use lists for series of items

## Editing Workflow

### Step 1: Read and Understand

```bash
# Read the document
Read <file-path>

# Identify document type (using Diátaxis Classifier)
# - Tutorial, How-To, Reference, or Explanation
```

### Step 2: Check Structure

- [ ] Document has clear title (`#`)
- [ ] Headings follow hierarchy (`##`, `###`)
- [ ] Headings use sentence case
- [ ] Headings are task-based (for how-tos)
- [ ] Lists are introduced properly
- [ ] Code blocks have language identifiers

### Step 3: Edit for Voice and Tone

- [ ] Active voice used
- [ ] Second person (you/your) used
- [ ] Sentences are concise (< 25 words)
- [ ] Present tense when possible
- [ ] Professional but conversational

### Step 4: Check Terminology

- [ ] Consistent terms throughout
- [ ] Acronyms defined on first use
- [ ] No Latin abbreviations (e.g., i.e.)
- [ ] Standard technical terms used

### Step 5: Review Links and References

- [ ] Link text is descriptive
- [ ] No "click here" or "this page"
- [ ] Links work (check for 404s)

### Step 6: Validate Formatting

- [ ] Code uses proper formatting
- [ ] Placeholders use `<placeholder>` format
- [ ] Tables have headers
- [ ] Images have alt text
- [ ] Callouts use standard format

### Step 7: Check Global Audience

- [ ] No idioms or cultural references
- [ ] Simple, clear language
- [ ] No humor that doesn't translate

## Common Issues and Fixes

### Issue: Passive Voice

❌ **Before**: "The configuration file is created by the installer."
✅ **After**: "The installer creates the configuration file."

### Issue: Vague Links

❌ **Before**: "For more details, click [here](url)."
✅ **After**: "For more details, see [Configuration options](url)."

### Issue: Inconsistent Terminology

❌ **Before**: "Clone the repo... After cloning the repository... Once you've cloned the codebase..."
✅ **After**: "Clone the repository... After cloning the repository... Once you've cloned the repository..."

### Issue: Long Sentences

❌ **Before**: "After you've configured the API key in your environment variables and restarted the service to pick up the changes, you should be able to make authenticated requests to the endpoints."
✅ **After**: "Configure the API key in your environment variables. Restart the service to pick up the changes. You can now make authenticated requests to the endpoints."

### Issue: Latin Abbreviations

❌ **Before**: "Configure the following settings (e.g., timeout, retry, etc.)."
✅ **After**: "Configure settings such as timeout and retry."

### Issue: Non-Descriptive Headings

❌ **Before**: "## Setup"
✅ **After**: "## Set up your development environment"

### Issue: Unclear Placeholders

❌ **Before**: `gcloud projects create PROJECT_ID`
✅ **After**: `gcloud projects create <project-id>`

## Integration with context1000 Commands

When editing creates the need for new documentation:

### For New Guides

```bash
/context1000:guide "<Title>" --audience <role>
```

### For New Rules (Standards)

```bash
/context1000:rule "<Rule Title>" --severity <level> --scope <area>
```

### For Architectural Decisions

```bash
/context1000:adr "<Decision Title>" --status <status> --template madr --scope <area>
```

## Example Edit Session

### Before (Original Draft)

```markdown
# Kafka Setup

Setting up Kafka is easy. Simply download kafka, extract it, and run it.

e.g. you can download from the official site.

After downloading:

- extraction
- run zookeeper
- kafka broker can be started

Click [here](link) for config details.

Note that you need Java installed.
```

### After (Google Style Applied)

````markdown
# Set up Kafka

This guide shows you how to install and configure Apache Kafka.

## Prerequisites

Before you begin, ensure you have:

- Java 11 or later installed
- At least 4 GB of available RAM

## Download Kafka

1. Go to the [Apache Kafka downloads page](https://kafka.apache.org/downloads).
2. Download the latest stable release.

## Install Kafka

1. Extract the downloaded archive:
   ```bash
   tar -xzf kafka_<version>.tgz
   cd kafka_<version>
   ```
````

2. Start ZooKeeper:

   ```bash
   bin/zookeeper-server-start.sh config/zookeeper.properties
   ```

3. In a new terminal, start the Kafka broker:

   ```bash
   bin/kafka-server-start.sh config/server.properties
   ```

## Verify installation

To verify Kafka is running:

```bash
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

**Note**: For production configuration options, see [Kafka configuration reference](link).

## Next steps

- [Create your first Kafka topic](link)
- [Configure Kafka for production](link)

```

### Changes Made
1. ✅ Heading: Verb-based, sentence case
2. ✅ Added clear introduction sentence
3. ✅ Prerequisites section added
4. ✅ "Simply" removed (unnecessary word)
5. ✅ "e.g." replaced with proper introduction
6. ✅ Lists: Parallel structure, proper introduction
7. ✅ Links: Descriptive text instead of "click here"
8. ✅ Placeholders: `<version>` format
9. ✅ Callouts: Proper **Note** format
10. ✅ Code blocks: Language identifiers added
11. ✅ Active voice: "This guide shows you" (not passive)
12. ✅ Second person: "you have", "you begin"

## Quality Checklist

Before finishing an edit:

- [ ] Document follows Diátaxis framework (Tutorial/How-To/Reference/Explanation)
- [ ] Active voice used throughout
- [ ] Second person (you/your) used consistently
- [ ] Sentences are concise (< 25 words)
- [ ] Headings use sentence case and are descriptive
- [ ] Lists have parallel structure
- [ ] Links use descriptive text
- [ ] Code blocks have language identifiers
- [ ] Placeholders use `<placeholder>` format
- [ ] Acronyms defined on first use
- [ ] No Latin abbreviations (e.g., i.e., etc.)
- [ ] Consistent terminology throughout
- [ ] Images have alt text
- [ ] No idioms or cultural references
- [ ] Professional but conversational tone

## Integration Points

- **With Diátaxis Classifier**: Apply appropriate style for document type
- **With Crosslinker**: Ensure links use descriptive text
- **With Example Upgrader**: Format code examples consistently
- **With Glossary**: Ensure terminology consistency

## References

- Google Developer Documentation Style Guide: https://developers.google.com/style
- Google style guide highlights: https://developers.google.com/style/highlights
- Word list: https://developers.google.com/style/word-list
- Microsoft Writing Style Guide (similar principles): https://docs.microsoft.com/en-us/style-guide/
```
