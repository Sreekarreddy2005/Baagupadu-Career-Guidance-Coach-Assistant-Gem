# Persona Template — Baagupadu Output

## 📋 About This File

| Field | Value |
|-------|-------|
| **File Name** | `persona_template.md` |
| **Purpose** | Defines the strict output schema for presenting the synthesized persona to the user |
| **When to Use** | After all 3 life stages are explored and persona is synthesized |
| **Key Principle** | The persona should feel like a mirror — warm, insightful, and deeply personal |
| **Tone** | Warm, compassionate, empowering, non-judgmental, celebratory |
| **Output Format** | JSON (for UI rendering) with rich Markdown fields |

---

## 🎯 How to Use This Template

| Step | Action |
|------|--------|
| 1 | Follow the JSON schema below — this is the EXACT structure to output |
| 2 | Use the user's own words whenever possible |
| 3 | Frame strengths with evidence from the user's story |
| 4 | Frame shadow traits as "overused strengths" |
| 5 | Include specific childhood/teenage evidence in Core Identity |
| 6 | Include Psychological Fit and Execution Risk for each career affinity |
| 7 | Always ask for user validation at the end |

---

## 📄 STRICT OUTPUT SCHEMA (LLM MUST FOLLOW THIS)

```json
{
  "core_identity": {
    "archetype_name": "string",
    "tagline": "string",
    "description": "string",
    "description_for_user": "string",
    "secondary_archetype": "string or null",
    "secondary_explanation": "string or null",
    "childhood_evidence": "string (specific story from user's childhood)",
    "teenage_evidence": "string (specific story from user's teenage years)"
  },
  "core_drivers": {
    "primary_driver": "string",
    "secondary_driver": "string",
    "core_fear_or_value": "string",
    "synthesis": "string (1-2 sentences connecting drivers to user's story)"
  },
  "strengths": [
    {
      "trait": "string",
      "evidence": "string (user's own words or specific story)"
    }
  ],
  "growth_and_complexity": {
    "growth_areas": [
      {
        "area": "string",
        "compassionate_framing": "string (frame as an overused strength, e.g., 'Perfectionism is just high standards taken too far')"
      }
    ],
    "shadow_traits": [
      {
        "trait": "string",
        "acknowledgment": "string (tentative, compassionate, framed as overused strength)"
      }
    ]
  },
  "core_values_and_non_negotiables": {
    "core_values": ["string"],
    "non_negotiables": [
      {
        "value": "string",
        "reason": "string"
      }
    ]
  },
  "flow_and_burnout": {
    "flow_triggers": ["string (conditions that put them in flow state)"],
    "burnout_triggers": ["string (conditions that trigger shadow traits)"],
    "balance_strategy": "string"
  },
  "learning_style": {
    "preferred_methods": ["string"],
    "ideal_environment": "string",
    "motivations": ["string"]
  },
  "career_affinities": [
    {
      "role_type": "string",
      "industry": "string",
      "reasoning": "string",
      "psychological_fit": "string (Why does this match their emotional blueprint?)",
      "execution_risk": "string (What is the hardest part about this role for their specific personality?)"
    }
  ],
  "work_environment": {
    "thrive_in": ["string"],
    "struggle_in": ["string"],
    "work_style": ["string"]
  },
  "immediate_next_steps": {
    "skill_gaps": [
      {
        "skill": "string",
        "severity": "CRITICAL | BRIDGEABLE | SOFT_SKILL",
        "recommended_action": "string"
      }
    ],
    "learning_path": {
      "formal_education": ["string"],
      "certifications": ["string"],
      "self_directed_projects": ["string"]
    },
    "first_action": "string (What should they do on Monday morning?)"
  },
  "guidance_note": "string (1-2 sentences of compassionate, practical guidance)",
  "validation": {
    "question": "string (Does this feel like you?)",
    "next_steps": ["string"]
  }
}


📄 SECTION-BY-SECTION INSTRUCTIONS
```

### Section 1: Core Identity
Instructions:

Use the archetype from persona_framework.json

Include a tagline and description

MANDATORY: Include specific childhood evidence (e.g., "as seen when you dismantled your family's radio at age 10")

MANDATORY: Include specific teenage evidence

Schema:

```json
"core_identity": {
  "archetype_name": "The Curious Explorer",
  "tagline": "Always learning, always questioning, always seeking.",
  "description": "You are driven by an insatiable curiosity about the world...",
  "description_for_user": "You're someone who sees the world as a place to explore...",
  "secondary_archetype": "The Driven Achiever",
  "secondary_explanation": "You also dream big and are willing to do the work...",
  "childhood_evidence": "This showed early when you dismantled your family's radio at age 10 to see how it worked.",
  "teenage_evidence": "In high school, you spent weekends teaching yourself to code, building your first website from scratch."
}
```

