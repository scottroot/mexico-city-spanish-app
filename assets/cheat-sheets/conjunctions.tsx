/*
This is a component that displays a formatted cheat sheet that is suitable for the user to print

this cheat sheet will be used to help the user learn the most common conjunctions in Spanish.

it will be a table with the following columns:
- Conjunction
- English translation

1. Coordinating conjunctions,
Connect grammatically equal elements.,
Conjunction,Translation
y,and
e,"and (before i, hi)"
o,or
u,"or (before o, ho)"
pero,but
mas,but (formal)
sino,but rather
sino que,but rather that
sino también,but also
no solo… sino…,not only… but…
no solo… sino también…,not only… but also…
bien… bien…,either… or…
ora… ora…,now… now…
además,"furthermore, also"
en cambio,on the other hand
incluso,even
así como,"just as, as well as"
igual que,just like
mientras tanto,meanwhile
al contrario,on the contrary
aun así,even so
de cualquier manera,in any way
de cualquier modo,in any way
de todos modos,anyway
de todas formas,in any case
sin embargo,however
no obstante,however
entonces,"so, then"
así pues,"so, thus"
así que,"so, therefore"
por eso,that is why
por lo tanto,therefore
por tanto,therefore
por consiguiente,consequently
por ende,therefore
esto es,that is
es decir,that is
o sea,"that is, I mean"
,
2. Subordinating conjunctions,
Introduce a dependent clause.,
Causal,
,
Conjunction,Translation
porque,because
como,"since, because, as"
debido a que,because
puesto que,"since, given that"
ya que,"since, because"
pues,"since, because"
de ahí que,hence
,
Conditional,
,
Conjunction,Translation
si,if
siempre que,as long as
a menos que,unless
a no ser que,unless
en caso de que,in case
,
Concessive,
,
Conjunction,Translation
aunque,although
aunque sí,"although yes, even if so"
aun cuando,"even when, although"
pese a que,"although, despite the fact that"
a pesar de que,despite the fact that
,
Temporal,
,
Conjunction,Translation
cuando,when
tan pronto como,as soon as
en cuanto,as soon as
apenas,"as soon as, barely"
apenas si,barely
después de que,after
tras,after
mientras,while
mientras que,whereas
,
Final (purpose),
,
Conjunction,Translation
a fin de que,so that
de manera que,so that
de modo que,so that
,
Comparative,
,
Conjunction,Translation
como si,as if
igual que,just like
,
Consecutive (result),
,
Conjunction,Translation
así que,"so, therefore"
por lo tanto,therefore
por tanto,therefore
por consiguiente,consequently
por ende,therefore
de manera que,so that
de modo que,so that
por eso,that is why
,
Declarative / completive,
,
Conjunction,Translation
que,that (subordinating)
,
Other subordinators,
,
Conjunction,Translation
según,according to
ya sea que,whether
,
,
,
3. Correlative conjunctions,
,
,
Paired structures.,
,
Conjunction,Translation
tanto… como…,both… and…
bien… bien…,either… or…
no solo… sino…,not only… but…
no solo… sino también…,not only… but also…
ya sea… ya sea…,whether… or…
ya sea / ya sea que,whether
*/

