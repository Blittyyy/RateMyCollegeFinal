// College Scorecard API utilities
// https://collegescorecard.ed.gov/data/documentation/

const SCORECARD_API_BASE = 'https://api.data.gov/ed/collegescorecard/v1/schools'

interface ScorecardCollege {
  id: string
  school: {
    name: string
    city: string
    state: string
    zip: string
    school_url: string
    price_calculator_url: string
    ownership: string
    locale: string
    carnegie_basic: string
    carnegie_undergrad: string
    carnegie_size_setting: string
    degrees_awarded: {
      predominant: string
      highest: string
    }
  }
  latest: {
    student: {
      size: number
      enrollment: {
        all: number
        '12_month': number
        '4_year': number
        '2_year': number
        less_than_2_year: number
      }
      demographics: {
        race_ethnicity: {
          white: number
          black: number
          hispanic: number
          asian: number
          american_indian_alaska_native: number
          native_hawaiian_pacific_islander: number
          two_or_more_races: number
          unknown: number
          non_resident_alien: number
        }
        age_entry: number
        median_family_income: number
        share_firstgeneration: number
        share_25_older: number
      }
    }
    cost: {
      attendance: {
        academic_year: {
          '2019-20': {
            '4_year': number
            '2_year': number
            less_than_2_year: number
          }
        }
      }
      tuition: {
        in_state: number
        out_of_state: number
      }
      roomboard: {
        on_campus: number
        off_campus_with_family: number
        off_campus_not_with_family: number
      }
    }
    aid: {
      median_debt: {
        graduating: {
          overall: number
          '4_year': number
          '2_year': number
          less_than_2_year: number
        }
      }
      loan_principal: {
        '4_year': number
        '2_year': number
        less_than_2_year: number
      }
      pell_grant: {
        '4_year': number
        '2_year': number
        less_than_2_year: number
      }
    }
    academics: {
      program_degree: {
        '4_year': number
        '2_year': number
        less_than_2_year: number
      }
      program_percentage: {
        '4_year': number
        '2_year': number
        less_than_2_year: number
      }
    }
    outcomes: {
      '8_yr_rt': number
      '6_yr_rt': number
      '4_yr_rt': number
      '3_yr_rt': number
      '2_yr_rt': number
      '1_yr_rt': number
      repayment: {
        '3_yr_repayment': number
        '5_yr_repayment': number
        '7_yr_repayment': number
      }
      earnings: {
        '10_yrs_after_entry': number
        '6_yrs_after_entry': number
        '8_yrs_after_entry': number
      }
    }
  }
}

export async function searchCollegeByName(collegeName: string): Promise<ScorecardCollege | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SCORECARD_API_KEY
    console.log('🔍 Searching for college:', collegeName)
    console.log('🔑 API Key present:', !!apiKey)
    
    if (!apiKey) {
      console.warn('❌ Scorecard API key not found')
      return null
    }

    // Use a more focused search with the fields that are actually available
    const url = `${SCORECARD_API_BASE}?school.name=${encodeURIComponent(collegeName)}&fields=id,school.name,school.city,school.state,school.ownership,school.locale,school.degrees_awarded.highest,latest.student.size,latest.student.demographics.median_family_income,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.earnings.6_yrs_after_entry.median,latest.earnings.10_yrs_after_entry.median&api_key=${apiKey}`
    
    console.log('🌐 Making API request to:', url.substring(0, 100) + '...')
    
    const response = await fetch(url)

    console.log('📡 Response status:', response.status)
    console.log('📡 Response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error response:', errorText)
      throw new Error(`Scorecard API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('📊 API Response data:', data)
    console.log('📊 Results array:', data.results)
    console.log('📊 Number of results:', data.results?.length)
    
    if (data.results && data.results.length > 0) {
      const firstResult = data.results[0]
      console.log('📊 First result:', firstResult)
      console.log('📊 School ownership:', firstResult['school.ownership'])
      console.log('📊 School locale:', firstResult['school.locale'])
      console.log('📊 School degrees:', firstResult['school.degrees_awarded.highest'])
      console.log('📊 6-year graduation rate:', firstResult['latest.outcomes.6_yr_rt'])
      console.log('📊 All available fields:', Object.keys(firstResult))
      
      // The API returns flat keys, so we need to reconstruct the nested structure
      const collegeData: ScorecardCollege = {
        id: firstResult.id,
        school: {
          name: firstResult['school.name'],
          city: firstResult['school.city'],
          state: firstResult['school.state'],
          zip: '',
          school_url: '',
          price_calculator_url: '',
          ownership: firstResult['school.ownership'],
          locale: firstResult['school.locale'],
          carnegie_basic: '',
          carnegie_undergrad: '',
          carnegie_size_setting: '',
          degrees_awarded: {
            predominant: '',
            highest: firstResult['school.degrees_awarded.highest']
          }
        },
        latest: {
          student: {
            size: firstResult['latest.student.size'],
            enrollment: {
              all: null,
              '12_month': null,
              '4_year': null,
              '2_year': null,
              less_than_2_year: null
            },
            demographics: {
              race_ethnicity: {
                white: null,
                black: null,
                hispanic: null,
                asian: null,
                american_indian_alaska_native: null,
                native_hawaiian_pacific_islander: null,
                two_or_more_races: null,
                unknown: null,
                non_resident_alien: null
              },
              age_entry: null,
              median_family_income: firstResult['latest.student.demographics.median_family_income'],
              share_firstgeneration: null,
              share_25_older: null
            }
          },
          cost: {
            attendance: {
              academic_year: {
                '2019-20': {
                  '4_year': null
                }
              }
            },
            tuition: {
              in_state: firstResult['latest.cost.tuition.in_state'],
              out_of_state: firstResult['latest.cost.tuition.out_of_state']
            },
            roomboard: {
              on_campus: null,
              off_campus_with_family: null,
              off_campus_not_with_family: null
            }
          },
          aid: {
            median_debt: {
              graduating: {
                overall: null,
                '4_year': null,
                '2_year': null,
                less_than_2_year: null
              }
            },
            loan_principal: {
              '4_year': null,
              '2_year': null,
              less_than_2_year: null
            },
            pell_grant: {
              '4_year': null,
              '2_year': null,
              less_than_2_year: null
            }
          },
          academics: {
            program_degree: {
              '4_year': null,
              '2_year': null,
              less_than_2_year: null
            },
            program_percentage: {
              '4_year': null,
              '2_year': null,
              less_than_2_year: null
            }
          },
          outcomes: {
            '8_yr_rt': null,
            '6_yr_rt': null,
            '4_yr_rt': null,
            '3_yr_rt': null,
            '2_yr_rt': null,
            '1_yr_rt': null,
            repayment: {
              '3_yr_repayment': null,
              '5_yr_repayment': null,
              '7_yr_repayment': null
            },
            earnings: {
              '10_yrs_after_entry': firstResult['latest.earnings.10_yrs_after_entry.median'],
              '6_yrs_after_entry': firstResult['latest.earnings.6_yrs_after_entry.median'],
              '8_yrs_after_entry': null
            }
          }
        }
      }
      
      console.log('📊 School name path:', collegeData.school.name)
      console.log('✅ Found college data:', collegeData.school.name)
      return collegeData
    }
    
    console.log('❌ No college found for:', collegeName)
    return null
  } catch (error) {
    console.error('❌ Error fetching Scorecard data:', error)
    return null
  }
}