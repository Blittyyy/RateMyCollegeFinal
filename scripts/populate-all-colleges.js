// Script to populate the Supabase database with ALL colleges from RateMyDorm
// Run this with: node scripts/populate-all-colleges.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// COMPLETE list of ALL 272 colleges from RateMyDorm
const allColleges = [
  // Alabama
  { name: 'Auburn University', location: 'Auburn, Alabama', slug: 'auburn-university' },
  { name: 'University of Alabama', location: 'Tuscaloosa, Alabama', slug: 'university-of-alabama' },
  { name: 'University of Alabama at Birmingham', location: 'Birmingham, Alabama', slug: 'university-of-alabama-birmingham' },
  
  // Arizona
  { name: 'Arizona State University', location: 'Tempe, Arizona', slug: 'arizona-state-university' },
  { name: 'Grand Canyon University', location: 'Phoenix, Arizona', slug: 'grand-canyon-university' },
  { name: 'University of Arizona', location: 'Tucson, Arizona', slug: 'university-of-arizona' },
  
  // California
  { name: 'Cal Poly Pomona', location: 'Pomona, California', slug: 'cal-poly-pomona' },
  { name: 'California Polytechnic State University, San Luis Obispo', location: 'San Luis Obispo, California', slug: 'cal-poly-san-luis-obispo' },
  { name: 'California State University, Fresno', location: 'Fresno, California', slug: 'california-state-university-fresno' },
  { name: 'California State University, Fullerton', location: 'Fullerton, California', slug: 'california-state-university-fullerton' },
  { name: 'California State University, Long Beach', location: 'Long Beach, California', slug: 'california-state-university-long-beach' },
  { name: 'California State University, Monterey Bay', location: 'Seaside, California', slug: 'california-state-university-monterey-bay' },
  { name: 'California State University, Northridge', location: 'Northridge, California', slug: 'california-state-university-northridge' },
  { name: 'California State University, Sacramento', location: 'Sacramento, California', slug: 'california-state-university-sacramento' },
  { name: 'California State University, San Bernardino', location: 'San Bernardino, California', slug: 'california-state-university-san-bernardino' },
  { name: 'Chapman University', location: 'Orange, California', slug: 'chapman-university' },
  { name: 'Dominican University of California', location: 'San Rafael, California', slug: 'dominican-university-of-california' },
  { name: 'Harvey Mudd College', location: 'Claremont, California', slug: 'harvey-mudd-college' },
  { name: 'Loyola Marymount University', location: 'Los Angeles, California', slug: 'loyola-marymount-university' },
  { name: 'Pepperdine University', location: 'Malibu, California', slug: 'pepperdine-university' },
  { name: 'Pomona College', location: 'Claremont, California', slug: 'pomona-college' },
  { name: 'San Diego State University', location: 'San Diego, California', slug: 'san-diego-state-university' },
  { name: 'San Francisco State University', location: 'San Francisco, California', slug: 'san-francisco-state-university' },
  { name: 'San Jose State University', location: 'San Jose, California', slug: 'san-jose-state-university' },
  { name: 'Santa Clara University', location: 'Santa Clara, California', slug: 'santa-clara-university' },
  { name: 'Shasta College', location: 'Redding, California', slug: 'shasta-college' },
  { name: 'Sonoma State University', location: 'Rohnert Park, California', slug: 'sonoma-state-university' },
  { name: 'Stanford University', location: 'Stanford, California', slug: 'stanford-university' },
  { name: 'UC Merced', location: 'Merced, California', slug: 'uc-merced' },
  { name: 'UC Santa Cruz', location: 'Santa Cruz, California', slug: 'uc-santa-cruz' },
  { name: 'UC Berkeley', location: 'Berkeley, California', slug: 'uc-berkeley' },
  { name: 'UC Davis', location: 'Davis, California', slug: 'uc-davis' },
  { name: 'UC Irvine', location: 'Irvine, California', slug: 'uc-irvine' },
  { name: 'UC Los Angeles', location: 'Los Angeles, California', slug: 'uc-los-angeles' },
  { name: 'UC Riverside', location: 'Riverside, California', slug: 'uc-riverside' },
  { name: 'UC San Diego', location: 'La Jolla, California', slug: 'uc-san-diego' },
  { name: 'UC Santa Barbara', location: 'Santa Barbara, California', slug: 'uc-santa-barbara' },
  { name: 'University of San Diego', location: 'San Diego, California', slug: 'university-of-san-diego' },
  { name: 'University of Southern California', location: 'Los Angeles, California', slug: 'university-of-southern-california' },
  
  // Colorado
  { name: 'Colorado College', location: 'Colorado Springs, Colorado', slug: 'colorado-college' },
  { name: 'Colorado School of Mines', location: 'Golden, Colorado', slug: 'colorado-school-of-mines' },
  { name: 'University of Colorado Boulder', location: 'Boulder, Colorado', slug: 'university-of-colorado-boulder' },
  { name: 'University of Denver', location: 'Denver, Colorado', slug: 'university-of-denver' },
  
  // Connecticut
  { name: 'University of Connecticut', location: 'Storrs, Connecticut', slug: 'university-of-connecticut' },
  { name: 'Yale University', location: 'New Haven, Connecticut', slug: 'yale-university' },
  
  // Washington D.C.
  { name: 'American University', location: 'Washington, D.C.', slug: 'american-university' },
  { name: 'George Washington University', location: 'Washington, D.C.', slug: 'george-washington-university' },
  { name: 'Georgetown University', location: 'Washington, D.C.', slug: 'georgetown-university' },
  
  // Delaware
  { name: 'University of Delaware', location: 'Newark, Delaware', slug: 'university-of-delaware' },
  
  // Florida
  { name: 'Florida Atlantic University', location: 'Boca Raton, Florida', slug: 'florida-atlantic-university' },
  { name: 'Florida Gulf Coast University', location: 'Fort Myers, Florida', slug: 'florida-gulf-coast-university' },
  { name: 'Florida International University', location: 'Miami, Florida', slug: 'florida-international-university' },
  { name: 'Florida State University', location: 'Tallahassee, Florida', slug: 'florida-state-university' },
  { name: 'Ringling College of Art and Design', location: 'Sarasota, Florida', slug: 'ringling-college-of-art-and-design' },
  { name: 'University of Central Florida', location: 'Orlando, Florida', slug: 'university-of-central-florida' },
  { name: 'University of Florida', location: 'Gainesville, Florida', slug: 'university-of-florida' },
  { name: 'University of Miami', location: 'Coral Gables, Florida', slug: 'university-of-miami' },
  { name: 'University of South Florida', location: 'Tampa, Florida', slug: 'university-of-south-florida' },
  
  // Georgia
  { name: 'Brenau University', location: 'Gainesville, Georgia', slug: 'brenau-university' },
  { name: 'Columbus State University', location: 'Columbus, Georgia', slug: 'columbus-state-university' },
  { name: 'Emory University', location: 'Atlanta, Georgia', slug: 'emory-university' },
  { name: 'Georgia College & State University', location: 'Milledgeville, Georgia', slug: 'georgia-college-state-university' },
  { name: 'Georgia Institute of Technology', location: 'Atlanta, Georgia', slug: 'georgia-institute-of-technology' },
  { name: 'Kennesaw State University', location: 'Kennesaw, Georgia', slug: 'kennesaw-state-university' },
  { name: 'Savannah College of Art and Design', location: 'Savannah, Georgia', slug: 'savannah-college-of-art-and-design' },
  { name: 'University of Georgia', location: 'Athens, Georgia', slug: 'university-of-georgia' },
  
  // Hawaii
  { name: 'Hawaii Pacific University', location: 'Honolulu, Hawaii', slug: 'hawaii-pacific-university' },
  { name: 'UH Hilo', location: 'Hilo, Hawaii', slug: 'uh-hilo' },
  { name: 'UH Manoa', location: 'Honolulu, Hawaii', slug: 'uh-manoa' },
  
  // Iowa
  { name: 'Grinnell College', location: 'Grinnell, Iowa', slug: 'grinnell-college' },
  { name: 'Iowa State University', location: 'Ames, Iowa', slug: 'iowa-state-university' },
  { name: 'University of Iowa', location: 'Iowa City, Iowa', slug: 'university-of-iowa' },
  
  // Illinois
  { name: 'DePaul University', location: 'Chicago, Illinois', slug: 'depaul-university' },
  { name: 'Illinois State University', location: 'Normal, Illinois', slug: 'illinois-state-university' },
  { name: 'Loyola University Chicago', location: 'Chicago, Illinois', slug: 'loyola-university-chicago' },
  { name: 'Northern Illinois University', location: 'DeKalb, Illinois', slug: 'northern-illinois-university' },
  { name: 'Northwestern University', location: 'Evanston, Illinois', slug: 'northwestern-university' },
  { name: 'University of Chicago', location: 'Chicago, Illinois', slug: 'university-of-chicago' },
  { name: 'University of Illinois at Urbana-Champaign', location: 'Champaign, Illinois', slug: 'university-of-illinois-urbana-champaign' },
  
  // Indiana
  { name: 'Indiana University Bloomington', location: 'Bloomington, Indiana', slug: 'indiana-university-bloomington' },
  { name: 'Purdue University', location: 'West Lafayette, Indiana', slug: 'purdue-university' },
  { name: 'Taylor University', location: 'Upland, Indiana', slug: 'taylor-university' },
  { name: 'University of Notre Dame', location: 'Notre Dame, Indiana', slug: 'university-of-notre-dame' },
  
  // Kansas
  { name: 'Kansas State University', location: 'Manhattan, Kansas', slug: 'kansas-state-university' },
  { name: 'University of Kansas', location: 'Lawrence, Kansas', slug: 'university-of-kansas' },
  
  // Kentucky
  { name: 'Centre College', location: 'Danville, Kentucky', slug: 'centre-college' },
  { name: 'Murray State University', location: 'Murray, Kentucky', slug: 'murray-state-university' },
  { name: 'Northern Kentucky University', location: 'Highland Heights, Kentucky', slug: 'northern-kentucky-university' },
  { name: 'University of Louisville', location: 'Louisville, Kentucky', slug: 'university-of-louisville' },
  
  // Louisiana
  { name: 'Louisiana State University', location: 'Baton Rouge, Louisiana', slug: 'louisiana-state-university' },
  
  // Massachusetts
  { name: 'Babson College', location: 'Wellesley, Massachusetts', slug: 'babson-college' },
  { name: 'Berklee College of Music', location: 'Boston, Massachusetts', slug: 'berklee-college-of-music' },
  { name: 'Boston College', location: 'Chestnut Hill, Massachusetts', slug: 'boston-college' },
  { name: 'Boston University', location: 'Boston, Massachusetts', slug: 'boston-university' },
  { name: 'Clark University', location: 'Worcester, Massachusetts', slug: 'clark-university' },
  { name: 'Endicott College', location: 'Beverly, Massachusetts', slug: 'endicott-college' },
  { name: 'Harvard University', location: 'Cambridge, Massachusetts', slug: 'harvard-university' },
  { name: 'Massachusetts Institute of Technology', location: 'Cambridge, Massachusetts', slug: 'mit' },
  { name: 'Merrimack College', location: 'North Andover, Massachusetts', slug: 'merrimack-college' },
  { name: 'Mount Holyoke College', location: 'South Hadley, Massachusetts', slug: 'mount-holyoke-college' },
  { name: 'Northeastern University', location: 'Boston, Massachusetts', slug: 'northeastern-university' },
  { name: 'Simmons University', location: 'Boston, Massachusetts', slug: 'simmons-university' },
  { name: 'Smith College', location: 'Northampton, Massachusetts', slug: 'smith-college' },
  { name: 'Stonehill College', location: 'Easton, Massachusetts', slug: 'stonehill-college' },
  { name: 'Suffolk University', location: 'Boston, Massachusetts', slug: 'suffolk-university' },
  { name: 'Tufts University', location: 'Medford, Massachusetts', slug: 'tufts-university' },
  { name: 'University of Massachusetts Amherst', location: 'Amherst, Massachusetts', slug: 'university-of-massachusetts-amherst' },
  { name: 'University of Massachusetts Boston', location: 'Boston, Massachusetts', slug: 'university-of-massachusetts-boston' },
  { name: 'Wellesley College', location: 'Wellesley, Massachusetts', slug: 'wellesley-college' },
  { name: 'Wentworth Institute of Technology', location: 'Boston, Massachusetts', slug: 'wentworth-institute-of-technology' },
  { name: 'Wheaton College', location: 'Norton, Massachusetts', slug: 'wheaton-college' },
  { name: 'Worcester Polytechnic Institute', location: 'Worcester, Massachusetts', slug: 'worcester-polytechnic-institute' },
  
  // Maryland
  { name: 'Johns Hopkins University', location: 'Baltimore, Maryland', slug: 'johns-hopkins-university' },
  { name: 'Morgan State University', location: 'Baltimore, Maryland', slug: 'morgan-state-university' },
  { name: 'Peabody Institute - Johns Hopkins University', location: 'Baltimore, Maryland', slug: 'peabody-institute-johns-hopkins-university' },
  { name: 'University of Maryland, Baltimore County', location: 'Baltimore, Maryland', slug: 'university-of-maryland-baltimore-county' },
  { name: 'University of Maryland, College Park', location: 'College Park, Maryland', slug: 'university-of-maryland-college-park' },
  
  // Maine
  { name: 'Colby College', location: 'Waterville, Maine', slug: 'colby-college' },
  
  // Michigan
  { name: 'Aquinas College', location: 'Grand Rapids, Michigan', slug: 'aquinas-college' },
  { name: 'Calvin University', location: 'Grand Rapids, Michigan', slug: 'calvin-university' },
  { name: 'Central Michigan University', location: 'Mount Pleasant, Michigan', slug: 'central-michigan-university' },
  { name: 'Michigan State University', location: 'East Lansing, Michigan', slug: 'michigan-state-university' },
  { name: 'Michigan Technological University', location: 'Houghton, Michigan', slug: 'michigan-technological-university' },
  { name: 'University of Michigan', location: 'Ann Arbor, Michigan', slug: 'university-of-michigan' },
  
  // Minnesota
  { name: 'Carleton College', location: 'Northfield, Minnesota', slug: 'carleton-college' },
  { name: 'St. Cloud State University', location: 'St. Cloud, Minnesota', slug: 'st-cloud-state-university' },
  { name: 'University of Minnesota', location: 'Minneapolis, Minnesota', slug: 'university-of-minnesota' },
  { name: 'University of St. Thomas', location: 'St. Paul, Minnesota', slug: 'university-of-st-thomas' },
  
  // Missouri
  { name: 'Mizzou - University of Missouri', location: 'Columbia, Missouri', slug: 'university-of-missouri' },
  { name: 'Saint Louis University', location: 'St. Louis, Missouri', slug: 'saint-louis-university' },
  { name: 'Washington University in St. Louis', location: 'St. Louis, Missouri', slug: 'washington-university-st-louis' },
  
  // Mississippi
  { name: 'University of Mississippi', location: 'Oxford, Mississippi', slug: 'university-of-mississippi' },
  
  // Montana
  { name: 'Montana State University', location: 'Bozeman, Montana', slug: 'montana-state-university' },
  
  // North Carolina
  { name: 'Appalachian State University', location: 'Boone, North Carolina', slug: 'appalachian-state-university' },
  { name: 'Duke University', location: 'Durham, North Carolina', slug: 'duke-university' },
  { name: 'High Point University', location: 'High Point, North Carolina', slug: 'high-point-university' },
  { name: 'Mars Hill University', location: 'Mars Hill, North Carolina', slug: 'mars-hill-university' },
  { name: 'North Carolina A&T', location: 'Greensboro, North Carolina', slug: 'north-carolina-at' },
  { name: 'North Carolina State University', location: 'Raleigh, North Carolina', slug: 'north-carolina-state-university' },
  { name: 'UNC Greensboro', location: 'Greensboro, North Carolina', slug: 'unc-greensboro' },
  { name: 'UNC Chapel Hill', location: 'Chapel Hill, North Carolina', slug: 'unc-chapel-hill' },
  { name: 'UNC Charlotte', location: 'Charlotte, North Carolina', slug: 'unc-charlotte' },
  { name: 'UNC Wilmington', location: 'Wilmington, North Carolina', slug: 'unc-wilmington' },
  { name: 'Wake Forest University', location: 'Winston-Salem, North Carolina', slug: 'wake-forest-university' },
  { name: 'Western Carolina University', location: 'Cullowhee, North Carolina', slug: 'western-carolina-university' },
  
  // North Dakota
  { name: 'North Dakota State University', location: 'Fargo, North Dakota', slug: 'north-dakota-state-university' },
  
  // Nebraska
  { name: 'University of Nebraska-Lincoln', location: 'Lincoln, Nebraska', slug: 'university-of-nebraska-lincoln' },
  { name: 'University of Nebraska-Omaha', location: 'Omaha, Nebraska', slug: 'university-of-nebraska-omaha' },
  
  // New Hampshire
  { name: 'Dartmouth College', location: 'Hanover, New Hampshire', slug: 'dartmouth-college' },
  { name: 'Plymouth State University', location: 'Plymouth, New Hampshire', slug: 'plymouth-state-university' },
  { name: 'University of New Hampshire', location: 'Durham, New Hampshire', slug: 'university-of-new-hampshire' },
  
  // New Jersey
  { name: 'Drew University', location: 'Madison, New Jersey', slug: 'drew-university' },
  { name: 'Kean University', location: 'Union, New Jersey', slug: 'kean-university' },
  { name: 'Montclair State University', location: 'Montclair, New Jersey', slug: 'montclair-state-university' },
  { name: 'New Jersey Institute of Technology', location: 'Newark, New Jersey', slug: 'new-jersey-institute-of-technology' },
  { name: 'Princeton University', location: 'Princeton, New Jersey', slug: 'princeton-university' },
  { name: 'Ramapo College of New Jersey', location: 'Mahwah, New Jersey', slug: 'ramapo-college-of-new-jersey' },
  { name: 'Rowan University', location: 'Glassboro, New Jersey', slug: 'rowan-university' },
  { name: 'Rutgers University-Camden', location: 'Camden, New Jersey', slug: 'rutgers-university-camden' },
  { name: 'Rutgers University-New Brunswick', location: 'New Brunswick, New Jersey', slug: 'rutgers-university-new-brunswick' },
  { name: 'Stevens Institute of Technology', location: 'Hoboken, New Jersey', slug: 'stevens-institute-of-technology' },
  { name: 'Stockton University', location: 'Galloway, New Jersey', slug: 'stockton-university' },
  { name: 'The College of New Jersey', location: 'Ewing, New Jersey', slug: 'the-college-of-new-jersey' },
  
  // New Mexico
  { name: 'Institute of American Indian Arts', location: 'Santa Fe, New Mexico', slug: 'institute-of-american-indian-arts' },
  { name: 'University of New Mexico', location: 'Albuquerque, New Mexico', slug: 'university-of-new-mexico' },
  
  // New York
  { name: 'Bard College', location: 'Annandale-on-Hudson, New York', slug: 'bard-college' },
  { name: 'Baruch College', location: 'New York, New York', slug: 'baruch-college' },
  { name: 'Binghamton University - SUNY', location: 'Binghamton, New York', slug: 'binghamton-university-suny' },
  { name: 'Columbia University', location: 'New York, New York', slug: 'columbia-university' },
  { name: 'Cornell University', location: 'Ithaca, New York', slug: 'cornell-university' },
  { name: 'Fordham University', location: 'New York, New York', slug: 'fordham-university' },
  { name: 'Hofstra University', location: 'Hempstead, New York', slug: 'hofstra-university' },
  { name: 'Marist College', location: 'Poughkeepsie, New York', slug: 'marist-college' },
  { name: 'New York University', location: 'New York, New York', slug: 'new-york-university' },
  { name: 'Pratt Institute', location: 'Brooklyn, New York', slug: 'pratt-institute' },
  { name: 'Queens College, CUNY', location: 'Queens, New York', slug: 'queens-college-cuny' },
  { name: 'Rensselaer Polytechnic Institute', location: 'Troy, New York', slug: 'rensselaer-polytechnic-institute' },
  { name: 'Rochester Institute of Technology', location: 'Rochester, New York', slug: 'rochester-institute-of-technology' },
  { name: 'St. John\'s University', location: 'Queens, New York', slug: 'st-johns-university' },
  { name: 'Stony Brook University', location: 'Stony Brook, New York', slug: 'stony-brook-university' },
  { name: 'SUNY New Paltz', location: 'New Paltz, New York', slug: 'suny-new-paltz' },
  { name: 'Syracuse University', location: 'Syracuse, New York', slug: 'syracuse-university' },
  { name: 'The New School', location: 'New York, New York', slug: 'the-new-school' },
  { name: 'Union College', location: 'Schenectady, New York', slug: 'union-college' },
  { name: 'University at Albany - SUNY', location: 'Albany, New York', slug: 'university-at-albany-suny' },
  { name: 'University at Buffalo', location: 'Buffalo, New York', slug: 'university-at-buffalo' },
  { name: 'University of Rochester', location: 'Rochester, New York', slug: 'university-of-rochester' },
  { name: 'Vassar College', location: 'Poughkeepsie, New York', slug: 'vassar-college' },
  
  // Ohio
  { name: 'Bowling Green State University', location: 'Bowling Green, Ohio', slug: 'bowling-green-state-university' },
  { name: 'Case Western Reserve University', location: 'Cleveland, Ohio', slug: 'case-western-reserve-university' },
  { name: 'Miami University', location: 'Oxford, Ohio', slug: 'miami-university' },
  { name: 'Ohio University', location: 'Athens, Ohio', slug: 'ohio-university' },
  { name: 'Ohio State University', location: 'Columbus, Ohio', slug: 'ohio-state-university' },
  { name: 'University of Akron', location: 'Akron, Ohio', slug: 'university-of-akron' },
  { name: 'University of Cincinnati', location: 'Cincinnati, Ohio', slug: 'university-of-cincinnati' },
  { name: 'University of Dayton', location: 'Dayton, Ohio', slug: 'university-of-dayton' },
  { name: 'Wright State University', location: 'Dayton, Ohio', slug: 'wright-state-university' },
  { name: 'Youngstown State University', location: 'Youngstown, Ohio', slug: 'youngstown-state-university' },
  
  // Oklahoma
  { name: 'University of Oklahoma', location: 'Norman, Oklahoma', slug: 'university-of-oklahoma' },
  { name: 'University of Tulsa', location: 'Tulsa, Oklahoma', slug: 'university-of-tulsa' },
  
  // Oregon
  { name: 'George Fox University', location: 'Newberg, Oregon', slug: 'george-fox-university' },
  { name: 'Oregon State University', location: 'Corvallis, Oregon', slug: 'oregon-state-university' },
  { name: 'Portland State University', location: 'Portland, Oregon', slug: 'portland-state-university' },
  { name: 'University of Oregon', location: 'Eugene, Oregon', slug: 'university-of-oregon' },
  { name: 'University of Portland', location: 'Portland, Oregon', slug: 'university-of-portland' },
  
  // Pennsylvania
  { name: 'Bucknell University', location: 'Lewisburg, Pennsylvania', slug: 'bucknell-university' },
  { name: 'Carnegie Mellon University', location: 'Pittsburgh, Pennsylvania', slug: 'carnegie-mellon-university' },
  { name: 'Drexel University', location: 'Philadelphia, Pennsylvania', slug: 'drexel-university' },
  { name: 'Duquesne University', location: 'Pittsburgh, Pennsylvania', slug: 'duquesne-university' },
  { name: 'Geneva College', location: 'Beaver Falls, Pennsylvania', slug: 'geneva-college' },
  { name: 'Haverford College', location: 'Haverford, Pennsylvania', slug: 'haverford-college' },
  { name: 'La Salle University', location: 'Philadelphia, Pennsylvania', slug: 'la-salle-university' },
  { name: 'Lafayette College', location: 'Easton, Pennsylvania', slug: 'lafayette-college' },
  { name: 'Lehigh University', location: 'Bethlehem, Pennsylvania', slug: 'lehigh-university' },
  { name: 'Penn State Harrisburg', location: 'Middletown, Pennsylvania', slug: 'penn-state-harrisburg' },
  { name: 'Penn State University', location: 'University Park, Pennsylvania', slug: 'penn-state-university' },
  { name: 'Robert Morris University', location: 'Moon Township, Pennsylvania', slug: 'robert-morris-university' },
  { name: 'Swarthmore College', location: 'Swarthmore, Pennsylvania', slug: 'swarthmore-college' },
  { name: 'Temple University', location: 'Philadelphia, Pennsylvania', slug: 'temple-university' },
  { name: 'University of Pennsylvania', location: 'Philadelphia, Pennsylvania', slug: 'university-of-pennsylvania' },
  { name: 'University of Pittsburgh', location: 'Pittsburgh, Pennsylvania', slug: 'university-of-pittsburgh' },
  { name: 'Wilkes University', location: 'Wilkes-Barre, Pennsylvania', slug: 'wilkes-university' },
  
  // Rhode Island
  { name: 'Brown University', location: 'Providence, Rhode Island', slug: 'brown-university' },
  { name: 'University of Rhode Island', location: 'Kingston, Rhode Island', slug: 'university-of-rhode-island' },
  
  // South Carolina
  { name: 'Clemson University', location: 'Clemson, South Carolina', slug: 'clemson-university' },
  { name: 'College of Charleston', location: 'Charleston, South Carolina', slug: 'college-of-charleston' },
  { name: 'Presbyterian College', location: 'Clinton, South Carolina', slug: 'presbyterian-college' },
  { name: 'University of South Carolina', location: 'Columbia, South Carolina', slug: 'university-of-south-carolina' },
  { name: 'Winthrop University', location: 'Rock Hill, South Carolina', slug: 'winthrop-university' },
  
  // Tennessee
  { name: 'Belmont University', location: 'Nashville, Tennessee', slug: 'belmont-university' },
  { name: 'University of Memphis', location: 'Memphis, Tennessee', slug: 'university-of-memphis' },
  { name: 'University of Tennessee at Chattanooga', location: 'Chattanooga, Tennessee', slug: 'university-of-tennessee-chattanooga' },
  { name: 'University of Tennessee, Knoxville', location: 'Knoxville, Tennessee', slug: 'university-of-tennessee-knoxville' },
  { name: 'Vanderbilt University', location: 'Nashville, Tennessee', slug: 'vanderbilt-university' },
  
  // Texas
  { name: 'Angelo State University', location: 'San Angelo, Texas', slug: 'angelo-state-university' },
  { name: 'Baylor University', location: 'Waco, Texas', slug: 'baylor-university' },
  { name: 'Rice University', location: 'Houston, Texas', slug: 'rice-university' },
  { name: 'Texas A&M University', location: 'College Station, Texas', slug: 'texas-am-university' },
  { name: 'Texas A&M University - Galveston', location: 'Galveston, Texas', slug: 'texas-am-university-galveston' },
  { name: 'Texas State University', location: 'San Marcos, Texas', slug: 'texas-state-university' },
  { name: 'Texas Tech University', location: 'Lubbock, Texas', slug: 'texas-tech-university' },
  { name: 'The University of Texas at Arlington', location: 'Arlington, Texas', slug: 'university-of-texas-arlington' },
  { name: 'University of Houston', location: 'Houston, Texas', slug: 'university-of-houston' },
  { name: 'University of North Texas', location: 'Denton, Texas', slug: 'university-of-north-texas' },
  { name: 'University of Texas at Austin', location: 'Austin, Texas', slug: 'university-of-texas-austin' },
  { name: 'University of Texas at Dallas', location: 'Richardson, Texas', slug: 'university-of-texas-dallas' },
  { name: 'University of Texas at San Antonio', location: 'San Antonio, Texas', slug: 'university-of-texas-san-antonio' },
  
  // Utah
  { name: 'Brigham Young University', location: 'Provo, Utah', slug: 'brigham-young-university' },
  { name: 'University of Utah', location: 'Salt Lake City, Utah', slug: 'university-of-utah' },
  
  // Virginia
  { name: 'George Mason University', location: 'Fairfax, Virginia', slug: 'george-mason-university' },
  { name: 'James Madison University', location: 'Harrisonburg, Virginia', slug: 'james-madison-university' },
  { name: 'Liberty University', location: 'Lynchburg, Virginia', slug: 'liberty-university' },
  { name: 'University of Virginia', location: 'Charlottesville, Virginia', slug: 'university-of-virginia' },
  { name: 'Virginia Commonwealth University', location: 'Richmond, Virginia', slug: 'virginia-commonwealth-university' },
  { name: 'Virginia Tech', location: 'Blacksburg, Virginia', slug: 'virginia-tech' },
  { name: 'College of William and Mary', location: 'Williamsburg, Virginia', slug: 'college-of-william-and-mary' },
  
  // Vermont
  { name: 'University of Vermont', location: 'Burlington, Vermont', slug: 'university-of-vermont' },
  
  // Washington
  { name: 'Gonzaga University', location: 'Spokane, Washington', slug: 'gonzaga-university' },
  { name: 'Pacific Lutheran University', location: 'Tacoma, Washington', slug: 'pacific-lutheran-university' },
  { name: 'Seattle University', location: 'Seattle, Washington', slug: 'seattle-university' },
  { name: 'University of Washington', location: 'Seattle, Washington', slug: 'university-of-washington' },
  { name: 'Washington State University', location: 'Pullman, Washington', slug: 'washington-state-university' },
  
  // Wisconsin
  { name: 'Marquette University', location: 'Milwaukee, Wisconsin', slug: 'marquette-university' },
  { name: 'University of Wisconsin - Milwaukee', location: 'Milwaukee, Wisconsin', slug: 'university-of-wisconsin-milwaukee' },
  { name: 'University of Wisconsin - Platteville', location: 'Platteville, Wisconsin', slug: 'university-of-wisconsin-platteville' },
  { name: 'University of Wisconsin – Whitewater', location: 'Whitewater, Wisconsin', slug: 'university-of-wisconsin-whitewater' },
  { name: 'University of Wisconsin–Madison', location: 'Madison, Wisconsin', slug: 'university-of-wisconsin-madison' },
  
  // West Virginia
  { name: 'West Virginia University', location: 'Morgantown, West Virginia', slug: 'west-virginia-university' },
  
  // Wyoming
  { name: 'Sheridan College', location: 'Sheridan, Wyoming', slug: 'sheridan-college' },
  
  // Canada Schools
  { name: 'Toronto Metropolitan University', location: 'Toronto, Ontario, Canada', slug: 'toronto-metropolitan-university' },
  { name: 'University of Toronto', location: 'Toronto, Ontario, Canada', slug: 'university-of-toronto' },
  { name: 'University of Waterloo', location: 'Waterloo, Ontario, Canada', slug: 'university-of-waterloo' },
  { name: 'University of Western Ontario', location: 'London, Ontario, Canada', slug: 'university-of-western-ontario' }
]