function ConjunctionsCheatSheet() {
  const coordinating = [
    { spanish: "y", english: "and" },
    { spanish: "e", english: "and (before i, hi)" },
    { spanish: "o", english: "or" },
    { spanish: "u", english: "or (before o, ho)" },
    { spanish: "pero", english: "but" },
    { spanish: "mas", english: "but (formal)" },
    { spanish: "sino", english: "but rather" },
    { spanish: "sino que", english: "but rather that" },
    { spanish: "sino también", english: "but also" },
    { spanish: "no solo… sino…", english: "not only… but…" },
    { spanish: "no solo… sino también…", english: "not only… but also…" },
    { spanish: "bien… bien…", english: "either… or…" },
    { spanish: "ora… ora…", english: "now… now…" },
    { spanish: "además", english: "furthermore, also" },
    { spanish: "en cambio", english: "on the other hand" },
    { spanish: "incluso", english: "even" },
    { spanish: "así como", english: "just as, as well as" },
    { spanish: "igual que", english: "just like" },
    { spanish: "mientras tanto", english: "meanwhile" },
    { spanish: "al contrario", english: "on the contrary" },
    { spanish: "aun así", english: "even so" },
    { spanish: "de cualquier manera", english: "in any way" },
    { spanish: "de cualquier modo", english: "in any way" },
    { spanish: "de todos modos", english: "anyway" },
    { spanish: "de todas formas", english: "in any case" },
    { spanish: "sin embargo", english: "however" },
    { spanish: "no obstante", english: "however" },
    { spanish: "entonces", english: "so, then" },
    { spanish: "así pues", english: "so, thus" },
    { spanish: "así que", english: "so, therefore" },
    { spanish: "por eso", english: "that is why" },
    { spanish: "por lo tanto", english: "therefore" },
    { spanish: "por tanto", english: "therefore" },
    { spanish: "por consiguiente", english: "consequently" },
    { spanish: "por ende", english: "therefore" },
    { spanish: "esto es", english: "that is" },
    { spanish: "es decir", english: "that is" },
    { spanish: "o sea", english: "that is, I mean" },
  ];

  const subordinating = {
    causal: [
      { spanish: "porque", english: "because" },
      { spanish: "como", english: "since, because, as" },
      { spanish: "debido a que", english: "because" },
      { spanish: "puesto que", english: "since, given that" },
      { spanish: "ya que", english: "since, because" },
      { spanish: "pues", english: "since, because" },
      { spanish: "de ahí que", english: "hence" },
    ],
    conditional: [
      { spanish: "si", english: "if" },
      { spanish: "siempre que", english: "as long as" },
      { spanish: "a menos que", english: "unless" },
      { spanish: "a no ser que", english: "unless" },
      { spanish: "en caso de que", english: "in case" },
    ],
    concessive: [
      { spanish: "aunque", english: "although" },
      { spanish: "aunque sí", english: "although yes, even if so" },
      { spanish: "aun cuando", english: "even when, although" },
      { spanish: "pese a que", english: "although, despite the fact that" },
      { spanish: "a pesar de que", english: "despite the fact that" },
    ],
    temporal: [
      { spanish: "cuando", english: "when" },
      { spanish: "tan pronto como", english: "as soon as" },
      { spanish: "en cuanto", english: "as soon as" },
      { spanish: "apenas", english: "as soon as, barely" },
      { spanish: "apenas si", english: "barely" },
      { spanish: "después de que", english: "after" },
      { spanish: "tras", english: "after" },
      { spanish: "mientras", english: "while" },
      { spanish: "mientras que", english: "whereas" },
    ],
    final: [
      { spanish: "a fin de que", english: "so that" },
      { spanish: "de manera que", english: "so that" },
      { spanish: "de modo que", english: "so that" },
    ],
    comparative: [
      { spanish: "como si", english: "as if" },
      { spanish: "igual que", english: "just like" },
    ],
    consecutive: [
      { spanish: "así que", english: "so, therefore" },
      { spanish: "por lo tanto", english: "therefore" },
      { spanish: "por tanto", english: "therefore" },
      { spanish: "por consiguiente", english: "consequently" },
      { spanish: "por ende", english: "therefore" },
      { spanish: "de manera que", english: "so that" },
      { spanish: "de modo que", english: "so that" },
      { spanish: "por eso", english: "that is why" },
    ],
    declarative: [
      { spanish: "que", english: "that (subordinating)" },
    ],
    other: [
      { spanish: "según", english: "according to" },
      { spanish: "ya sea que", english: "whether" },
    ],
  };

  const correlative = [
    { spanish: "tanto… como…", english: "both… and…" },
    { spanish: "bien… bien…", english: "either… or…" },
    { spanish: "no solo… sino…", english: "not only… but…" },
    { spanish: "no solo… sino también…", english: "not only… but also…" },
    { spanish: "ya sea… ya sea…", english: "whether… or…" },
    { spanish: "ya sea / ya sea que", english: "whether" },
  ];

  const renderTable = (items: Array<{ spanish: string; english: string }>) => (
    <table className="w-full border-collapse mb-6">
      <thead>
        <tr className="bg-gray-100 border-b-2 border-gray-300">
          <th className="text-left py-3 px-4 font-semibold text-gray-800 w-2/5">Conjunction</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-800 w-3/5">Translation</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4 font-medium text-gray-900">{item.spanish}</td>
            <td className="py-3 px-4 text-gray-700">{item.english}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg print:p-4 print:max-w-full">
      {/* Header */}
      <div className="mb-8 text-center print:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">
          Spanish Conjunctions Cheat Sheet
        </h1>
        <p className="text-gray-600 text-sm print:text-xs">
          A comprehensive guide to Spanish conjunctions
        </p>
      </div>

      {/* Section 1: Coordinating Conjunctions */}
      <section className="mb-10 print:mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
            1. Coordinating Conjunctions
          </h2>
          <p className="text-gray-600 text-sm italic print:text-xs">
            Connect grammatically equal elements
          </p>
        </div>
        {renderTable(coordinating)}
      </section>

      {/* Section 2: Subordinating Conjunctions */}
      <section className="mb-10 print:mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
            2. Subordinating Conjunctions
          </h2>
          <p className="text-gray-600 text-sm italic print:text-xs">
            Introduce a dependent clause
          </p>
        </div>

        {/* Causal */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Causal
          </h3>
          {renderTable(subordinating.causal)}
        </div>

        {/* Conditional */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Conditional
          </h3>
          {renderTable(subordinating.conditional)}
        </div>

        {/* Concessive */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Concessive
          </h3>
          {renderTable(subordinating.concessive)}
        </div>

        {/* Temporal */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Temporal
          </h3>
          {renderTable(subordinating.temporal)}
        </div>

        {/* Final (purpose) */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Final (Purpose)
          </h3>
          {renderTable(subordinating.final)}
        </div>

        {/* Comparative */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Comparative
          </h3>
          {renderTable(subordinating.comparative)}
        </div>

        {/* Consecutive (result) */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Consecutive (Result)
          </h3>
          {renderTable(subordinating.consecutive)}
        </div>

        {/* Declarative / Completive */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Declarative / Completive
          </h3>
          {renderTable(subordinating.declarative)}
        </div>

        {/* Other Subordinators */}
        <div className="mb-6 print:mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
            Other Subordinators
          </h3>
          {renderTable(subordinating.other)}
        </div>
      </section>

      {/* Section 3: Correlative Conjunctions */}
      <section className="mb-6 print:mb-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
            3. Correlative Conjunctions
          </h2>
          <p className="text-gray-600 text-sm italic print:text-xs">
            Paired structures
          </p>
        </div>
        {renderTable(correlative)}
      </section>
    </div>
  );
}

export default ConjunctionsCheatSheet;