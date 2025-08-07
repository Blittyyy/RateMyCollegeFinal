"use client"

interface ScorecardDataProps {
  data: any
}

export function ScorecardData({ data }: ScorecardDataProps) {
  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-500">Official data not available for this college</p>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat().format(num)
  }

  const formatCurrency = (num: number) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatPercentage = (num: number) => {
    if (!num) return 'N/A'
    return `${(num * 100).toFixed(1)}%`
  }

  const getOwnershipLabel = (ownership: string) => {
    switch (ownership) {
      case '1': return 'Public'
      case '2': return 'Private Non-Profit'
      case '3': return 'Private For-Profit'
      case 'Public': return 'Public'
      case 'Private nonprofit': return 'Private Non-Profit'
      case 'Private for-profit': return 'Private For-Profit'
      default: return ownership
    }
  }

  const getLocaleLabel = (locale: string) => {
    switch (locale) {
      case '11': return 'Large City'
      case '12': return 'Midsize City'
      case '13': return 'Small City'
      case '21': return 'Large Suburb'
      case '22': return 'Midsize Suburb'
      case '23': return 'Small Suburb'
      case '31': return 'Fringe Town'
      case '32': return 'Distant Town'
      case '33': return 'Remote Town'
      case '41': return 'Fringe Rural'
      case '42': return 'Distant Rural'
      case '43': return 'Remote Rural'
      case 'City: Large': return 'Large City'
      case 'City: Midsize': return 'Midsize City'
      case 'City: Small': return 'Small City'
      case 'Suburb: Large': return 'Large Suburb'
      case 'Suburb: Midsize': return 'Midsize Suburb'
      case 'Suburb: Small': return 'Small Suburb'
      case 'Town: Fringe': return 'Fringe Town'
      case 'Town: Distant': return 'Distant Town'
      case 'Town: Remote': return 'Remote Town'
      case 'Rural: Fringe': return 'Fringe Rural'
      case 'Rural: Distant': return 'Distant Rural'
      case 'Rural: Remote': return 'Remote Rural'
      default: return locale
    }
  }

  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case '1': return 'Certificate'
      case '2': return 'Associate'
      case '3': return 'Bachelor'
      case '4': return 'Graduate'
      default: return degree
    }
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 text-xl">🏢</span>
            <h3 className="font-semibold text-gray-900">Institution Type</h3>
          </div>
          <p className="text-gray-700">{getOwnershipLabel(data.school?.ownership?.toString())}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 text-xl">🌍</span>
            <h3 className="font-semibold text-gray-900">Location Type</h3>
          </div>
          <p className="text-gray-700">{getLocaleLabel(data.school?.locale?.toString())}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-600 text-xl">🎓</span>
            <h3 className="font-semibold text-gray-900">Degree Level</h3>
          </div>
          <p className="text-gray-700">{getDegreeLabel(data.school?.degrees_awarded?.highest?.toString())}</p>
        </div>
      </div>

      {/* Student Body */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-blue-600 text-2xl">👥</span>
          Student Body
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Enrollment</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.latest?.student?.size)}</p>
            <p className="text-xs text-gray-500 mt-1">Undergraduate students only</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Median Family Income</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.student?.demographics?.median_family_income)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">First-Generation Students</p>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.latest?.student?.demographics?.share_firstgeneration)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Students 25+ Years Old</p>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.latest?.student?.demographics?.share_25_older)}</p>
          </div>
        </div>
      </div>

      {/* Cost & Financial Aid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-green-600 text-2xl">💰</span>
          Cost & Financial Aid
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">In-State Tuition</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.cost?.tuition?.in_state)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Out-of-State Tuition</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.cost?.tuition?.out_of_state)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Room & Board</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.cost?.roomboard?.on_campus)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Median Debt at Graduation</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.aid?.median_debt?.graduating?.overall)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Students Receiving Pell Grants</p>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.latest?.aid?.pell_grant?.['4_year'])}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Cost of Attendance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.cost?.attendance?.academic_year?.['2019-20']?.['4_year'])}</p>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-purple-600 text-2xl">📈</span>
          Outcomes
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">6-Year Graduation Rate</p>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.latest?.outcomes?.['6_yr_rt'])}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">8-Year Graduation Rate</p>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.latest?.outcomes?.['8_yr_rt'])}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Median Earnings (6 Years)</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.outcomes?.earnings?.['6_yrs_after_entry'])}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Median Earnings (10 Years)</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.latest?.outcomes?.earnings?.['10_yrs_after_entry'])}</p>
          </div>
        </div>
      </div>

      {/* Additional Links */}
      {data.school?.school_url && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Official College Website</h4>
          <a 
            href={data.school.school_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Visit Official Website →
          </a>
        </div>
      )}
    </div>
  )
}