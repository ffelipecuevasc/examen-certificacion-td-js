# Visión del producto

> Documento fundacional. No se reescribe. Si la visión cambia, se abre una ADR en
> `decisiones.md` que lo declare explícitamente.

## Objetivo general

Proveer un entorno web de estudio y preparación para el examen de certificación de
**Talento Digital para Chile**, que reúna en un solo lugar la materia evaluada y
las herramientas para practicarla.

## Objetivos específicos

1. **Ordenar el temario.** Mostrar con precisión qué entra en el examen, módulo por
   módulo, para que el estudiante no adivine qué estudiar.
2. **Permitir práctica sin presión.** Un cuestionario con el banco completo de
   preguntas, a ritmo propio, con corrección inmediata.
3. **Reproducir las condiciones del examen.** Un simulacro cronometrado que entrene
   la gestión del tiempo, no solo el conocimiento.
4. **Devolver un diagnóstico.** Que al terminar, el estudiante sepa en qué módulos
   está débil y a cuáles volver.
5. **Mantener el material vivo.** Que actualizar el banco de preguntas no exija
   tocar código.

## Usuario objetivo

Estudiantes del bootcamp **Desarrollo de Aplicaciones Web Fullstack JavaScript**,
en las semanas previas a rendir la certificación.

Perfil que condiciona el diseño:

- Son **principiantes**. Puede ser su primera certificación técnica.
- Estudian **desde el teléfono** tanto como desde el computador.
- Leen poco y en diagonal: el material debe ser visual antes que extenso.
- Estudian a deshora, con conexiones variables y en sesiones cortas e interrumpidas.

## Principios del producto

**Cero fricción.** Sin registro, sin correo, sin inicio de sesión, sin banner de
consentimiento de cookies. Se entra y se estudia. Cualquier funcionalidad que exija
identificar al estudiante contradice este principio.

**Cero servidor para lo esencial.** El formato funciona íntegramente en el
navegador. El sitio debe seguir siendo útil aunque no exista ningún servicio
externo disponible. Los servicios de terceros pueden mejorar la experiencia, nunca
ser condición para que el sitio funcione.

> **Nota de revisión · 2026-09-02.** ADR-007 incorpora Cloudflare Workers y D1 como
> capa de datos, de modo que el sitio ya no es puramente estático. El principio
> **no se deroga**: se mantiene como exigencia de degradación. ADR-008 obliga a
> versionar una instantánea local del banco, para que el estudiante pueda estudiar
> aunque la capa de datos no responda. Lo que cambia es el medio; la promesa al
> estudiante se conserva.

**Español de primera clase.** Español de Chile en interfaz, documentación y código.
No es una traducción de un original en inglés: se escribe en español desde el
principio.

**Honestidad sobre el origen del material.** Es material de apoyo no oficial,
elaborado a partir del testimonio de alumnos que ya rindieron el examen. Esto se
declara de forma visible y no se disimula.

## Fuera de alcance

Lo siguiente no forma parte del producto, y proponerlo requiere una ADR:

- Cuentas de usuario, perfiles o rankings entre estudiantes.
- Backend que vaya más allá de servir el banco de preguntas en modo lectura. La
  capa de datos autorizada por ADR-007 y acotada por ADR-009 es la excepción, y su
  alcance no se amplía sin una ADR nueva.
- Publicidad, analítica que rastree individuos, o monetización.
- Contenido que suplante al material oficial del programa.
