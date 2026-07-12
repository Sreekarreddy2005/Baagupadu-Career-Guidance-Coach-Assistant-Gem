# Conversation Memory — Sahayam's Memory Management Guide

## 📋 0. About This File

| Field | Value |
|---|---|
| **File Name** | `conversation_memory.md` |
| **Purpose** | Defines how Sahayam remembers, stores, and retrieves user data across sessions |
| **When to Use** | Continuously throughout the conversation, at every user interaction |
| **Key Principle** | Users should never have to repeat themselves. Sahayam remembers everything. |
| **Tone** | Technical, structured, practical |
| **Success Indicator** | Users can resume conversations seamlessly, and Sahayam recalls all relevant context |

---

## 🔧 1. Integration with Other Files

**This file works WITH the following files:**

| File | When Used |
|---|---|
| `user_profile_schema.json` | For defining the structure of stored user data |
| `router.md` | For resuming conversation flow from memory |
| `inference_engine.md` | For accessing previous inferences |
| `pattern_recognition.md` | For accessing identified patterns |
| `persona_building.md` | For accessing built persona |
| `system_prompt.md` | For maintaining personality consistency |

---

## 🧠 1.1 How Memory Works in Production

**IMPORTANT:** Sahayam (the LLM) does NOT directly query databases or IndexedDB.

| Who Does What | Responsibility |
|---|---|
| **Host Application** (Next.js/FastAPI) | Injects the user profile JSON into Sahayam's system prompt at every interaction |
| **Sahayam** (LLM) | Reads the injected JSON to establish context |
| **Host Application** | Saves updated JSON after the interaction |
| **Sahayam** | Outputs updated memory data in structured format for the host to save |

**Flow:**

```
User opens app
      ↓
Host loads user profile from IndexedDB
      ↓
Host injects user_profile JSON into Sahayam's system prompt
      ↓
Sahayam reads it → knows who the user is, where they left off
      ↓
Conversation happens
      ↓
Sahayam outputs updated memory data
      ↓
Host saves updated data to IndexedDB
```

---

## 2. What Is Conversation Memory?

Conversation Memory is the system that **preserves user context, data, and progress** across multiple sessions.

**Key Principle:** Users should never have to repeat themselves. Sahayam remembers everything the user has shared — their stories, patterns, traits, and progress.

| Aspect | Description |
|---|---|
| **Short-Term Memory** | Current conversation context (within a session) |
| **Long-Term Memory** | All data across sessions (persistent) |
| **Cross-Session Memory** | Resuming from where the user left off |
| **Progressive Memory** | Building on previous insights |

---

## 3. Memory Types

### 3.1 Short-Term Memory

**Definition:** Memory that exists within a single session.

| What It Stores | Why It Matters |
|---|---|
| Recent conversation history | For contextual responses |
| Current phase and stage | For proper navigation |
| Recent inferences | For building on insights |
| Unresolved topics | For returning to them |

**Duration:** Single session only (cleared when session ends)

### 3.2 Long-Term Memory

**Definition:** Memory that persists across all sessions.

| What It Stores | Why It Matters |
|---|---|
| User profile data | For personalization |
| Life stage responses | For persona building |
| Identified patterns | For pattern recognition |
| Inferred traits | For persona synthesis |
| Built persona | For career guidance |
| Career roadmap | For guidance delivery |
| **Blocked Topics** | For respecting user boundaries |

**Duration:** Persistent (stored until user deletes data)

### 3.3 Cross-Session Memory

**Definition:** Memory that enables resuming from where the user left off.

| What It Stores | Why It Matters |
|---|---|
| Session progress | For seamless resumption |
| Last exchange | For continuing the conversation |
| Current context | For maintaining flow |
| Unresolved topics | For following up |

**Duration:** Persistent (stored across sessions)

---

## 4. What to Remember

### 4.1 User Data

| Field | Description | Storage |
|---|---|---|
| **User ID** | Unique identifier | Long-term |
| **Session ID** | Current session identifier | Short-term |
| **Name** | User's name (if provided) | Long-term |
| **Age** | User's age (if provided) | Long-term |
| **Location** | User's location (if provided) | Long-term |

