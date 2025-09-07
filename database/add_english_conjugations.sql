-- Migration: Add English conjugation fields to verb_conjugations table
-- Run this in your Supabase SQL editor

-- Add English conjugation fields to the existing verb_conjugations table
ALTER TABLE public.verb_conjugations 
ADD COLUMN IF NOT EXISTS form_1s_english TEXT, -- I
ADD COLUMN IF NOT EXISTS form_2s_english TEXT, -- you (informal)
ADD COLUMN IF NOT EXISTS form_3s_english TEXT, -- he/she/you (formal)
ADD COLUMN IF NOT EXISTS form_1p_english TEXT, -- we
ADD COLUMN IF NOT EXISTS form_2p_english TEXT, -- you (plural, Spain)
ADD COLUMN IF NOT EXISTS form_3p_english TEXT; -- they/you (plural)

-- Add comments to document the fields
COMMENT ON COLUMN public.verb_conjugations.form_1s_english IS 'English conjugation for yo (I)';
COMMENT ON COLUMN public.verb_conjugations.form_2s_english IS 'English conjugation for tú (you informal)';
COMMENT ON COLUMN public.verb_conjugations.form_3s_english IS 'English conjugation for él/ella/usted (he/she/you formal)';
COMMENT ON COLUMN public.verb_conjugations.form_1p_english IS 'English conjugation for nosotros (we)';
COMMENT ON COLUMN public.verb_conjugations.form_2p_english IS 'English conjugation for vosotros (you plural, Spain)';
COMMENT ON COLUMN public.verb_conjugations.form_3p_english IS 'English conjugation for ellos/ellas/ustedes (they/you plural)';

-- Create indexes for the new English fields for better query performance
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_1s_english ON public.verb_conjugations(form_1s_english);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_2s_english ON public.verb_conjugations(form_2s_english);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_3s_english ON public.verb_conjugations(form_3s_english);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_1p_english ON public.verb_conjugations(form_1p_english);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_2p_english ON public.verb_conjugations(form_2p_english);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_form_3p_english ON public.verb_conjugations(form_3p_english);

-- Example data insertion for testing (you can remove this after testing)
-- This shows how to populate the English conjugations for a few verbs
-- You'll need to populate these fields with actual English conjugations

-- ========================================
-- COMPREHENSIVE EXAMPLES FOR ALL TENSE/MOOD COMBINATIONS
-- ========================================
-- Using "abandonar" (to abandon) as the example verb for all combinations

-- INDICATIVO MOOD (11 tenses)
-- 1. Presente Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I abandon',
  form_2s_english = 'You abandon',
  form_3s_english = 'He/She abandons',
  form_1p_english = 'We abandon',
  form_2p_english = 'You (plural) abandon',
  form_3p_english = 'They abandon'
WHERE infinitive = 'abandonar' AND tense = 'Presente' AND mood = 'Indicativo';

-- 2. Futuro Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I will abandon',
  form_2s_english = 'You will abandon',
  form_3s_english = 'He/She will abandon',
  form_1p_english = 'We will abandon',
  form_2p_english = 'You (plural) will abandon',
  form_3p_english = 'They will abandon'
WHERE infinitive = 'abandonar' AND tense = 'Futuro' AND mood = 'Indicativo';

-- 3. Imperfecto Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I used to abandon',
  form_2s_english = 'You used to abandon',
  form_3s_english = 'He/She used to abandon',
  form_1p_english = 'We used to abandon',
  form_2p_english = 'You (plural) used to abandon',
  form_3p_english = 'They used to abandon'
WHERE infinitive = 'abandonar' AND tense = 'Imperfecto' AND mood = 'Indicativo';

-- 4. Pretérito Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I abandoned',
  form_2s_english = 'You abandoned',
  form_3s_english = 'He/She abandoned',
  form_1p_english = 'We abandoned',
  form_2p_english = 'You (plural) abandoned',
  form_3p_english = 'They abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Pretérito' AND mood = 'Indicativo';

-- 5. Condicional Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I would abandon',
  form_2s_english = 'You would abandon',
  form_3s_english = 'He/She would abandon',
  form_1p_english = 'We would abandon',
  form_2p_english = 'You (plural) would abandon',
  form_3p_english = 'They would abandon'
WHERE infinitive = 'abandonar' AND tense = 'Condicional' AND mood = 'Indicativo';

-- 6. Presente perfecto Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I have abandoned',
  form_2s_english = 'You have abandoned',
  form_3s_english = 'He/She has abandoned',
  form_1p_english = 'We have abandoned',
  form_2p_english = 'You (plural) have abandoned',
  form_3p_english = 'They have abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Presente perfecto' AND mood = 'Indicativo';

-- 7. Futuro perfecto Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I will have abandoned',
  form_2s_english = 'You will have abandoned',
  form_3s_english = 'He/She will have abandoned',
  form_1p_english = 'We will have abandoned',
  form_2p_english = 'You (plural) will have abandoned',
  form_3p_english = 'They will have abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Futuro perfecto' AND mood = 'Indicativo';

-- 8. Pluscuamperfecto Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I had abandoned',
  form_2s_english = 'You had abandoned',
  form_3s_english = 'He/She had abandoned',
  form_1p_english = 'We had abandoned',
  form_2p_english = 'You (plural) had abandoned',
  form_3p_english = 'They had abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Pluscuamperfecto' AND mood = 'Indicativo';

-- 9. Pretérito anterior Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I had abandoned',
  form_2s_english = 'You had abandoned',
  form_3s_english = 'He/She had abandoned',
  form_1p_english = 'We had abandoned',
  form_2p_english = 'You (plural) had abandoned',
  form_3p_english = 'They had abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Pretérito anterior' AND mood = 'Indicativo';

