export interface CulinaryHighlight {
  dish: string;
  description: string;
  category: "street-food" | "fine-dining" | "local-specialty";
  heatLevel: number; // 1 to 5 (chili 🌶️ rating)
  authenticity: number; // 1 to 5 (flame 🔥 rating)
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  coordinates: string;
  quote: string;
  description: string;
  culinaryHighlights: CulinaryHighlight[];
  lessonsLearned: string[];
  status: "visited" | "planned";
}

export const destinations: Destination[] = [
  {
    id: "vietnam-hanoi",
    name: "Hanoi",
    country: "Vietnam",
    lat: 21.0285,
    lng: 105.8542,
    coordinates: "21.0285° N, 105.8542° E",
    quote: "Vietnam. It grabs you and doesn’t let go. Once you love it, you love it forever. This is a place where you just want to sit on a plastic stool, drink cold beer, and eat whatever comes out of the hot oil.",
    description: "A sensory overload of motorbikes, steaming cauldrons of pho, and French colonial architecture. A city that lives on its sidewalks.",
    culinaryHighlights: [
      {
        dish: "Bún Chả",
        description: "Charcoal-grilled pork patties and belly served in warm dipping sauce with rice noodles and fresh herbs. The legendary dish shared with President Obama.",
        category: "street-food",
        heatLevel: 2,
        authenticity: 5
      },
      {
        dish: "Pho Bo",
        description: "Rich, spiced beef broth simmered for 24 hours, poured over tender flat rice noodles and rare beef slices, topped with green onions.",
        category: "local-specialty",
        heatLevel: 1,
        authenticity: 5
      },
      {
        dish: "Egg Coffee (Cà Phê Trứng)",
        description: "Vietnamese dark roast coffee topped with an airy, creamy whip of egg yolk and condensed milk. A dessert and kickstart combined.",
        category: "local-specialty",
        heatLevel: 1,
        authenticity: 4
      }
    ],
    lessonsLearned: [
      "The best food is almost always found on a plastic stool inches from the pavement.",
      "Don't hesitate when crossing the street; the motorbikes will flow around you like water.",
      "A culture's heart is best understood through its street food."
    ],
    status: "visited"
  },
  {
    id: "morocco-marrakech",
    name: "Marrakech",
    country: "Morocco",
    lat: 31.6295,
    lng: -7.9811,
    coordinates: "31.6295° N, 7.9811° W",
    quote: "Marrakech is a place that feels like a dream. It has this intoxicating mix of dust, spices, incense, and horse manure. It's beautiful, chaotic, and completely hypnotic.",
    description: "The red city, framed by the Atlas Mountains. Its souks are a labyrinth of spices, rugs, and snake charmers, leading to the theatrical Jemaa el-Fnaa.",
    culinaryHighlights: [
      {
        dish: "Lamb Tagine",
        description: "Slow-braised lamb shank cooked in a conical clay pot with prunes, almonds, and saffron until the meat falls off the bone.",
        category: "local-specialty",
        heatLevel: 2,
        authenticity: 5
      },
      {
        dish: "Harira Soup",
        description: "A rich tomato, lentil, and chickpea soup flavored with cilantro, parsley, ginger, and turmeric, traditionally eaten to break the fast.",
        category: "street-food",
        heatLevel: 2,
        authenticity: 4
      }
    ],
    lessonsLearned: [
      "Getting lost in the Souks is not a mistake; it's the destination.",
      "A cup of mint tea (Moroccan whiskey) is a gesture of hospitality that should never be rushed.",
      "Respect the maze, and it will reward you with unexpected wonders."
    ],
    status: "visited"
  },
  {
    id: "japan-tokyo",
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    coordinates: "35.6762° N, 139.6503° E",
    quote: "Tokyo is a beautiful, terrifying, beautiful mystery. If I had to agree to live in one city for the rest of my life and never leave, it would be Tokyo. It is a world unto itself.",
    description: "An ultra-modern metropolis powered by neon, salarymen, and high-speed trains, housing some of the world's most disciplined culinary masters.",
    culinaryHighlights: [
      {
        dish: "Edomae Sushi",
        description: "Perfectly seasoned, warm vinegared rice topped with aged or fresh seafood, brushed with nikiri soy sauce by a chef who has trained for decades.",
        category: "fine-dining",
        heatLevel: 1,
        authenticity: 5
      },
      {
        dish: "Tonkotsu Ramen",
        description: "Thick, creamy, emulsified pork bone broth served with thin noodles, chashu pork belly, soft-boiled egg, and wood ear mushrooms.",
        category: "street-food",
        heatLevel: 2,
        authenticity: 4
      },
      {
        dish: "Yakitori",
        description: "Skewered chicken parts grilled over white binchotan charcoal, glazed with tare sauce at a smoky alleyway counter.",
        category: "street-food",
        heatLevel: 1,
        authenticity: 4
      }
    ],
    lessonsLearned: [
      "True craftsmanship requires obsessive, lifelong dedication to a single task.",
      "There is beauty in silence, rules, and unspoken etiquette.",
      "The tiny alleys under train tracks hold more soul than the giant skyscrapers."
    ],
    status: "visited"
  },
  {
    id: "france-paris",
    name: "Paris",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    coordinates: "48.8566° N, 2.3522° E",
    quote: "I can't think of a better place to be unhappy than Paris. It's the place where my cooking journey technically started, and where the weight of culinary history sits on every single bistro chair.",
    description: "The city of light, romance, and butter. Paris is a living museum of bistros, bakeries, and classical techniques that defined modern cooking.",
    culinaryHighlights: [
      {
        dish: "Steak Frites",
        description: "Seared ribeye steak basted in foaming butter and garlic, served with crispy double-fried hand-cut potatoes and a rich béarnaise.",
        category: "local-specialty",
        heatLevel: 1,
        authenticity: 4
      },
      {
        dish: "Escargot de Bourgogne",
        description: "Plump land snails baked in their shells with a rich filling of butter, garlic, and flat-leaf parsley.",
        category: "fine-dining",
        heatLevel: 1,
        authenticity: 5
      }
    ],
    lessonsLearned: [
      "Never trust a neighborhood without a bakery that smells of fresh baguettes.",
      "Butter is not an ingredient; it is a way of life.",
      "Sometimes the most rebellious thing you can do is sit at a café and do absolutely nothing."
    ],
    status: "visited"
  },
  {
    id: "mexico-oaxaca",
    name: "Oaxaca",
    country: "Mexico",
    lat: 17.0732,
    lng: -96.7266,
    coordinates: "17.0732° N, 96.7266° W",
    quote: "Mexico is a country we are deeply connected to, yet understand so little. Oaxaca is the culinary heart of the country, where centuries of Indigenous tradition mix with Spanish influence to create moles that are as complex as any French grand sauce.",
    description: "The land of the seven moles. A vibrant city of colonial architecture, bustling indigenous markets, and the birthplace of mezcal.",
    culinaryHighlights: [
      {
        dish: "Mole Negro",
        description: "A dark, complex sauce made from over 30 ingredients including toasted chilies, spices, seeds, nuts, and Mexican chocolate, served over chicken.",
        category: "local-specialty",
        heatLevel: 3,
        authenticity: 5
      },
      {
        dish: "Tlayuda",
        description: "A large, crispy toasted tortilla smeared with pork lard (asiento), refried beans, quesillo (string cheese), and topped with grilled meats.",
        category: "street-food",
        heatLevel: 2,
        authenticity: 4
      },
      {
        dish: "Mezcal",
        description: "An artisanal smoky spirit distilled from roasted agave hearts, served neat with orange slices and sal de gusano (worm salt).",
        category: "local-specialty",
        heatLevel: 4,
        authenticity: 5
      }
    ],
    lessonsLearned: [
      "History isn't just in books; it is cooked into the mole.",
      "Mezcal is to be sipped slowly, like a conversation with an elder.",
      "The most generous hospitality often comes from those who have the least."
    ],
    status: "visited"
  }
];
