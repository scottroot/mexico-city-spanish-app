import React from 'react';
import { motion } from 'framer-motion';

const SpanishVerbTimeline = () => {
  // Simplified timeline with modern design
  const timelineTenses = [
    // Past tenses (left side)
    {
      name: "Past Perfect",
      spanish: "Pluscuamperfecto",
      example: "Había comido",
      englishExample: "I had eaten",
      color: "from-red-500 to-red-600",
      dotColor: "bg-red-500",
      position: -3,
      category: "past"
    },
    {
      name: "Imperfect",
      spanish: "Imperfecto", 
      example: "Comía",
      englishExample: "I was eating",
      color: "from-red-400 to-red-500",
      dotColor: "bg-red-400",
      position: -2,
      category: "past"
    },
    {
      name: "Past Simple",
      spanish: "Pretérito",
      example: "Comí",
      englishExample: "I ate",
      color: "from-red-300 to-red-400",
      dotColor: "bg-red-300",
      position: -1,
      category: "past"
    },
    // Present tenses (center)
    {
      name: "Present Perfect",
      spanish: "Pretérito Perfecto",
      example: "He comido",
      englishExample: "I have eaten",
      color: "from-blue-500 to-blue-600",
      dotColor: "bg-blue-500",
      position: 0.5,
      category: "present"
    },
    {
      name: "Present Continuous",
      spanish: "Presente Continuo",
      example: "Estoy comiendo",
      englishExample: "I am eating",
      color: "from-blue-400 to-blue-500",
      dotColor: "bg-blue-400",
      position: 0.2,
      category: "present"
    },
    {
      name: "Present Simple",
      spanish: "Presente",
      example: "Como",
      englishExample: "I eat",
      color: "from-blue-300 to-blue-400",
      dotColor: "bg-blue-300",
      position: 0,
      category: "present"
    },
    // Future tenses (right side)
    {
      name: "Future Simple",
      spanish: "Futuro Simple",
      example: "Comeré",
      englishExample: "I will eat",
      color: "from-green-400 to-green-500",
      dotColor: "bg-green-400",
      position: 1,
      category: "future"
    },
    {
      name: "Future Continuous",
      spanish: "Futuro Continuo",
      example: "Estaré comiendo",
      englishExample: "I will be eating",
      color: "from-green-500 to-green-600",
      dotColor: "bg-green-500",
      position: 2,
      category: "future"
    },
    {
      name: "Future Perfect",
      spanish: "Futuro Perfecto",
      example: "Habré comido",
      englishExample: "I will have eaten",
      color: "from-green-600 to-green-700",
      dotColor: "bg-green-600",
      position: 3,
      category: "future"
    },
    // Conditional tenses (far right)
    {
      name: "Conditional",
      spanish: "Condicional Simple",
      example: "Comería",
      englishExample: "I would eat",
      color: "from-purple-400 to-purple-500",
      dotColor: "bg-purple-400",
      position: 4,
      category: "conditional"
    },
    {
      name: "Conditional Perfect",
      spanish: "Condicional Perfecto",
      example: "Habría comido",
      englishExample: "I would have eaten",
      color: "from-purple-500 to-purple-600",
      dotColor: "bg-purple-500",
      position: 5,
      category: "conditional"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Minimalist Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Spanish Verb Tenses
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Chronological timeline from past to conditional
        </p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block relative min-h-[600px]">
        {/* Timeline Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-red-300 via-blue-300 via-green-300 to-purple-300 rounded-full"></div>
        
        {/* NOW Marker */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
            NOW
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative pt-16 pb-20">
          {timelineTenses.map((tense, index) => {
            // Systematic positioning to prevent overlap
            const totalItems = timelineTenses.length;
            const leftPercentage = 20 + (index * (60 / (totalItems - 1))); // Even distribution across 60% of width
            const isAbove = index % 2 === 0;
            
            return (
              <motion.div
                key={tense.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2"
                style={{ 
                  left: `${leftPercentage}%`,
                  top: isAbove ? '0' : '200px' // Increased vertical spacing
                }}
              >
                {/* Timeline Dot */}
                <div className={`w-3 h-3 ${tense.dotColor} rounded-full border-2 border-white shadow-sm mx-auto mb-2`}></div>
                
                {/* Tense Card */}
                <div className="w-20 sm:w-24 group cursor-pointer"> {/* Even smaller width */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br ${tense.color} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
                  >
                    <div className="p-1.5 text-white"> {/* Reduced padding */}
                      <h3 className="font-semibold text-xs leading-tight mb-0.5">
                        {tense.name}
                      </h3>
                      <p className="text-xs opacity-90 italic mb-1">
                        {tense.spanish}
                      </p>
                      <div className="bg-white bg-opacity-20 rounded p-1 backdrop-blur-sm">
                        <p className="font-medium text-xs">{tense.example}</p>
                        <p className="text-xs opacity-80 mt-0.5">{tense.englishExample}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Category Labels */}
        <div className="flex justify-between items-center mt-8 px-4">
          <div className="text-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Past</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Present</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Future</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Conditional</span>
          </div>
        </div>
      </div>

      {/* Mobile Grid Layout */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timelineTenses.map((tense, index) => (
            <motion.div
              key={tense.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${tense.color} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
                <div className="p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 ${tense.dotColor} rounded-full border-2 border-white shadow-sm`}></div>
                    <h3 className="font-semibold text-sm">
                      {tense.name}
                    </h3>
                  </div>
                  <p className="text-sm opacity-90 italic mb-3">
                    {tense.spanish}
                  </p>
                  <div className="bg-white bg-opacity-20 rounded p-3 backdrop-blur-sm">
                    <p className="font-medium text-sm">{tense.example}</p>
                    <p className="text-sm opacity-80 mt-1">{tense.englishExample}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpanishVerbTimeline;