/*
This is a component that displays a formatted cheat sheet that is suitable for the user to print

this cheat sheet will be used to help the user learn the most common prepositions in Spanish.

it will be a table with the following columns:
- Preposition
- English translation

a,to / at
a base de,"by means of, made from"
a bordo de,"aboard, on board"
a cambio de,in exchange for
a cargo de,in charge of
a causa de,because of
a consecuencia de,as a consequence of
a costa de,at the cost of
a falta de,"lacking, in the absence of"
a favor de,in favor of
a fin de,in order to
a fuerza de,by force of
a lo largo de,along
a partir de,starting from
a partir desde,starting from (colloquial variant)
a pesar de,despite
a punta de,"by force of, using"
a raíz de,as a result of
a través de,through
abajo de,below
adentro de,inside
afuera de,outside
al lado de,beside
alrededor de,around
ante,before / in the presence of
antes de,before
arriba de,above
bajo,under / below
basado en,based on
cerca de,near
con,with
con base en,based on
con respecto a,regarding
con rumbo a,heading toward
contra,against
de,of / from
de acuerdo con,according to
de lado de,on the side of
debajo de,underneath
debido a,due to
delante de,in front of
dentro de,inside
desde,from / since (time)
después de,after
detrás de,behind
durante,during
en,in / on / at / into
en busca de,in search of
en caso de,in case of
en contra de,against
en cuanto a,regarding
en dirección a,in the direction of
en frente de,in front of
en función de,"depending on, according to"
en lugar de,instead of
en medio de,in the middle of
en nombre de,in the name of
en torno a,"around, about"
en vez de,instead of
en vista de,in view of
entre,between / among
excepto,except
frente a,facing
hacia,toward / about
hasta,until / up to
junto a,next to
junto con,together with
lejos de,far from
mediante,via / through
para,for / in order to
por,for / through / by
por alrededor de,around (quantity estimate)
por causa de,because of
por culpa de,"because of, due to someone or something"
por debajo de,below
por delante de,ahead of
por dentro,inside
por dentro de,inside of
por detrás de,behind
por encima de,above
por fuera,outside
por fuera de,outside of
por medio de,by means of
por motivo de,due to
por parte de,on the part of
por razón de,on account of
rumbo a,toward
salvo,except
según,according to
sin,without
sobre,on / upon / about
tras,behind / after
vía,"via, through"

*/

