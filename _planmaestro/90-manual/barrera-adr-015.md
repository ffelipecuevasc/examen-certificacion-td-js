# La barrera de ADR-015

ADR-015 dice que **Claude Code no ejecuta wrangler contra la cuenta de Cloudflare**.
Hasta el 2026-09-04 eso era sólo una frase escrita, y falló en su primera prueba
real: un comando `--remote` se autenticó y alcanzó la base de producción. El detalle
está en **H-014** de la auditoría técnica.

Esta página explica **cómo se pone la barrera, cómo se comprueba y qué hacer si se
cae**. La regla sigue estando en ADR-015; aquí está la parte que se toca con las
manos.

---

## Por qué la barrera no puede vivir en el repositorio

Dos motivos, y los dos se descubrieron probando.

**1. El bloque `env` de los ajustes de proyecto no se aplica.** Se intentó primero en
`.claude/settings.json` y en `.claude/settings.local.json` del repositorio. No
funcionó ni tras reiniciar la sesión: las variables no llegaban al entorno.
Probablemente sea deliberado por parte de Claude Code, y con buen criterio —inyectar
variables de entorno en todos los subprocesos desde un archivo que viene dentro de un
repositorio clonado es justo la clase de cosa que no conviene permitir—. Sea o no ese
el motivo, el hecho está comprobado, y la barrera se mudó a los ajustes de usuario.

**2. La regla es sobre Claude Code, no sobre este proyecto.** ADR-015 restringe a la
herramienta, así que corresponde que viva donde vive la configuración de la
herramienta. El efecto secundario es que aplica a **todas** las sesiones de Claude
Code de este equipo, no sólo a las de este repositorio. Aceptado a propósito por el
autor el 2026-09-04.

---

## Cómo se pone (lo hace el autor, una vez)

### Paso 1 · Añadir el bloque `env` a los ajustes de usuario

Archivo: **`C:\Users\<usuario>\.claude\settings.json`**

Es un objeto JSON que ya tiene otras claves —tema, modelo, permisos—. **No lo
reemplaces entero.** Se añade una clave `"env"` al mismo nivel que las que ya están,
separada por una coma:

```json
  "env": {
    "XDG_CONFIG_HOME": "C:\\Users\\<usuario>\\.claude\\wrangler-sin-credenciales",
    "CLOUDFLARE_API_TOKEN": "",
    "CLOUDFLARE_API_KEY": "",
    "CLOUDFLARE_EMAIL": "",
    "CLOUDFLARE_ACCOUNT_ID": ""
  }
```

Tres cosas que importan:

- **Las barras invertidas van dobles.** En JSON, `\` es un carácter de escape; una
  ruta de Windows con barras simples produce un archivo inválido.
- **Un JSON mal formado deja sin efecto TODOS los ajustes de ese archivo**, no sólo
  el bloque nuevo. Si tras esto el tema o el modelo cambian solos, es que el archivo
  se rompió.
- El directorio al que apunta ya existe y trae un `LEEME.txt` explicando qué es. Está
  vacío a propósito: es un `XDG_CONFIG_HOME` sin sesión de wrangler dentro.

### Paso 2 · Recargar la configuración

Abrir **`/hooks`** una vez en la sesión de Claude Code. Eso recarga la configuración.
Reiniciar la sesión, por sí solo, no bastó cuando se probó.

### Paso 3 · Comprobar que quedó puesta

```
npm run verificar:barrera
```

Debe responder, **dentro de Claude Code**:

```
BARRERA EN PIE
  - XDG_CONFIG_HOME apunta a ...\wrangler-sin-credenciales, y ahi no hay sesion de wrangler.
  - Ninguna de estas trae valor: CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_KEY, ...
  - El enganche PreToolUse esta declarado y su guion existe.
  - El enganche se ejecuto hace 0 s: esta vivo, no solo declarado.