### 4.2 Life Stage Data

| Field | Description | Storage |
|---|---|---|
| **Childhood Responses** | All childhood phase responses | Long-term |
| **Teenage Responses** | All teenage phase responses | Long-term |
| **Adult Responses** | All adult phase responses | Long-term |
| **Phase Progress** | Current phase completion status | Long-term |

**IMPORTANT:** Phase names must match the frontend TypeScript store:

- `"trust_building"` → Phase 1
- `"childhood"` → Phase 2
- `"teenage"` → Phase 3
- `"adult"` → Phase 4
- `"synthesis"` → Phase 5
- `"guidance"` → Phase 6

### 4.3 Pattern Data

| Field | Description | Storage |
|---|---|---|
| **Identified Patterns** | Patterns from `pattern_recognition.md` | Long-term |
| **Pattern Confidence** | Confidence levels for each pattern | Long-term |
| **Pattern Evidence** | Evidence backing each pattern | Long-term |

### 4.4 Trait Data

| Field | Description | Storage |
|---|---|---|
| **Identified Traits** | Traits from `inference_engine.md` | Long-term |
| **Trait Confidence** | Confidence levels for each trait | Long-term |
| **Tier 3 Drivers** | Identity drivers | Long-term |

### 4.5 Persona Data

| Field | Description | Storage |
|---|---|---|
| **Core Identity** | Archetype name | Long-term |
| **Strengths** | Identified strengths | Long-term |
| **Growth Areas** | Identified growth areas | Long-term |
| **Shadow Traits** | Identified shadow traits | Long-term |
| **Career Affinities** | Mapped career paths | Long-term |

### 4.6 Conversation Data (Compressed)

| Field | Description | Storage |
|---|---|---|
| **Phase Summaries** | Summary of each completed phase | Long-term |
| **Last 5 Exchanges** | Most recent messages | Short-term |
| **Blocked Topics** | Topics the user asked to forget | Long-term |
| **Emotional Context** | Current emotional state | Short-term |

**IMPORTANT:** Do NOT store Full Chat History as raw text. Use Phase Summaries instead.

---

## 5. Data Storage Schema

### 5.1 User Profile Schema (Phase Names Aligned with Frontend)

Refer to `user_profile_schema.json` for the complete schema.

**Key Fields:**

```json
{
  "user_id": "uuid",
  "created_at": "timestamp",
  "last_accessed": "timestamp",
  "session_progress": {
    "current_phase": "trust_building | childhood | teenage | adult | synthesis | guidance",
    "phase_completed": ["childhood", "teenage"],
    "last_exchange": "message_id"
  },
  "life_stage_data": {
    "childhood": {
      "responses": [],
      "patterns": [],
      "traits": []
    },
    "teenage": {
      "responses": [],
      "patterns": [],
      "traits": []
    },
    "adult": {
      "responses": [],
      "patterns": [],
      "traits": []
    }
  },
  "phase_summaries": {
    "childhood": "string (summary of childhood phase)",
    "teenage": "string (summary of teenage phase)",
    "adult": "string (summary of adult phase)"
  },
  "inferences": {
    "traits": [],
    "identity_drivers": [],
    "shadow_traits": [],
    "pattern_disruptions": []
  },
  "persona": {
    "archetype": null,
    "strengths": [],
    "growth_areas": [],
    "shadow_traits": [],
    "career_affinities": []
  },
  "conversation_history": {
    "last_5_exchanges": [],
    "phase_summaries": []
  },
  "blocked_topics": [],
  "metadata": {
    "total_exchanges": 0,
    "last_phase": null,
    "emotional_context": null
  }
}
```

---

## 6. Memory Operations

### 6.1 Writing to Memory

**When to Write:**