function PrepositionsCheatSheet() {
  const prepositions = [
    { spanish: "a", english: "to / at" },
    { spanish: "a base de", english: "by means of, made from" },
    { spanish: "a bordo de", english: "aboard, on board" },
    { spanish: "a cambio de", english: "in exchange for" },
    { spanish: "a cargo de", english: "in charge of" },
    { spanish: "a causa de", english: "because of" },
    { spanish: "a consecuencia de", english: "as a consequence of" },
    { spanish: "a costa de", english: "at the cost of" },
    { spanish: "a falta de", english: "lacking, in the absence of" },
    { spanish: "a favor de", english: "in favor of" },
    { spanish: "a fin de", english: "in order to" },
    { spanish: "a fuerza de", english: "by force of" },
    { spanish: "a lo largo de", english: "along" },
    { spanish: "a partir de", english: "starting from" },
    { spanish: "a partir desde", english: "starting from (colloquial variant)" },
    { spanish: "a pesar de", english: "despite" },
    { spanish: "a punta de", english: "by force of, using" },
    { spanish: "a raíz de", english: "as a result of" },
    { spanish: "a través de", english: "through" },
    { spanish: "abajo de", english: "below" },
    { spanish: "adentro de", english: "inside" },
    { spanish: "afuera de", english: "outside" },
    { spanish: "al lado de", english: "beside" },
    { spanish: "alrededor de", english: "around" },
    { spanish: "ante", english: "before / in the presence of" },
    { spanish: "antes de", english: "before" },
    { spanish: "arriba de", english: "above" },
    { spanish: "bajo", english: "under / below" },
    { spanish: "basado en", english: "based on" },
    { spanish: "cerca de", english: "near" },
    { spanish: "con", english: "with" },
    { spanish: "con base en", english: "based on" },
    { spanish: "con respecto a", english: "regarding" },
    { spanish: "con rumbo a", english: "heading toward" },
    { spanish: "contra", english: "against" },
    { spanish: "de", english: "of / from" },
    { spanish: "de acuerdo con", english: "according to" },
    { spanish: "de lado de", english: "on the side of" },
    { spanish: "debajo de", english: "underneath" },
    { spanish: "debido a", english: "due to" },
    { spanish: "delante de", english: "in front of" },
    { spanish: "dentro de", english: "inside" },
    { spanish: "desde", english: "from / since (time)" },
    { spanish: "después de", english: "after" },
    { spanish: "detrás de", english: "behind" },
    { spanish: "durante", english: "during" },
    { spanish: "en", english: "in / on / at / into" },
    { spanish: "en busca de", english: "in search of" },
    { spanish: "en caso de", english: "in case of" },
    { spanish: "en contra de", english: "against" },
    { spanish: "en cuanto a", english: "regarding" },
    { spanish: "en dirección a", english: "in the direction of" },
    { spanish: "en frente de", english: "in front of" },
    { spanish: "en función de", english: "depending on, according to" },
    { spanish: "en lugar de", english: "instead of" },
    { spanish: "en medio de", english: "in the middle of" },
    { spanish: "en nombre de", english: "in the name of" },
    { spanish: "en torno a", english: "around, about" },
    { spanish: "en vez de", english: "instead of" },
    { spanish: "en vista de", english: "in view of" },
    { spanish: "entre", english: "between / among" },
    { spanish: "excepto", english: "except" },
    { spanish: "frente a", english: "facing" },
    { spanish: "hacia", english: "toward / about" },
    { spanish: "hasta", english: "until / up to" },
    { spanish: "junto a", english: "next to" },
    { spanish: "junto con", english: "together with" },
    { spanish: "lejos de", english: "far from" },
    { spanish: "mediante", english: "via / through" },
    { spanish: "para", english: "for / in order to" },
    { spanish: "por", english: "for / through / by" },
    { spanish: "por alrededor de", english: "around (quantity estimate)" },
    { spanish: "por causa de", english: "because of" },
    { spanish: "por culpa de", english: "because of, due to someone or something" },
    { spanish: "por debajo de", english: "below" },
    { spanish: "por delante de", english: "ahead of" },
    { spanish: "por dentro", english: "inside" },
    { spanish: "por dentro de", english: "inside of" },
    { spanish: "por detrás de", english: "behind" },
    { spanish: "por encima de", english: "above" },
    { spanish: "por fuera", english: "outside" },
    { spanish: "por fuera de", english: "outside of" },
    { spanish: "por medio de", english: "by means of" },
    { spanish: "por motivo de", english: "due to" },
    { spanish: "por parte de", english: "on the part of" },
    { spanish: "por razón de", english: "on account of" },
    { spanish: "rumbo a", english: "toward" },
    { spanish: "salvo", english: "except" },
    { spanish: "según", english: "according to" },
    { spanish: "sin", english: "without" },
    { spanish: "sobre", english: "on / upon / about" },
    { spanish: "tras", english: "behind / after" },
    { spanish: "vía", english: "via, through" },
  ];

  const renderTable = (items: Array<{ spanish: string; english: string }>) => (
    <table className="w-full border-collapse mb-6">
      <thead>
        <tr className="bg-gray-100 border-b-2 border-gray-300">
          <th className="text-left py-3 px-4 font-semibold text-gray-800 w-2/5">Preposition</th>
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
    <div className="max-w-4xl mx-auto p-6 bg-white print:p-4 print:max-w-full">
      {/* Header */}
      <div className="mb-8 text-center print:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">
          Spanish Prepositions Cheat Sheet
        </h1>
        <p className="text-gray-600 text-sm print:text-xs">
          A comprehensive guide to Spanish prepositions
        </p>
      </div>

      {/* Prepositions Table */}
      <section className="mb-6 print:mb-4">
        {renderTable(prepositions)}
      </section>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          table {
            page-break-inside: avoid;
          }
          section {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default PrepositionsCheatSheet;