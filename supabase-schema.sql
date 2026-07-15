-- =====================================================================
-- Anthony Bourdain's Travel Tool - Database Schema & Seed Data
-- =====================================================================
-- Copy and paste this script into the Supabase SQL Editor to provision
-- your tables, configure Row-Level Security (RLS), and seed initial data.

-- 1. DROP EXISTING TABLES (IF ANY)
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS culinary_highlights;
DROP TABLE IF EXISTS destinations;

-- 2. CREATE DESTINATIONS TABLE
CREATE TABLE destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    coordinates TEXT NOT NULL,
    quote TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('visited', 'planned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CREATE CULINARY HIGHLIGHTS TABLE
CREATE TABLE culinary_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    dish TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('street-food', 'fine-dining', 'local-specialty')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CREATE LESSONS TABLE
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    lesson TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ENABLE ROW-LEVEL SECURITY (RLS)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE culinary_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- 6. CREATE READ POLICIES (Allow public read access to anyone)
CREATE POLICY "Allow public read access on destinations" ON destinations
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on culinary_highlights" ON culinary_highlights
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on lessons" ON lessons
    FOR SELECT USING (true);

-- 7. SEED INITIAL DATA

-- Seed Destinations
INSERT INTO destinations (id, name, country, lat, lng, coordinates, quote, description, status) VALUES
('vietnam-hanoi', 'Hanoi', 'Vietnam', 21.0285, 105.8542, '21.0285° N, 105.8542° E', 'Vietnam. It grabs you and doesn’t let go. Once you love it, you love it forever. This is a place where you just want to sit on a plastic stool, drink cold beer, and eat whatever comes out of the hot oil.', 'A sensory overload of motorbikes, steaming cauldrons of pho, and French colonial architecture. A city that lives on its sidewalks.', 'visited'),

('morocco-marrakech', 'Marrakech', 'Morocco', 31.6295, -7.9811, '31.6295° N, 7.9811° W', 'Marrakech is a place that feels like a dream. It has this intoxicating mix of dust, spices, incense, and horse manure. It''s beautiful, chaotic, and completely hypnotic.', 'The red city, framed by the Atlas Mountains. Its souks are a labyrinth of spices, rugs, and snake charmers, leading to the theatrical Jemaa el-Fnaa.', 'visited'),

('japan-tokyo', 'Tokyo', 'Japan', 35.6762, 139.6503, '35.6762° N, 139.6503° E', 'Tokyo is a beautiful, terrifying, beautiful mystery. If I had to agree to live in one city for the rest of my life and never leave, it would be Tokyo. It is a world unto itself.', 'An ultra-modern metropolis powered by neon, salarymen, and high-speed trains, housing some of the world''s most disciplined culinary masters.', 'visited'),

('france-paris', 'Paris', 'France', 48.8566, 2.3522, '48.8566° N, 2.3522° E', 'I can''t think of a better place to be unhappy than Paris. It''s the place where my cooking journey technically started, and where the weight of culinary history sits on every single bistro chair.', 'The city of light, romance, and butter. Paris is a living museum of bistros, bakeries, and classical techniques that defined modern cooking.', 'visited'),

('mexico-oaxaca', 'Oaxaca', 'Mexico', 17.0732, -96.7266, '17.0732° N, 96.7266° W', 'Mexico is a country we are deeply connected to, yet understand so little. Oaxaca is the culinary heart of the country, where centuries of Indigenous tradition mix with Spanish influence to create moles that are as complex as any French grand sauce.', 'The land of the seven moles. A vibrant city of colonial architecture, bustling indigenous markets, and the birthplace of mezcal.', 'visited');

-- Seed Culinary Highlights
INSERT INTO culinary_highlights (destination_id, dish, description, category) VALUES
('vietnam-hanoi', 'Bún Chả', 'Charcoal-grilled pork patties and belly served in warm dipping sauce with rice noodles and fresh herbs. The legendary dish shared with President Obama.', 'street-food'),
('vietnam-hanoi', 'Pho Bo', 'Rich, spiced beef broth simmered for 24 hours, poured over tender flat rice noodles and rare beef slices, topped with green onions.', 'local-specialty'),
('vietnam-hanoi', 'Egg Coffee (Cà Phê Trứng)', 'Vietnamese dark roast coffee topped with an airy, creamy whip of egg yolk and condensed milk. A dessert and kickstart combined.', 'local-specialty'),

('morocco-marrakech', 'Lamb Tagine', 'Slow-braised lamb shank cooked in a conical clay pot with prunes, almonds, and saffron until the meat falls off the bone.', 'local-specialty'),
('morocco-marrakech', 'Harira Soup', 'A rich tomato, lentil, and chickpea soup flavored with cilantro, parsley, ginger, and turmeric, traditionally eaten to break the fast.', 'street-food'),

('japan-tokyo', 'Edomae Sushi', 'Perfectly seasoned, warm vinegared rice topped with aged or fresh seafood, brushed with nikiri soy sauce by a chef who has trained for decades.', 'fine-dining'),
('japan-tokyo', 'Tonkotsu Ramen', 'Thick, creamy, emulsified pork bone broth served with thin noodles, chashu pork belly, soft-boiled egg, and wood ear mushrooms.', 'street-food'),
('japan-tokyo', 'Yakitori', 'Skewered chicken parts grilled over white binchotan charcoal, glazed with tare sauce at a smoky alleyway counter.', 'street-food'),

('france-paris', 'Steak Frites', 'Seared ribeye steak basted in foaming butter and garlic, served with crispy double-fried hand-cut potatoes and a rich béarnaise.', 'local-specialty'),
('france-paris', 'Escargot de Bourgogne', 'Plump land snails baked in their shells with a rich filling of butter, garlic, and flat-leaf parsley.', 'fine-dining'),

('mexico-oaxaca', 'Mole Negro', 'A dark, complex sauce made from over 30 ingredients including toasted chilies, spices, seeds, nuts, and Mexican chocolate, served over chicken.', 'local-specialty'),
('mexico-oaxaca', 'Tlayuda', 'A large, crispy toasted tortilla smeared with pork lard (asiento), refried beans, quesillo (string cheese), and topped with grilled meats.', 'street-food'),
('mexico-oaxaca', 'Mezcal', 'An artisanal smoky spirit distilled from roasted agave hearts, served neat with orange slices and sal de gusano (worm salt).', 'local-specialty');

-- Seed Lessons
INSERT INTO lessons (destination_id, lesson) VALUES
('vietnam-hanoi', 'The best food is almost always found on a plastic stool inches from the pavement.'),
('vietnam-hanoi', 'Don''t hesitate when crossing the street; the motorbikes will flow around you like water.'),
('vietnam-hanoi', 'A culture''s heart is best understood through its street food.'),

('morocco-marrakech', 'Getting lost in the Souks is not a mistake; it''s the destination.'),
('morocco-marrakech', 'A cup of mint tea (Moroccan whiskey) is a gesture of hospitality that should never be rushed.'),
('morocco-marrakech', 'Respect the maze, and it will reward you with unexpected wonders.'),

('japan-tokyo', 'True craftsmanship requires obsessive, lifelong dedication to a single task.'),
('japan-tokyo', 'There is beauty in silence, rules, and unspoken etiquette.'),
('japan-tokyo', 'The tiny alleys under train tracks hold more soul than the giant skyscrapers.'),

('france-paris', 'Never trust a neighborhood without a bakery that smells of fresh baguettes.'),
('france-paris', 'Butter is not an ingredient; it is a way of life.'),
('france-paris', 'Sometimes the most rebellious thing you can do is sit at a café and do absolutely nothing.'),

('mexico-oaxaca', 'History isn''t just in books; it is cooked into the mole.'),
('mexico-oaxaca', 'Mezcal is to be sipped slowly, like a conversation with an elder.'),
('mexico-oaxaca', 'The most generous hospitality often comes from those who have the least.');
