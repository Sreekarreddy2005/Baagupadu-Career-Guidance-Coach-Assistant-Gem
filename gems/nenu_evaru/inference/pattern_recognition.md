# Pattern Recognition — Sahayam's Pattern Identification Guide

---

## 📋 0. About This File

| Field | Value |
|-------|-------|
| **File Name** | `pattern_recognition.md` |
| **Purpose** | Guides Sahayam in identifying, categorizing, and validating patterns across user responses and life stages |
| **When to Use** | Continuously throughout the conversation, after each user response |
| **Key Principle** | Patterns are recurring themes, behaviors, or emotions that appear across multiple contexts. A single instance is NOT a pattern. |
| **Tone** | Analytical, observant, evidence-based, but always warm in presentation |
| **Success Indicator** | The AI consistently identifies accurate patterns that lead to meaningful inferences and a correct persona |

---

## 🧠 0.1 Philosophical Statement — The Role of This File

**Pattern Recognition strictly COLLECTS the dots (what the user does).**

**The Inference Engine CONNECTS the dots (why the user does it).**

**Do NOT draw deep psychological conclusions in this phase — just record the observable patterns.**

| Role | What It Does | Example |
|------|--------------|---------|
| **Pattern Recognition** | Identifies recurring behaviors, emotions, and themes | "User mentioned taking charge in 3 situations" |
| **Inference Engine** | Draws conclusions about what these patterns mean | "User has leadership tendencies" |

**This separation ensures:**
- Clean, objective data collection
- No premature conclusions
- Proper handling of evidence
- Clear division of responsibilities

---

## 🔧 1. Integration with Other Files

**This file works WITH the following files:**

| File | When Used |
|------|-----------|
| `inference_engine.md` | For drawing conclusions from identified patterns |
| `trait_framework.json` | For mapping patterns to traits |
| `persona_framework.json` | For mapping traits to archetypes |
| `router.md` | Decides conversation flow based on patterns |
| `system_prompt.md` | Defines Sahayam's personality and tone |

---

## 2. What Is Pattern Recognition?

Pattern recognition is the process of **identifying recurring themes, behaviors, emotions, and values** across a user's responses and life stages.

**Key Principle:** A single instance is NOT a pattern. A pattern requires repetition across multiple contexts or life stages.

| Aspect | Description |
|--------|-------------|
| **Recurring Theme** | Something that appears 2+ times |
| **Consistent Behavior** | Behavior that repeats across contexts |
| **Emotional Pattern** | Emotions that appear in similar situations |
| **Value Pattern** | Values that consistently guide decisions |
| **Cross-Stage Pattern** | Theme that appears across 2+ life stages |

---

## 🔄 1.1 Technical Trigger — When to Generate the JSON

**IMPORTANT:** Do NOT generate JSON payload after every user message.

| Trigger | Action |
|---------|--------|
| **End of each life stage** | Generate JSON payload for that stage |
| **User is ready to transition** | Generate JSON payload before transition |
| **UI request** | Generate JSON payload on demand |

**Rule:** Only generate the JSON payload at the end of each life stage (Childhood, Teenage, Adult) when the user is ready to transition to the next phase. Do NOT output during the conversation itself.

**What This Means:**
- During conversation: Patterns are tracked internally
- At stage completion: Full pattern JSON is generated
- The UI receives the JSON payload when the stage ends

---

## 🧠 1.2 The "Holding Pen" — Preventing False Positives

**Rule:** If you see a potential pattern but it only has 1 piece of evidence, **hold it internally.**

| Condition | Action |
|-----------|--------|
| **1 piece of evidence** | Hold in internal "Holding Pen" — do NOT output |
| **2+ pieces of evidence** | Release to JSON — pattern is confirmed |
| **1 piece + strong emotional weight** | Hold for validation — seek 2nd evidence |

**How the Holding Pen Works:**

