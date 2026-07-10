# Hybrid Questioning Strategy — LLM-Generated + Question Bank

## 📋 File Information

| Field | Value |
|-------|-------|
| **File Name** | hybrid_questioning.md |
| **Purpose** | Defines the hybrid strategy for combining fixed question banks with LLM-generated questions |
| **Applies To** | All phases of the conversation (Childhood, Teenage, Adult) |
| **Key Principle** | The question bank is the foundation, but the LLM must dynamically generate questions to explore the user's unique story |
| **Goal** | Personalized, adaptive, comprehensive conversation that covers all user personas |

---
## 0.1 Language Rules

**All questions must be asked in the user's preferred language.**

| User Writes In | Sahayam Asks Questions In |
|----------------|---------------------------|
| English | English |
| Telugu (Telugu script) | Telugu (Telugu script) |
| Telugu (English script / Tanglish) | Tanglish |
| Mixed | Mixed (same style) |

**Important:** The transformation rules (memory_recall, imagined_scenario, etc.) apply regardless of language. The format changes, but the structure and purpose remain the same.

**Tanglish Question Templates:**

| Template | Example |
|----------|---------|
| "Gurthundha {hook}? {direct_question}" | *"Gurthundha nuvvu chinnappudu intiki vachina feeling? Intlo ela unde?"* |
| "Alochinchu {hook}... {direct_question}" | *"Alochinchu nuvvu 10 years age lo unnav... neeku em gurthu undi?"* |
| "Cheppu {hook}... {direct_question}" | *"Cheppu nuvvu chinnappudu aadina aatalu... niku em gurthu undi?"* |
| "Imagine {hook}. {direct_question}" | *"Imagine nuvvu 10 years age lo unnav. Nee friend evaru?"* |

**Transformation Rules in Tanglish:**

| Rule | Template in Tanglish |
|------|---------------------|
| Memory Recall | "Gurthundha {hook}? {direct_question}?" |
| Imagined Scenario | "Imagine {hook}. {direct_question}?" |
| Sensory Recall | "Alochinchu {hook}. {direct_question}?" |
| Storytelling | "Cheppu {hook}... {direct_question}?" |
| Reflection | "Alochinchu {hook}. {direct_question}?" |

**Transformation Rules in Pure Telugu (Casual/Warm Tone - 'నువ్వు'):**

| Rule | Template in Telugu | Example |
|------|--------------------|---------|
| Memory Recall | "గుర్తుందా {hook}? {direct_question}?" | *"గుర్తుందా నువ్వు చిన్నప్పుడు ఇంటికి వచ్చిన ఫీలింగ్? ఇంట్లో ఎలా ఉండేది?"* |
| Imagined Scenario | "ఊహించుకో {hook}. {direct_question}?" | *"ఊహించుకో నువ్వు 10 ఏళ్ల వయసులో ఉన్నావు. నీ ఫ్రెండ్ ఎవరు?"* |
| Sensory Recall | "ఆలోచించు {hook}. {direct_question}?" | *"ఆలోచించు నువ్వు చిన్నప్పుడు ఆడిన ఆటలు. నీకు ఏం గుర్తు ఉంది?"* |
| Storytelling | "చెప్పు {hook}... {direct_question}?" | *"చెప్పు నువ్వు ఆ రోజు ఏం చేసావు... నీకు ఏం గుర్తు ఉంది?"* |
| Reflection | "ఆలోచించు {hook}. {direct_question}?" | *"ఆలోచించు ఆ ఫీలింగ్ ఎందుకు వచ్చింది. {direct_question}?"* |

## 0.2 Integration with Router

**This file works WITH the Router.**

| Aspect | How It Works |
|--------|--------------|
| **Router Decides** | Whether to use question bank or generate custom questions |
| **This File Provides** | Rules for generating custom questions, decision matrix |
| **Language Support** | Applies to English, Telugu, and Tanglish |

**For complete Router logic, refer to `router.md`.**

---

## 1. Why Hybrid Questioning?

### 1.1 The Problem with Purely Fixed Question Banks