async function populateAllColleges() {
  console.log('🚀 Starting to populate ALL colleges database...')
  console.log(`📚 Found ${allColleges.length} colleges to add`)
  
  let successCount = 0
  let errorCount = 0
  let skipCount = 0
  
  for (const college of allColleges) {
    try {
      // Check if college already exists
      const { data: existing } = await supabase
        .from('colleges')
        .select('id')
        .eq('slug', college.slug)
        .single()
      
      if (existing) {
        console.log(`⏭️  Skipping ${college.name} (already exists)`)
        skipCount++
        continue
      }
      
      // Insert new college
      const { data, error } = await supabase
        .from('colleges')
        .insert({
          name: college.name,
          slug: college.slug,
          location: college.location,
          description: `${college.name} is a higher education institution located in ${college.location}.`,
          overall_rating: 0,
          total_reviews: 0
        })
        .select()
      
      if (error) {
        console.error(`❌ Error adding ${college.name}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Added ${college.name}`)
        successCount++
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing ${college.name}:`, error.message)
      errorCount++
    }
  }
  
  console.log('\n🎉 Population complete!')
  console.log(`✅ Successfully added: ${successCount} colleges`)
  console.log(`⏭️  Skipped (already exist): ${skipCount} colleges`)
  console.log(`❌ Errors: ${errorCount} colleges`)
  console.log(`📊 Total processed: ${allColleges.length} colleges`)
  console.log(`🏆 Your database now contains: ${successCount + skipCount} colleges`)
}

// Run the script
populateAllColleges().catch(console.error)