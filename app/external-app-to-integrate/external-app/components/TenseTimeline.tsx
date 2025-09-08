import clsx from "clsx";


function DownArrow(props: any) {
  const { className, ...rest } = props;
  return (
    <div className={clsx("block", className)} {...rest}>
      <svg 
        className="w-24 h-20"
        style={{rotate: "90deg"}}
        focusable="false" 
        aria-hidden="true" 
        viewBox="0 0 24 24"
      >
        <path d="M12 8V4l8 8-8 8v-4H4V8z" fill="currentColor" />
      </svg>
    </div>
  )
}

export default function TenseTimeline() {
  const tenseGroups = {
    Past: [
      {
        name: "Past Perfect",
        example: "I had eaten",
        color: "bg-red-600",
        borderColor: "border-red-600",
        textColor: "text-red-700"
      },
      {
        // name: "Imperfect (Past Continuous)",
        name: "Imperfect",
        example: "I was eating",
        color: "bg-red-500",
        borderColor: "border-red-500",
        textColor: "text-red-700"
      },
      {
        name: "Past Simple",
        example: "I ate",
        color: "bg-red-400",
        borderColor: "border-red-400",
        textColor: "text-red-700"
      }
    ],
    Present: [
      {
        name: "Present Perfect",
        example: "I have eaten",
        color: "bg-blue-700",
        borderColor: "border-blue-700",
        textColor: "text-blue-700"
      },
      {
        name: "Present Continuous",
        example: "I am eating",
        color: "bg-blue-600",
        borderColor: "border-blue-600",
        textColor: "text-blue-700"
      },
      {
        name: "Present Simple",
        example: "I eat",
        color: "bg-blue-500",
        borderColor: "border-blue-500",
        textColor: "text-blue-700"
      }
    ],
    Future: [
      {
        name: "Future Perfect Continuous",
        example: "I will have been eating",
        color: "bg-green-600",
        borderColor: "border-green-600",
        textColor: "text-green-700"
      },
      {
        name: "Future Perfect",
        example: "I will have eaten",
        color: "bg-green-500",
        borderColor: "border-green-500",
        textColor: "text-green-700"
      },
      {
        name: "Future Continuous",
        example: "I will be eating",
        color: "bg-green-400",
        borderColor: "border-green-400",
        textColor: "text-green-700"
      },
      {
        name: "Future Simple",
        example: "I will eat",
        color: "bg-green-300",
        borderColor: "border-green-300",
        textColor: "text-green-700"
      }
    ]
  };

  const groupColors = {
    Past: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    Present: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    Future: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Chronological Order of Tenses
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(tenseGroups).map(([timeGroup, tenses]) => (
          <div 
            key={timeGroup} 
            className={clsx(
              "p-4 rounded-lg border",
              groupColors[timeGroup as keyof typeof groupColors].border,
              groupColors[timeGroup as keyof typeof groupColors].bg
            )}
          >
            <h3 
              className={clsx(
                "text-lg font-bold mb-4 text-center",
                groupColors[timeGroup as keyof typeof groupColors].text
              )}
            >
              {timeGroup}
            </h3>
            
            <div className="space-y-8">
              {tenses.map((tense, index) => (
                <div key={tense.name} className="relative">
                  {/* Tense Card */}
                  <div 
                    style={{zIndex: Math.floor(1000 / (index + 1) + 10)}}
                    className={clsx(
                      `relative p-3 rounded-lg border-l-4`,
                      tense.borderColor,
                      "bg-white shadow-sm hover:shadow-md transition-shadow"
                    )}
                  >
                    <div 
                      id={`tense-header-${tense.name.replaceAll(" ", "-").toLowerCase()}`} 
                      className="flex flex-row items-start gap-4 mb-2"
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className={clsx(
                            "w-6 h-6",
                            "text-xs font-bold text-white px-2 py-1 rounded-full",
                            tense.color
                          )}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <h4 
                        className={clsx(
                          "font-semibold text-sm mb-1 leading-none pt-1 h-8",
                          tense.textColor
                        )}
                      >
                        {tense.name}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-xs italic">
                      {tense.example}
                    </p>
                  </div>
                  
                  {/* Large Arrow Overlay (except for the last tense) */}
                  {index < tenses.length - 1 && (
                    <div 
                      style={{zIndex: Math.floor(1000 / (index + 1))}}
                      className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 opacity-20"
                    >
                      <div className={clsx("text-gray-400", tense.textColor)}>
                        <DownArrow />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Note: This timeline shows the chronological order of when actions occur, not the order of learning complexity.</p>
      </div>
    </div>
  );
} 