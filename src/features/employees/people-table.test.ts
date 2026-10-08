import { describe, expect, it } from 'vitest';

import { decodeCsvFile, parseAmount, parsePeopleTable } from './people-table';

describe('parsePeopleTable', () => {
  it('reads a German Excel CSV with headings in any order', () => {
    const csv = '﻿E-Mail;Nachname;Vorname;Betrag (EUR);Personalnummer\r\nlea@firma.de;Lehmann;Lea;25,50;10427\r\n';
    expect(parsePeopleTable(csv)).toEqual([
      {
        line: 2,
        firstName: 'Lea',
        lastName: 'Lehmann',
        email: 'lea@firma.de',
        personnelNumber: '10427',
        monthlyAmountCents: 2550,
        problems: [],
      },
    ]);
  });

  it('reads cells pasted from Excel without headings in template order', () => {
    const [person] = parsePeopleTable('Tom\tThiele\tTom.Thiele@Firma.de\t\t\n');
    expect(person).toMatchObject({ firstName: 'Tom', email: 'tom.thiele@firma.de', monthlyAmountCents: 5000 });
    expect(person.personnelNumber).toBeUndefined();
  });

  it('lists every problem per row', () => {
    const rows = parsePeopleTable('Vorname;Nachname;E-Mail;Betrag\n;Lehmann;kaputt;60\nA;B;a@b.de;\nC;D;A@b.de;\n');
    expect(rows[0].problems).toEqual([
      'Vorname fehlt',
      'E-Mail-Adresse ungültig',
      'Betrag muss zwischen 0 und 50 € liegen',
    ]);
    expect(rows[1].problems).toEqual([]);
    expect(rows[2].problems).toEqual(['E-Mail-Adresse doppelt in der Liste']);
  });

  it('handles quoted cells and skips empty lines', () => {
    const rows = parsePeopleTable('Vorname,Nachname,E-Mail\n"Anna, Maria",Schmidt,anna@firma.de\n\n');
    expect(rows).toHaveLength(1);
    expect(rows[0].firstName).toBe('Anna, Maria');
  });
});

describe('parseAmount', () => {
  it('accepts German and plain amounts up to 50 €', () => {
    expect(parseAmount('50')).toBe(5000);
    expect(parseAmount('25,5 €')).toBe(2550);
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('')).toBe(5000);
    expect(parseAmount('50,01')).toBeNull();
    expect(parseAmount('viel')).toBeNull();
  });
});

describe('decodeCsvFile', () => {
  it('reads UTF-8 and old Windows Excel files', () => {
    expect(decodeCsvFile(new TextEncoder().encode('Jürgen').buffer as ArrayBuffer)).toBe('Jürgen');
    const windows1252 = new Uint8Array([0x4a, 0xfc, 0x72, 0x67, 0x65, 0x6e]); // "Jürgen"
    expect(decodeCsvFile(windows1252.buffer)).toBe('Jürgen');
  });
});
