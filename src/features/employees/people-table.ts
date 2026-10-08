/**
 * Reads a list of people from a CSV file or from cells copied out of Excel (tab-separated).
 * Columns are found by their headings (Vorname, Nachname, E-Mail, Personalnummer, Betrag); without
 * headings the order of the template is assumed. Every row is checked, so HR sees all problems at once.
 */

export interface ParsedPerson {
  line: number;
  firstName: string;
  lastName: string;
  email: string;
  personnelNumber?: string;
  monthlyAmountCents: number;
  /** German texts; empty when the row can be invited. */
  problems: string[];
}

type Column = 'firstName' | 'lastName' | 'email' | 'personnelNumber' | 'amount';

const TEMPLATE_ORDER: Column[] = ['firstName', 'lastName', 'email', 'personnelNumber', 'amount'];

const HEADINGS: Record<Column, string[]> = {
  firstName: ['vorname', 'first name', 'firstname'],
  lastName: ['nachname', 'name', 'familienname', 'last name', 'lastname', 'surname'],
  email: ['e-mail', 'email', 'e-mail-adresse', 'mail', 'emailadresse'],
  personnelNumber: ['personalnummer', 'personal-nr', 'personal-nr.', 'pers.-nr.', 'persnr', 'personnel number'],
  amount: ['betrag', 'betrag (eur)', 'betrag in eur', 'monatsbetrag', 'guthaben', 'amount'],
};

export const MAX_MONTHLY_CENTS = 5000;

/** The template HR can download and fill in Excel. */
export const TEMPLATE_CSV =
  '﻿Vorname;Nachname;E-Mail;Personalnummer;Betrag (EUR)\r\nMax;Mustermann;max.mustermann@firma.de;10427;50\r\n';

export function parsePeopleTable(text: string): ParsedPerson[] {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .map((line, index) => ({ cells: splitLine(line), line: index + 1 }))
    .filter(({ cells }) => cells.some((cell) => cell !== ''));
  if (lines.length === 0) return [];

  const headerColumns = columnsFromHeader(lines[0].cells);
  const columns = headerColumns ?? TEMPLATE_ORDER;
  const rows = headerColumns ? lines.slice(1) : lines;

  const seen = new Set<string>();
  return rows.map(({ cells, line }) => {
    const value = (column: Column) => (cells[columns.indexOf(column)] ?? '').trim();
    const email = value('email').toLowerCase();
    const amount = parseAmount(value('amount'));
    const problems: string[] = [];
    if (!value('firstName')) problems.push('Vorname fehlt');
    if (!value('lastName')) problems.push('Nachname fehlt');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push('E-Mail-Adresse ungültig');
    else if (seen.has(email)) problems.push('E-Mail-Adresse doppelt in der Liste');
    if (amount === null) problems.push(`Betrag muss zwischen 0 und ${MAX_MONTHLY_CENTS / 100} € liegen`);
    seen.add(email);
    return {
      line,
      firstName: value('firstName'),
      lastName: value('lastName'),
      email,
      personnelNumber: value('personnelNumber') || undefined,
      monthlyAmountCents: amount ?? MAX_MONTHLY_CENTS,
      problems,
    };
  });
}

/** "25", "25,50", "25,50 €", empty → cents (empty = 50 €); null when not a valid amount. */
export function parseAmount(text: string): number | null {
  const cleaned = text.replace(/€|eur/gi, '').replace(/\s/g, '');
  if (cleaned === '') return MAX_MONTHLY_CENTS;
  if (!/^\d+([.,]\d{1,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned.replace(',', '.')) * 100);
  return cents <= MAX_MONTHLY_CENTS ? cents : null;
}

/** Semicolon (German Excel), tab (copied cells) or comma; quoted cells may contain the separator. */
function splitLine(line: string): string[] {
  const separator = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === separator && !quoted) {
      cells.push(current.trim());
      current = '';
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

function columnsFromHeader(cells: string[]): Column[] | null {
  const columns = cells.map(
    (cell) =>
      (Object.keys(HEADINGS) as Column[]).find((column) => HEADINGS[column].includes(cell.trim().toLowerCase())) ??
      null,
  );
  // A header row names at least the email column; otherwise it is a person.
  return columns.includes('email') ? (columns as Column[]) : null;
}

/** Excel saves CSV in UTF-8 or in Windows-1252 (older versions); umlauts must come out right either way. */
export function decodeCsvFile(bytes: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}