codigo de salida: 0
```

En tu propio terminal responde `BARRERA NO APLICA`, código 0, porque tú sí puedes
hablar con la cuenta. Es lo esperado.

**Si sigue diciendo `BARRERA CAIDA`, no lo des por bueno.** El mensaje nombra qué
condición falta, una por una, y cada una dice qué hacer.

---

## Las cuatro condiciones

Las comprueba `scripts/verificar-barrera.mjs`, que corre como **primer paso de
`npm run verificar`**: si la barrera está caída, la verificación se detiene ahí y ni
siquiera construye.

| # | Condición | Por qué |
|---|---|---|
| 1 | `XDG_CONFIG_HOME` apunta a un directorio sin sesión de wrangler | Es la capa que sostiene: la heredan todos los procesos hijos, así que sobrevive a cualquier andamiaje |
| 2 | Ninguna variable `CLOUDFLARE_*` trae credencial | Wrangler las prefiere a la sesión en disco, así que la 1 sola no basta |
| 3 | El enganche `PreToolUse` está declarado y su guion existe | Es la capa que da el mensaje claro al rechazar |
| 4 | El enganche **se está ejecutando**, no sólo declarado | Añadida el 2026-09-04 tras descubrir que un enganche declarado en un archivo que no se carga no rechaza nada, y la comprobación decía «en pie» igualmente |

La condición 4 funciona con un testigo: el guardián escribe la hora en
`.wrangler/barrera-ultimo-uso.txt` cada vez que corre, y como el comprobador se lanza
a través de la misma herramienta que dispara el enganche, si está vivo el testigo se
acaba de escribir. Si está muerto, envejece y se nota.

---

## Lo que la barrera NO hace

Conviene tenerlo escrito para no confiarse:

- **El enganche sólo ve la línea de comandos.** No habría detenido el incidente de
  H-014, donde el comando era `powershell -File correr.ps1` y el `--remote` vivía
  dentro del archivo. Por eso la capa 1 es la que importa.
- **No distingue un comando de un texto que habla de un comando.** Escribir
  documentación que mencione `wrangler … --remote` desde el shell también queda
  bloqueado. La salida correcta es escribir esos archivos con la herramienta de
  escritura, no aflojar el patrón.
- **No impide nada en tu terminal.** No es su trabajo.

---

## Las salidas explícitas

Dos variables permiten saltarse comprobaciones a propósito. Existen porque hay casos
legítimos, y llevan nombre largo para que nadie las escriba por inercia.

| Variable | Qué desactiva | Cuándo se usa |
|---|---|---|
| `PERMITIR_REMOTO=1` | Que `verificar-banco` se niegue a `--remote` | Siempre que **tú** verifiques contra la nube. Claude Code no la pone nunca |
| `PERMITIR_BASE_NO_DECLARADA=1` | Que `verificar-banco` exija que el `--base` esté en `wrangler.toml` | Sólo para apuntar a propósito a un nombre que no existe: es como se provoca el veredicto `NO SE PUDO VERIFICAR` (forma A del ensayo del banco) |

Ninguna de las dos desactiva la capa 1. Comprobado: con `PERMITIR_REMOTO=1` puesto y
la barrera en pie, un `--remote` no sale del equipo — wrangler responde que no
encuentra credenciales y no hace ni una petición a la API.

```
PowerShell:  $env:PERMITIR_REMOTO=1
Git Bash:    PERMITIR_REMOTO=1 npm run ...
```

En PowerShell la variable dura lo que dure la ventana. Para quitarla antes:
`Remove-Item Env:\PERMITIR_REMOTO`.

---

## Si hay que levantar la barrera a propósito

Se quita el bloque `env` de `~/.claude/settings.json`, se recarga con `/hooks`, y
`npm run verificar:barrera` pasará a decir `BARRERA CAIDA`. **Eso es correcto**: la
barrera no está, y el aviso lo dice. Volver a ponerla es pegar el bloque otra vez.

Que haga falta un acto deliberado en un archivo del usuario —y que quede gritando
mientras esté quitada— es exactamente el objetivo.