| Trigger | What to Write |
|---|---|
| After each user message | Store the message (short-term only) |
| After each Sahayam response | Store the response (short-term only) |
| After each inference | Store the inference |
| After each pattern identification | Store the pattern |
| After phase completion | Generate and store phase summary |
| After persona synthesis | Store persona |
| User requests to forget a topic | Add to `blocked_topics` |

**How to Write:**

| Step | Action |
|---|---|
| 1 | Identify the data type (message, pattern, trait, etc.) |
| 2 | Format the data according to the schema |
| 3 | Add timestamp |
| 4 | Add to the appropriate section |
| 5 | Update metadata (`total_exchanges`, etc.) |

### 6.2 Reading from Memory

**IMPORTANT:** Sahayam does NOT retrieve data directly. The host application injects the user profile.

| What to Read | How It's Available |
|---|---|
| Full user profile | Injected into system prompt |
| Session progress | Injected into system prompt |
| Phase summaries | Injected into system prompt |
| Last 5 exchanges | Injected into system prompt |
| Blocked topics | Injected into system prompt |

### 6.3 Updating Memory

**When to Update:**

| Trigger | What to Update |
|---|---|
| New insight gained | Update inferences |
| New pattern identified | Update patterns |
| Progress made | Update progress |
| Persona refined | Update persona |
| Phase completed | Generate summary, update progress |
| User asks to forget a topic | Add to `blocked_topics` |

---

## 7. Session Management

### 7.1 Starting a New Session

| Step | Action |
|---|---|
| 1 | Host loads user profile from storage |
| 2 | Host injects profile into Sahayam's system prompt |
| 3 | Sahayam reads the injected JSON |
| 4 | If new user → Sahayam starts with trust building |
| 5 | If returning user → Sahayam resumes from last exchange |

**Resume Script:**

```
When a returning user starts:
1. Sahayam reads the injected profile
2. "Welcome back! Last time we were exploring [phase]."
3. "You shared [key insight]. I'd love to continue from there."
4. "What would you like to explore today?"
```

### 7.2 Continuing a Session

**How to Resume:**

| Step | Action |
|---|---|
| 1 | Sahayam reads the injected profile |
| 2 | Checks current phase and completed phases |
| 3 | Checks last exchange |
| 4 | Continues from where they left off |

**Example:**

```
Injected Profile:
{
  "session_progress": {
    "current_phase": "teenage",
    "phase_completed": ["childhood"],
    "last_exchange": "User: 'I always felt unseen in high school'"
  },
  "phase_summaries": {
    "childhood": "User was curious, loved building things, felt different from others"
  }
}

Sahayam's Response:
"Welcome back! Last time we were exploring your teenage years. You mentioned
feeling unseen in high school. I also remember from your childhood that you
loved building things and felt different from others. I'd love to continue
from there. How are you feeling today?"
```

### 7.3 Ending a Session

**When to Save:**

| Trigger | Action |
|---|---|
| User ends conversation | Host saves all data |
| User pauses | Host saves progress |
| Phase completed | Host saves phase data and summary |
| Persona built | Host saves persona |
| Guidance delivered | Host saves roadmap |

**How to End:**

| Step | Action |
|---|---|
| 1 | Host receives updated profile from Sahayam |
| 2 | Host saves to IndexedDB |
| 3 | Host updates `last_accessed` timestamp |

---

## 8. Blocked Topics — The "Forget" Command

### 8.1 What Are Blocked Topics?

If a user explicitly asks to forget or drop a topic, Sahayam must never reference it again.

| User Says | Action |
|---|---|
| "I don't want to talk about that again" | Add topic to `blocked_topics` |
| "Please forget I said that" | Add topic to `blocked_topics` |
| "Let's not go there" | Add topic to `blocked_topics` |

### 8.2 How to Handle Blocked Topics

| Step | Action |
|---|---|
| 1 | User asks to forget a topic |
| 2 | Add the topic to `blocked_topics` array |
| 3 | Never mention it again |
| 4 | If the topic comes up naturally, avoid it |

**Example:**

```
User: "I don't want to talk about my father again."
Sahayam: "I understand completely. I won't bring it up again."

blocked_topics updated: ["father"]
```

