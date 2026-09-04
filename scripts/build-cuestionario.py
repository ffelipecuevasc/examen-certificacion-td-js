"""Convierte los cuestionarios markdown en static/js/data/cuestionario.js.

Valida que cada pregunta tenga exactamente 4 alternativas y una respuesta
correcta que coincida con una de ellas. Aborta si algo no calza.

Interprete: Python 3, invocado como `python` (npm run cuestionario).

Antes decia `python3`, y en Windows eso no es el interprete sino un alias de
Microsoft Store: un ejecutable de cero bytes que no hace nada y devuelve
«no encontrado». Es el mismo problema que el hallazgo H-011, con otra herramienta.
Si en tu equipo `python` apunta a Python 2 —hoy es raro—, usa `py -3` en su lugar.
"""
import json
import re
import sys
from pathlib import Path

ORIGEN = Path('/mnt/user-data/uploads')
DESTINO = Path('static/js/data/cuestionario.js')

MODULOS = {
    2: ('Fundamentos de Desarrollo Front-End', 'devices'),
    3: ('Fundamentos de Programación en JavaScript', 'data-object'),
    4: ('Programación Avanzada en JavaScript', 'bolt'),
    5: ('Fundamentos de Bases de Datos Relacionales', 'database'),
    6: ('Desarrollo de Aplicaciones Web Node Express', 'dns'),
    7: ('Acceso a Datos en Aplicaciones Node', 'layers'),
    8: ('Implementación de API Backend Node Express', 'shield-lock'),
}

RE_PREGUNTA = re.compile(r'^(\d+)\.\s+(.*)$')
RE_OPCION = re.compile(r'^([A-D])\)\s+(.*)$')
RE_RESPUESTA = re.compile(r'^\**\s*Respuesta\s+Correct[a-z]*\s*:?\**\s*(.*)$', re.IGNORECASE)


def limpiar(texto):
    """Quita backticks de markdown y espacios sobrantes."""
    return re.sub(r'`([^`]*)`', r'\1', texto).strip()


def parsear(ruta):
    preguntas = []
    actual = None

    for linea in ruta.read_text(encoding='utf-8').splitlines():
        linea = linea.strip()
        if not linea or linea.startswith('#'):
            continue

        m = RE_PREGUNTA.match(linea)
        if m:
            if actual:
                preguntas.append(actual)
            actual = {'q': limpiar(m.group(2)), 'opciones': [], 'correcta': None}
            continue

        if actual is None:
            continue

        m = RE_RESPUESTA.match(linea)
        if m:
            # Puede venir repetida; conservamos la primera lectura valida.
            if actual['correcta'] is None:
                actual['correcta'] = limpiar(m.group(1))
            continue

        m = RE_OPCION.match(linea)
        if m:
            actual['opciones'].append({'letra': m.group(1), 'texto': limpiar(m.group(2))})

    if actual:
        preguntas.append(actual)
    return preguntas


def resolver_indice(pregunta, contexto):
    """Traduce 'C) Texto...' al indice de la alternativa correspondiente."""
    bruto = pregunta['correcta']
    if not bruto:
        sys.exit(f'{contexto}: sin respuesta correcta -> {pregunta["q"][:60]}')

    m = re.match(r'^([A-D])\)?\s*(.*)$', bruto)
    if not m:
        sys.exit(f'{contexto}: respuesta ilegible "{bruto}"')

    letra, texto = m.group(1), limpiar(m.group(2))
    for i, opcion in enumerate(pregunta['opciones']):
        if opcion['letra'] == letra:
            # Verificacion cruzada: la letra y el texto deben apuntar a lo mismo.
            if texto and texto.rstrip('.') not in opcion['texto'].rstrip('.') \
               and opcion['texto'].rstrip('.') not in texto.rstrip('.'):
                print(f'  AVISO {contexto}: letra {letra} y texto no coinciden literalmente')
                print(f'         md: {texto}')
                print(f'         op: {opcion["texto"]}')
            return i
    sys.exit(f'{contexto}: la letra {letra} no existe entre las alternativas')


grupos = []
total = 0

for numero, (titulo, icono) in MODULOS.items():
    ruta = ORIGEN / f'cuestionario_modulo_{numero}.md'
    preguntas = parsear(ruta)

    limpias = []
    for i, p in enumerate(preguntas, start=1):
        contexto = f'M{numero}.P{i}'
        if len(p['opciones']) != 4:
            sys.exit(f'{contexto}: tiene {len(p["opciones"])} alternativas, se esperaban 4')
        indice = resolver_indice(p, contexto)
        textos = [o['texto'] for o in p['opciones']]

        # Si alguna alternativa se refiere a otras por su letra ("Ambas B y C"),
        # barajarlas rompe el sentido de la pregunta: se deja el orden original.
        fijo = any(
            re.search(r'\b(todas|ninguna)\s+las?\s+anteriores\b', t, re.IGNORECASE)
            or re.search(r'\bambas\s+[A-D]\b', t, re.IGNORECASE)
            or re.search(r'\b[A-D]\s+y\s+[A-D]\s+son\b', t)
            for t in textos
        )
        if fijo:
            print(f'  {contexto}: orden fijo (las alternativas se referencian por letra)')

        limpias.append({
            'q': p['q'],
            'opciones': textos,
            'correcta': indice,
            'fijo': fijo,
        })

    total += len(limpias)
    grupos.append({
        'modulo': f'Módulo {numero}',
        'titulo': titulo,
        'icono': icono,
        'preguntas': limpias,
    })
    print(f'Módulo {numero}: {len(limpias)} preguntas')

cabecera = '''/**
 * Banco de preguntas del cuestionario de práctica.
 * Generado desde los cuestionarios en markdown de cada módulo del plan formativo.
 * `correcta` es el índice de la alternativa correcta dentro de `opciones`.
 */
export const cuestionario = '''

DESTINO.write_text(
    cabecera + json.dumps(grupos, ensure_ascii=False, indent=2) + ';\n',
    encoding='utf-8',
)
print(f'\nTotal: {total} preguntas -> {DESTINO}')
