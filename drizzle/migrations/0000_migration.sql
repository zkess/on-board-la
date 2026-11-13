CREATE TABLE public.neighborhood_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  neighborhood text,
  fact text NOT NULL,
  source_title text NOT NULL,
  source_publisher text NOT NULL,
  source_author text,
  source_date text,
  source_url text NOT NULL,
  source_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.neighborhood_facts TO anon, authenticated;
GRANT ALL ON public.neighborhood_facts TO service_role;
ALTER TABLE public.neighborhood_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Facts are public" ON public.neighborhood_facts FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.neighborhood_facts (region, neighborhood, fact, source_title, source_publisher, source_author, source_date, source_url, source_note) VALUES
('Central', NULL, 'Los Angeles began as a pueblo founded in 1781 by 44 mixed-race settlers, the Pobladores.', 'Remembering Old Chinatown', 'Los Angeles Public Library', 'Kelly Wallace, Librarian', '2019-03-14', 'https://www.lapl.org/fa/node/47623', NULL),
('Central', 'Downtown', 'Angels Flight first climbed Bunker Hill on December 31, 1901. A ride cost 1 cent, or 3 rides for a nickel, and over 2,000 people rode it on opening day.', 'Angels Flight: Welcome Back, Olivet and Sinai', 'Los Angeles Public Library', 'Kelly Wallace', '2017-08-30', 'https://www.lapl.org/news-stories/articles/angels-flight-welcome-back-olivet-and-sinai', NULL),
('Central', 'Chinatown', 'The 1850 U.S. Census, the first to include California, lists two Chinese men living in Los Angeles: Alluce and Ah Fou.', 'Remembering Old Chinatown', 'Los Angeles Public Library', 'Kelly Wallace, Librarian', '2019-03-14', 'https://www.lapl.org/fa/node/47623', 'Original record: 1850 United States Federal Census.'),
('Central', 'Koreatown', 'Koreatown''s story traces to 1902, when independence activist Dosan Ahn Chang Ho immigrated to the U.S. with his wife Helen Ahn.', 'The History of Koreatown: A Heartbeat of Los Angeles', 'Los Angeles Public Library', 'Joann Im', '2022-05-27', 'https://www.lapl.org/news-stories/articles/history-koreatown-heartbeat-los-angeles', NULL),
('South', NULL, 'The Dunbar Hotel on Central Avenue opened June 23, 1928 as the Hotel Somerville, the first hotel built by and for Black people. It hosted the first NAACP convention held in Los Angeles days later.', 'Dunbar Hotel: The Jewel of Central Avenue', 'Los Angeles Public Library', 'Mary McCoy, Senior Librarian', '2026-02-13', 'https://www.lapl.org/news-stories/articles/dunbar-hotel-jewel-central-avenue', NULL),
('South', NULL, 'The Los Angeles chapter of the NAACP was founded in the sitting room of dentists John and Vada Somerville, USC''s first Black graduates.', 'Dunbar Hotel: The Jewel of Central Avenue', 'Los Angeles Public Library', 'Mary McCoy, Senior Librarian', '2026-02-13', 'https://www.lapl.org/news-stories/articles/dunbar-hotel-jewel-central-avenue', NULL),
('South', 'Watts', 'Simon Rodia bought a triangular lot in Watts in 1921 and spent more than three decades building 17 structures by hand, with towers reaching nearly 100 feet.', 'Watts Towers Recognized by World Monuments Fund', 'City of Los Angeles Department of Cultural Affairs', NULL, '2026-06-30', 'https://www.wattstowers.org/general-1', NULL),
('West', 'Venice', 'Abbot Kinney opened "Venice of America" on July 4, 1905 to a crowd of 40,000.', 'About the Canals', 'Venice Canals Association', NULL, NULL, 'https://venicecanals.org/canals/', NULL),
('West', 'Venice', 'Venice''s canals were dug with horses and mules starting in 1904, filled with tidal water from the Pacific.', 'Grand Design: The Canals of Venice (California)', 'LAPL Photo Friends', 'Eleanor Boba', '2017-11-07', 'http://photofriends.org/grand-design-the-canals-of-venice-california/', 'Photo: Herald-Examiner Collection, Los Angeles Public Library, Image #00057203.'),
('Valley', NULL, 'About 30,000 people gathered at the "Cascades" above the Valley on November 5, 1913 to watch Owens River water arrive through the LA Aqueduct.', 'Early Views of the San Fernando Valley', 'Water and Power Associates', NULL, NULL, 'https://www.waterandpower.org/museum/Early_Views_of_the_San_Fernando_Valley_Page_2.html', NULL),
('Harbor', NULL, 'In 1906 LA annexed the "Shoestring," a strip under a mile wide and 16 miles long, so it could reach the harbor. San Pedro and Wilmington joined months later.', 'The Shoestring Strip: Los Angeles Goes Out on a Limb', 'LAvenues Project', NULL, '2015-02-01', 'https://lavenuesproject.com/2015/02/01/the-shoestring-strip-los-angeles-goes-out-on-a-limb/', 'Original source: Homer Hamlin, City Engineer, "Map showing territory annexed to the city of Los Angeles" (1916), Library of Congress: http://www.loc.gov/resource/g4364l.ct001800/'),
('Harbor', 'San Pedro', 'San Pedro was established as its own city in 1888 and grew once the Southern Pacific Railroad linked LA to the transcontinental network.', 'Comments on San Pedro Community Plan Update Draft EIR', 'Los Angeles Conservancy', NULL, '2012-09-24', 'https://www.laconservancy.org/wp-content/uploads/2022/11/LAC-comments-on-San-Pedro-Community-Plan-Draft-EIR_09.24.2012.pdf', NULL),
('East', 'Los Feliz', 'Since Griffith Observatory opened in 1935, more than seven million people have looked through its 12-inch Zeiss telescope, more than any other telescope in the world.', 'Zeiss Telescopes', 'Griffith Observatory', NULL, NULL, 'https://griffithobservatory.org/exhibits/telescopes/Zeiss-telescopes/', NULL),
('East', 'Boyle Heights', 'Boyle Heights has been called the "Ellis Island" of the West Coast, home to many immigrant groups shut out of other LA neighborhoods.', 'Boyle Heights Oral History', 'Los Angeles Public Library', 'Anita Martinez, Digitization & Special Collections', '2020-10-01', 'https://tessa.lapl.org/b06', NULL);