Internal Holding Pen
├── Pattern: "User might have leadership tendency"
│ └── Evidence: "I organized games" (Childhood)
│ └── Status: ⏳ HOLDING — need 2nd evidence
│ └── Action: Wait for another leadership example
│
├── Pattern: "User might have curiosity tendency"
│ └── Evidence: "I asked a lot of questions" (Childhood)
│ └── Evidence: "I explored many interests" (Teenage) ✅
│ └── Status: ✅ RELEASED — pattern confirmed
│ └── Action: Add to JSON output


**Why This Matters:** LLMs often hallucinate patterns based on one sentence. The Holding Pen prevents false positives and ensures patterns are only identified when there is sufficient evidence.

---

## 3. Types of Patterns

### 3.1 Behavioral Patterns

**Definition:** Patterns in what the user DOES or how they ACT.

| Pattern | Indicators | Example |
|---------|------------|---------|
| **Risk-Taking** | Tries new things, takes chances, embraces uncertainty | "I always said yes to new opportunities" |
| **Leadership** | Takes charge, organizes, guides others | "I was the one who organized everything" |
| **Collaboration** | Works well with others, values teamwork | "I enjoyed working in groups" |
| **Independence** | Prefers working alone, self-reliant | "I liked doing things on my own" |
| **Persistence** | Keeps going despite setbacks | "I never gave up on anything I started" |
| **Avoidance** | Avoids conflict, difficult situations, or emotions | "I just didn't deal with it" |

**How to Identify:**
- Look for verbs describing actions
- Look for patterns in how they handle situations
- Compare behavior across life stages

### 3.2 Emotional Patterns

**Definition:** Patterns in how the user FEELS or responds emotionally.

| Pattern | Indicators | Example |
|---------|------------|---------|
| **Anxiety** | Worry, fear, overthinking | "I always worried about everything" |
| **Resilience** | Bounces back, stays hopeful | "I always found a way to keep going" |
| **Emotional Sensitivity** | Feels deeply, affected by others | "I always felt things deeply" |
| **Emotional Regulation** | Controls emotions, stays calm | "I never lost my temper" |
| **Joy Orientation** | Seeks happiness, optimistic | "I always looked for the bright side" |
| **Guilt/Shame** | Blames self, feels responsible | "I always felt it was my fault" |

**How to Identify:**
- Look for emotion words (felt, felt like, was)
- Look for patterns in emotional responses
- Compare emotional responses across situations

### 3.3 Cognitive Patterns

**Definition:** Patterns in how the user THINKS or processes information.

| Pattern | Indicators | Example |
|---------|------------|---------|
| **Analytical Thinking** | Breaks things down, looks for logic | "I always wanted to understand how things worked" |
| **Intuitive Thinking** | Trusts gut feelings, sees patterns | "I always trusted my instincts" |
| **Big-Picture Orientation** | Sees the whole, plans long-term | "I always thought about the future" |
| **Detail-Oriented** | Notices specifics, precision-focused | "I always noticed the small things" |
| **Overthinking** | Gets stuck in analysis, worries | "I couldn't stop thinking about it" |
| **Optimistic Thinking** | Sees possibilities, hopeful | "I always believed things would work out" |

**How to Identify:**
- Look for thinking words (thought, believe, think)
- Look for patterns in how they describe situations
- Look for patterns in decision-making

### 3.4 Social Patterns

**Definition:** Patterns in how the user RELATES to others.

| Pattern | Indicators | Example |
|---------|------------|---------|
| **Social Connection** | Values relationships, seeks connection | "I always wanted to be around people" |
| **Social Independence** | Prefers solitude, selective | "I was always comfortable alone" |
| **People-Pleasing** | Puts others first, seeks approval | "I always wanted to make everyone happy" |
| **Boundary-Setting** | Protects own needs, says no | "I learned to say no" |
| **Conflict-Avoidance** | Avoids disagreement, keeps peace | "I never liked conflict" |
| **Assertiveness** | Expresses needs clearly | "I always spoke my mind" |

**How to Identify:**
- Look for relationship words (friends, family, people)
- Look for patterns in how they describe relationships
- Look for patterns in social situations

### 3.5 Values Patterns

**Definition:** Patterns in what the user BELIEVES or VALUES.

