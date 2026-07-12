# Guidance Template — Baagupadu Career Roadmap Output

## 📋 About This File

| Field | Value |
|-------|-------|
| **File Name** | `guidance_template.md` |
| **Purpose** | Defines the strict output schema for presenting the career roadmap to the user |
| **When to Use** | After persona is validated and career affinities are mapped |
| **Key Principle** | The roadmap should bridge insight to action — clear, actionable, and motivating |
| **Tone** | Practical, encouraging, empowering, structured |
| **Output Format** | JSON (for UI rendering) with rich Markdown fields |

---

## 🎯 How to Use This Template

| Step | Action |
|------|--------|
| 1 | Follow the JSON schema below — this is the EXACT structure to output |
| 2 | Use the persona data from `persona_template.md` |
| 3 | Use the career mapping from `career_framework.json` |
| 4 | Include specific, actionable steps — not generic advice |
| 5 | Include realistic timeframes (e.g., "1-2 weeks", "1 hour/day") — NOT hyper-specific hour counts |
| 6 | Include a 30-60-90 day action plan |
| 7 | End with motivation and next steps |

---

## 📄 STRICT OUTPUT SCHEMA (LLM MUST FOLLOW THIS)

```json
{
  "career_roadmap": {
    "executive_summary": {
      "heading": "string (Your Career Roadmap)",
      "overview": "string (2-3 sentence summary of the roadmap)",
      "persona_connection": "string (How this roadmap connects to their persona)"
    },
    "primary_career_path": {
      "title": "string",
      "role_type": "string",
      "industry": "string",
      "reasoning": "string",
      "psychological_fit": "string",
      "execution_risk": "string",
      "day_in_the_life": "string (What a typical day looks like)",
      "growth_trajectory": "string (5-year progression path)",
      "transition_reality_check": {
        "financial_considerations": "string (e.g., 'Expect a 15% pay cut initially as a junior')",
        "market_demand": "string (e.g., 'High demand, but highly competitive entry-level')",
        "timeline_realism": "string (e.g., 'Realistically, this is a 9-12 month pivot')"
      }
    },
    "alternative_paths": [
      {
        "title": "string",
        "role_type": "string",
        "industry": "string",
        "reasoning": "string",
        "why_alternative": "string",
        "execution_risk": "string"
      }
    ],
    "skill_gap_analysis": {
      "current_skills": ["string"],
      "required_skills": ["string"],
      "critical_gaps": [
        {
          "skill": "string",
          "severity": "CRITICAL | BRIDGEABLE | SOFT_SKILL",
          "recommended_action": "string",
          "time_estimate": "string (use broad realistic timeframe, e.g., '2-4 weeks')"
        }
      ],
      "bridgeable_gaps": [
        {
          "skill": "string",
          "transferable_skill": "string",
          "recommended_action": "string",
          "time_estimate": "string (use broad realistic timeframe, e.g., '1-2 weeks')"
        }
      ],
      "soft_skill_gaps": [
        {
          "skill": "string",
          "recommended_action": "string"
        }
      ]
    },
    "learning_path": {
      "formal_education": [
        {
          "program": "string",
          "institution": "string",
          "duration": "string",
          "priority": "HIGH | MEDIUM | LOW"
        }
      ],
      "certifications": [
        {
          "name": "string",
          "provider": "string",
          "duration": "string",
          "priority": "HIGH | MEDIUM | LOW"
        }
      ],
      "self_directed_projects": [
        {
          "name": "string",
          "description": "string",
          "duration": "string (use broad realistic timeframe)",
          "priority": "HIGH | MEDIUM | LOW"
        }
      ],
      "networking_strategy": [
        {
          "action": "string",
          "why": "string",
          "frequency": "string"
        }
      ]
    },
    "action_plan": {
      "first_week": [
        {
          "action": "string",
          "why": "string",
          "timeframe": "string (use broad realistic timeframe, e.g., '1-2 hours')"
        }
      ],
      "first_month": [
        {
          "action": "string",
          "why": "string",
          "timeframe": "string (use broad realistic timeframe, e.g., '1-2 weeks')"
        }
      ],
      "first_quarter": [
        {
          "action": "string",
          "why": "string",
          "timeframe": "string (use broad realistic timeframe, e.g., '3-4 weeks')"
        }
      ],
      "first_year": [
        {
          "action": "string",
          "why": "string",
          "timeframe": "string (use broad realistic timeframe, e.g., '3-6 months')"
        }
      ]
    },
    "work_environment_fit": {
      "ideal_environments": ["string"],
      "avoid_environments": ["string"],
      "team_dynamics": "string (How they work best in teams)",
      "management_style": "string (What kind of manager they need)"
    },
    "success_metrics": {
      "behavioral_metrics": [
        {
          "metric": "string (leading behavior, e.g., 'Reach out to 5 designers per week for informational interviews')",
          "target": "string",
          "timeframe": "string"
        }
      ],
      "outcome_metrics": [
        {
          "metric": "string (lagging outcome, e.g., 'Offer accepted')",
          "target": "string",
          "timeframe": "string"
        }
      ]
    },
    "motivational_note": "string (1-2 sentences of encouragement)",
    "next_steps": {
      "immediate_action": "string (What to do today/tomorrow)",
      "resources": ["string (Links or recommendations)"],
      "validation_question": "string (Does this roadmap feel right for you?)"
    }
  }
}

```

