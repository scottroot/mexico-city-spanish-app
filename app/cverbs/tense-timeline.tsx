import React from 'react';

const SpanishVerbTimeline = () => {
  // Flattened timeline in chronological order
  const timelineTenses = [
    // Past tenses (left side)
    {
      name: "Past Perfect",
      spanish: "Pluscuamperfecto",
      example: "Había comido",
      englishExample: "I had eaten",
      color: "bg-red-700",
      borderColor: "border-red-700",
      textColor: "text-red-800",
      position: -3
    },
    {
      name: "Imperfect",
      spanish: "Imperfecto",
      example: "Comía",
      englishExample: "I was eating",
      color: "bg-red-500",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      position: -2
    },
    {
      name: "Past Simple",
      spanish: "Pretérito",
      example: "Comí",
      englishExample: "I ate",
      color: "bg-red-400",
      borderColor: "border-red-400",
      textColor: "text-red-600",
      position: -1
    },
    // Present tenses (center)
    {
      name: "Present Perfect",
      spanish: "Pretérito Perfecto",
      example: "He comido",
      englishExample: "I have eaten",
      color: "bg-blue-700",
      borderColor: "border-blue-700",
      textColor: "text-blue-800",
      position: 0.5
    },
    {
      name: "Present Continuous",
      spanish: "Presente Continuo",
      example: "Estoy comiendo",
      englishExample: "I am eating",
      color: "bg-blue-600",
      borderColor: "border-blue-600",
      textColor: "text-blue-700",
      position: 0.2
    },
    {
      name: "Present Simple",
      spanish: "Presente",
      example: "Como",
      englishExample: "I eat",
      color: "bg-blue-500",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      position: 0
    },
    // Future tenses (right side)
    {
      name: "Future Simple",
      spanish: "Futuro Simple",
      example: "Comeré",
      englishExample: "I will eat",
      color: "bg-green-400",
      borderColor: "border-green-400",
      textColor: "text-green-600",
      position: 1
    },
    {
      name: "Future Continuous",
      spanish: "Futuro Continuo",
      example: "Estaré comiendo",
      englishExample: "I will be eating",
      color: "bg-green-500",
      borderColor: "border-green-500",
      textColor: "text-green-600",
      position: 2
    },
    {
      name: "Future Perfect",
      spanish: "Futuro Perfecto",
      example: "Habré comido",
      englishExample: "I will have eaten",
      color: "bg-green-600",
      borderColor: "border-green-600",
      textColor: "text-green-700",
      position: 3
    },
    // Conditional tenses (far right)
    {
      name: "Conditional",
      spanish: "Condicional Simple",
      example: "Comería",
      englishExample: "I would eat",
      color: "bg-purple-500",
      borderColor: "border-purple-500",
      textColor: "text-purple-600",
      position: 4
    },
    {
      name: "Conditional Perfect",
      spanish: "Condicional Perfecto",
      example: "Habría comido",
      englishExample: "I would have eaten",
      color: "bg-purple-600",
      borderColor: "border-purple-600",
      textColor: "text-purple-700",
      position: 5
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <h1 className="text-4xl">WHAT THE FUCKKKKKKKKKKKKK</h1>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Spanish Verb Tenses Timeline
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A chronological journey from past to conditional
        </p>
      </div>

      {/* Timeline Labels */}
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-semibold text-red-600">PAST</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-semibold text-blue-600">PRESENT</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-semibold text-green-600">FUTURE</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-semibold text-purple-600">CONDITIONAL</span>
        </div>
      </div>

      {/* Main Timeline Container */}
      <div className="relative overflow-x-auto pb-8">
        <div className="min-w-full" style={{ minWidth: '1200px' }}>
          
          {/* Timeline Base Line */}
          <div className="relative h-96">
            {/* Main horizontal timeline */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-red-400 via-blue-400 via-green-400 to-purple-400 rounded-full transform -translate-y-1/2"></div>
            
            {/* Center "NOW" marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-20 relative"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                NOW
              </div>
            </div>

            {/* Timeline Tenses */}
            {timelineTenses.map((tense, index) => {
              // Calculate position along timeline
              const leftPercentage = 50 + (tense.position * 8); // Center at 50%, spread by 8% per position
              const isAbove = index % 2 === 0;
              
              return (
                <div
                  key={tense.name}
                  className="absolute transform -translate-x-1/2"
                  style={{ 
                    left: `${Math.max(5, Math.min(95, leftPercentage))}%`,
                    top: isAbove ? '20%' : '60%'
                  }}
                >
                  {/* Connecting Line */}
                  <div 
                    className={`absolute w-0.5 bg-gray-400 ${isAbove ? 'top-full' : 'bottom-full'}`}
                    style={{ 
                      height: '60px',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                  
                  {/* Timeline Dot */}
                  <div 
                    className={`absolute w-4 h-4 ${tense.color} rounded-full border-2 border-white shadow-md z-10`}
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)',
                      [isAbove ? 'bottom' : 'top']: '-62px'
                    }}
                  ></div>

                  {/* Tense Card */}
                  <div className={`w-48 group hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <div className={`${tense.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${tense.borderColor}`}>
                      {/* Card Header */}
                      <div className="bg-white bg-opacity-90 p-3">
                        <h3 className={`font-bold text-sm ${tense.textColor} leading-tight`}>
                          {tense.name}
                        </h3>
                        <p className="text-xs text-gray-600 italic">
                          {tense.spanish}
                        </p>
                      </div>

                      {/* Examples */}
                      <div className="p-3 text-white">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
                          <p className="font-medium text-sm">{tense.example}</p>
                          <p className="text-xs opacity-90">{tense.englishExample}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline (Vertical for small screens) */}
      <div className="lg:hidden mt-12">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-blue-400 via-green-400 to-purple-400 rounded-full"></div>
          
          {timelineTenses.map((tense, index) => (
            <div key={`mobile-${tense.name}`} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className={`w-6 h-6 ${tense.color} rounded-full border-4 border-white shadow-lg z-10 flex-shrink-0 mt-2`}></div>
              
              {/* Card */}
              <div className="ml-6 flex-1">
                <div className={`${tense.color} rounded-xl shadow-lg overflow-hidden border-l-4 ${tense.borderColor}`}>
                  <div className="bg-white bg-opacity-90 p-4">
                    <h3 className={`font-bold text-lg ${tense.textColor}`}>
                      {tense.name}
                    </h3>
                    <p className="text-sm text-gray-600 italic">
                      {tense.spanish}
                    </p>
                  </div>
                  <div className="p-4 text-white">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                      <p className="font-medium">{tense.example}</p>
                      <p className="text-sm opacity-90">{tense.englishExample}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline Guide</h3>
          <p className="text-gray-600 mb-4">
            Tenses are positioned chronologically from left to right. The "NOW" marker represents the present moment.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <span className="text-red-600">← Past</span>
            <div className="w-16 h-1 bg-gradient-to-r from-red-400 via-blue-400 to-purple-400 rounded-full"></div>
            <span className="text-purple-600">Conditional →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpanishVerbTimeline;