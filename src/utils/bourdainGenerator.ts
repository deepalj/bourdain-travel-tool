/**
 * Dynamic content generator that synthesizes realistic, poetic Anthony Bourdain style
 * quotes and description logs for newly logged destinations.
 */

export function generateBourdainQuote(city: string, country: string, primaryFood?: string): string {
  const foodText = primaryFood ? primaryFood.toLowerCase() : "the local specialties";
  
  const quotes = [
    `There's something about ${city} that grabs you and doesn't let go. It's a place where you just want to drop your plans, sit down on a low plastic stool, drink whatever's cold, and eat ${foodText} right out of the hot oil. That is the soul of ${country}.`,
    `You walk the streets of ${city} and you feel the weight of history. It's a gorgeous, chaotic, exhausting puzzle. In this corner of ${country}, they don't cook to impress you; they cook because it's who they are. One bowl of ${foodText} and you'll understand why.`,
    `If I've learned anything on the road, it's that food is the first window into a culture. Here in ${city}, the kitchen is a temple. They've been perfecting ${foodText} for generations, and to eat it here, surrounded by the noise of ${country}, is a privilege.`
  ];

  // Hash based on name lengths to keep the choice deterministic per location
  const index = (city.length + country.length) % quotes.length;
  return quotes[index];
}

export function generateBourdainDescription(city: string, country: string, primaryFood?: string): string {
  const foodMention = primaryFood ? `steaming plates of ${primaryFood}` : "the smell of roasting charcoal and herbs";
  
  const descriptions = [
    `A dizzying, beautiful sensory overload of street vendors, roaring traffic, and hidden alleys. ${city} is a city that refuses to be ignored. It lives on its sidewalks, fueled by ${foodMention} and a spirit that is uniquely ${country}.`,
    `Framed by history and modern ambition, ${city} is a city of layers. Its markets are a labyrinth of spices, greetings, and ${foodMention}, offering an honest, unvarnished look at the culinary heart of ${country}.`
  ];

  const index = (city.length + country.length) % descriptions.length;
  return descriptions[index];
}
