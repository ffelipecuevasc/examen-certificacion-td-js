# Publicar el sitio en Cloudflare Pages

Procedimiento completo, desde un clon del repositorio hasta el sitio publicado.
Escrito para poder repetirse sin contexto previo: si el proyecto de Pages se borrara
entero, esto basta para reconstruirlo.

**Quién lo ejecuta:** el autor. Claude Code no tiene acceso al panel de Cloudflare.

**Origen de la decisión:** ADR-010. El despliegue compila y publica solo `dist/`.

---

## Antes de empezar

Necesitas:

- Una cuenta de Cloudflare (el plan gratuito alcanza de sobra).
- El repositorio en GitHub, con la rama `main` al día.
- Node.js instalado, para poder comprobar la construcción antes de publicar.
- Git, para clonar y publicar. **No hace falta que esté en el PATH de tu terminal**:
  los comandos de este manual funcionan igual, y `npm run verificar` lo busca solo.
  Si aun así no lo encuentra, te lo dice en vez de fallar a medias.

---

## Paso 1 · Comprobar la construcción en tu equipo

Nunca publiques sin haber visto la construcción terminar aquí. Si falla en tu
equipo, va a fallar igual en Cloudflare, pero allá la vas a diagnosticar a ciegas.

```bash
git clone https://github.com/ffelipecuevasc/examen-certificacion-td-js.git
cd examen-certificacion-td-js
npm install
npm run build
```

Tiene que terminar con estas dos líneas:

```
3 entradas copiadas a dist/
15 recursos enlazados, ninguno roto
```

Si en vez de eso aparece `ERROR: N referencia(s) sin destino dentro de dist/`,
significa que alguna página enlaza un archivo que no llegó a `dist/`. Revisa
`LISTA_COPIA` en `scripts/build-dist.mjs`. **No publiques hasta resolverlo:** esa
comprobación existe justamente para que un recurso roto no llegue a producción.

Luego mira el sitio construido en un navegador:

```bash
npm run serve:dist
```

Abre las dos páginas, recórrelas enteras y **abre la consola del navegador**
(F12 → pestaña «Consola»). No debe haber ningún error. Esta comprobación es manual:
no hay forma de automatizarla sin meter un navegador de pruebas al proyecto, y eso
exigiría una dependencia nueva.

---

## Paso 2 · Crear el proyecto en Cloudflare Pages

1. Entra al panel de Cloudflare → **Workers & Pages** → **Create** → pestaña
   **Pages** → **Connect to Git**.
2. Autoriza a Cloudflare a leer tu cuenta de GitHub y elige el repositorio
   `examen-certificacion-td-js`.
3. En la pantalla de configuración, completa exactamente esto:

| Campo | Valor |
|---|---|
| Project name | `examen-certificacion-td-js` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(vacío)* |

El nombre del proyecto **es** la dirección: `examen-certificacion-td-js.pages.dev`.
Elígelo pensando en que se lo vas a dictar a estudiantes.

4. Despliega **Variables and Secrets** y añade una variable de entorno:

| Nombre | Valor |
|---|---|
| `NODE_VERSION` | `22.16.0` |

El repositorio incluye un `.nvmrc` con esa misma versión y Pages lo respeta, así que
esta variable es redundante. Se pone igual porque deja la versión a la vista de
quien abra el panel, en vez de escondida en un archivo.

5. **Save and Deploy.**

---

## Paso 3 · Verificar lo publicado

La primera construcción tarda un par de minutos. Cuando termine, revisa el registro
del despliegue en el panel y confirma que aparecen las dos líneas del paso 1.

Luego, sobre `https://examen-certificacion-td-js.pages.dev`:

- [ ] `index.html` carga y se ve igual que en `npm run serve:dist`.
- [ ] `cuestionario.html` carga y se ve igual.
- [ ] La consola del navegador no muestra ningún error en ninguna de las dos.
- [ ] Los íconos se ven. Si aparecen huecos en blanco, el CSS no llegó.
- [ ] La navegación entre ambas páginas funciona en los dos sentidos.
- [ ] El candado del navegador indica conexión segura, con certificado válido.
- [ ] En la pestaña **Red** de las herramientas de desarrollo, ninguna petición
      responde 404.

Y una comprobación que suele olvidarse: confirma que lo que **no** debía publicarse
no está publicado. Estas dos direcciones tienen que responder 404:

```
https://examen-certificacion-td-js.pages.dev/CLAUDE.md
https://examen-certificacion-td-js.pages.dev/_planmaestro/README.md
```

Si alguna responde 200, el directorio de salida está mal configurado: revisa que
diga `dist` y no `.` (paso 2, punto 3).

---

## Paso 4 · Retirar GitHub Pages

Solo cuando el paso 3 esté completo y la dirección nueva funcione.

1. En GitHub → repositorio → **Settings** → **Pages**.
2. En **Build and deployment**, cambia **Source** a **None** (o desactiva el
   flujo de trabajo que publicaba el sitio, si se publicaba así).
3. Avisa a los estudiantes de la dirección nueva. **No hay redirección:** la
   dirección antigua deja de existir sin reenviar a ninguna parte, así que el aviso
   es el único puente.
4. Anota la fecha de retiro en las notas de la iteración 11.

---

## Cómo se publica a partir de ahora

Cada `git push` a `main` dispara una construcción y publica sola. No hay que entrar
al panel.

Antes de cada push conviene:

```bash
npm run verificar
```

Reconstruye el CSS y lo compara con lo que había. Termina siempre con **uno de
estos tres veredictos**, en un recuadro imposible de pasar por alto:

| Veredicto | Código | Qué significa |
|---|---|---|
| `VERIFICADO` | 0 | El CSS corresponde a la fuente y está commiteado. Puedes publicar |
| `DESFASADO` | 1 | El CSS no correspondía: se acaba de reconstruir. Revisa y commitea |
| `VERIFICACION PARCIAL` | 2 | Comprobó lo del CSS, pero **no** pudo comprobar si está commiteado, porque no encontró git. **No es un éxito** |

No es obligatorio —el despliegue compila por su cuenta— pero mantiene la copia del
repositorio al día con la fuente.

---

## Si algo sale mal

**La construcción falla.** El sitio **no se cae**: Cloudflare sigue sirviendo el
último despliegue que sí construyó. Tienes tiempo para arreglarlo con calma. Lee el
registro del despliegue fallido en el panel, reproduce el fallo con `npm run build`
en tu equipo y corrige.

**Publicaste algo roto.** En el panel → **Deployments**, busca un despliegue
anterior que funcionara y usa **Rollback to this deployment**. Vuelve a estar vivo
en segundos, sin tocar el repositorio.

**Quieres volver a publicar sin compilar.** Es la salida de emergencia que menciona
ADR-010. En el panel → **Settings** → **Builds & deployments**: vacía el **Build
command** y cambia el **Build output directory** de `dist` a `.`. Como
`static/css/style.css` e `icons.css` están versionados, el sitio se publica igual.
Ojo con dos efectos: `_planmaestro/` y `CLAUDE.md` pasarían a ser públicos, y desde
la iteración 12 la capa de datos dejaría de funcionar. Es una maniobra para salir
del paso, no un estado en el que quedarse.

---

## Lo que este procedimiento todavía no cubre

- **Dominio propio.** No hay. Se evalúa cuando el autor lo decida; entonces habrá
  que decidir si `.pages.dev` se redirige o se abandona.
- **Cabeceras de seguridad, caché y métricas.** Son la épica 50.
- **La capa de datos.** Va como funciones del proyecto de Pages, en un directorio
  `functions/` en la raíz del repositorio (**no** dentro de `dist/`). Es la
  iteración 12.