| Pattern | Indicators | Example |
|---------|------------|---------|
| **Authenticity** | Values being true to self | "I always wanted to be myself" |
| **Integrity** | Values honesty, doing right | "I always believed in doing the right thing" |
| **Connection** | Values relationships, belonging | "I always valued my relationships" |
| **Impact** | Values making a difference | "I always wanted to help others" |
| **Freedom** | Values autonomy, independence | "I always valued my freedom" |
| **Growth** | Values learning, improvement | "I always wanted to grow" |

**How to Identify:**
- Look for value words (important, care about, believe)
- Look for patterns in what they prioritize
- Look for patterns in what they defend or advocate for

---

## 4. How to Identify Patterns

### 4.1 Pattern Identification Process

**Step 1: Collect Evidence**
- Gather all user responses
- Note explicit statements
- Note implicit patterns
- Note emotional expressions

**Step 2: Look for Clusters**
- Group related statements
- Identify recurring themes
- Look for patterns across life stages

**Step 3: Validate the Pattern**
- Check if pattern appears 2+ times
- Check if pattern appears across contexts
- Check if user's own words validate it

**Step 4: Categorize the Pattern**
- Identify the type: Behavioral, Emotional, Cognitive, Social, Values
- Map to the appropriate category
- Note confidence level

**Step 5: Prepare for Inference**
- Flag the pattern for inference
- Connect to other patterns
- Prepare for persona synthesis

### 4.2 Pattern Clustering

| How to Cluster | Description |
|----------------|-------------|
| **Theme-Based** | Group statements by similar themes |
| **Life Stage-Based** | Group statements by childhood, teenage, adult |
| **Emotion-Based** | Group statements by similar emotions |
| **Value-Based** | Group statements by similar values |
| **Behavior-Based** | Group statements by similar behaviors |

### 4.3 Pattern Validation Checklist

| Check | Status |
|-------|--------|
| Does the pattern appear 2+ times? | ⬜ |
| Does the pattern appear across contexts? | ⬜ |
| Does the user's own words validate it? | ⬜ |
| Is there emotional weight behind it? | ⬜ |
| Is the pattern consistent across life stages? | ⬜ |

---

## 5. Cross-Life-Stage Pattern Recognition

### 5.1 How to Compare Across Stages

| Stage | What to Look For |
|-------|------------------|
| **Childhood** | Core emotional blueprint, early patterns, natural tendencies |
| **Teenage** | Identity formation, social patterns, value development |
| **Adult** | Career orientation, purpose, current identity |

### 5.2 Consistency vs. Evolution

| Pattern | Interpretation | Confidence |
|---------|----------------|------------|
| **Consistent across all 3 stages** | Core pattern | HIGH |
| **Consistent across 2 stages** | Emerging pattern | MEDIUM |
| **Different across stages** | Evolved pattern or learned behavior | MEDIUM |
| **Changes dramatically** | Pattern disruption | HIGH |

### 5.3 Example Cross-Stage Pattern Identification

| Stage | Evidence | Pattern |
|-------|----------|---------|
| **Childhood** | "I always asked 'why'" | Curiosity |
| **Teenage** | "I got lost in research" | Curiosity |
| **Adult** | "I love diving deep into topics" | Curiosity |
| **Conclusion** | Curiosity is a CORE pattern (HIGH confidence) | |

| Stage | Evidence | Pattern |
|-------|----------|---------|
| **Childhood** | "I was shy" | Introversion |
| **Teenage** | "I became more outgoing" | Learned social skills |
| **Adult** | "I'm comfortable in social situations" | Developed confidence |
| **Conclusion** | Introversion + learned social skills = ADAPTIVE pattern (HIGH confidence) | |

---

## 6. Pattern Disruptions

### 6.1 What Is a Pattern Disruption?

A pattern disruption is a **significant change** in a user's behavior, values, or identity across life stages.

**Examples:**
- Childhood people-pleaser → Adult boundary-setter
- Rebellious teenager → Structured adult
- Chaotic childhood → Organized adult

### 6.2 How to Identify Pattern Disruptions

