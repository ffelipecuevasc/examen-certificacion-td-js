# Bitácora

Una entrada por iteración cerrada. Se escribe **al final**, cuando ya se sabe qué
pasó de verdad.

Su valor no está en repetir lo que decía la iteración, sino en registrar **lo que
salió distinto de lo planeado**. Dentro de seis meses, esta carpeta será lo único
que explique por qué el proyecto tomó el camino que tomó.

**Nombre del archivo:** `AAAA-MM-DD-iteracion-NN.md`

## Y desde el 2026-09-10, también una entrada por lote

La regla de arriba —una entrada por iteración cerrada— se escribió cuando una
iteración era una unidad de trabajo de unos días. **La iteración 25 dura siete
lotes**, uno por módulo del banco, y su contexto no puede esperar al séptimo:
para entonces nadie se acuerda de por qué el tercero salió como salió.

Por eso una iteración larga admite además **una entrada por lote**:

**Nombre del archivo:** `AAAA-MM-DD-iteracion-NN-modulo-MM.md`

Misma plantilla. La entrada de la iteración se sigue escribiendo al cerrarla, y
resume; las de lote registran lo que pasó en cada uno.

> **Esto se volvió necesario al adoptar ADR-030**, que acotó los mensajes de
> commit a 200 caracteres y mandó el porqué aquí. Si un commit corto deja algo sin
> explicar, es señal de que falta escribirlo en esta carpeta.

## Plantilla

```markdown
# Iteración NN · Título

**Épica:** N · Nombre · **Cerrada:** AAAA-MM-DD

## Qué se entregó
Dos o tres frases. Lo que un tercero necesita saber sin leer nada más.

## Qué salió distinto de lo planeado
Lo más valioso de la entrada. Supuestos que resultaron falsos, tareas que se
revelaron más grandes de lo previsto, caminos que se probaron y se abandonaron.

## Decisiones tomadas
ADR creadas o modificadas durante la iteración, con su número.

## Hallazgos
Entradas añadidas a la auditoría técnica, con su código.

## Queda pendiente
Lo que se aplazó y dónde quedó anotado.
```