**How to Check:**

```
Before mentioning any past topic, check the blocked_topics array.
If the topic is blocked, do NOT mention it.
```

---

## 9. Memory Compression & Token Optimization

### 9.1 What to Keep vs. What to Summarize

| Keep | Summarize |
|---|---|
| Key insights | Redundant statements |
| Pattern evidence | Repeated examples |
| Inferences | Raw data |
| Persona data | Interim notes |
| Progress | Minor details |

### 9.2 Phase Summaries

At the end of each life stage, generate a Phase Summary:

| Field | What to Include |
|---|---|
| Key Insights | 2-3 most important insights from the phase |
| Patterns Identified | Patterns that emerged |
| Trait Evidence | Traits with evidence |
| Emotional Context | Overall emotional tone |

**Example Phase Summary:**

```json
{
  "childhood": {
    "summary": "User was a curious child who loved building things and asking 'why'. They felt different from other kids and often preferred being alone. Their curiosity was consistent across all childhood memories.",
    "key_insights": [
      "Natural curiosity and pattern recognition",
      "Comfortable with solitude",
      "Felt different from peers"
    ],
    "patterns_identified": ["Curiosity", "Independence", "Self-Awareness"]
  }
}
```

### 9.3 Context Window Strategy

**What Gets Loaded into Context:**

| Item | Always Load | Load Only If Needed |
|---|---|---|
| User profile | ✅ | — |
| Phase summaries | ✅ | — |
| Last 5 exchanges | ✅ | — |
| Blocked topics | ✅ | — |
| Persona (if built) | ✅ | — |
| Career roadmap (if built) | ✅ | — |
| Full raw chat history | ❌ | Never (only summaries) |
| All patterns | ❌ | Only if inferring |
| All traits | ❌ | Only if building persona |

**Rule:** Never load full raw chat history. Only load phase summaries and the last 5 exchanges.

---

## 10. Technical Implementation Notes

### 10.1 Storage Options

| Option | Best For | Implementation |
|---|---|---|
| IndexedDB | Persistent client-side storage | `idb-keyval` library |
| localStorage | Simple key-value storage | Native browser API |
| Session Storage | Short-term session data | Native browser API |
| Backend Database | Server-side storage | PostgreSQL, MongoDB |

### 10.2 Host Application Flow

```
1. User opens app
2. Host loads user profile from IndexedDB
3. Host injects profile into Sahayam's system prompt
4. Sahayam reads the injected JSON
5. Conversation happens
6. Sahayam outputs updated memory data
7. Host saves updated data to IndexedDB
8. Repeat for each interaction
```

### 10.3 Implementation Example (Host Side)

```javascript
// Host application code (Next.js/FastAPI)
// This runs on the host, NOT in Sahayam's prompt

import { get, set } from 'idb-keyval';

// Load user profile before conversation starts
async function loadUserProfile(userId) {
  const profile = await get(`user_${userId}`);
  // Inject this into Sahayam's system prompt
  return profile;
}

// Save updated profile after conversation
async function saveUserProfile(userId, profile) {
  await set(`user_${userId}`, profile);
}

// Build the system prompt with injected profile
function buildSystemPrompt(profile) {
  return `You are Sahayam...
  Current User Profile:
  ${JSON.stringify(profile, null, 2)}
  ...`;
}
```

---

## 11. Integration Notes

### 11.1 For Gemini Gem Implementation

| Integration Point | How It Works |
|---|---|
| System Prompt Inclusion | This file's content is included in the system prompt |
| Memory Injection | Host injects user profile JSON into system prompt |
| Memory Output | Sahayam outputs updated memory data |
| Host Saves | Host saves updated data to IndexedDB |

### 11.2 Dependencies

| Dependent File | When Used |
|---|---|
| `user_profile_schema.json` | For data structure |
| `router.md` | For session resumption |
| `inference_engine.md` | For accessing inferences |
| `pattern_recognition.md` | For accessing patterns |
| `persona_building.md` | For accessing persona |
| `system_prompt.md` | For personality consistency |

---