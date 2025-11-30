#!/usr/bin/env python3
"""
Convert the wide verb CSV into a long form where each row = one (mood, tense, pronoun) entry.

Input columns (example):
infinitive,infinitive_english,mood,mood_english,tense,tense_english,
form_1s,form_1s_english,form_2s,form_2s_english,form_3s,form_3s_english,
form_1p,form_1p_english,form_2p,form_2p_english,form_3p,form_3p_english,
gerund,gerund_english,pastparticiple,pastparticiple_english
"""

import argparse
import pandas as pd
from pathlib import Path

pd.options.display.max_columns = None


PRONOUN_ES = {
    ("1","s"): "yo",
    ("2","s"): "tú",
    ("3","s"): "él/ella",
    ("1","p"): "nosotros",
    ("2","p"): "vosotros",
    ("3","p"): "ellos/ellas/ustedes",
}
PRONOUN_EN = {
    ("1","s"): "I",
    ("2","s"): "you",
    ("3","s"): "he/she/it",
    ("1","p"): "we",
    ("2","p"): "you (formal plural)",
    ("3","p"): "they",
}

KEEP_COLS = [
    "infinitive", "infinitive_english",
    "mood", "mood_english",
    "tense", "tense_english",
]

PRONOUN_SLOTS = [
    ("1", "s", "form_1s", "form_1s_english"),
    ("2", "s", "form_2s", "form_2s_english"),
    ("3", "s", "form_3s", "form_3s_english"),
    ("1", "p", "form_1p", "form_1p_english"),
    ("2", "p", "form_2p", "form_2p_english"),
    ("3", "p", "form_3p", "form_3p_english"),
]

def to_long(df: pd.DataFrame) -> pd.DataFrame:
    records = []
    for _, row in df.iterrows():
        if row['tense'] == "Pretérito anterior":
            continue
        for person, number, form_es_colname, form_en_colname in PRONOUN_SLOTS:
            form_text_es = row.get(form_es_colname, None)
            form_text_en = row.get(form_en_colname, None)
            # Skip empty or NaN forms
            if not (form_text_es and form_text_en) or pd.isna(form_text_es) or pd.isna(form_text_en) or form_text_es == "" or form_text_en == "":
                print(f"Skipping {row['mood_english']}_{row['tense_english']}_{row['infinitive']} - {person}{number}")
                # exit()
            rec = {k: row.get(k, None) for k in KEEP_COLS if k in df.columns}
            rec.update({
                "person": person,                 # "1","2","3"
                "number": number,                 # "s" or "p"
                "pronoun": PRONOUN_ES[(person, number)],
                "pronoun_english": PRONOUN_EN[(person, number)],
                "form": form_text_es,
                "form_english": form_text_en,
            })
            records.append(rec)
    out = pd.DataFrame.from_records(records)
    # Optional stable column order
    cols = [
        "infinitive","infinitive_english",
        "mood","mood_english","tense","tense_english",
        "person","number","pronoun","pronoun_english",
        "form","form_english",
        # "gerund","gerund_english","pastparticiple","pastparticiple_english",
    ]
    return out[[c for c in cols if c in out.columns]]

def main():
    main_path = "/Users/scomax/Documents/Git/Spanish-Language-App/archive/external-app-to-integrate/external-app"
    input_csv = f"{main_path}/verbs_filled.csv"

    in_path = Path(input_csv)
    out_path = in_path.with_name(in_path.stem + "_long.csv")

    df = pd.read_csv(in_path, encoding="utf-8") 
    # print(df.head())
    long_df = to_long(df)
    long_df.to_csv(out_path, index=False, encoding="utf-8-sig")
    print(f"Wrote {out_path} with {len(long_df)} rows")

if __name__ == "__main__":
    main()