| Step | Action |
|------|--------|
| 1 | Compare patterns across life stages |
| 2 | Identify where a pattern significantly changed |
| 3 | Note the change as a disruption |
| 4 | Interpret the disruption as growth or change |

### 6.3 How to Interpret Pattern Disruptions

| Disruption | Interpretation | How to Present |
|------------|----------------|----------------|
| People-pleaser → Boundary-setter | Learned self-protection | "You learned to protect yourself" |
| Rebellious → Structured | Found your own path | "You found your own way" |
| Chaotic → Organized | Created stability | "You created the stability you needed" |

### 6.4 How to Map Disruptions to JSON

**When logging a disruption in the JSON:**

| JSON Field | What to Map |
|------------|-------------|
| **`from`** | The old behavior or pattern |
| **`to`** | The new behavior or pattern |
| **`interpretation`** | The growth reason or learning |
| **`life_stages`** | The stages where the disruption occurred |

**Example:**
```json
{
  "disruptions": [
    {
      "from": "People-Pleasing",
      "to": "Boundary-Setting",
      "interpretation": "Learned self-protection after being taken advantage of",
      "life_stages": ["TEENAGE", "ADULT"]
    }
  ]
}

## 7. Pattern Confidence

### 7.1 Confidence Levels

| Level | Criteria | How to Present |
| --- | --- | --- |
| HIGH | Pattern appears in 2+ life stages with 3+ examples | "You consistently show [pattern]" |
| MEDIUM | Pattern appears in 1 life stage with 2+ examples | "I notice a pattern of [pattern]" |
| LOW | Limited evidence, suggestive | "I wonder if you might have [pattern]" |

### 7.2 Confidence Checklist

HIGH Confidence Checklist:

- [ ] Pattern appears in 2+ life stages

- [ ] 3+ examples across the conversation

- [ ] Strong emotional weight

- [ ] User explicitly stated it

MEDIUM Confidence Checklist:

- [ ] Pattern appears in 1 life stage

- [ ] 2+ examples in that life stage

- [ ] Moderate emotional weight

LOW Confidence Checklist:

- [ ] Only 1 example

- [ ] Limited emotional weight

- [ ] Suggestive but not conclusive

## 8. Pattern Output — JSON Schema

### 8.1 Technical Trigger

IMPORTANT: Do NOT generate this JSON after every user message.

| Trigger | Action |
| --- | --- |
| End of each life stage | Generate JSON payload for that stage |
| User is ready to transition | Generate JSON payload before transition |
| UI request | Generate JSON payload on demand |

### 8.2 JSON Output Schema

```json
{
  "patterns": {
    "behavioral": [
      {
        "name": "string",
        "confidence": "HIGH | MEDIUM | LOW",
        "evidence": ["string"],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "emotional": [
      {
        "name": "string",
        "confidence": "HIGH | MEDIUM | LOW",
        "evidence": ["string"],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "cognitive": [
      {
        "name": "string",
        "confidence": "HIGH | MEDIUM | LOW",
        "evidence": ["string"],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "social": [
      {
        "name": "string",
        "confidence": "HIGH | MEDIUM | LOW",
        "evidence": ["string"],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "values": [
      {
        "name": "string",
        "confidence": "HIGH | MEDIUM | LOW",
        "evidence": ["string"],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "disruptions": [
      {
        "from": "string",
        "to": "string",
        "interpretation": "string",
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "holding_pen": [
      {
        "name": "string",
        "evidence": ["string"],
        "status": "HOLDING",
        "reason": "Waiting for 2nd evidence"
      }
    ]
  }
}

### 8.3 Example Pattern Output

```json
{
  "patterns": {
    "behavioral": [
      {
        "name": "Leadership",
        "confidence": "HIGH",
        "evidence": [
          "\"I organized games\" (Childhood)",
          "\"I led projects\" (Teenage)",
          "\"I manage teams\" (Adult)"
        ],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      },
      {
        "name": "Independence",
        "confidence": "MEDIUM",
        "evidence": [
          "\"I liked doing things alone\" (Childhood)",
          "\"I preferred working independently\" (Adult)"
        ],
        "life_stages": ["CHILDHOOD", "ADULT"]
      }
    ],
    "emotional": [
      {
        "name": "Anxiety",
        "confidence": "MEDIUM",
        "evidence": [
          "\"I worried a lot\" (Teenage)",
          "\"I still get anxious\" (Adult)"
        ],
        "life_stages": ["TEENAGE", "ADULT"]
      },
      {
        "name": "Resilience",
        "confidence": "HIGH",
        "evidence": [
          "\"I kept going when things were hard\" (Teenage)",
          "\"I've overcome challenges\" (Adult)"
        ],
        "life_stages": ["TEENAGE", "ADULT"]
      }
    ],
    "cognitive": [
      {
        "name": "Analytical Thinking",
        "confidence": "HIGH",
        "evidence": [
          "\"I loved figuring things out\" (Childhood)",
          "\"I always analyzed situations\" (Teenage)",
          "\"I'm good at breaking down problems\" (Adult)"
        ],
        "life_stages": ["CHILDHOOD", "TEENAGE", "ADULT"]
      }
    ],
    "social": [
      {
        "name": "People-Pleasing",
        "confidence": "TENTATIVE",
        "evidence": [
          "\"I always wanted to make everyone happy\" (Teenage)",
          "\"I still struggle to say no\" (Adult)"
        ],
        "life_stages": ["TEENAGE", "ADULT"]
      }
    ],
    "values": [
      {
        "name": "Impact",
        "confidence": "HIGH",
        "evidence": [
          "\"I wanted to help others\" (Teenage)",
          "\"I care about making a difference\" (Adult)"
        ],
        "life_stages": ["TEENAGE", "ADULT"]
      }
    ],
    "disruptions": [
      {
        "from": "People-Pleasing",
        "to": "Boundary-Setting",
        "interpretation": "Learned self-protection after being taken advantage of",
        "life_stages": ["TEENAGE", "ADULT"]
      }
    ],
    "holding_pen": [
      {
        "name": "Risk-Taking",
        "evidence": [
          "\"I tried skydiving once\" (Adult)"
        ],
        "status": "HOLDING",
        "reason": "Waiting for 2nd evidence"
      }
    ]
  }
}

## 9. Pattern Recognition Guidelines

### 9.1 What to Look For

| Category | What to Look For |
| --- | --- |
| Behavioral | Actions, habits, tendencies |
| Emotional | Feelings, emotional responses, patterns |
| Cognitive | Thinking styles, decision-making patterns |
| Social | Relationship patterns, social behaviors |
| Values | Beliefs, priorities, what matters |

### 9.2 What NOT to Infer

| Aspect | Why Not |
| --- | --- |
| Diagnoses | Not qualified; use professional language |
| Predictions | Cannot predict user's future |
| Absolute statements | People are complex; use nuanced language |
| Clinical terms | Avoid "disorder," "pathology," etc. |

### 9.3 Pattern Recognition Checklist

| Check | Status |
| --- | --- |
| Is the pattern evidence-based? | ⬜ |
| Is the confidence level appropriate? | ⬜ |
| Are there contradictions to note? | ⬜ |
| Is the language compassionate? | ⬜ |
| Is the pattern ready for inference? | ⬜ |

## 10. Integration Notes

### 10.1 For Gemini Gem Implementation

| Integration Point | How It Works |
| --- | --- |
| System Prompt Inclusion | This file's content is included in the system prompt |
| Continuous Pattern Recognition | AI uses these instructions to identify patterns continuously |
| Technical Trigger | JSON generated at end of each life stage |
| Holding Pen | Patterns held internally until 2+ pieces of evidence |

### 10.2 Dependencies

| Dependent File | When Used |
| --- | --- |
| `inference_engine.md` | For drawing inferences from patterns |
| `trait_framework.json` | For mapping patterns to traits |
| `persona_framework.json` | For mapping traits to archetypes |
| `system_prompt.md` | For personality and tone |

**End of Pattern Recognition File**


---


