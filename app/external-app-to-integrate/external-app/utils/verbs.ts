import sqlite3 from 'sqlite3';
import path from 'path';

export interface VerbConjugation {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb_english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}

export interface Verb {
  infinitive: string;
  infinitive_english: string;
  conjugations: VerbConjugation[];
}

interface DatabaseRow {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb_english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}

function getDatabase() {
  const dbPath = path.join(process.cwd(), 'app', 'verbs.db');
  return new sqlite3.Database(dbPath);
}

export function getAllVerbs(): Promise<Verb[]> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const sql = `
      SELECT DISTINCT infinitive, infinitive_english 
      FROM conjugations 
      WHERE infinitive IS NOT NULL 
      ORDER BY infinitive
    `;
    
    db.all(sql, [], (err: Error | null, rows: DatabaseRow[]) => {
      if (err) {
        reject(err);
        return;
      }
      
      const verbs: Verb[] = rows.map((row: DatabaseRow) => ({
        infinitive: row.infinitive,
        infinitive_english: row.infinitive_english,
        conjugations: []
      }));
      
      db.close();
      resolve(verbs);
    });
  });
}

export function getVerbByInfinitive(infinitive: string): Promise<Verb | null> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const sql = `
      SELECT * FROM conjugations 
      WHERE infinitive = ? 
      ORDER BY mood, tense
    `;
    
    db.all(sql, [infinitive], (err: Error | null, rows: DatabaseRow[]) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (rows.length === 0) {
        db.close();
        resolve(null);
        return;
      }
      
      const verb: Verb = {
        infinitive: rows[0].infinitive,
        infinitive_english: rows[0].infinitive_english,
        conjugations: rows.map((row: DatabaseRow) => ({
          infinitive: row.infinitive,
          infinitive_english: row.infinitive_english,
          mood: row.mood,
          mood_english: row.mood_english,
          tense: row.tense,
          tense_english: row.tense_english,
          verb_english: row.verb_english,
          form_1s: row.form_1s,
          form_2s: row.form_2s,
          form_3s: row.form_3s,
          form_1p: row.form_1p,
          form_2p: row.form_2p,
          form_3p: row.form_3p,
          gerund: row.gerund,
          gerund_english: row.gerund_english,
          pastparticiple: row.pastparticiple,
          pastparticiple_english: row.pastparticiple_english
        }))
      };
      
      db.close();
      resolve(verb);
    });
  });
}

export function searchVerbs(searchTerm: string, limit: number = 50): Promise<Verb[]> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const sql = `
      SELECT DISTINCT infinitive, infinitive_english 
      FROM conjugations 
      WHERE (infinitive LIKE ? OR infinitive_english LIKE ?)
      AND infinitive IS NOT NULL 
      ORDER BY infinitive
      LIMIT ?
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    db.all(sql, [searchPattern, searchPattern, limit], (err: Error | null, rows: DatabaseRow[]) => {
      if (err) {
        reject(err);
        return;
      }
      
      const verbs: Verb[] = rows.map((row: DatabaseRow) => ({
        infinitive: row.infinitive,
        infinitive_english: row.infinitive_english,
        conjugations: []
      }));
      
      db.close();
      resolve(verbs);
    });
  });
} 