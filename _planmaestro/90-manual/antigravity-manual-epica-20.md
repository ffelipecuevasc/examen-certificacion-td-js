# Manual de Administración del Banco de Preguntas (CLI)

Este documento explica cómo utilizar la herramienta de gestión local (CLI) construida durante la Iteración 23 para administrar el banco de preguntas de la base de datos D1, protegiendo siempre la producción y sin exponer herramientas web abiertas.

## 1. Preparación del Archivo (El Lote de Datos)
La herramienta consume archivos de texto en formato `JSON` estándar. Toda la información que desees inyectar o modificar debe estar formateada bajo el siguiente modelo, guardada preferentemente en la raíz (ej. `mi-lote.json`). Puedes listar múltiples preguntas (separadas por coma) agrupándolas en corchetes `[ ... ]` al estar trabajando con un "bloque" (array).

### 📋 Estructura Modelo 
```json
[
  {
    "modulo": 2,
    "origen": "json_2026",
    "numero_origen": 1001,
    "enunciado": "¿Qué es HTML?",
    "justificacion": "Lenguaje de marcado esencial para Front-End",
    "dificultad": "baja",
    "orden_fijo": 0,
    "estado": "activa",
    "alternativas": [
      { "letra": "a", "orden": 1, "texto": "Un lenguaje de programación compilado", "es_correcta": 0 },
      { "letra": "b", "orden": 2, "texto": "El lenguaje de marcado para estructurar la web", "es_correcta": 1 },
      { "letra": "c", "orden": 3, "texto": "Una librería de estilos estáticos", "es_correcta": 0 },
      { "letra": "d", "orden": 4, "texto": "Un gestor de bases de datos", "es_correcta": 0 }
    ]
  }
]
```
> **Tip Experto:** Cerciórate de que **exactamente una alternativa** indique `"es_correcta": 1`, y que las letras/órdenes no se repitan por pregunta. No incluyas atributos desconocidos como "fecha_de_creacion" u ofuscarás el validador estricto.

## 2. Ejecución y Operatoria Básica
Abre la consola/terminal desde la raíz del proyecto. El aplicativo se invoca anteponiendo `node scripts/admin-db.mjs`, seguido del verbo (`insertar` o `actualizar`) y finalmente el archivo `.json`.

### ➕ Insertar Nuevas Preguntas 
Si vas a ampliar el catálogo general agregando nuevo currículum, usa:
```bash
node scripts/admin-db.mjs insertar mi-lote.json
```
La herramienta se asegurará de que:
- Las preguntas nazcan formalmente en la BD local de juguete/pruebas.
- No existan los mismos enunciados (Evite duplicidad involuntaria).
- Todas las relaciones queden guardadas.

### 📝 Actualizar Erratas (Correcciones)
Si estás viajando en el metro, detectas una errata ("typographical error"), llegas a tu escritorio y generas el JSON puntual con la corrección en el texto.
```bash
node scripts/admin-db.mjs actualizar correccion-typo.json
```
En este flujo, si el sistema detecta que la pregunta ya existe bajo tu nomenclatura base (origen+módulo+numero), borrará selectivamente sus antiguas alternativas y reemplazará su enunciado principal y variables base cuidando no desbordarse jamás hacia otras preguntas, re-validando siempre los datos nuevos.

> 🛡️ **Nota Cero Daño:** Pase lo que pase (inserción o actualización local), el sistema activará autómaticamente la **regeneración de la instantánea** local del sistema (El respaldo degradado de ADR-008) tras finalizar sanamente.

## 3. ¿Cómo leer los Errores (Troubleshooting)?
Si la herramienta te arroja una "X de Error" deteniendo la consola y negándose a modificar la base de datos (con un mensaje **"[Rollback D1] ❌ Operacion rechazada"**), felicidades, el sistema está abortando el lote para proteger tu catálogo de corromperse.

Hemos intercedido los mensajes complejos para arrojarte diagnósticos naturales. Acá detallo los rechazos más comunes:

- **Motivo:** *«Error de Base de Datos: La pregunta ya está registrada con ese origen, módulo y número base.»*
  - **Explicación**: Intentaste un comando `insertar` sobre una pregunta fundamental que ya vive en D1. Si buscabas arreglarla usa `actualizar`, o cambia el `numero_origen`.

- **Motivo:** *«Error de Base de Datos: Existe más de una alternativa correcta para la misma pregunta.»* o *«Validación de alternativa correcta falló.»*
  - **Explicación**: El JSON posee dos `"es_correcta": 1` o cero verdaderas. Arréglelo. Obligatoriamente DEBE ser sólo una.

- **Motivo:** *«Error de Base de Datos: Otra pregunta ya tiene exactamente el mismo enunciado. No se permiten enunciados duplicados.»*
  - **Explicación**: Literalmente estás cargando el mismo chiste dos veces (mismo texto exacto). Identifícala.

- **Motivo:** *«[Regla Abortada] ❌ Pregunta 0: "dificultad" debe ser "baja", "media", "alta" o null.»*
  - **Explicación**: Antes incluso de hablar con la BD, nuestra validación previa Javascript detectó un campo prohibido o mal escrito ("Media" en vez de "media"). Fíjate en los detalles de "Casing" (Mayúsculas y minúsculas).
