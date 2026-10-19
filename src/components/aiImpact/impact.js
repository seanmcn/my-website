/*
 * The sums behind AiImpactCalculator. Used by the component's frontmatter
 * for the server-rendered starting state and by its script for every change
 * after that, so a reader without JavaScript sees the same numbers.
 */

// Epoch AI, "How much energy does ChatGPT use?" (Feb 2025).
export const PROMPT_TYPES = {
  short: {label: 'Short chat', wh: 0.3, detail: 'a typical GPT-4o reply'},
  long: {label: 'Long input', wh: 2.5, detail: '~10k tokens in, a short paper'},
  huge: {label: 'Huge document', wh: 40, detail: '~100k tokens in, ~200 pages'},
};

// Grams of CO2 per kWh. Ember's 2025 figures, with the US rounded up to the
// 400 g the rest of the post uses.
export const GRIDS = {
  france: {label: 'France', grams: 40},
  uk: {label: 'UK', grams: 220},
  us: {label: 'US', grams: 400},
  world: {label: 'World', grams: 460},
};

export const MAX_PROMPTS = 2.5e9;
export const MAX_POSITION = Math.log10(MAX_PROMPTS);

export const PRESETS = [
  {label: 'Light use', prompts: 10},
  {label: 'Daily habit', prompts: 100},
  {label: 'Power user', prompts: 1000},
  {label: 'A whole team', prompts: 10000},
  {label: 'All of ChatGPT', prompts: MAX_PROMPTS},
];

const KETTLE_WH = 150;
const LED_WATTS = 10;
const UK_HOME_KWH = 2700;
const GPT3_WH = 1.287e9;
const CAR_GRAMS_PER_KM = 170;
const LONDON_EDINBURGH_RETURN_KM = 1300;
const EARTH_KM = 40075;
const WATER_LITRES_PER_KWH = 2;
const BATH_LITRES = 80;
const OLYMPIC_POOL_LITRES = 2.5e6;

// The reference points on the scale bar, in kWh a year.
export const SCALE_MIN_KWH = 0.1;
export const SCALE_MAX_KWH = 1e12;
export const LANDMARKS = [
  {
    label: 'LED on 24/7',
    kwh: LED_WATTS * 24 * 365 / 1000,
    detail: 'a 10W bulb left on all year',
  },
  {label: 'UK home', kwh: UK_HOME_KWH, detail: 'a typical UK home for a year'},
  {label: 'GPT-3 training', kwh: GPT3_WH / 1000, detail: 'training GPT-3'},
  {
    label: 'Frontier run',
    kwh: 2e8,
    detail: 'a 100 MW training run lasting a few months',
  },
  {
    label: 'All data centres',
    kwh: 4.6e11,
    detail: 'every data centre in the world, 2022',
  },
];

export function scalePercent(kwh) {
  const low = Math.log10(SCALE_MIN_KWH);
  const high = Math.log10(SCALE_MAX_KWH);
  const value = Math.log10(Math.max(kwh, SCALE_MIN_KWH));
  return Math.min(100, ((value - low) / (high - low)) * 100);
}

// The slider runs on log10(prompts), so each notch is the same proportional
// step whether you're at 10 a day or 10 million.
export const promptsFromPosition = position =>
  niceRound(10 ** Math.min(position, MAX_POSITION));

export const positionFromPrompts = prompts => Math.log10(Math.max(prompts, 1));

// Two significant figures, so the slider lands on 4,700 rather than 4,683.
function niceRound(value) {
  if (value < 10) {
    return Math.round(value);
  }
  const magnitude = 10 ** (Math.floor(Math.log10(value)) - 1);
  return Math.round(value / magnitude) * magnitude;
}

function sig(value, digits = 2) {
  if (value === 0) {
    return '0';
  }
  const rounded = Number(value.toPrecision(digits));
  return rounded.toLocaleString('en-GB', {maximumFractionDigits: 2});
}

const whole = value => Math.round(value).toLocaleString('en-GB');

export function formatCount(value) {
  if (value >= 1e9) {
    return `${sig(value / 1e9)} billion`;
  }
  if (value >= 1e6) {
    return `${sig(value / 1e6)} million`;
  }
  return whole(value);
}