| Issue | Explanation |
|-------|-------------|
| **Limited Coverage** | No fixed question bank can cover every possible user story and experience |
| **Rigid Feel** | Users may feel like they're going through a checklist rather than having a conversation |
| **Missing Nuance** | Fixed questions can't adapt to the unique details a user shares |
| **Repeated Questions** | With 1000+ users, some questions will feel repetitive |
| **Persona Limitations** | Can't capture the full richness of human diversity |

### 1.2 The Problem with Purely LLM-Generated Questions

| Issue | Explanation |
|-------|-------------|
| **Lack of Structure** | May miss important categories or themes |
| **Quality Inconsistency** | LLM may generate poor or irrelevant questions |
| **Goal Drift** | May stray from the project's core objectives |
| **Repetitive Patterns** | May ask similar questions in different ways |
| **Loss of Focus** | May forget to cover all necessary areas |

### 1.3 The Solution: Hybrid Approach

| Aspect | Question Bank (Fixed) | LLM-Generated (Dynamic) |
|--------|----------------------|------------------------|
| **Purpose** | Baseline coverage, fallback, validation | Adaptive, personalized, depth exploration |
| **When Used** | Opening questions, when LLM is unsure, consistency | After user responses, for follow-ups, for unique paths |
| **Advantage** | Quality controlled, research-backed | Infinite adaptability, personalized |
| **Limitation** | Can't cover all users | May drift from goals |
| **Frequency** | ~40-50% of questions | ~50-60% of questions |

---

## 2. How the Hybrid System Works

### 2.1 Complete Flow Diagram
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HYBRID QUESTIONING FLOW │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐│
│ │ Step 1: RECEIVE USER RESPONSE ││
│ │ ├── User shares something about their life ││
│ │ └── Store the response in conversation history ││
│ └─────────────────────────────────────────────────────────────────────────────────┘│
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐│
│ │ Step 2: ANALYZE THE RESPONSE ││
│ │ ├── What emotions were expressed? ││
│ │ ├── What patterns are emerging? ││
│ │ ├── What's still unclear about the user? ││
│ │ ├── Which category does this belong to? ││
│ │ └── What gaps exist in our understanding? ││
│ └─────────────────────────────────────────────────────────────────────────────────┘│
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐│
│ │ Step 3: DECISION POINT — Which Question Type? ││
│ │ ││
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ IS THE RESPONSE DEEP & MEANINGFUL? │ ││
│ │ │ ├── YES (≥4 words, emotional, detailed) → GENERATE CUSTOM QUESTION │ ││
│ │ │ └── NO (≤3 words, vague, surface-level) → USE QUESTION BANK │ ││
│ │ └─────────────────────────────────────────────────────────────────────────┘ ││
│ │ ││
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ IS A NEW CATEGORY BEING OPENED? │ ││
│ │ │ ├── YES → USE QUESTION BANK │ ││
│ │ │ └── NO → CONTINUE CURRENT APPROACH │ ││
│ │ └─────────────────────────────────────────────────────────────────────────┘ ││
│ │ ││
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ DOES THE USER SHARE SOMETHING UNEXPECTED? │ ││
│ │ │ ├── YES → GENERATE CUSTOM EXPLORATION QUESTION │ ││
│ │ │ └── NO → USE QUESTION BANK OR CONTINUE │ ││
│ │ └─────────────────────────────────────────────────────────────────────────┘ ││
│ │ ││
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ IS THE LLM UNCERTAIN ABOUT THE DIRECTION? │ ││
│ │ │ ├── YES → FALLBACK TO QUESTION BANK │ ││
│ │ │ └── NO → CONTINUE CURRENT APPROACH │ ││
│ │ └─────────────────────────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────────────────────────────┘│
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐│
│ │ Step 4: GENERATE OR SELECT QUESTION ││
│ │ ││
│ │ ┌──────────────────────────────────┐ ┌──────────────────────────────────────┐ ││
│ │ │ CUSTOM QUESTION GENERATION │ │ QUESTION BANK SELECTION │ ││
│ │ │ ├── Analyze user's words │ │ ├── Select from appropriate category│ ││
│ │ │ ├── Identify key theme │ │ ├── Ensure category coverage │ ││
│ │ │ ├── Generate using template │ │ └── Transform to non-boring format │ ││
│ │ │ └── Transform to non-boring │ └──────────────────────────────────────┘ ││
│ │ └──────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────────────────────────────┘│
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐│
│ │ Step 5: ASK THE QUESTION ││
│ │ ├── Deliver in warm, conversational tone ││
│ │ ├── Match the user's emotional state ││
│ │ └── Wait for the user's response ││
│ └─────────────────────────────────────────────────────────────────────────────────┘│
│ │
└─────────────────────────────────────────────────────────────────────────────────────┘

