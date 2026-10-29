# Genera src/lib/wordmark.ts: il nome "Boleòn" disegnato con il font Beth Ellen
# come tracciato SVG, usato nell'intestazione e nella home al posto del testo.
# Così il nome compare nel suo carattere fin dal primo istante, senza aspettare
# che il browser scarichi il font (prima, su connessioni lente o alla prima
# visita, per un attimo si vedeva un carattere di riserva).
#
# Da rilanciare solo se cambia il nome dell'artista:
#   python3 -m pip install fonttools uharfbuzz
#   python3 scripts/generate-wordmark.py "Boleòn"
import json
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / 'node_modules/@fontsource/beth-ellen/files/beth-ellen-latin-400-normal.woff'
OUT = ROOT / 'src/lib/wordmark.ts'

text = sys.argv[1] if len(sys.argv) > 1 else 'Boleòn'

font = TTFont(str(FONT))
upm = font['head'].unitsPerEm
ascent = font['hhea'].ascent
descent = font['hhea'].descent  # negativo
glyph_set = font.getGlyphSet()
order = font.getGlyphOrder()

# Impaginazione con HarfBuzz (crenatura e lettere accentate come nel browser)
buf = hb.Buffer()
buf.add_str(text)
buf.guess_segment_properties()
font.flavor = None
from io import BytesIO
raw = BytesIO()
font.save(raw)
hb_font = hb.Font(hb.Face(raw.getvalue()))
hb.shape(hb_font, buf)

pen = SVGPathPen(glyph_set)
bounds = BoundsPen(glyph_set)
x = 0
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    name = order[info.codepoint]
    # SVG ha l'asse y verso il basso: si ribalta e si sposta sulla linea di base
    t = (1, 0, 0, -1, x + pos.x_offset, ascent - pos.y_offset)
    glyph_set[name].draw(TransformPen(pen, t))
    glyph_set[name].draw(TransformPen(bounds, t))
    x += pos.x_advance

# Riquadro ritagliato sull'inchiostro delle lettere (il font prevede molto spazio
# vuoto sopra e sotto): la scala resta quella del testo, 1 em = upm unità
xmin, ymin, xmax, ymax = bounds.bounds
left, top = int(xmin) - 10, int(ymin) - 10
w, h = int(xmax) + 10 - left, int(ymax) + 10 - top

ts = f"""// File generato da scripts/generate-wordmark.py: non modificare a mano.
// Il nome dell'artista disegnato con Beth Ellen (unità del font: {upm} per em).
export const wordmark = {{
  text: {json.dumps(text, ensure_ascii=False)},
  viewBox: '{left} {top} {w} {h}',
  /** Altezza del disegno in em: con questa altezza le lettere hanno la stessa
   * grandezza di una scritta in Beth Ellen della stessa dimensione */
  heightEm: {round(h / upm, 4)},
  path: {json.dumps(pen.getCommands())},
}};
"""
OUT.write_text(ts, encoding='utf-8')
print(f'{OUT.relative_to(ROOT)}: "{text}", viewBox {left} {top} {w} {h}, {len(pen.getCommands())} caratteri')