-- 10. Condicional perfecto Indicativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I would have abandoned',
  form_2s_english = 'You would have abandoned',
  form_3s_english = 'He/She would have abandoned',
  form_1p_english = 'We would have abandoned',
  form_2p_english = 'You (plural) would have abandoned',
  form_3p_english = 'They would have abandoned'
WHERE infinitive = 'abandonar' AND tense = 'Condicional perfecto' AND mood = 'Indicativo';

-- SUBJUNTIVO MOOD (6 tenses)
-- 11. Presente Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I abandon (subjunctive)',
  form_2s_english = 'You abandon (subjunctive)',
  form_3s_english = 'He/She abandons (subjunctive)',
  form_1p_english = 'We abandon (subjunctive)',
  form_2p_english = 'You (plural) abandon (subjunctive)',
  form_3p_english = 'They abandon (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Presente' AND mood = 'Subjuntivo';

-- 12. Futuro Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I will abandon (subjunctive)',
  form_2s_english = 'You will abandon (subjunctive)',
  form_3s_english = 'He/She will abandon (subjunctive)',
  form_1p_english = 'We will abandon (subjunctive)',
  form_2p_english = 'You (plural) will abandon (subjunctive)',
  form_3p_english = 'They will abandon (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Futuro' AND mood = 'Subjuntivo';

-- 13. Imperfecto Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I abandoned (subjunctive)',
  form_2s_english = 'You abandoned (subjunctive)',
  form_3s_english = 'He/She abandoned (subjunctive)',
  form_1p_english = 'We abandoned (subjunctive)',
  form_2p_english = 'You (plural) abandoned (subjunctive)',
  form_3p_english = 'They abandoned (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Imperfecto' AND mood = 'Subjuntivo';

-- 14. Pluscuamperfecto Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I had abandoned (subjunctive)',
  form_2s_english = 'You had abandoned (subjunctive)',
  form_3s_english = 'He/She had abandoned (subjunctive)',
  form_1p_english = 'We had abandoned (subjunctive)',
  form_2p_english = 'You (plural) had abandoned (subjunctive)',
  form_3p_english = 'They had abandoned (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Pluscuamperfecto' AND mood = 'Subjuntivo';

-- 15. Futuro perfecto Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I will have abandoned (subjunctive)',
  form_2s_english = 'You will have abandoned (subjunctive)',
  form_3s_english = 'He/She will have abandoned (subjunctive)',
  form_1p_english = 'We will have abandoned (subjunctive)',
  form_2p_english = 'You (plural) will have abandoned (subjunctive)',
  form_3p_english = 'They will have abandoned (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Futuro perfecto' AND mood = 'Subjuntivo';

-- 16. Presente perfecto Subjuntivo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = 'I have abandoned (subjunctive)',
  form_2s_english = 'You have abandoned (subjunctive)',
  form_3s_english = 'He/She has abandoned (subjunctive)',
  form_1p_english = 'We have abandoned (subjunctive)',
  form_2p_english = 'You (plural) have abandoned (subjunctive)',
  form_3p_english = 'They have abandoned (subjunctive)'
WHERE infinitive = 'abandonar' AND tense = 'Presente perfecto' AND mood = 'Subjuntivo';

-- IMPERATIVO MOOD (2 tenses)
-- 17. Imperativo Afirmativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = '', -- No first person singular in imperative
  form_2s_english = 'Abandon!',
  form_3s_english = 'Let him/her abandon!',
  form_1p_english = 'Let us abandon!',
  form_2p_english = 'Abandon! (plural)',
  form_3p_english = 'Let them abandon!'
WHERE infinitive = 'abandonar' AND tense = 'Presente' AND mood = 'Imperativo Afirmativo';

-- 18. Imperativo Negativo
UPDATE public.verb_conjugations 
SET 
  form_1s_english = '', -- No first person singular in imperative
  form_2s_english = 'Don''t abandon!',
  form_3s_english = 'Don''t let him/her abandon!',
  form_1p_english = 'Let''s not abandon!',
  form_2p_english = 'Don''t abandon! (plural)',
  form_3p_english = 'Don''t let them abandon!'
WHERE infinitive = 'abandonar' AND tense = 'Presente' AND mood = 'Imperativo Negativo';

-- ========================================
-- COMPLETE COVERAGE SUMMARY
-- ========================================
-- This migration script provides examples for ALL 18 tense/mood combinations
-- found in the CSV file and database:

-- INDICATIVO MOOD (11 tenses):
-- 1. Presente, 2. Futuro, 3. Imperfecto, 4. Pretérito, 5. Condicional
-- 6. Presente perfecto, 7. Futuro perfecto, 8. Pluscuamperfecto
-- 9. Pretérito anterior, 10. Condicional perfecto

-- SUBJUNTIVO MOOD (6 tenses):
-- 11. Presente, 12. Futuro, 13. Imperfecto, 14. Pluscuamperfecto
-- 15. Futuro perfecto, 16. Presente perfecto

-- IMPERATIVO MOOD (2 tenses):
-- 17. Imperativo Afirmativo + Presente, 18. Imperativo Negativo + Presente

-- ========================================
-- NEXT STEPS FOR FULL POPULATION
-- ========================================
-- To populate all English conjugations for all verbs:
-- 1. Run this migration script to add the columns and example data
-- 2. Use the examples above as templates for all other verbs
-- 3. For each verb, create 18 UPDATE statements (one per tense/mood combination)
-- 4. Consider using a script or translation service to automate the process
-- 5. The quiz will automatically use these English conjugations when available
--    and fall back to generated phrases when not available

-- Total combinations to populate: 637 verbs × 18 tense/mood combinations = 11,466 records