### Section 2: Core Drivers
Instructions:

Identify primary and secondary drivers

Identify core fear or value

Write a 1-2 sentence synthesis connecting drivers to user's story

Schema:

```json
"core_drivers": {
  "primary_driver": "A deep desire to create things that matter and make an impact",
  "secondary_driver": "A need for autonomy and intellectual freedom",
  "core_fear_or_value": "Fear of failure — it drives you, but also creates pressure",
  "synthesis": "Your desire to create has been a thread throughout your life — from building things as a child to solving complex problems as an adult."
}
```

### Section 3: Strengths
Instructions:

List 3-5 strengths

Each strength MUST have evidence from the user's own words or specific stories

Schema:

```json
"strengths": [
  {
    "trait": "Natural Pattern Recognition",
    "evidence": "\"I always loved figuring out how things work\" — from childhood gadgets to teenage systems."
  },
  {
    "trait": "Intellectual Versatility",
    "evidence": "You've explored so many different interests — from science to art to business."
  }
]
```

### Section 4: Growth & Complexity
Instructions:

Growth areas: Frame as "overused strengths" — NOT as weaknesses

Shadow traits: Use tentative, compassionate language

Schema:

```json
"growth_and_complexity": {
  "growth_areas": [
    {
      "area": "Following Through",
      "compassionate_framing": "You have so many ideas — your curiosity is a gift. The challenge is choosing which one to see through to completion."
    },
    {
      "area": "Self-Compassion",
      "compassionate_framing": "You hold yourself to high standards — a strength that's helped you achieve. The growth is in being as kind to yourself as you are to others."
    }
  ],
  "shadow_traits": [
    {
      "trait": "Perfectionism",
      "acknowledgment": "I notice you have high standards — sometimes so high that it creates pressure. It's a quality that's helped you achieve so much, and I wonder if it also sometimes weighs on you."
    }
  ]
}
```

### Section 5: Core Values & Non-Negotiables (NEW)
Instructions:

List 2-3 core values

List 2-3 non-negotiables (what the user refuses to compromise on)

Schema:

```json
"core_values_and_non_negotiables": {
  "core_values": [
    "Integrity — doing what's right even when no one is watching",
    "Impact — making a meaningful difference"
  ],
  "non_negotiables": [
    {
      "value": "Remote Flexibility",
      "reason": "You need autonomy and the ability to work from anywhere — rigid office schedules drain your energy."
    },
    {
      "value": "Purpose-Driven Work",
      "reason": "You cannot work for organizations that prioritize profit over people — it drains your soul."
    }
  ]
}
```

### Section 6: Flow & Burnout Triggers (NEW)
Instructions:

Identify what puts the user in a flow state

Identify what triggers burnout (connects to shadow traits)

Provide a balance strategy

Schema:

```json
"flow_and_burnout": {
  "flow_triggers": [
    "Deep focus on solving complex problems",
    "Learning something new and fascinating",
    "Creating something from scratch"
  ],
  "burnout_triggers": [
    "Repetitive, unchanging tasks",
    "Constant interruptions and distractions",
    "Lack of autonomy or micromanagement"
  ],
  "balance_strategy": "Schedule uninterrupted deep work blocks (2-3 hours) before any meetings. Take a 5-minute walk after each deep work session to reset."
}
```

### Section 7: Learning Style
Schema:

```json
"learning_style": {
  "preferred_methods": ["Self-directed learning and exploration", "Research and deep dives"],
  "ideal_environment": "Quiet, flexible, intellectually stimulating",
  "motivations": ["Intrinsic curiosity", "The joy of discovery", "Intellectual challenge"]
}
```

### Section 8: Career Affinities
Instructions:

Each career MUST include:

Role Type and Industry

Reasoning (why it fits)

NEW: Psychological Fit (why it matches their emotional blueprint)

NEW: Execution Risk (the hardest part for their specific personality)

Schema:

```json
"career_affinities": [
  {
    "role_type": "Product Designer",
    "industry": "Technology",
    "reasoning": "Your creativity and problem-solving skills make you a natural designer.",
    "psychological_fit": "You thrive when you can deeply understand users' needs and create solutions that make their lives better — this aligns with your desire for impact.",
    "execution_risk": "The hardest part for you will be the iteration cycles. You love exploring ideas, but refining the same design repeatedly may feel tedious. Build systems to manage iteration without losing momentum."
  }
]
```

### Section 9: Work Environment
Schema:

```json
"work_environment": {
  "thrive_in": [
    "Flexible, autonomous work settings",
    "Intellectually stimulating environments",
    "Collaborative, idea-rich teams"
  ],
  "struggle_in": [
    "Highly rigid, bureaucratic settings",
    "Repetitive, unchanging tasks"
  ],
  "work_style": [
    "Thrives with intellectual freedom",
    "Enjoys deep dives into topics",
    "Prefers variety over routine"
  ]
}
```

