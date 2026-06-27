# Universal Question Transformation Rules
## Ultra-Detailed Development File

---

## 📋 0. About This File

| Field | Value |
|-------|-------|
| **File Name** | `question_transformation.md` |
| **Purpose** | Defines universal rules to transform ANY direct question from ANY question bank into an indirect, engaging, conversation-style question. |
| **Applies To** | All question banks: childhood, teenage, adult, and any future question banks. |
| **When to Use** | Every time ANY question is asked from ANY question bank. |
| **Key Principle** | **Never ask a direct question.** Always wrap it in a story, memory, or scenario. |
| **Tone** | Warm, curious, conversational, human, natural. |
| **Transformation Goal** | The user should feel like they're having a conversation with a friend, not taking a survey. |

---

## 🔧 1. How This File Is Used (Universal Flow)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                   UNIVERSAL QUESTION TRANSFORMATION FLOW                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Step 1: AI selects ANY direct question from ANY question bank              │
│          ├── childhood_questions.json                                       │
│          ├── teenage_questions.json                                         │
│          └── adult_questions.json                                           │
│          (Example: "What is your earliest memory of home?")                 │
│                                                                             │
│  Step 2: AI identifies transformation_rule from the question                │
│          (Example: transformation_rule: "memory_recall")                    │
│                                                                             │
│  Step 3: AI looks up the transformation template in this file               │
│          (Example: "Remember when {hook}? {direct_question}?")              │
│                                                                             │
│  Step 4: AI selects an appropriate hook based on the question's context     │
│          (Example: "waking up in your childhood bedroom")                   │
│                                                                             │
│  Step 5: AI combines template + hook + direct question                      │
│          (Output: "Remember waking up in your childhood bedroom?            │
│                   What is your earliest memory of home?")                   │
│                                                                             │
│  Step 6: AI asks the TRANSFORMED question to the user                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Universal Transformation Rules

### 2.1 Rule 1: Memory Recall

| Field | Value |
|-------|-------|
| **Rule Name** | Memory Recall |
| **Rule ID** | TRANS-001 |
| **Template** | `"Remember when {hook}? {direct_question}?"` |
| **Best For** | Questions about specific people, events, or experiences. |
| **When to Use** | When the question requires accessing past memories. |

**Hook Guidelines:**
- Use a specific, vivid memory anchor.
- Should paint a picture in the user's mind.
- Should be relatable and accessible.

**Hook Examples by Category:**

| Category | Direct Question | Hook | Transformed Question |
|----------|-----------------|------|----------------------|
| **Family** | What is your earliest memory of home? | waking up in your childhood bedroom | *Remember waking up in your childhood bedroom? What is your earliest memory of home?* |
| **Family** | Who made you feel safe? | coming home after a bad day at school | *Remember coming home after a bad day at school? Who was the first person you wanted to see?* |
| **Family** | Did you feel understood as a child? | a time when you tried to explain something important | *Remember a time when you tried to explain something important to an adult? Did you feel understood?* |
| **Family** | Were you close to your family? | a family dinner from when you were young | *Remember a family dinner from when you were young? What do you remember most?* |
| **Social** | Who was your best friend? | your favorite playmate from childhood | *Remember your favorite playmate from childhood? Who was it and what made them special?* |
| **Social** | Did you feel accepted by your classmates? | how you felt in your classroom | *Remember how you felt in your classroom? Did you feel accepted by your classmates?* |
| **Social** | Did you maintain long-term friendships? | friendships that lasted through your childhood | *Remember friendships that lasted through your childhood? What made them last?* |
| **Emotional** | What made you feel loved? | a time when you felt truly cared for | *Remember a time when you felt truly cared for? What made you feel loved?* |
| **Emotional** | What made you feel afraid? | a time when you were really scared | *Remember a time when you were really scared? What made you feel afraid?* |
| **Emotional** | What made you feel proud? | a time when you achieved something important | *Remember a time when you achieved something important? What made you feel proud?* |
| **Emotional** | What made you feel embarrassed? | a time when you felt really awkward | *Remember a time when you felt really awkward? What made you feel embarrassed?* |
| **Learning** | What fascinated you the most? | a time when you were completely absorbed in something | *Remember a time when you were completely absorbed in something? What fascinated you the most?* |
| **Learning** | Did you enjoy learning before school became serious? | a time when learning felt like play | *Remember a time when learning felt like play? Did you enjoy learning before school became serious?* |
| **Identity** | What was your biggest childhood challenge? | what was difficult for you | *Remember what was difficult for you as a child? What was your biggest challenge?* |
| **Identity** | What part of your childhood still influences you today? | a moment from childhood that still feels present | *Remember a moment from childhood that still feels present? What part of your childhood still influences you today?* |
| **Teenage** | What was the hardest part of being a teenager? | a time when being a teenager felt overwhelming | *Remember a time when being a teenager felt overwhelming? What was the hardest part?* |
| **Teenage** | Who was your closest friend in high school? | the person you could talk to about anything | *Remember the person you could talk to about anything? Who was your closest friend in high school?* |
| **Adult** | What made you choose your career path? | a moment when you knew what you wanted to do | *Remember a moment when you knew what you wanted to do? What made you choose your career path?* |
| **Adult** | What was the biggest lesson you learned in your 20s? | a time when life taught you something important | *Remember a time when life taught you something important? What was the biggest lesson you learned in your 20s?* |

---

### 2.2 Rule 2: Imagined Scenario

| Field | Value |
|-------|-------|
| **Rule Name** | Imagined Scenario |
| **Rule ID** | TRANS-002 |
| **Template** | `"Imagine {hook}. {direct_question}?"` |
| **Best For** | Questions about preferences, feelings, or abstract concepts. |
| **When to Use** | When the question requires imagination or perspective-taking. |

**Hook Guidelines:**
- Place the user in a vivid, specific scenario.
- Make it visual and sensory.
- Should be relatable and easy to imagine.

**Hook Examples by Category:**

| Category | Direct Question | Hook | Transformed Question |
|----------|-----------------|------|----------------------|
| **Learning** | What was your favorite subject? | it's Monday morning and you're packing your bag for school | *Imagine it's Monday morning and you're packing your bag for school. Which class are you secretly hoping comes first?* |
| **Learning** | What made you curious? | being completely free to explore anything | *Imagine being completely free to explore anything. What fascinated you the most?* |
| **Learning** | What activity could keep you engaged for hours? | having a whole day to do whatever you loved most | *Imagine having a whole day to do whatever you loved most. What activity would keep you engaged for hours?* |
| **Identity** | What did you want to be when you grew up? | someone asks you at age 8 what you want to be | *Imagine someone asks you at age 8 what you want to be. What do you say?* |
| **Identity** | If someone met 10-year-old you, how would they describe you? | a stranger meeting you at age 10 | *Imagine a stranger meeting you at age 10. How would they describe you?* |
| **Identity** | What made you feel confident? | being really sure of yourself | *Imagine a time when you were really sure of yourself. What made you feel confident?* |
| **Identity** | What made you feel insecure? | feeling uncertain about yourself | *Imagine a time when you felt uncertain about yourself. What made you feel insecure?* |
| **Identity** | What dream from childhood still exists today? | a childhood dream that has stayed with you | *Imagine a childhood dream that has stayed with you. What is it?* |
| **Social** | What game or activity made you the happiest? | feeling pure happiness as a child | *Imagine feeling pure happiness as a child. What game or activity made you feel that way?* |
| **Emotional** | What does "knowing yourself" mean to you? | looking at your life from the outside | *Imagine looking at your life from the outside. What does "knowing yourself" mean to you?* |
| **Teenage** | What kind of person did you want to become? | being 25 and looking back at your teenage self | *Imagine being 25 and looking back at your teenage self. What kind of person did you want to become?* |
| **Teenage** | What was your biggest dream as a teenager? | being able to do anything you wanted | *Imagine being able to do anything you wanted. What was your biggest dream as a teenager?* |
| **Adult** | What would you do if you knew you couldn't fail? | having no fear of failure | *Imagine having no fear of failure. What would you do?* |
| **Adult** | What would your future self thank you for doing today? | looking back from 10 years in the future | *Imagine looking back from 10 years in the future. What would your future self thank you for doing today?* |
| **Adult** | If you could change one thing about your career path, what would it be? | having a chance to redo one career decision | *Imagine having a chance to redo one career decision. If you could change one thing, what would it be?* |

---

### 2.3 Rule 3: Sensory Recall

| Field | Value |
|-------|-------|
| **Rule Name** | Sensory Recall |
| **Rule ID** | TRANS-003 |
| **Template** | `"Think about {hook}. {direct_question}?"` |
| **Best For** | Questions about emotions, comfort, or atmosphere. |
| **When to Use** | When the question benefits from sensory anchoring (sight, sound, smell, touch, taste). |

**Hook Guidelines:**
- Use at least one of the five senses.
- Should evoke a specific atmosphere or feeling.
- Should be vivid and descriptive.

**Hook Examples by Category:**

| Category | Direct Question | Hook | Transformed Question |
|----------|-----------------|------|----------------------|
| **Family** | How would you describe the atmosphere in your childhood home? | the feeling of walking through your front door after school | *Think about the feeling of walking through your front door after school. How would you describe the atmosphere in your childhood home?* |
| **Family** | What did your home feel like? | the smell of your childhood kitchen | *Think about the smell of your childhood kitchen. What did your home feel like?* |
| **Family** | Were family meals common in your home? | what dinnertime felt like in your home | *Think about what dinnertime felt like in your home. Were family meals common?* |
| **Family** | Did you enjoy spending time at home? | a typical weekend at home when you were little | *Think about a typical weekend at home when you were little. Did you enjoy spending time at home?* |
| **Family** | Did you feel safe at home? | what it felt like to be at home at night | *Think about what it felt like to be at home at night. Did you feel safe?* |
| **Learning** | Were books common in your house? | what you remember seeing around your childhood home | *Think about what you remember seeing around your childhood home. Were books common in your house?* |
| **Play** | Did you prefer outdoor play or indoor play? | what made you happiest — being inside or outside | *Think about what made you happiest — being inside or outside. Did you prefer outdoor play or indoor play?* |
| **Play** | Were you physically active as a child? | what your body loved to do when you were young | *Think about what your body loved to do when you were young. Were you physically active?* |
| **Emotional** | What were you afraid of as a child? | what was in your closet that only you knew about | *Think about what was in your closet that only you knew about. What were you afraid of?* |
| **Emotional** | What made you feel loved? | a hug or a kind word from someone | *Think about a hug or a kind word from someone. What made you feel loved?* |
| **Teenage** | What did it feel like to be a teenager? | the feeling of being 16 | *Think about the feeling of being 16. What did it feel like to be a teenager?* |
| **Teenage** | What was your favorite place to be as a teenager? | a place where you felt completely yourself | *Think about a place where you felt completely yourself. What was your favorite place to be as a teenager?* |
| **Adult** | What does your dream career feel like? | what it would feel like to be in your ideal job | *Think about what it would feel like to be in your ideal job. What does your dream career feel like?* |
| **Adult** | What does success look like to you? | what a successful life looks like | *Think about what a successful life looks like. What does success look like to you?* |

---

### 2.4 Rule 4: Storytelling

| Field | Value |
|-------|-------|
| **Rule Name** | Storytelling |
| **Rule ID** | TRANS-004 |
| **Template** | `"Tell me about {hook}... {direct_question}?"` |
| **Best For** | Questions about memories, events, or narratives. |
| **When to Use** | When the question invites elaboration or a story. |

**Hook Guidelines:**
- Invite the user to share a narrative.
- Should feel like an invitation, not a demand.
- Should create space for elaboration.

**Hook Examples by Category:**

| Category | Direct Question | Hook | Transformed Question |
|----------|-----------------|------|----------------------|
| **Family** | What is your earliest memory of home? | a story you've told yourself many times | *Tell me about a story you've told yourself many times... What is your earliest memory of home?* |
| **Play** | What did you spend most of your time playing with? | a typical day of play when you were young | *Tell me about a typical day of play when you were young... what did you spend most of your time playing with?* |
| **Play** | Did you invent your own games? | a game you created when you were young | *Tell me about a game you created when you were young... how did it work?* |
| **Play** | What hobby excited you the most? | something you were completely obsessed with | *Tell me about something you were completely obsessed with... what hobby excited you the most?* |
| **Play** | What was your favorite game? | the games you played with friends | *Tell me about the games you played with friends... what made them so fun?* |
| **Identity** | What was your biggest childhood strength? | what you were really good at when you were young | *Tell me about what you were really good at when you were young... what was your biggest strength?* |
| **Identity** | What childhood experience shaped you the most? | an experience that changed you | *Tell me about an experience that changed you... what childhood experience shaped you the most?* |
| **Emotional** | How did you react when things didn't go your way? | a time when something you wanted didn't happen | *Tell me about a time when something you wanted didn't happen... how did you react?* |
| **Emotional** | What made you feel proud? | a time when you felt really proud of yourself | *Tell me about a time when you felt really proud of yourself... what made you feel that way?* |
| **Emotional** | What is the happiest memory from your childhood? | a time when you felt pure joy | *Tell me about a time when you felt pure joy... what is the happiest memory from your childhood?* |
| **Teenage** | What was the best part of being a teenager? | a time when being a teenager felt amazing | *Tell me about a time when being a teenager felt amazing... what was the best part?* |
| **Teenage** | What was the most memorable experience of your teenage years? | a moment that defined your teenage years | *Tell me about a moment that defined your teenage years... what was the most memorable experience?* |
| **Adult** | What's the most significant lesson life has taught you? | a time when life taught you something important | *Tell me about a time when life taught you something important... what's the most significant lesson life has taught you?* |
| **Adult** | What's the best decision you've ever made? | a decision that changed your life | *Tell me about a decision that changed your life... what's the best decision you've ever made?* |

---

### 2.5 Rule 5: Reflection

| Field | Value |
|-------|-------|
| **Rule Name** | Reflection |
| **Rule ID** | TRANS-005 |
| **Template** | `"Think about {hook}. {direct_question}?"` |
| **Best For** | Questions about identity, values, or self-perception. |
| **When to Use** | When the question connects past to present or explores personal growth. |

**Hook Guidelines:**
- Encourage deep thinking.
- Should connect past experiences to current identity.
- Should feel introspective, not clinical.

**Hook Examples by Category:**

| Category | Direct Question | Hook | Transformed Question |
|----------|-----------------|------|----------------------|
| **Family** | Did you feel understood as a child? | what it felt like to have people listen to you | *Think about what it felt like to have people listen to you. Did you feel understood as a child?* |
| **Family** | What values were most important to your family? | what your family believed was important | *Think about what your family believed was important. What values were most important to them?* |
| **Identity** | What do you think shaped your confidence at that age? | what made you feel capable or unsure | *Think about what made you feel capable or unsure. What do you think shaped your confidence?* |
| **Identity** | What part of your childhood still influences you today? | how your childhood shows up in your life now | *Think about how your childhood shows up in your life now. What part of it still influences you today?* |
| **Emotional** | Did you feel accepted by the people around you? | how you felt when you were with others | *Think about how you felt when you were with others. What made you feel accepted?* |
| **Emotional** | Did you express your emotions openly? | whether you showed your feelings or kept them inside | *Think about whether you showed your feelings or kept them inside. Did you express your emotions openly?* |
| **Emotional** | Did you feel emotionally secure? | what it felt like to be you when you were young | *Think about what it felt like to be you when you were young. Did you feel emotionally secure?* |
| **Identity** | What was your biggest childhood challenge? | what was difficult for you at that age | *Think about what was difficult for you at that age. What was your biggest childhood challenge?* |
| **Identity** | What dream from childhood still exists today? | a dream that has stayed with you | *Think about a dream that has stayed with you. What childhood dream still exists today?* |
| **Social** | How did unfamiliar situations affect you? | a time when you faced something new | *Think about a time when you faced something new. How did unfamiliar situations affect you?* |
| **Teenage** | What did being a teenager teach you about yourself? | what you learned about yourself during those years | *Think about what you learned about yourself during those years. What did being a teenager teach you about yourself?* |
| **Teenage** | What values did you develop in your teenage years? | what became important to you as a teenager | *Think about what became important to you as a teenager. What values did you develop?* |
| **Adult** | How have your priorities changed since you were younger? | what matters to you now that didn't before | *Think about what matters to you now that didn't before. How have your priorities changed?* |
| **Adult** | What do you wish you had known earlier? | advice you'd give to your younger self | *Think about advice you'd give to your younger self. What do you wish you had known earlier?* |

---

## 3. Follow-Up Transformation Rules

### 3.1 Rule 6: Softening Emotional Responses

| Field | Value |
|-------|-------|
| **Rule Name** | Softening Emotional Responses |
| **Rule ID** | TRANS-006 |
| **Purpose** | To normalize emotional responses and encourage continued sharing. |
| **When to Use** | When the user shows signs of emotion (sadness, vulnerability, anxiety). |

**Templates by Emotion:**

| User Emotion | Response Template | Example |
|--------------|-------------------|---------|
| **Sadness** | "That sounds really difficult. What do you think that experience taught you about yourself?" | User shares something sad → *"That sounds really difficult. What do you think that experience taught you about yourself?"* |
| **Vulnerability** | "Thank you for sharing that. It takes courage to say something like that." | User shares something vulnerable → *"Thank you for sharing that. It takes courage to say something like that."* |
| **Excitement** | "I can feel how much that means to you. What about it makes you feel that way?" | User expresses excitement → *"I can feel how much that means to you. What about it makes you feel that way?"* |
| **Confusion** | "That's okay — sometimes we need to talk things out to understand them. Can you tell me more?" | User seems confused → *"That's okay — sometimes we need to talk things out to understand them. Can you tell me more?"* |
| **Hesitation** | "Take your time. There's no rush. What's the first thing that comes to mind?" | User is hesitant → *"Take your time. There's no rush. What's the first thing that comes to mind?"* |
| **Anger** | "I can hear how frustrating that was. You're not wrong to feel that way." | User expresses anger → *"I can hear how frustrating that was. You're not wrong to feel that way."* |
| **Relief** | "That sounds like a weight off your shoulders." | User expresses relief → *"That sounds like a weight off your shoulders."* |
| **Joy** | "That's beautiful. I can feel the warmth in your words." | User expresses joy → *"That's beautiful. I can feel the warmth in your words."* |
| **Pride** | "That's an incredible accomplishment. What did that feel like?" | User expresses pride → *"That's an incredible accomplishment. What did that feel like?"* |
| **Fear** | "That must have been really scary. How did you get through it?" | User expresses fear → *"That must have been really scary. How did you get through it?"* |

---

### 3.2 Rule 7: Depth Follow-Ups

| Field | Value |
|-------|-------|
| **Rule Name** | Depth Follow-Ups |
| **Rule ID** | TRANS-007 |
| **Purpose** | To go deeper based on the user's response. |
| **When to Use** | Based on the user's response quality and depth. |

**Templates by User Response Type:**

| User Response | Follow-Up Template | Example |
|---------------|--------------------|---------|
| **Short answer** | "I'm curious about that—what made that so memorable?" | User: "It was fine." → *"I'm curious about that—what made that so memorable?"* |
| **Short answer** | "What was the most important part of that for you?" | User gives a brief description → *"What was the most important part of that for you?"* |
| **Emotional answer** | "What do you think that experience taught you about yourself?" | User shares emotional memory → *"What do you think that experience taught you about yourself?"* |
| **Emotional answer** | "How did that experience change how you see yourself?" | User shares emotional memory → *"How did that experience change how you see yourself?"* |
| **Surprising answer** | "That's fascinating—I didn't expect that. What do you think made you react that way?" | User shares surprising experience → *"That's fascinating—I didn't expect that. What do you think made you react that way?"* |
| **General answer** | "That's interesting. Can you tell me more about that?" | User gives a vague answer → *"That's interesting. Can you tell me more about that?"* |
| **Resistant answer** | "That's okay. We can come back to it later if you'd prefer. Let's try another question." | User seems resistant → *"That's okay. We can come back to it later if you'd prefer. Let's try another question."* |
| **Reflective answer** | "That's a beautiful way to put it. What do you think that says about who you are today?" | User gives a reflective answer → *"That's a beautiful way to put it. What do you think that says about who you are today?"* |
| **Defensive answer** | "I'm not here to judge. I'm just curious about what that was like for you." | User seems defensive → *"I'm not here to judge. I'm just curious about what that was like for you."* |
| **Overthinking answer**| "There's no right answer. What's your first instinct, even if it's just a feeling?" | User overanalyzes → *"There's no right answer. What's your first instinct, even if it's just a feeling?"* |

---

## 4. Universal Application Logic

### 4.1 Step-by-Step Process

| Step | Action | Example |
|------|--------|---------|
| **1** | Select a question from ANY question bank | `childhood_questions.json` → *"What is your earliest memory of home?"* |
| **2** | Read the `transformation_rule` field | `transformation_rule`: "storytelling" |
| **3** | Identify the appropriate hook | hook: *"a story you've told yourself many times"* |
| **4** | Apply the transformation template | `"Tell me about {hook}... {direct_question}?"` |
| **5** | Generate the final question | *"Tell me about a story you've told yourself many times... What is your earliest memory of home?"* |
| **6** | Ask the transformed question | ✅ *"Tell me about a story you've told yourself many times... What is your earliest memory of home?"* |

### 4.2 Question Bank Compatibility

| Question Bank | Rule Applies | Hook Types Used |
|---------------|--------------|-----------------|
| `childhood_questions.json` | Yes | All 5 rules, All 5 categories |
| `teenage_questions.json` | Yes | All 5 rules, All 5 categories |
| `adult_questions.json` | Yes | All 5 rules, All 5 categories |
| Any future bank | Yes | All 5 rules, All 5 categories |

---

## 5. Transformation Quality Checklist

| Criteria | Description | Check |
|----------|-------------|-------|
| **Friend-like Tone** | Sounds like a friend talking, not a robot | ✅ |
| **No Clinical Language** | Avoids diagnostic or analytical phrasing | ✅ |
| **Conversational Feel** | Feels like a natural conversation, not a survey | ✅ |
| **Invites Storytelling** | Encourages elaboration and depth | ✅ |
| **Comfortable** | Makes the user feel at ease | ✅ |
| **Encourages Depth** | Prompts reflection and insight | ✅ |
| **Human** | Sounds human, not mechanical | ✅ |
| **Natural Flow** | Flows naturally from the conversation | ✅ |
| **Non-Judgmental**| No evaluation or judgment | ✅ |
| **Emotionally Aware** | Adapts to user's emotional state | ✅ |

---

## 6. Transformation Rules Summary Table

| Rule ID | Rule Name | Template | Best For | Example |
|---------|-----------|----------|----------|---------|
| **TRANS-001** | Memory Recall | `"Remember when {hook}? {direct_question}?"` | Specific people, events, experiences | *"Remember waking up in your childhood bedroom? What is your earliest memory of home?"* |
| **TRANS-002** | Imagined Scenario | `"Imagine {hook}. {direct_question}?"` | Preferences, feelings, abstract concepts | *"Imagine being completely free to explore anything. What fascinated you the most?"* |
| **TRANS-003** | Sensory Recall | `"Think about {hook}. {direct_question}?"` | Emotions, comfort, atmosphere | *"Think about the smell of your childhood kitchen. What did your home feel like?"* |
| **TRANS-004** | Storytelling | `"Tell me about {hook}... {direct_question}?"` | Memories, events, narratives | *"Tell me about a story you've told yourself many times... What is your earliest memory of home?"* |
| **TRANS-005** | Reflection | `"Think about {hook}. {direct_question}?"` | Identity, values, self-perception | *"Think about what made you feel capable or unsure. What do you think shaped your confidence?"* |
| **TRANS-006** | Softening Emotions | Various templates | Emotional responses | *"That sounds really difficult. What do you think that experience taught you about yourself?"* |
| **TRANS-007** | Depth Follow-Ups | Various follow-up templates | Different user response types | *"I'm curious about that—what made that so memorable?"* |

---

## 7. Integration Notes

### 7.1 For Gemini Gem Implementation

| Integration Point | How It Works |
|-------------------|--------------|
| **System Prompt Inclusion** | This file's rules are included in the system prompt. |
| **Dynamic Selection** | The AI selects the appropriate transformation rule based on the question's `transformation_rule` field. |
| **Context Awareness** | The AI adjusts the hook based on the user's previous responses. |
| **Follow-Up Chaining** | The AI uses the follow-up transformation rules to deepen the conversation. |

### 7.2 Dependencies

| Dependent File | When Used |
|----------------|-----------|
| All question banks (`.json`) | Provides direct questions and transformation rules. |
| All exploration files (`.md`) | Uses transformed questions during phases. |
| `system_prompt.md` | Contains personality guidelines that inform transformation. |
| `trust_building_phase.md` | Uses transformed questions during trust building. |

### 7.3 File References

| File | Referenced For |
|------|----------------|
| `childhood_questions.json` | Direct questions + `transformation_rule` |
| `teenage_questions.json` | Direct questions + `transformation_rule` |
| `adult_questions.json` | Direct questions + `transformation_rule` |
| Any future `.json` question bank | Direct questions + `transformation_rule` |

---
**End of Universal Question Transformation File — Ultra-Detailed Version**
