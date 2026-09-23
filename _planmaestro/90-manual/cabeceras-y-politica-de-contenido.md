# Cabeceras de seguridad y política de contenido en producción

**Quién lo ejecuta:** el autor. Claude Code no despliega ni prueba contra producción.
**Origen:** iteración 51, etapa D. Escrito el 2026-09-23.

La etapa A dejó las cabeceras escritas y probadas en local. Este documento es lo que queda: comprobar que llegan al
sitio publicado y pasar la política de contenido de **modo informe** a **obligatoria**, en ese orden (decisión 2 de
la PARADA 1).

Para publicar se sigue el procedimiento de siempre, en [Publicar el sitio en Cloudflare Pages](publicacion-en-cloudflare-pages.md).
Este documento empieza cuando el despliegue ya terminó.

---

## Qué hay

| Dónde | Qué pone | Para qué |
|---|---|---|
| `_headers`, en la raíz | cuatro cabeceras para todas las páginas: la política de contenido (hoy `Content-Security-Policy-Report-Only`), `X-Frame-Options`, `Permissions-Policy` y `Cross-Origin-Opener-Policy` | que ninguna página cargue lo que no debe, ni se pueda incrustar en otro sitio |
| `functions/api/_middleware.js` | `X-Content-Type-Options: nosniff` y una política `default-src 'none'; frame-ancestors 'none'` en todo `/api/` | Pages no aplica `_headers` a las Functions |

`X-Content-Type-Options` y `Referrer-Policy` no están en `_headers` porque Pages ya las envía, y
`Strict-Transport-Security` sobra porque todo `.dev` está precargado en HSTS (decisión 3).

---

## Paso 1 · Las cabeceras llegaron

En una terminal:

```
curl -sI https://examen-certificacion-td-js.pages.dev/
curl -sI https://examen-certificacion-td-js.pages.dev/acerca-de
curl -si https://examen-certificacion-td-js.pages.dev/api/estado
```

- En las dos primeras tienen que aparecer las cuatro de `_headers`. La de la política se llama
  `content-security-policy-report-only` mientras esté en modo informe.
- En la tercera tienen que aparecer `x-content-type-options: nosniff` y `content-security-policy: default-src 'none';
  frame-ancestors 'none'`, y el cuerpo tiene que ser el JSON de siempre.

**Si falta alguna en las páginas,** lo más probable es que `_headers` no haya llegado a lo publicado. En local, `npm
run build` y después `npm run probar:cabeceras` con el servidor arriba lo dicen.

---

## Paso 2 · La consola queda limpia

Abre las cuatro páginas publicadas: `/`, `/cuestionario`, `/simulacro` y `/acerca-de`. En `/cuestionario`, carga un
módulo y responde dos o tres preguntas. En `/simulacro`, empieza un intento y avanza un par de preguntas.

En cada una, abre las herramientas de desarrollo (F12) → **Console**, y **muestra todos los niveles**, incluido
*Info* o *Verbose*. Busca «Content Security Policy».

**Esto importa:** en modo informe, Chrome escribe las violaciones como mensajes de nivel *info*, no como errores
rojos. Con la consola filtrada a errores, parece limpia aunque no lo esté. Se comprobó en la etapa A.

**Limpia** significa que no aparece **ningún** mensaje «…violates the following Content Security Policy…», en ningún
nivel y en ninguna de las cuatro páginas.

Si aparece alguno, no sigas al paso 3: anota el mensaje completo y la página, y se corrige en el repositorio. `npm run
verificar:csp` suele nombrar el archivo y la línea.

---

## Paso 3 · La política pasa a obligatoria

Solo con el paso 2 limpio:

1. En `_headers`, cambia el nombre de la cabecera `Content-Security-Policy-Report-Only` por `Content-Security-Policy`.
   El valor no se toca. También lo puede hacer Claude Code si se lo pides.
2. `npm run verificar` en local. En la sección `csp` tiene que desaparecer el aviso de «MODO INFORME».
3. Publica como siempre.
4. Repite el paso 1: ahora la cabecera se llama `content-security-policy`.
5. Repite el paso 2. Ahora una violación sí se vería como error rojo, y además **bloquearía** lo que intentó cargar.
   Tiene que seguir sin aparecer ninguna.

**Si algo se rompe después del paso 3,** vuelve el nombre a `Content-Security-Policy-Report-Only` y publica: en modo
informe el navegador vuelve a avisar sin bloquear, y se investiga con calma.

---

## Paso 4 · Lo que se cierra al publicar `acerca-de.html`

La primera publicación que incluya `acerca-de.html` cierra dos cosas, sin otro trámite:

- **El período sin atribución visible de animate.css**, abierto desde el 2026-09-15 (decisión 7 de la iteración 36).
  El cierre ya está escrito en `registro_log.md`, condicionado únicamente a esta publicación.
- **H-006.**

Comprueba que `https://examen-certificacion-td-js.pages.dev/acerca-de` carga, que el enlace «Acerca de» del pie
lleva ahí desde las otras tres páginas, y que el enlace a `acerca-de` de `LICENSE.md` ya no lleva a una página
inexistente.

---

## Lo que este documento todavía no cubre

**El criterio del 429 en producción.** La iteración 51 pide que un 429 provocado, simulado o real, llegue al
estudiante como el aviso de respaldo y no como una página rota, y lo ejecuta el autor. En local ya está comprobado
(`npm run probar:respaldo`, 11 de 11). Para producción falta acordar **cómo** provocarlo sin agotar la cuota de
verdad. No se escribe aquí un método que no se haya probado.

---

## Registro

| Fecha | Paso | Resultado |
|---|---|---|
| — | 1 · cabeceras | pendiente |
| — | 2 · consola en modo informe | pendiente |
| — | 3 · política obligatoria | pendiente |
| — | 4 · `acerca-de.html` publicada | pendiente |