### Section 10: Immediate Next Steps & Skill Gaps (NEW)
Instructions:

Include a concrete "Monday morning" action

This bridges the gap from insight to execution

Schema:

```json
"immediate_next_steps": {
  "skill_gaps": [
    {
      "skill": "Figma / Design Tools",
      "severity": "BRIDGEABLE",
      "recommended_action": "Complete a 2-week Figma course on Coursera and redesign a familiar app"
    },
    {
      "skill": "User Research",
      "severity": "CRITICAL",
      "recommended_action": "Read 'The Design of Everyday Things' and conduct 3 user interviews this month"
    }
  ],
  "learning_path": {
    "formal_education": ["Certificate in Human-Computer Interaction"],
    "certifications": ["Google UX Design Certificate"],
    "self_directed_projects": ["Redesign a familiar app", "Build a portfolio case study"]
  },
  "first_action": "Spend 2 hours this Monday researching UX design portfolio examples and identify 5 you admire."
}
```

### Section 11: Guidance Note
Schema:

```json
"guidance_note": "Your curiosity and creativity are your superpowers. The world needs people who can see connections others miss. Trust your instincts — they've served you well."
```

### Section 12: Validation
Schema:

```json
"validation": {
  "question": "Does this feel like you? I want to make sure I'm seeing you clearly. What would you add or change?",
  "next_steps": [
    "If this feels right → I'll help you explore your career path",
    "If something feels off → Tell me what to refine, and I'll adjust",
    "If you have questions → I'm here to answer them"
  ]
}
📄 COMPLETE EXAMPLE OUTPUT
```json
{
  "core_identity": {
    "archetype_name": "The Curious Explorer",
    "tagline": "Always learning, always questioning, always seeking.",
    "description": "You are driven by an insatiable curiosity about the world. You love exploring ideas, understanding how things work, and connecting dots across different domains. Your mind is never at rest — and that's your greatest strength.",
    "description_for_user": "You're someone who sees the world as a place to explore, not just to exist in. You have a gift for making connections others miss and finding joy in understanding.",
    "secondary_archetype": "The Driven Achiever",
    "secondary_explanation": "You also dream big and are willing to do the work to make those dreams real.",
    "childhood_evidence": "This showed early when you dismantled your family's radio at age 10 to see how it worked.",
    "teenage_evidence": "In high school, you spent weekends teaching yourself to code, building your first website from scratch."
  },
  "core_drivers": {
    "primary_driver": "A deep desire to create things that matter and make an impact",
    "secondary_driver": "A need for autonomy and intellectual freedom",
    "core_fear_or_value": "Fear of failure — it drives you, but also creates pressure",
    "synthesis": "Your desire to create has been a thread throughout your life — from building things as a child to solving complex problems as an adult. Your fear of failure pushes you to excel, but it can also weigh on you."
  },
  "strengths": [
    {
      "trait": "Natural Pattern Recognition",
      "evidence": "\"I always loved figuring out how things work\" — from childhood gadgets to teenage systems to adult strategies."
    },
    {
      "trait": "Intellectual Versatility",
      "evidence": "You've explored so many different interests — from science to art to business."
    },
    {
      "trait": "Self-Awareness",
      "evidence": "\"I always felt different from other kids\" — you've always been aware of who you are and what you feel."
    },
    {
      "trait": "Resilience",
      "evidence": "You've learned to manage your anxiety and keep going even when things are hard."
    },
    {
      "trait": "Creative Problem-Solving",
      "evidence": "You see possibilities others miss and find unique solutions to challenges."
    }
  ],
  "growth_and_complexity": {
    "growth_areas": [
      {
        "area": "Following Through",
        "compassionate_framing": "You have so many ideas — your curiosity is a gift. The challenge is choosing which one to see through to completion."
      },
      {
        "area": "Self-Compassion",
        "compassionate_framing": "You hold yourself to high standards — a strength that's helped you achieve. The growth is in being as kind to yourself as you are to others."
      }
    ],
    "shadow_traits": [
      {
        "trait": "Perfectionism",
        "acknowledgment": "I notice you have high standards — sometimes so high that it creates pressure. It's a quality that's helped you achieve so much, and I wonder if it also sometimes weighs on you."
      },
      {
        "trait": "Overthinking",
        "acknowledgment": "Your mind is always active — a gift for exploration, but sometimes it makes it hard to rest."
      }
    ]
  },
  "core_values_and_non_negotiables": {
    "core_values": [
      "Integrity — doing what's right even when no one is watching",
      "Impact — making a meaningful difference",
      "Creativity — bringing new ideas to life"
    ],
    "non_negotiables": [
      {
        "value": "Remote Flexibility",
        "reason": "You need autonomy and the ability to work from anywhere — rigid office schedules drain your energy."
      },
      {
        "value": "Purpose-Driven Work",
        "reason": "You cannot work for organizations that prioritize profit over people — it drains your soul."
      }
    ]
  },
  "flow_and_burnout": {
    "flow_triggers": [
      "Deep focus on solving complex problems",
      "Learning something new and fascinating",
      "Creating something from scratch"
    ],
    "burnout_triggers": [
      "Repetitive, unchanging tasks",
      "Constant interruptions and distractions",
      "Lack of autonomy or micromanagement"
    ],
    "balance_strategy": "Schedule uninterrupted deep work blocks (2-3 hours) before any meetings. Take a 5-minute walk after each deep work session to reset."
  },
  "learning_style": {
    "preferred_methods": [
      "Self-directed learning and exploration",
      "Research and deep dives",
      "Discussion and idea-sharing"
    ],
    "ideal_environment": "Quiet, flexible, intellectually stimulating — where you can explore ideas freely without interruption.",
    "motivations": [
      "Intrinsic curiosity — you learn because you genuinely want to understand",
      "The joy of discovery — finding new connections and insights",
      "Intellectual challenge — you love solving hard problems"
    ]
  },
  "career_affinities": [
    {
      "role_type": "Product Designer",
      "industry": "Technology",
      "reasoning": "Your creativity and problem-solving skills make you a natural designer. You can see the big picture while also obsessing over the details.",
      "psychological_fit": "You thrive when you can deeply understand users' needs and create solutions that make their lives better — this aligns with your desire for impact.",
      "execution_risk": "The hardest part for you will be the iteration cycles. You love exploring ideas, but refining the same design repeatedly may feel tedious. Build systems to manage iteration without losing momentum."
    },
    {
      "role_type": "Architect",
      "industry": "Architecture",
      "reasoning": "Your childhood love of building and teenage passion for design points to a career where you can create tangible, lasting things.",
      "psychological_fit": "You find meaning in creating physical spaces that shape how people live and work — this aligns with your need for tangible impact.",
      "execution_risk": "The hardest part for you will be the long timelines and regulatory constraints. You thrive on exploration, but architecture requires patience and adherence to codes."
    },
    {
      "role_type": "Product Manager",
      "industry": "Technology",
      "reasoning": "Your combination of creativity, problem-solving, and leadership would make you a natural product manager — you can see the vision and execute on it.",
      "psychological_fit": "You thrive when you can balance strategic vision with tactical execution — this aligns with your desire for both creativity and impact.",
      "execution_risk": "The hardest part for you will be the constant context-switching and meetings. You love deep focus, but product management requires constant communication."
    }
  ],
  "work_environment": {
    "thrive_in": [
      "Flexible, autonomous work settings where you can explore ideas freely",
      "Intellectually stimulating environments with continuous learning opportunities",
      "Collaborative, idea-rich teams where curiosity is valued"
    ],
    "struggle_in": [
      "Highly rigid, bureaucratic settings",
      "Repetitive, unchanging tasks that don't challenge your curiosity"
    ],
    "work_style": [
      "Thrives with intellectual freedom and autonomy",
      "Enjoys deep dives into topics",
      "Prefers variety over routine",
      "Values learning over hierarchy"
    ]
  },
  "immediate_next_steps": {
    "skill_gaps": [
      {
        "skill": "Figma / Design Tools",
        "severity": "BRIDGEABLE",
        "recommended_action": "Complete a 2-week Figma course on Coursera and redesign a familiar app"
      },
      {
        "skill": "User Research",
        "severity": "CRITICAL",
        "recommended_action": "Read 'The Design of Everyday Things' and conduct 3 user interviews this month"
      },
      {
        "skill": "Portfolio Development",
        "severity": "CRITICAL",
        "recommended_action": "Create a portfolio with 3 case studies showcasing your process"
      }
    ],
    "learning_path": {
      "formal_education": ["Certificate in Human-Computer Interaction"],
      "certifications": ["Google UX Design Certificate"],
      "self_directed_projects": ["Redesign a familiar app", "Build a portfolio case study"]
    },
    "first_action": "Spend 2 hours this Monday researching UX design portfolio examples and identify 5 you admire."
  },
  "guidance_note": "Your curiosity and creativity are your superpowers. The world needs people who can see connections others miss. Trust your instincts — they've served you well. I wonder — what would it look like to give yourself permission to explore one of these paths, just for a week, without any pressure to commit?",
  "validation": {
    "question": "Does this feel like you? I want to make sure I'm seeing you clearly. What would you add or change?",
    "next_steps": [
      "If this feels right → I'll help you explore your career path",
      "If something feels off → Tell me what to refine, and I'll adjust",
      "If you have questions → I'm here to answer them"
    ]
  }
}

```