/**
 * Separation Reason Generator Engine
 * 
 * Identifies lowest scoring dimensions and generates humorous, witty textual separation reasons.
 */

const DIMENSION_REASONS = {
  relationship: {
    C: {
      name: "Communication",
      primary: "Communication breakdown",
      secondary: "Passive-aggressive texting and unspoken assumptions"
    },
    T: {
      name: "Quality Time",
      primary: "Emotional distance from limited quality time",
      secondary: "Parallel scrolling on TikTok instead of connecting"
    },
    I: {
      name: "Interests & Lifestyle",
      primary: "Growing apart due to mismatched interests and lifestyles",
      secondary: "Incompatible Netflix queues and weekend hobbies"
    },
    F: {
      name: "Financial Habits",
      primary: "Financial stress and incompatible spending habits",
      secondary: "Unsynchronized grocery budgets and impulsive Amazon orders"
    },
    G: {
      name: "Life Goals",
      primary: "Diverging life goals and conflicting priorities",
      secondary: "Opposing 5-year plans regarding cities, pets, and career paths"
    },
    K: {
      name: "Conflict Handling",
      primary: "Unresolved conflicts escalating over time",
      secondary: "Bringing up arguments from 8 months ago during pizza night"
    }
  },
  friendship: {
    C: {
      name: "Group Chat Chemistry",
      primary: "Gradual ghosting and unanswered group memes",
      secondary: "Left on read for 3 business weeks"
    },
    T: {
      name: "Hangout Frequency",
      primary: "Scheduling paralysis ('We definitely need to catch up soon!')",
      secondary: "Planning hangouts that stay perpetually stuck in draft mode"
    },
    I: {
      name: "Shared Vibe",
      primary: "Vibe divergence into completely separate hyper-fixations",
      secondary: "One of you got into bouldering, the other started sourdough"
    },
    F: {
      name: "Bill Splitting",
      primary: "Venmo request awkwardness and unequal snack budgeting",
      secondary: "Itemizing restaurant receipts down to the exact lime wedge"
    },
    G: {
      name: "Life Trajectory",
      primary: "Moving to different life eras and bedtime routines",
      secondary: "One became an 8 PM sleep enthusiast, the other a 3 AM rave goblin"
    },
    K: {
      name: "Vibe Check",
      primary: "Simmering passive-aggressiveness over unreturned borrowed hoodies",
      secondary: "Unresolved tension over who chose the last mediocre brunch spot"
    }
  },
  cofounder: {
    C: {
      name: "Async Syncs",
      primary: "Fatal Slack thread paralysis and misaligned async communication",
      secondary: "Ignoring urgent blockers in favor of redesigning the logo"
    },
    T: {
      name: "Sprint Commitment",
      primary: "Asymmetrical grind hours and divergent commitment levels",
      secondary: "One worked 80-hour weeks, the other took 4-day 'ideation weekends'"
    },
    I: {
      name: "Tech / Product Vision",
      primary: "Irreconcilable architectural wars (e.g. Microservices vs Monolith)",
      secondary: "Rewriting the entire codebase in Rust without team consensus"
    },
    F: {
      name: "Cap Table & Burn Rate",
      primary: "Disputes over equity split and unchecked SaaS subscription burn",
      secondary: "Buying \$4,000 ergonomic chairs before achieving product-market fit"
    },
    G: {
      name: "Exit Strategy",
      primary: "Divergent north stars (Bootstrapped lifestyle vs Hyper-VC rocket)",
      secondary: "One wanted IPO glory; the other wanted a cozy 4-hour workweek"
    },
    K: {
      name: "Boardroom Clashes",
      primary: "Deadlocked product decisions leading to executive rage-quits",
      secondary: "Passive-aggressive Jira ticket assignments during retrospectives"
    }
  }
};

function generateReasons(scores, mode = 'relationship') {
  const modeKey = DIMENSION_REASONS[mode] ? mode : 'relationship';
  const table = DIMENSION_REASONS[modeKey];

  const dimensions = ['C', 'T', 'I', 'F', 'G', 'K'];
  const ranked = dimensions
    .map(dim => ({ dim, score: scores[dim] ?? 0.5, meta: table[dim] }))
    .sort((a, b) => a.score - b.score);

  const lowest = ranked[0];
  const secondLowest = ranked[1];
  const thirdLowest = ranked[2];

  let primary_reason = `${lowest.meta.primary} compounded by ${secondLowest.meta.primary.toLowerCase()}.`;
  
  // Format secondary factors array
  const secondary_factors = [
    lowest.meta.secondary,
    secondLowest.meta.secondary,
    `Low ${thirdLowest.meta.name} stability (${Math.round(thirdLowest.score * 100)}%)`
  ];

  return {
    primary_reason,
    secondary_factors,
    lowest_dimension: lowest.dim,
    second_lowest_dimension: secondLowest.dim,
    ranked_dimensions: ranked.map(r => ({
      dim: r.dim,
      name: r.meta.name,
      score: r.score
    }))
  };
}

module.exports = {
  DIMENSION_REASONS,
  generateReasons
};