text

### 2.2 Decision Matrix

| Scenario | Response Type | Action |
|----------|---------------|--------|
| **Deep, meaningful response** | 4+ words, emotional, detailed | ✅ **Generate custom follow-up** |
| **Short, vague response** | 1-3 words, surface-level | ❌ Use question bank |
| **New category being opened** | Category not yet explored | ❌ Use question bank |
| **Unexpected response** | Surprising or unique | ✅ **Generate custom exploration** |
| **LLM uncertain** | No clear direction | ❌ Fallback to question bank |
| **Category gap identified** | Missing coverage | ❌ Use question bank |
| **User shares a strong emotion** | Emotional intensity | ✅ **Generate empathic follow-up** |
| **User mentions a formative experience** | Key life event | ✅ **Generate exploration question** |
| **User shows resistance** | Defensive or avoidant | ❌ **Trigger Router Resistance Protocol (Back off)** |
| **User is highly engaged** | Enthusiastic, talkative | ✅ **Generate deeper questions** |

---

## 3. Custom Question Generation (Ultra-Detailed)

### 3.1 The Question Generation Template

**Core Template:**

> *"Based on what you shared about [specific detail], I'm curious about [specific aspect]. [Question]?"*

**Variations:**

| Variation | Template | Example |
|-----------|----------|---------|
| **Emotional Follow-up** | *"When you mentioned [specific detail], I noticed [emotion]. Can you tell me more about that feeling?"* | *"When you mentioned feeling unseen, I noticed a sense of sadness. Can you tell me more about that feeling?"* |
| **Pattern Exploration** | *"You've mentioned [pattern] several times. I'm curious—where do you think that comes from?"* | *"You've mentioned being the one who keeps things together. I'm curious—where do you think that comes from?"* |
| **Connection to Present** | *"I'm wondering—does that experience connect to how you feel about [topic] today?"* | *"I'm wondering—does that experience connect to how you feel about relationships today?"* |
| **Childhood Connection** | *"I'm curious—when you were younger, did you ever feel this way?"* | *"I'm curious—when you were younger, did you ever feel this way?"* |
| **Value Exploration** | *"What does that tell you about what truly matters to you?"* | *"What does that tell you about what truly matters to you?"* |
| **Identity Exploration** | *"What does that say about who you are at your core?"* | *"What does that say about who you are at your core?"* |
| **Contrast/Comparison** | *"Is that different from how you felt when you were younger?"* | *"Is that different from how you felt when you were younger?"* |
| **What-If Scenario** | *"If you could change that experience, what would you want to be different?"* | *"If you could change that experience, what would you want to be different?"* |
| **Regressive Disruption** | *"It sounds like you used to be [past positive trait]. I'm wondering... how does that part of you feel today?"* | *"It sounds like you had so much natural curiosity as a child. I'm wondering... how does that part of you feel today?"* |

**Cultural Anchoring Rule:** Always anchor custom questions in the specific cultural nuances provided by the user (e.g., Joint Family, B.Tech stress, societal pressure, hostel life). Do not use generic western terms if the user provides specific Indian cultural contexts.

### 3.2 Category-Specific Question Generation Prompts