## 📄 SECTION-BY-SECTION INSTRUCTIONS
Section 1: Executive Summary
#### Instructions:

- Provide a 2-3 sentence overview of the roadmap

- Connect the roadmap to the user's persona

- Set the tone for what's ahead

#### Schema:

```json
"executive_summary": {
  "heading": "Your Career Roadmap",
  "overview": "Based on your unique persona — The Curious Explorer — here is a personalized career roadmap designed to leverage your natural curiosity, creativity, and problem-solving skills.",
  "persona_connection": "Your natural pattern recognition and intellectual versatility make you uniquely suited for roles that require deep thinking and creative problem-solving."
}
Section 2: Primary Career Path
```

#### Instructions:

- Focus on the #1 best-fit career

- Include day-in-the-life description

- Include 5-year growth trajectory

NEW: Include a reality check (financial, market, timeline)

#### Schema:

```json
"primary_career_path": {
  "title": "Product Designer",
  "role_type": "Creator",
  "industry": "Technology",
  "reasoning": "Your creativity and problem-solving skills make you a natural designer.",
  "psychological_fit": "You thrive when you can deeply understand users' needs and create solutions that make their lives better.",
  "execution_risk": "The hardest part for you will be iteration cycles. Build systems to manage refinement without losing momentum.",
  "day_in_the_life": "You'll start your day with user research, spend mid-morning sketching wireframes, collaborate with engineers in the afternoon, and end with user testing and iteration.",
  "growth_trajectory": "Junior Designer → Mid-Level Designer → Senior Designer → Lead Designer → Design Director",
  "transition_reality_check": {
    "financial_considerations": "Expect a 15-20% pay cut initially as a junior. Entry-level design roles typically pay less than mid-career roles in other fields.",
    "market_demand": "High demand for design roles, but highly competitive at the entry level. You'll need a strong portfolio to stand out.",
    "timeline_realism": "Realistically, this is a 9-12 month transition. It will take time to build skills, create a portfolio, and find the right opportunity."
  }
}
Section 3: Alternative Paths
```

#### Instructions:

- Include 2-3 alternative career paths

- For each, explain why it's a good fit

- Explain why it's "alternative"

NEW: Include execution_risk for alternatives

#### Schema:

```json
"alternative_paths": [
  {
    "title": "UX Researcher",
    "role_type": "Individual Contributor",
    "industry": "Technology",
    "reasoning": "Your curiosity about how people think and behave makes you a natural UX researcher.",
    "why_alternative": "More research-focused, less design execution — if you prefer understanding users over creating solutions.",
    "execution_risk": "You might miss the creative design aspect. UX research requires patience with data synthesis and user observation."
  },
  {
    "title": "Product Manager",
    "role_type": "Strategist",
    "industry": "Technology",
    "reasoning": "Your combination of creativity, problem-solving, and leadership makes you a natural product manager.",
    "why_alternative": "More strategic and cross-functional — if you prefer vision and execution over hands-on design.",
    "execution_risk": "The hardest part will be the constant context-switching and meetings. You love deep focus, but product management requires constant communication."
  }
]
Section 4: Skill Gap Analysis
```

#### Instructions:

- Identify current skills (from user's Adult phase)

- Identify required skills (from career framework)

Categorize gaps: CRITICAL, BRIDGEABLE, SOFT_SKILL

#### Schema:

```json
"skill_gap_analysis": {
  "current_skills": ["Creative problem-solving", "User empathy", "Visual thinking", "Communication"],
  "required_skills": ["Figma / Design Tools", "User Research", "Prototyping", "Design Systems", "HTML/CSS"],
  "critical_gaps": [
    {
      "skill": "Figma / Design Tools",
      "severity": "CRITICAL",
      "recommended_action": "Complete a 2-week Figma course on Coursera",
      "time_estimate": "2-4 weeks"
    },
    {
      "skill": "User Research",
      "severity": "CRITICAL",
      "recommended_action": "Read 'The Design of Everyday Things' and conduct 3 user interviews",
      "time_estimate": "1-2 months"
    }
  ],
  "bridgeable_gaps": [
    {
      "skill": "Prototyping",
      "transferable_skill": "Visual thinking + problem-solving",
      "recommended_action": "Build 3 low-fidelity prototypes for different user flows",
      "time_estimate": "2-3 weeks"
    }
  ],
  "soft_skill_gaps": [
    {
      "skill": "Iteration Resilience",
      "recommended_action": "Practice receiving feedback without attachment — join a design critique group"
    }
  ]
}
Section 5: Learning Path
```

#### Instructions:

- Recommend formal education if needed

- Recommend certifications

- Include self-directed projects

NEW: Include networking strategy

#### Schema:

```json
"learning_path": {
  "formal_education": [
    {
      "program": "Certificate in Human-Computer Interaction",
      "institution": "Coursera / Interaction Design Foundation",
      "duration": "3-6 months",
      "priority": "HIGH"
    }
  ],
  "certifications": [
    {
      "name": "Google UX Design Certificate",
      "provider": "Coursera",
      "duration": "6 months",
      "priority": "HIGH"
    }
  ],
  "self_directed_projects": [
    {
      "name": "Redesign a Familiar App",
      "description": "Pick an app you use daily and redesign its core user flow",
      "duration": "2-3 weeks",
      "priority": "HIGH"
    },
    {
      "name": "Build a Portfolio Case Study",
      "description": "Document your redesign process from research to final design",
      "duration": "3-4 weeks",
      "priority": "HIGH"
    }
  ],
  "networking_strategy": [
    {
      "action": "Join ADPList and schedule 1 mentorship session per week",
      "why": "Get direct feedback from experienced designers and build your network",
      "frequency": "Weekly"
    },
    {
      "action": "Reach out to 2 designers on LinkedIn per week for informational interviews",
      "why": "Learn about different design roles and build relationships",
      "frequency": "Weekly"
    },
    {
      "action": "Join UX Collective or Design Buddies community",
      "why": "Stay updated on trends and get feedback on your work",
      "frequency": "Daily"
    }
  ]
}
Section 6: Action Plan
```

#### Instructions:

First Week: Immediate, easy wins

First Month: Building momentum

First Quarter: Significant progress

First Year: Long-term milestones

IMPORTANT: Use broad realistic timeframes (e.g., "1-2 hours", "1-2 weeks", "3-4 weeks") — NOT hyper-specific hour counts

#### Schema:

```json
"action_plan": {
  "first_week": [
    {
      "action": "Research UX design portfolio examples",
      "why": "Understand the quality bar and what hiring managers look for",
      "timeframe": "2-3 hours"
    },
    {
      "action": "Create a Figma account and complete the introductory tutorial",
      "why": "Get hands-on with the industry-standard design tool",
      "timeframe": "3-4 hours"
    }
  ],
  "first_month": [
    {
      "action": "Complete the Google UX Design Certificate first module",
      "why": "Build foundational knowledge",
      "timeframe": "1-2 weeks"
    },
    {
      "action": "Conduct 3 user interviews",
      "why": "Practice user research skills",
      "timeframe": "1-2 weeks"
    }
  ],
  "first_quarter": [
    {
      "action": "Redesign a familiar app and document the process",
      "why": "Build portfolio piece #1",
      "timeframe": "4-6 weeks"
    },
    {
      "action": "Join a design community (e.g., ADPList, Design Buddies)",
      "why": "Build network and get feedback",
      "timeframe": "Ongoing"
    }
  ],
  "first_year": [
    {
      "action": "Complete Google UX Design Certificate",
      "why": "Earn credential and build portfolio",
      "timeframe": "6-9 months"
    },
    {
      "action": "Apply to 10 product design roles",
      "why": "Start your career transition",
      "timeframe": "2-3 months"
    }
  ]
}
Section 7: Work Environment Fit
```

#### Instructions:

- Ideal environments based on persona

- Environments to avoid

- Team dynamics preference

- Management style preference

#### Schema:

```json
"work_environment_fit": {
  "ideal_environments": [
    "Flexible, autonomous work settings",
    "Intellectually stimulating environments",
    "Collaborative, idea-rich teams"
  ],
  "avoid_environments": [
    "Highly rigid, bureaucratic settings",
    "Repetitive, unchanging tasks"
  ],
  "team_dynamics": "You work best in cross-functional teams with engineers and product managers. You thrive on collaboration but need focused time for deep work.",
  "management_style": "You need a manager who gives you autonomy and intellectual freedom — someone who challenges your thinking without micromanaging."
}
Section 8: Success Metrics
```

#### Instructions:

NEW: Include Behavioral Metrics (leading indicators, actions the user controls)

- Include Outcome Metrics (lagging indicators, results)

- Both qualitative and quantitative

#### Schema:

```json
"success_metrics": {
  "behavioral_metrics": [
    {
      "metric": "Reach out to 5 designers per week for informational interviews",
      "target": "20+ connections/month",
      "timeframe": "Monthly"
    },
    {
      "metric": "Complete 1 design challenge per week",
      "target": "30 challenges in 30 days",
      "timeframe": "Monthly"
    },
    {
      "metric": "Share work on design community for feedback",
      "target": "3 portfolio pieces",
      "timeframe": "Quarterly"
    }
  ],
  "outcome_metrics": [
    {
      "metric": "Complete Google UX Design Certificate",
      "target": "100% completion",
      "timeframe": "6 months"
    },
    {
      "metric": "Land a product design role",
      "target": "Offer accepted",
      "timeframe": "12-18 months"
    }
  ]
}
Section 9: Motivational Note
```

#### Instructions:

- Personalized encouragement

- Connect to their persona and strengths

#### Schema:

```json
"motivational_note": "Your curiosity and creativity are your superpowers. The world needs people who can see connections others miss and create solutions that make lives better. Trust your instincts — they've served you well. You've already done the hardest part: understanding who you truly are. Now, take the next step, one small action at a time."
Section 10: Next Steps
```

#### Instructions:

- Immediate action (today/tomorrow)

- Recommended resources

- Validation question

#### Schema:

```json
"next_steps": {
  "immediate_action": "Spend 2-3 hours this week researching UX design portfolio examples and identify 5 you admire.",
  "resources": [
    "Google UX Design Certificate (Coursera)",
    "Figma — Free Design Tool",
    "The Design of Everyday Things — Don Norman",
    "ADPList — Free Mentorship Platform"
  ],
  "validation_question": "Does this roadmap feel right for you? Which path excites you the most? I'm here to help you refine it."
}
```

## 📄 COMPLETE EXAMPLE OUTPUT
```json
{
  "career_roadmap": {
    "executive_summary": {
      "heading": "Your Career Roadmap",
      "overview": "Based on your unique persona — The Curious Explorer — here is a personalized career roadmap designed to leverage your natural curiosity, creativity, and problem-solving skills.",
      "persona_connection": "Your natural pattern recognition and intellectual versatility make you uniquely suited for roles that require deep thinking and creative problem-solving. Your curiosity drives you to explore, and your resilience helps you push through challenges."
    },
    "primary_career_path": {
      "title": "Product Designer",
      "role_type": "Creator",
      "industry": "Technology",
      "reasoning": "Your creativity and problem-solving skills make you a natural designer. You can see the big picture while also obsessing over the details.",
      "psychological_fit": "You thrive when you can deeply understand users' needs and create solutions that make their lives better — this aligns with your desire for impact.",
      "execution_risk": "The hardest part for you will be the iteration cycles. You love exploring ideas, but refining the same design repeatedly may feel tedious. Build systems to manage iteration without losing momentum.",
      "day_in_the_life": "You'll start your day with user research, spend mid-morning sketching wireframes, collaborate with engineers in the afternoon, and end with user testing and iteration. You'll work closely with cross-functional teams while having autonomy over your design decisions.",
      "growth_trajectory": "Junior Designer → Mid-Level Designer → Senior Designer → Lead Designer → Design Director",
      "transition_reality_check": {
        "financial_considerations": "Expect a 15-20% pay cut initially as a junior. Entry-level design roles typically pay less than mid-career roles in other fields.",
        "market_demand": "High demand for design roles, but highly competitive at the entry level. You'll need a strong portfolio to stand out.",
        "timeline_realism": "Realistically, this is a 9-12 month transition. It will take time to build skills, create a portfolio, and find the right opportunity."
      }
    },
    "alternative_paths": [
      {
        "title": "UX Researcher",
        "role_type": "Individual Contributor",
        "industry": "Technology",
        "reasoning": "Your curiosity about how people think and behave makes you a natural UX researcher.",
        "why_alternative": "More research-focused, less design execution — if you prefer understanding users over creating solutions.",
        "execution_risk": "You might miss the creative design aspect. UX research requires patience with data synthesis and user observation."
      },
      {
        "title": "Product Manager",
        "role_type": "Strategist",
        "industry": "Technology",
        "reasoning": "Your combination of creativity, problem-solving, and leadership makes you a natural product manager.",
        "why_alternative": "More strategic and cross-functional — if you prefer vision and execution over hands-on design.",
        "execution_risk": "The hardest part will be the constant context-switching and meetings. You love deep focus, but product management requires constant communication."
      }
    ],
    "skill_gap_analysis": {
      "current_skills": ["Creative problem-solving", "User empathy", "Visual thinking", "Communication", "Curiosity"],
      "required_skills": ["Figma / Design Tools", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "Design Thinking"],
      "critical_gaps": [
        {
          "skill": "Figma / Design Tools",
          "severity": "CRITICAL",
          "recommended_action": "Complete a 2-week Figma course on Coursera and practice by redesigning a familiar app",
          "time_estimate": "2-4 weeks"
        },
        {
          "skill": "User Research",
          "severity": "CRITICAL",
          "recommended_action": "Read 'The Design of Everyday Things' and conduct 3 user interviews this month",
          "time_estimate": "1-2 months"
        }
      ],
      "bridgeable_gaps": [
        {
          "skill": "Prototyping",
          "transferable_skill": "Visual thinking and problem-solving — you already think in solutions",
          "recommended_action": "Build 3 low-fidelity prototypes for different user flows",
          "time_estimate": "2-3 weeks"
        },
        {
          "skill": "Design Systems",
          "transferable_skill": "Pattern recognition and system thinking",
          "recommended_action": "Study existing design systems (Material Design, Carbon) and document patterns",
          "time_estimate": "1-2 months"
        }
      ],
      "soft_skill_gaps": [
        {
          "skill": "Iteration Resilience",
          "recommended_action": "Practice receiving feedback without attachment — join a design critique group"
        },
        {
          "skill": "Self-Promotion",
          "recommended_action": "Learn to articulate your design decisions and share your work confidently"
        }
      ]
    },
    "learning_path": {
      "formal_education": [
        {
          "program": "Certificate in Human-Computer Interaction",
          "institution": "Coursera / Interaction Design Foundation",
          "duration": "3-6 months",
          "priority": "HIGH"
        }
      ],
      "certifications": [
        {
          "name": "Google UX Design Certificate",
          "provider": "Coursera",
          "duration": "6 months",
          "priority": "HIGH"
        }
      ],
      "self_directed_projects": [
        {
          "name": "Redesign a Familiar App",
          "description": "Pick an app you use daily and redesign its core user flow — document your process from research to final design",
          "duration": "2-3 weeks",
          "priority": "HIGH"
        },
        {
          "name": "Build a Portfolio Case Study",
          "description": "Document your redesign process — user research, sketches, wireframes, prototypes, final design",
          "duration": "3-4 weeks",
          "priority": "HIGH"
        }
      ],
      "networking_strategy": [
        {
          "action": "Join ADPList and schedule 1 mentorship session per week",
          "why": "Get direct feedback from experienced designers and build your network",
          "frequency": "Weekly"
        },
        {
          "action": "Reach out to 2 designers on LinkedIn per week for informational interviews",
          "why": "Learn about different design roles and build relationships",
          "frequency": "Weekly"
        },
        {
          "action": "Join UX Collective or Design Buddies community",
          "why": "Stay updated on trends and get feedback on your work",
          "frequency": "Daily"
        }
      ]
    },
    "action_plan": {
      "first_week": [
        {
          "action": "Research UX design portfolio examples and identify 5 you admire",
          "why": "Understand the quality bar and what hiring managers look for",
          "timeframe": "2-3 hours"
        },
        {
          "action": "Create a Figma account and complete the introductory tutorial",
          "why": "Get hands-on with the industry-standard design tool",
          "timeframe": "3-4 hours"
        }
      ],
      "first_month": [
        {
          "action": "Complete the Google UX Design Certificate first module",
          "why": "Build foundational knowledge and get into a learning rhythm",
          "timeframe": "1-2 weeks"
        },
        {
          "action": "Conduct 3 user interviews",
          "why": "Practice user research skills and build empathy for users",
          "timeframe": "1-2 weeks"
        },
        {
          "action": "Start a design critique group with 2-3 peers",
          "why": "Get feedback and build a support network",
          "timeframe": "2-3 hours"
        }
      ],
      "first_quarter": [
        {
          "action": "Redesign a familiar app and document the process",
          "why": "Build portfolio piece #1",
          "timeframe": "4-6 weeks"
        },
        {
          "action": "Join a design community (ADPList, Design Buddies, UX Collective)",
          "why": "Build network and get feedback",
          "timeframe": "Ongoing"
        },
        {
          "action": "Complete Google UX Design Certificate Module 2-3",
          "why": "Continue building skills",
          "timeframe": "3-4 weeks"
        }
      ],
      "first_year": [
        {
          "action": "Complete Google UX Design Certificate",
          "why": "Earn credential and build portfolio",
          "timeframe": "6-9 months"
        },
        {
          "action": "Build portfolio with 3 case studies",
          "why": "Showcase your design process and skills",
          "timeframe": "3-4 months"
        },
        {
          "action": "Apply to 10 product design roles",
          "why": "Start your career transition",
          "timeframe": "2-3 months"
        }
      ]
    },
    "work_environment_fit": {
      "ideal_environments": [
        "Flexible, autonomous work settings where you can explore ideas freely",
        "Intellectually stimulating environments with continuous learning opportunities",
        "Collaborative, idea-rich teams where curiosity is valued",
        "Companies that prioritize user-centered design and innovation"
      ],
      "avoid_environments": [
        "Highly rigid, bureaucratic settings",
        "Repetitive, unchanging tasks that don't challenge your curiosity",
        "Environments that don't value design or user research",
        "Companies where design is an afterthought"
      ],
      "team_dynamics": "You work best in cross-functional teams with engineers and product managers. You thrive on collaboration but need focused time for deep work. You naturally bring positive energy to teams and help bridge communication gaps.",
      "management_style": "You need a manager who gives you autonomy and intellectual freedom — someone who challenges your thinking without micromanaging. You respond well to mentors who trust you and push you to grow."
    },
    "success_metrics": {
      "behavioral_metrics": [
        {
          "metric": "Reach out to 5 designers per week for informational interviews",
          "target": "20+ connections/month",
          "timeframe": "Monthly"
        },
        {
          "metric": "Complete 1 design challenge per week",
          "target": "30 challenges in 30 days",
          "timeframe": "Monthly"
        },
        {
          "metric": "Share work on design community for feedback",
          "target": "3 portfolio pieces",
          "timeframe": "Quarterly"
        }
      ],
      "outcome_metrics": [
        {
          "metric": "Complete Google UX Design Certificate",
          "target": "100% completion",
          "timeframe": "6 months"
        },
        {
          "metric": "Portfolio pieces created",
          "target": "3 case studies",
          "timeframe": "6 months"
        },
        {
          "metric": "Land a product design role",
          "target": "Offer accepted",
          "timeframe": "12-18 months"
        }
      ]
    },
    "motivational_note": "Your curiosity and creativity are your superpowers. The world needs people who can see connections others miss and create solutions that make lives better. Trust your instincts — they've served you well. You've already done the hardest part: understanding who you truly are. Now, take the next step, one small action at a time. I believe in you — and I'm here to help you every step of the way.",
    "next_steps": {
      "immediate_action": "Spend 2-3 hours this week researching UX design portfolio examples and identify 5 you admire. Then, create your Figma account and start the tutorial.",
      "resources": [
        "Google UX Design Certificate — Coursera",
        "Figma — Free Design Tool",
        "The Design of Everyday Things — Don Norman",
        "ADPList — Free Mentorship Platform",
        "UX Collective — Design Community",
        "Design Buddies — Design Community"
      ],
      "validation_question": "Does this roadmap feel right for you? Which path excites you the most? I'm here to help you refine it and make it even more aligned with who you are."
    }
  }
}


```