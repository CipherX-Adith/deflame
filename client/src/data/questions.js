export const QUESTIONS = [
  {
    id: "argue_frequency",
    dimension: "K",
    title: "How often do you argue?",
    subtitle: "From minor thermostat spats to philosophical existential crises.",
    icon: "MessageSquareWarning",
    options: [
      { label: "Rarely", desc: "Zen masters of peace and unspoken passive sighs", value: "Rarely" },
      { label: "Sometimes", desc: "Occasional spicy debates about what to eat for dinner", value: "Sometimes" },
      { label: "Often", desc: "Daily recurring courtroom trials over chores", value: "Often" },
      { label: "Constantly", desc: "Perpetual UFC championship title matches", value: "Constantly" }
    ]
  },
  {
    id: "communication_style",
    dimension: "C",
    title: "How would you describe your communication style?",
    subtitle: "When something is bothering you, what actually happens?",
    icon: "Radio",
    options: [
      { label: "Very open and direct", desc: "Radical honesty with no hidden subtext", value: "Very open and direct" },
      { label: "Mostly open", desc: "We talk things out with mild diplomatic hedging", value: "Mostly open" },
      { label: "Sometimes avoidant", desc: "'I'm fine.' (Narrator: They were not fine.)", value: "Sometimes avoidant" },
      { label: "Mostly avoidant or aggressive", desc: "Silent treatment followed by dramatic door slamming", value: "Mostly avoidant or aggressive" }
    ]
  },
  {
    id: "time_together",
    dimension: "T",
    title: "How much quality time do you spend together per week?",
    subtitle: "Active attention, not just parallel scrolling on separate sofas.",
    icon: "Clock",
    options: [
      { label: "Less than 5 hours", desc: "Two ships passing like fleeting ghosts", value: "Less than 5 hours" },
      { label: "5–10 hours", desc: "Standard weekly date night & occasional brunch", value: "5–10 hours" },
      { label: "10–20 hours", desc: "Solid connection time, deep talks and shared meals", value: "10–20 hours" },
      { label: "More than 20 hours", desc: "Attached at the hip like Siamese twins", value: "More than 20 hours" }
    ]
  },
  {
    id: "goals_similarity",
    dimension: "G",
    title: "How similar are your long-term life goals?",
    subtitle: "Where do you see yourselves when civilization reaches year 2035?",
    icon: "Compass",
    options: [
      { label: "Very different", desc: "One wants a goat farm in Idaho, the other a Tokyo penthouse", value: "Very different" },
      { label: "Somewhat different", desc: "Roughly overlapping continents, differing timelines", value: "Somewhat different" },
      { label: "Mostly similar", desc: "Shared core values with minor city preferences", value: "Mostly similar" },
      { label: "Very similar", desc: "Identical Pinterest vision boards and 10-year roadmaps", value: "Very similar" }
    ]
  },
  {
    id: "financial_compatibility",
    dimension: "F",
    title: "How compatible are your financial habits?",
    subtitle: "When payday drops and spontaneous online shopping calls...",
    icon: "PiggyBank",
    options: [
      { label: "Very different", desc: "Frugal coupon clipper meets compulsive luxury collector", value: "Very different" },
      { label: "Somewhat different", desc: "One saves diligently, one orders DoorDash 4x a week", value: "Somewhat different" },
      { label: "Mostly similar", desc: "General agreement on savings goals and treat-yourself caps", value: "Mostly similar" },
      { label: "Very similar", desc: "Synced budget spreadsheets and shared financial minimalism", value: "Very similar" }
    ]
  },
  {
    id: "interests_overlap",
    dimension: "I",
    title: "How well do your interests and hobbies overlap?",
    subtitle: "What happens when someone says 'Let's do something fun this weekend'?",
    icon: "Sparkles",
    options: [
      { label: "Low", desc: "Opposite ends of the universe (Gamer vs Extreme Mountaineer)", value: "Low" },
      { label: "Medium", desc: "A couple shared shows, but separate individual pursuits", value: "Medium" },
      { label: "High", desc: "Obsessed with the exact same niche indie subcultures", value: "High" }
    ]
  },
  {
    id: "conflict_handling",
    dimension: "K2",
    title: "How do you handle conflicts?",
    subtitle: "When the tension peaks and voices rise, how does it end?",
    icon: "ShieldAlert",
    options: [
      { label: "We resolve calmly", desc: "Empathetic listening and constructive problem solving", value: "We resolve calmly" },
      { label: "We argue but reconcile", desc: "Brief heated explosion followed by makeup hugs and snacks", value: "We argue but reconcile" },
      { label: "We often leave things unresolved", desc: "Swept cleanly under the rug to fester for next quarter", value: "We often leave things unresolved" },
      { label: "We frequently escalate conflicts", desc: "Full-scale thermonuclear scorched earth warfare", value: "We frequently escalate conflicts" }
    ]
  }
];

export const APP_MODES = [
  {
    id: 'relationship',
    title: 'Romantic Couple',
    icon: 'Heart',
    tagline: 'Predict your romantic expiry date & decay curve',
    accent: 'rose'
  },
  {
    id: 'friendship',
    title: 'Best Friends',
    icon: 'Users',
    tagline: 'When will your group chat go completely silent?',
    accent: 'amber'
  },
  {
    id: 'cofounder',
    title: 'Startup Co-Founders',
    icon: 'Briefcase',
    tagline: 'Who will rage-quit the cap table first?',
    accent: 'cyan'
  }
];