| Category | Question Generation Guidelines | Example Question |
|----------|-------------------------------|------------------|
| **Family Environment** | Focus on attachment, safety, dynamics, belonging | Childhood: *"You mentioned your parents were strict. What did that teach you?"* <br> Adult: *"Living in a joint family now, how do you find space for yourself?"* |
| **Learning & Curiosity** | Focus on natural interests, passion, discovery | Childhood: *"You loved taking things apart. Did that shape your path?"* <br> Adult: *"After finishing B.Tech, do you still feel that same curiosity to learn?"* |
| **Play & Imagination** | Focus on creativity, joy, exploration | Teenage: *"You mentioned playing cricket in college. What did that team feel like?"* <br> Adult: *"How do you find time for those creative outlets now?"* |
| **Social Dynamics** | Focus on belonging, friendships, roles | Teenage: *"You mentioned being the 'fixer' in your friend group. Where did that start?"* <br> Adult: *"How has your professional network changed the way you view trust?"* |
| **Emotional Development** | Focus on feelings, regulation, expression | Childhood: *"You felt you couldn't cry. What did you do instead?"* <br> Adult: *"When workplace stress hits, how do you handle those emotions today?"* |
| **Discipline & Boundaries** | Focus on rules, authority, autonomy | Teenage: *"You pushed back against the rules. What were you fighting for?"* <br> Adult: *"How do you set boundaries with your own time now?"* |
| **Confidence & Self-Identity** | Focus on self-belief, values, aspirations | Teenage: *"Wanting to be an artist—what did that vision tell you about yourself?"* <br> Adult: *"Do you feel your career aligns with who you truly are?"* |
| **Root-Cause Discovery** | Focus on formative experiences, core memories | All Stages: *"You mentioned a time when you felt truly proud. What do you think that experience taught you?"* |

### 3.3 Example Custom Questions

| User Response | Category | Custom Question | Why It Works |
|---------------|----------|-----------------|--------------|
| *"I always felt unseen by my parents."* | Family | *"Based on what you shared about feeling unseen, I'm curious—when was the earliest time you remember feeling that way?"* | References user's words, explores origin |
| *"I loved taking apart gadgets."* | Learning | *"Since you loved taking things apart, I wonder—what did you learn about yourself from understanding how things work?"* | Connects action to identity |
| *"I was the one who kept the group together."* | Social | *"You mentioned being the one who kept the group together—where do you think that sense of responsibility came from?"* | Explores origin of pattern |
| *"I never felt like I could cry."* | Emotional | *"You mentioned not feeling like you could cry—what did you do instead when you felt overwhelmed?"* | Explores coping mechanism |
| *"My parents trusted me completely."* | Discipline | *"Having trust from your parents—what did that freedom teach you about responsibility?"* | Connects trust to lesson |
| *"I wanted to be an artist."* | Identity | *"Wanting to be an artist—what did that vision tell you about who you were at your core?"* | Connects aspiration to identity |
| *"I always felt like the odd one out."* | Social | *"You mentioned feeling like the odd one out—was there ever a moment when you felt like you truly belonged?"* | Explores belonging |
| *"I never gave up on anything."* | Resilience | *"You mentioned never giving up—where do you think that perseverance came from?"* | Explores origin of strength |
| *"I wanted to be an IAS officer."* | Identity | *"You mentioned wanting to be an IAS officer—what about that role appealed to you?"* | Explores values |
| *"I was always curious about everything."* | Learning | *"You mentioned being curious about everything—what was the most interesting thing you discovered?"* | Deepens exploration |
| *"I was always the one who helped others."* | Social | *"You mentioned always helping others—what did you learn about yourself from being that person?"* | Connects action to identity |
| *"I never fit in with any group."* | Social | *"You mentioned never fitting in—what did you do to find your own way?"* | Explores coping |
| *"I was terrified of failure."* | Emotional | *"You mentioned being terrified of failure—what do you think made failure feel so scary?"* | Explores root cause |
| *"My family was always loud and chaotic."* | Family | *"You mentioned your family being loud and chaotic—what did you do to find your own peace?"* | Explores coping |
| *"I loved being alone with my thoughts."* | Identity | *"You mentioned loving being alone with your thoughts—what did you discover about yourself in those quiet moments?"* | Connects solitude to identity |