export function formatEnergy(wh) {
  const units = [['TWh', 1e12], ['GWh', 1e9], ['MWh', 1e6], ['kWh', 1e3]];
  const [unit, size] = units.find(([, size]) => wh >= size) || ['Wh', 1];
  return `${sig(wh / size, 3)} ${unit}`;
}

function formatMass(grams) {
  if (grams >= 1e12) {
    return `${formatCount(niceRound(grams / 1e6))} tonnes`;
  }
  if (grams >= 1e6) {
    return `${sig(grams / 1e6, 3)} tonnes`;
  }
  if (grams >= 1e3) {
    return `${sig(grams / 1e3, 3)} kg`;
  }
  return `${whole(grams)} g`;
}

function formatDuration(days) {
  const hours = days * 24;
  if (hours < 1) {
    return `${whole(hours * 60)} minutes`;
  }
  if (days < 2) {
    return `${sig(hours)} hours`;
  }
  if (days < 365 * 2) {
    return `${whole(days)} days`;
  }
  return `${formatCount(niceRound(days / 365))} years`;
}

function kettleLine(dayWh, yearKwh) {
  const perDay = dayWh / KETTLE_WH;
  if (perDay >= 1000) {
    const homes = formatCount(niceRound(yearKwh / UK_HOME_KWH));
    return `Enough to power ${homes} UK homes for a year.`;
  }
  if (perDay >= 1) {
    const count = sig(perDay);
    const kettles = count === '1' ? 'kettle' : 'kettles';
    return `Like boiling ${count} full ${kettles} every day.`;
  }
  const everyDays = 1 / perDay;
  if (everyDays > 365 * 1.5) {
    return `Like boiling one full kettle every ${sig(everyDays / 365)} years.`;
  }
  return `Like boiling one full kettle every ${whole(everyDays)} days.`;
}

function drivingLine(km) {
  if (km < 1) {
    return `Like driving a petrol car ${whole(km * 1000)} metres.`;
  }
  const distance = km >= 1e6 ? formatCount(niceRound(km)) : whole(km);
  const base = `Like driving a petrol car ${distance} km.`;
  if (km >= EARTH_KM * 2) {
    const laps = formatCount(niceRound(km / EARTH_KM));
    return `${base} That's ${laps} times round the Earth.`;
  }
  if (km >= LONDON_EDINBURGH_RETURN_KM * 2) {
    const trips = whole(km / LONDON_EDINBURGH_RETURN_KM);
    return `${base} London to Edinburgh and back ${trips} times.`;
  }
  return base;
}

function waterLine(litres) {
  if (litres >= OLYMPIC_POOL_LITRES) {
    return `${sig(litres / OLYMPIC_POOL_LITRES)} Olympic swimming pools.`;
  }
  if (litres >= BATH_LITRES) {
    const baths = sig(litres / BATH_LITRES);
    return `About ${baths} full ${baths === '1' ? 'bath' : 'baths'}.`;
  }
  return 'Less than a bath.';
}

export function calculate({prompts, type, grid}) {
  const dayWh = prompts * PROMPT_TYPES[type].wh;
  const yearWh = dayWh * 365;
  const yearKwh = yearWh / 1000;
  const co2Grams = yearKwh * GRIDS[grid].grams;
  const km = co2Grams / CAR_GRAMS_PER_KM;
  const litres = yearKwh * WATER_LITRES_PER_KWH;

  return {
    prompts: formatCount(prompts),
    energy: formatEnergy(yearWh),
    energyLine: kettleLine(dayWh, yearKwh),
    co2: formatMass(co2Grams),
    co2Line: drivingLine(km),
    water: litres < 1 ?
      'Under a litre' :
      `${formatCount(niceRound(litres))} litres`,
    waterLine: waterLine(litres),
    gpt3: formatDuration(GPT3_WH / dayWh),
    gpt3Line: 'to use as much electricity as training GPT-3 did.',
    scale: scalePercent(yearKwh),
    summary: [
      `${formatCount(prompts)} ${PROMPT_TYPES[type].label.toLowerCase()}`,
      `${prompts === 1 ? 'prompt' : 'prompts'} a day on the`,
      `${GRIDS[grid].label} grid: ${formatEnergy(yearWh)} and`,
      `${formatMass(co2Grams)} of CO₂ a year.`,
    ].join(' '),
  };
}
