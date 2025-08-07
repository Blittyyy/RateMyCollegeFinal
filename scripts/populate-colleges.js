// Script to populate the Supabase database with colleges from RateMyDorm
// Run this with: node scripts/populate-colleges.js

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

// Comprehensive list of colleges from RateMyDorm and other major institutions
const colleges = [
  // Alabama
  { name: 'Auburn University', location: 'Auburn, Alabama', slug: 'auburn-university' },
  { name: 'University of Alabama', location: 'Tuscaloosa, Alabama', slug: 'university-of-alabama' },
  { name: 'University of Alabama at Birmingham', location: 'Birmingham, Alabama', slug: 'university-of-alabama-birmingham' },
  
  // Arizona
  { name: 'Arizona State University', location: 'Tempe, Arizona', slug: 'arizona-state-university' },
  { name: 'Grand Canyon University', location: 'Phoenix, Arizona', slug: 'grand-canyon-university' },
  { name: 'University of Arizona', location: 'Tucson, Arizona', slug: 'university-of-arizona' },
  
  // California
  { name: 'California Polytechnic State University, San Luis Obispo', location: 'San Luis Obispo, California', slug: 'cal-poly-san-luis-obispo' },
  { name: 'California State University, Fresno', location: 'Fresno, California', slug: 'california-state-university-fresno' },
  { name: 'California State University, Fullerton', location: 'Fullerton, California', slug: 'california-state-university-fullerton' },
  { name: 'California State University, Long Beach', location: 'Long Beach, California', slug: 'california-state-university-long-beach' },
  { name: 'California State University, Northridge', location: 'Northridge, California', slug: 'california-state-university-northridge' },
  { name: 'California State University, Sacramento', location: 'Sacramento, California', slug: 'california-state-university-sacramento' },
  { name: 'Chapman University', location: 'Orange, California', slug: 'chapman-university' },
  { name: 'Harvey Mudd College', location: 'Claremont, California', slug: 'harvey-mudd-college' },
  { name: 'Loyola Marymount University', location: 'Los Angeles, California', slug: 'loyola-marymount-university' },
  { name: 'Pepperdine University', location: 'Malibu, California', slug: 'pepperdine-university' },
  { name: 'Pomona College', location: 'Claremont, California', slug: 'pomona-college' },
  { name: 'San Diego State University', location: 'San Diego, California', slug: 'san-diego-state-university' },
  { name: 'San Francisco State University', location: 'San Francisco, California', slug: 'san-francisco-state-university' },
  { name: 'San Jose State University', location: 'San Jose, California', slug: 'san-jose-state-university' },
  { name: 'Santa Clara University', location: 'Santa Clara, California', slug: 'santa-clara-university' },
  { name: 'Stanford University', location: 'Stanford, California', slug: 'stanford-university' },
  { name: 'University of California, Berkeley', location: 'Berkeley, California', slug: 'university-of-california-berkeley' },
  { name: 'University of California, Davis', location: 'Davis, California', slug: 'university-of-california-davis' },
  { name: 'University of California, Irvine', location: 'Irvine, California', slug: 'university-of-california-irvine' },
  { name: 'University of California, Los Angeles', location: 'Los Angeles, California', slug: 'university-of-california-los-angeles' },
  { name: 'University of California, Riverside', location: 'Riverside, California', slug: 'university-of-california-riverside' },
  { name: 'University of California, San Diego', location: 'La Jolla, California', slug: 'university-of-california-san-diego' },
  { name: 'University of California, Santa Barbara', location: 'Santa Barbara, California', slug: 'university-of-california-santa-barbara' },
  { name: 'University of California, Santa Cruz', location: 'Santa Cruz, California', slug: 'university-of-california-santa-cruz' },
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
  { name: 'Florida International University', location: 'Miami, Florida', slug: 'florida-international-university' },
  { name: 'Florida State University', location: 'Tallahassee, Florida', slug: 'florida-state-university' },
  { name: 'University of Central Florida', location: 'Orlando, Florida', slug: 'university-of-central-florida' },
  { name: 'University of Florida', location: 'Gainesville, Florida', slug: 'university-of-florida' },
  { name: 'University of Miami', location: 'Coral Gables, Florida', slug: 'university-of-miami' },
  { name: 'University of South Florida', location: 'Tampa, Florida', slug: 'university-of-south-florida' },
  
  // Georgia
  { name: 'Emory University', location: 'Atlanta, Georgia', slug: 'emory-university' },
  { name: 'Georgia Institute of Technology', location: 'Atlanta, Georgia', slug: 'georgia-institute-of-technology' },
  { name: 'University of Georgia', location: 'Athens, Georgia', slug: 'university-of-georgia' },
  
  // Illinois
  { name: 'DePaul University', location: 'Chicago, Illinois', slug: 'depaul-university' },
  { name: 'Illinois State University', location: 'Normal, Illinois', slug: 'illinois-state-university' },
  { name: 'Loyola University Chicago', location: 'Chicago, Illinois', slug: 'loyola-university-chicago' },
  { name: 'Northwestern University', location: 'Evanston, Illinois', slug: 'northwestern-university' },
  { name: 'University of Chicago', location: 'Chicago, Illinois', slug: 'university-of-chicago' },
  { name: 'University of Illinois at Urbana-Champaign', location: 'Champaign, Illinois', slug: 'university-of-illinois-urbana-champaign' },
  
  // Indiana
  { name: 'Indiana University Bloomington', location: 'Bloomington, Indiana', slug: 'indiana-university-bloomington' },
  { name: 'Purdue University', location: 'West Lafayette, Indiana', slug: 'purdue-university' },
  { name: 'University of Notre Dame', location: 'Notre Dame, Indiana', slug: 'university-of-notre-dame' },
  
  // Massachusetts
  { name: 'Babson College', location: 'Wellesley, Massachusetts', slug: 'babson-college' },
  { name: 'Boston College', location: 'Chestnut Hill, Massachusetts', slug: 'boston-college' },
  { name: 'Boston University', location: 'Boston, Massachusetts', slug: 'boston-university' },
  { name: 'Clark University', location: 'Worcester, Massachusetts', slug: 'clark-university' },
  { name: 'Harvard University', location: 'Cambridge, Massachusetts', slug: 'harvard-university' },
  { name: 'Massachusetts Institute of Technology', location: 'Cambridge, Massachusetts', slug: 'mit' },
  { name: 'Northeastern University', location: 'Boston, Massachusetts', slug: 'northeastern-university' },
  { name: 'Smith College', location: 'Northampton, Massachusetts', slug: 'smith-college' },
  { name: 'Tufts University', location: 'Medford, Massachusetts', slug: 'tufts-university' },
  { name: 'University of Massachusetts Amherst', location: 'Amherst, Massachusetts', slug: 'university-of-massachusetts-amherst' },
  { name: 'Wellesley College', location: 'Wellesley, Massachusetts', slug: 'wellesley-college' },
  { name: 'Worcester Polytechnic Institute', location: 'Worcester, Massachusetts', slug: 'worcester-polytechnic-institute' },
  
  // Maryland
  { name: 'Johns Hopkins University', location: 'Baltimore, Maryland', slug: 'johns-hopkins-university' },
  { name: 'University of Maryland, College Park', location: 'College Park, Maryland', slug: 'university-of-maryland-college-park' },
  
  // Michigan
  { name: 'Michigan State University', location: 'East Lansing, Michigan', slug: 'michigan-state-university' },
  { name: 'University of Michigan', location: 'Ann Arbor, Michigan', slug: 'university-of-michigan' },
  
  // Minnesota
  { name: 'Carleton College', location: 'Northfield, Minnesota', slug: 'carleton-college' },
  { name: 'University of Minnesota', location: 'Minneapolis, Minnesota', slug: 'university-of-minnesota' },
  
  // Missouri
  { name: 'Saint Louis University', location: 'St. Louis, Missouri', slug: 'saint-louis-university' },
  { name: 'University of Missouri', location: 'Columbia, Missouri', slug: 'university-of-missouri' },
  { name: 'Washington University in St. Louis', location: 'St. Louis, Missouri', slug: 'washington-university-st-louis' },
  
  // North Carolina
  { name: 'Duke University', location: 'Durham, North Carolina', slug: 'duke-university' },
  { name: 'North Carolina State University', location: 'Raleigh, North Carolina', slug: 'north-carolina-state-university' },
  { name: 'University of North Carolina at Chapel Hill', location: 'Chapel Hill, North Carolina', slug: 'university-of-north-carolina-chapel-hill' },
  { name: 'Wake Forest University', location: 'Winston-Salem, North Carolina', slug: 'wake-forest-university' },
  
  // New Hampshire
  { name: 'Dartmouth College', location: 'Hanover, New Hampshire', slug: 'dartmouth-college' },
  { name: 'University of New Hampshire', location: 'Durham, New Hampshire', slug: 'university-of-new-hampshire' },
  
  // New Jersey
  { name: 'Princeton University', location: 'Princeton, New Jersey', slug: 'princeton-university' },
  { name: 'Rutgers University-New Brunswick', location: 'New Brunswick, New Jersey', slug: 'rutgers-university-new-brunswick' },
  { name: 'Stevens Institute of Technology', location: 'Hoboken, New Jersey', slug: 'stevens-institute-of-technology' },
  
  // New York
  { name: 'Bard College', location: 'Annandale-on-Hudson, New York', slug: 'bard-college' },
  { name: 'Columbia University', location: 'New York, New York', slug: 'columbia-university' },
  { name: 'Cornell University', location: 'Ithaca, New York', slug: 'cornell-university' },
  { name: 'Fordham University', location: 'New York, New York', slug: 'fordham-university' },
  { name: 'New York University', location: 'New York, New York', slug: 'new-york-university' },
  { name: 'Rensselaer Polytechnic Institute', location: 'Troy, New York', slug: 'rensselaer-polytechnic-institute' },
  { name: 'Rochester Institute of Technology', location: 'Rochester, New York', slug: 'rochester-institute-of-technology' },
  { name: 'Stony Brook University', location: 'Stony Brook, New York', slug: 'stony-brook-university' },
  { name: 'Syracuse University', location: 'Syracuse, New York', slug: 'syracuse-university' },
  { name: 'University at Buffalo', location: 'Buffalo, New York', slug: 'university-at-buffalo' },
  { name: 'University of Rochester', location: 'Rochester, New York', slug: 'university-of-rochester' },
  { name: 'Vassar College', location: 'Poughkeepsie, New York', slug: 'vassar-college' },
  
  // Ohio
  { name: 'Case Western Reserve University', location: 'Cleveland, Ohio', slug: 'case-western-reserve-university' },
  { name: 'Miami University', location: 'Oxford, Ohio', slug: 'miami-university' },
  { name: 'Ohio State University', location: 'Columbus, Ohio', slug: 'ohio-state-university' },
  { name: 'University of Cincinnati', location: 'Cincinnati, Ohio', slug: 'university-of-cincinnati' },
  
  // Oregon
  { name: 'Oregon State University', location: 'Corvallis, Oregon', slug: 'oregon-state-university' },
  { name: 'University of Oregon', location: 'Eugene, Oregon', slug: 'university-of-oregon' },
  
  // Pennsylvania
  { name: 'Bucknell University', location: 'Lewisburg, Pennsylvania', slug: 'bucknell-university' },
  { name: 'Carnegie Mellon University', location: 'Pittsburgh, Pennsylvania', slug: 'carnegie-mellon-university' },
  { name: 'Drexel University', location: 'Philadelphia, Pennsylvania', slug: 'drexel-university' },
  { name: 'Haverford College', location: 'Haverford, Pennsylvania', slug: 'haverford-college' },
  { name: 'Lehigh University', location: 'Bethlehem, Pennsylvania', slug: 'lehigh-university' },
  { name: 'Pennsylvania State University', location: 'University Park, Pennsylvania', slug: 'pennsylvania-state-university' },
  { name: 'Swarthmore College', location: 'Swarthmore, Pennsylvania', slug: 'swarthmore-college' },
  { name: 'Temple University', location: 'Philadelphia, Pennsylvania', slug: 'temple-university' },
  { name: 'University of Pennsylvania', location: 'Philadelphia, Pennsylvania', slug: 'university-of-pennsylvania' },
  { name: 'University of Pittsburgh', location: 'Pittsburgh, Pennsylvania', slug: 'university-of-pittsburgh' },
  
  // Rhode Island
  { name: 'Brown University', location: 'Providence, Rhode Island', slug: 'brown-university' },
  { name: 'University of Rhode Island', location: 'Kingston, Rhode Island', slug: 'university-of-rhode-island' },
  
  // South Carolina
  { name: 'Clemson University', location: 'Clemson, South Carolina', slug: 'clemson-university' },
  { name: 'University of South Carolina', location: 'Columbia, South Carolina', slug: 'university-of-south-carolina' },
  
  // Tennessee
  { name: 'University of Tennessee, Knoxville', location: 'Knoxville, Tennessee', slug: 'university-of-tennessee-knoxville' },
  { name: 'Vanderbilt University', location: 'Nashville, Tennessee', slug: 'vanderbilt-university' },
  
  // Texas
  { name: 'Baylor University', location: 'Waco, Texas', slug: 'baylor-university' },
  { name: 'Rice University', location: 'Houston, Texas', slug: 'rice-university' },
  { name: 'Texas A&M University', location: 'College Station, Texas', slug: 'texas-am-university' },
  { name: 'Texas State University', location: 'San Marcos, Texas', slug: 'texas-state-university' },
  { name: 'Texas Tech University', location: 'Lubbock, Texas', slug: 'texas-tech-university' },
  { name: 'University of Houston', location: 'Houston, Texas', slug: 'university-of-houston' },
  { name: 'University of North Texas', location: 'Denton, Texas', slug: 'university-of-north-texas' },
  { name: 'University of Texas at Austin', location: 'Austin, Texas', slug: 'university-of-texas-austin' },
  { name: 'University of Texas at Dallas', location: 'Richardson, Texas', slug: 'university-of-texas-dallas' },
  
  // Utah
  { name: 'Brigham Young University', location: 'Provo, Utah', slug: 'brigham-young-university' },
  { name: 'University of Utah', location: 'Salt Lake City, Utah', slug: 'university-of-utah' },
  
  // Virginia
  { name: 'George Mason University', location: 'Fairfax, Virginia', slug: 'george-mason-university' },
  { name: 'James Madison University', location: 'Harrisonburg, Virginia', slug: 'james-madison-university' },
  { name: 'University of Virginia', location: 'Charlottesville, Virginia', slug: 'university-of-virginia' },
  { name: 'Virginia Commonwealth University', location: 'Richmond, Virginia', slug: 'virginia-commonwealth-university' },
  { name: 'Virginia Tech', location: 'Blacksburg, Virginia', slug: 'virginia-tech' },
  { name: 'College of William and Mary', location: 'Williamsburg, Virginia', slug: 'college-of-william-and-mary' },
  
  // Washington
  { name: 'Gonzaga University', location: 'Spokane, Washington', slug: 'gonzaga-university' },
  { name: 'Seattle University', location: 'Seattle, Washington', slug: 'seattle-university' },
  { name: 'University of Washington', location: 'Seattle, Washington', slug: 'university-of-washington' },
  { name: 'Washington State University', location: 'Pullman, Washington', slug: 'washington-state-university' },
  
  // Wisconsin
  { name: 'Marquette University', location: 'Milwaukee, Wisconsin', slug: 'marquette-university' },
  { name: 'University of Wisconsin-Madison', location: 'Madison, Wisconsin', slug: 'university-of-wisconsin-madison' },
  
  // West Virginia
  { name: 'West Virginia University', location: 'Morgantown, West Virginia', slug: 'west-virginia-university' }
]

async function populateColleges() {
  console.log('🚀 Starting to populate colleges database...')
  console.log(`📚 Found ${colleges.length} colleges to add`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const college of colleges) {
    try {
      // Check if college already exists
      const { data: existing } = await supabase
        .from('colleges')
        .select('id')
        .eq('slug', college.slug)
        .single()
      
      if (existing) {
        console.log(`⏭️  Skipping ${college.name} (already exists)`)
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
  console.log(`❌ Errors: ${errorCount} colleges`)
  console.log(`📊 Total processed: ${colleges.length} colleges`)
}

// Run the script
populateColleges().catch(console.error)