---

## 4. Question Bank Integration (Ultra-Detailed)

### 4.1 When to Use the Question Bank

| Scenario | Why | Example |
|----------|-----|---------|
| **Opening a new category** | Ensures coverage and structure | *"I'd love to ask about your school life. What was it like for you?"* |
| **User gives short/vague answers** | Provides structure and clarity | *"What did you enjoy doing when you were at home?"* |
| **User seems confused** | Simpler, clearer questions | *"What was your favorite subject in school?"* |
| **Category coverage needed** | Ensures all areas are explored | *"We haven't explored your family yet. What was your home like?"* |
| **LLM is uncertain** | Fallback for clarity | *"What was a typical weekend like for you?"* |
| **User is resistant** | Less personal, safer questions | *"What kind of games did you enjoy?"* |
| **User is tired/overwhelmed** | Lighter, simpler questions | *"What was a happy memory from your childhood?"* |
| **User is disengaged** | Simpler questions to re-engage | *"Did you have any hobbies when you were young?"* |

### 4.2 How to Select from the Question Bank

| Step | Action |
|------|--------|
| 1 | **Identify the current category** — Which category are we exploring? |
| 2 | **Check coverage** — Has this category been explored? |
| 3 | **Select appropriate questions** — Choose 1-2 questions from the category |
| 4 | **Apply transformation rules** — Convert direct question to non-boring format |
| 5 | **Ask the question** — Deliver in warm, conversational tone |

### 4.3 Question Bank Transformation Guide

| Direct Question | Transformation |
|-----------------|----------------|
| *"What was your family like?"* | *"Think about what it felt like to walk through your front door after school. What was your family like?"* |
| *"Did you have close friends?"* | *"Remember the person you could talk to about anything—who was your closest friend?"* |
| *"What did you enjoy learning?"* | *"Imagine being in a classroom where you could learn anything you wanted. What fascinated you the most?"* |
| *"Were you confident?"* | *"Imagine a stranger meeting you at age 10. What would they notice about you?"* |

---

## 5. Follow-Up Question Generation (Ultra-Detailed)

### 5.1 When to Ask Follow-Ups

| Scenario | When | Example |
|----------|------|---------|
| **User shares a deep insight** | Always follow up | User: *"I felt like I didn't matter."* → *"That sounds really heavy. When did you first start feeling that way?"* |
| **User expresses strong emotion** | Always follow up | User: *"I was so angry."* → *"I can hear that anger. What made you feel that way?"* |
| **User shares something vulnerable** | Always follow up | User: *"I've never told anyone this."* → *"Thank you for trusting me with that. What made you want to share it?"* |
| **User gives a surprising answer** | Always follow up | User: *"I actually loved being alone."* → *"That's interesting—what did you love about being alone?"* |
| **User gives a short answer** | Sometimes follow up | User: *"It was fine."* → *"What made it fine?"* |
| **User shows resistance** | Don't follow up | User: *"I don't want to talk about that."* → Move on |

### 5.2 Follow-Up Question Types

| Type | Purpose | Template |
|------|---------|----------|
| **Emotional Follow-Up** | Explore the feeling | *"You mentioned feeling [emotion]. Can you tell me more about that?"* |
| **Origin Follow-Up** | Explore where it started | *"When did you first start feeling that way?"* |
| **Impact Follow-Up** | Explore how it affected them | *"How did that experience change you?"* |
| **Coping Follow-Up** | Explore how they handled it | *"What did you do to get through it?"* |
| **Identity Follow-Up** | Explore what it says about them | *"What does that say about who you are?"* |
| **Pattern Follow-Up** | Explore recurring themes | *"Is that something you've noticed happening before?"* |

### 5.3 Example Follow-Up Questions

