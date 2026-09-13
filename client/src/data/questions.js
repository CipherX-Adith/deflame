const SCORES = [0.2, 0.55, 0.8, 1];

const question = (id, dimension, title, subtitle, labels, descriptions) => ({
  id, dimension, title, subtitle,
  options: labels.map((label, index) => ({ label, value: `option-${index}`, score: SCORES[index], desc: descriptions[index] }))
});

export const QUESTION_POOL = [
  question('talk_after_tension', 'C', 'When something feels off, do you actually talk about it?', 'Not a yes/no interrogation. The algorithm is already being dramatic.', ['SEND A CRYPTIC STORY', 'WAIT FOR THE VIBE', 'TALK IT OUT', 'HOLD A SUMMIT'], ['Emoji warfare and cryptic stories.', 'Eventually, after a tactical delay.', 'Usually before it becomes a saga.', 'You communicate like trained diplomats.']),
  question('phone_face_down', 'C', 'Can either of you say “I’m fine” and mean it?', 'A bold question in this economy.', ['“FINE” MEANS DANGER', 'DEPENDS ON THE SNACKS', 'MOSTLY, ACTUALLY FINE', 'FEELINGS WITH RECEIPTS'], ['“Fine” means prepare for impact.', 'It depends on the day and the snack supply.', 'Mostly. There are words, not riddles.', 'You name feelings before the kettle boils.']),
  question('weekend_alignment', 'T', 'Do your weekends ever overlap on purpose?', 'Existing in the same building does not automatically count.', ['CALENDAR WAR', 'ACCIDENTAL BRUNCH', 'PLANNED DATE TIME', 'WEEKEND DUO MODE'], ['Separate galaxies, separate calendars.', 'An occasional accidental brunch.', 'Dates, plans, and actual attention.', 'You voluntarily spend whole weekends together.']),
  question('micro_moments', 'T', 'Do you make time for tiny, boring moments together?', 'Shared errands count. So does sitting quietly without doom-scrolling.', ['EVERYTHING IS RUSHED', 'BETWEEN NOTIFICATIONS', 'REGULAR LITTLE MOMENTS', 'ERRANDS ARE A BIT'], ['Everything is rushed or rescheduled.', 'Sometimes, between notifications.', 'Often enough to feel connected.', 'Even grocery shopping becomes a bit.']),
  question('playlist_overlap', 'I', 'Could you survive a six-hour road trip playlist together?', 'No skips is an unreasonable standard. We know.', ['AUX-CORD CUSTODY BATTLE', 'HEADPHONE TRUCE', 'SOME SHARED BANGERS', 'JOINT PLAYLIST LORE'], ['Immediate aux-cord custody battle.', 'A fragile truce with headphones.', 'Enough shared songs to make it work.', 'You have a joint playlist with lore.']),
  question('silly_projects', 'I', 'Do you enjoy being silly together without a screen involved?', 'The most scientifically unserious compatibility metric.', ['VIBES EVAPORATE', 'POTENTIAL DETECTED', 'INSIDE-JOKE ENERGY', 'QUEUE COMEDY LEGENDS'], ['The vibes evaporate instantly.', 'Rarely, but there is potential.', 'Yes, you have inside jokes.', 'You could turn a queue into a comedy show.']),
  question('money_surprises', 'F', 'Would a surprise expense start a boss battle?', 'Imagine the washing machine makes a suspicious noise.', ['FINANCIAL JUMP-SCARE', 'SPREADSHEET DEBATE', 'MAKE A PLAN', 'BACKUP PLAN + SNACKS'], ['Financial jump-scare. Everyone panics.', 'Some stress and a spreadsheet debate.', 'You can make a plan together.', 'You have a plan, backups, and snacks.']),
  question('treat_budget', 'F', 'Can you agree on what counts as “just a little treat”?', 'This is where many empires fall.', ['COFFEE VS VACATION', 'LONG NEGOTIATION', 'MOSTLY ALIGNED', 'TREAT-ECONOMICS SYNC'], ['One says coffee; one says a weekend getaway.', 'Negotiations take longer than the purchase.', 'Mostly aligned with occasional chaos.', 'You have eerily compatible treat economics.']),
  question('future_map', 'G', 'Do your future plans point in roughly the same direction?', 'No need for matching vision boards. A shared continent helps.', ['OPPOSITE MAPS', 'SOME OVERLAP', 'SAME GENERAL DIRECTION', 'CURTAINS IN 2035'], ['Opposite maps, opposite timelines.', 'Some overlap if nobody moves suddenly.', 'The broad picture matches.', 'You may have discussed curtains in 2035.']),
  question('life_changes', 'G', 'When life gets weird, do you imagine adapting as a team?', 'Career pivots, family plans, unexpectedly owning a plant.', ['EVERYONE FOR THEMSELVES', 'COMMITTEE MEETING FIRST', 'TEAM MODE, USUALLY', 'CRISIS: COLOUR-CODED'], ['Everyone for themselves.', 'Maybe, after a long committee meeting.', 'Usually, yes.', 'You would make a crisis color-coded together.']),
  question('small_arguments', 'K', 'What happens after a tiny disagreement?', 'For example: the correct thermostat setting.', ['ARCHIVE THE GRUDGE', 'MINI DRAMA, THEN FINE', 'NO SEASON FINALE', 'APOLOGISE BEFORE LOADING'], ['It gets archived for future use.', 'A little drama, then normal service resumes.', 'You resolve it without a season finale.', 'You apologise before the passive aggression loads.']),
  question('repair_attempts', 'K', 'Do you know how to come back after a bad day?', 'Repair attempts: not glamorous, wildly useful.', ['SIDE-EYES AND NAPS', 'AWKWARDLY, EVENTUALLY', 'TALK OR KIND GESTURE', 'REPAIR EXPERTS'], ['Silence, side-eyes, and strategic naps.', 'Eventually, with some awkwardness.', 'Usually with a conversation or kind gesture.', 'You are almost annoyingly good at repair.'])
];

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export function getRandomQuestions() {
  const byDimension = QUESTION_POOL.reduce((groups, item) => {
    groups[item.dimension] = [...(groups[item.dimension] || []), item];
    return groups;
  }, {});
  const essential = Object.values(byDimension).map((items) => shuffle(items)[0]);
  const remaining = QUESTION_POOL.filter((item) => !essential.includes(item));
  const extraCount = 2 + Math.floor(Math.random() * 3);
  return shuffle([...essential, ...shuffle(remaining).slice(0, extraCount)]);
}

export const QUESTIONS = QUESTION_POOL;