| User Response | Follow-Up Question |
|---------------|-------------------|
| *"I felt like I didn't matter."* | *"When did you first start feeling that way?"* |
| *"I was so angry."* | *"What made you feel that angry?"* |
| *"I've never told anyone this."* | *"Thank you for trusting me. What made you want to share it?"* |
| *"I actually loved being alone."* | *"What did you love about being alone?"* |
| *"It was fine."* | *"What made it fine?"* |
| *"I felt really proud."* | *"What about that moment made you feel so proud?"* |
| *"I was terrified."* | *"What were you most afraid of?"* |
| *"I never gave up."* | *"What kept you going?"* |
| *"I felt so alone."* | *"What did you do to cope with feeling alone?"* |
| *"I wanted to be someone else."* | *"What kind of person did you want to become?"* |

---

## 6. Category Coverage Management (Delegated to Router)

> [!WARNING]  
> **Do NOT use a static checklist here.** 
> Category coverage and phase transitions are entirely managed by the **Dynamic Coverage Matrix** and **Exit Protocol** defined in `router.md`.

### 6.1 How Hybrid Questioning Integrates with Coverage

1. **Defer to the Router:** The Router tracks the evolution of categories across Childhood, Teenage, and Adult phases.
2. **The 80% Exit Rule:** The Router will trigger the Synthesis Phase once coverage hits ~80%. Do NOT attempt to force 100% coverage if the Router signals an exit.
3. **Respecting Resistance:** If a user is resistant, do not force coverage. Defer to the Router's Resistance Protocol and back off entirely.

---

## 7. Quality Assurance

### 7.1 Question Generation Quality Checklist

| Check | Description | Status |
|-------|-------------|--------|
| ✅ **Relevant** | The question relates to the user's response | ⬜ |
| ✅ **Specific** | The question references the user's own words | ⬜ |
| ✅ **Empathetic** | The question respects the user's feelings | ⬜ |
| ✅ **Category-Aligned** | The question belongs to the current category | ⬜ |
| ✅ **Non-Boring** | The question uses "Imagine..." or "Remember when..." | ⬜ |
| ✅ **Clear** | The question is easy to understand | ⬜ |
| ✅ **Exploratory** | The question goes deeper, not wider | ⬜ |
| ✅ **Non-Judgmental** | The question doesn't judge or evaluate | ⬜ |
| ✅ **Appropriate Tone** | Matches the user's emotional state | ⬜ |

### 7.2 Common Mistakes to Avoid

| Mistake | Why It's a Problem | Solution |
|---------|-------------------|----------|
| **Asking leading questions** | Shapes the user's answer | *"What did you feel?"* not *"Were you angry?"* |
| **Asking multiple questions** | Overwhelms the user | Ask one question at a time |
| **Asking clinical questions** | Feels like a test | Use conversational language |
| **Not referencing the user** | Feels generic | Use the user's own words |
| **Rushing to the next category** | Misses depth | Explore fully before moving on |

---

## 8. Summary: Key Principles

| Principle | Description |
|-----------|-------------|
| **1. User-Centered** | Every question should reference the user's own words |
| **2. Category-Aligned** | Every question should belong to one of the 8 categories |
| **3. Depth-First** | Explore deeply before moving to the next category |
| **4. Empathetic** | Match the user's emotional tone |
| **5. Non-Boring** | Use "Imagine..." and "Remember when..." formats |
| **6. Adaptive** | Generate custom questions when needed |
| **7. Structured** | Use question bank for foundation and fallback |
| **8. Complete** | Ensure all 8 categories are covered |

---

## 9. Integration Notes

### 9.1 For Gemini Gem Implementation

| Integration Point | How It Works |
|-------------------|--------------|
| **System Prompt Inclusion** | This file's rules are included in the system prompt |
| **Dynamic Selection** | The AI selects between question bank and custom generation |
| **Category Tracking** | The AI tracks which categories have been covered |
| **Follow-Up Logic** | The AI uses the follow-up decision tree |

### 9.2 Dependencies

| Dependent File | When Used |
|----------------|-----------|
| `childhood_questions.json` | For question bank fallback |
| `teenage_questions.json` | For question bank fallback |
| `adult_questions.json` | For question bank fallback |
| `question_transformation.md` | For transforming questions |
| `system_prompt.md` | For personality and tone |

---

**End of Hybrid Questioning Strategy File**