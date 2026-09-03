# Respaldo y restauración de la base

Cómo se protege el banco de preguntas, cómo se recupera cuando algo sale mal, y
cómo se comprueba que el respaldo sirve de verdad.

**Quién lo ejecuta:** el autor. Claude Code no ejecuta comandos contra la cuenta de
Cloudflare (ADR-015): escribe los comandos, los ejecuta el autor.

**De dónde sale la decisión:** ADR-014.

---

## Dos mecanismos, dos pérdidas distintas

No compiten. Cubren cosas distintas, y por eso hacen falta los dos.

| | Time Travel | Exportación a `.sql` |
|---|---|---|
| Para qué | Deshacer **tu propio error** | Sobrevivir a **perder la base o la cuenta** |
| Alcance | **7 días** en el plan gratuito | Ilimitado: es un archivo |
| Mantención | Ninguna, siempre activo | Se exporta tras cada cambio de contenido |
| Dónde vive | Dentro de D1 | `d1/respaldo-banco.sql`, versionado en el repositorio |
| Sirve si se pierde la cuenta | **No** | **Sí** |

Los **7 días** son el número que hay que tener presente: los 30 días que aparecen
en casi toda la documentación son del plan de pago. Pasada esa ventana, lo único que
queda es el archivo exportado.

---

## Respaldar

Se exporta **después de cada cambio de contenido**, no por calendario. Esta base no
cambia sola: solo cambia cuando editas el banco, así que el momento de respaldarla
es justo después de haberlo hecho.

```powershell
npx wrangler d1 export examen-td-js-produccion --remote --output=d1/respaldo-banco.sql
```

Siempre el mismo archivo, siempre sobrescrito: el historial lo lleva git. Después
del `git commit`, el diff muestra qué preguntas cambiaron respecto de la versión
anterior, que de paso es una revisión editorial gratis.

**Comprueba antes de dar por bueno el respaldo.** Un archivo de cero bytes también
se guarda sin protestar:

```powershell
Get-Item d1/respaldo-banco.sql | Select-Object Length
Get-Content d1/respaldo-banco.sql -TotalCount 20
```

Tiene que verse el `CREATE TABLE` y las primeras filas.

---

## Recuperar de un error propio · Time Travel

Sirve si el error ocurrió **dentro de los últimos 7 días**. Es lo primero que hay
que intentar: no necesita archivos ni depende de que alguien se acordara de
exportar.

```powershell
npx wrangler d1 time-travel info examen-td-js-produccion
npx wrangler d1 time-travel restore examen-td-js-produccion --help
```

El primero dice hasta dónde se puede volver. El segundo muestra las banderas
exactas de esta versión de wrangler; **léelas antes de ejecutar la restauración**,
porque es una operación destructiva y no conviene descubrir su sintaxis a la
primera.

Tres cosas que hay que saber antes de usarlo:

- **Sobrescribe la base en su lugar.** No crea una copia al lado. Lo que había se
  pierde.
- **Los marcadores anteriores sobreviven**, así que una restauración equivocada se
  puede deshacer volviendo a un punto anterior.
- **No hay nada que activar.** Está funcionando ahora mismo, sin configuración.

---

## Recuperar de una pérdida real · el archivo exportado

Cuando la base ya no existe, o el error tiene más de 7 días.

```powershell
npx wrangler d1 execute <base> --remote --command "DROP TABLE IF EXISTS prueba_tuberia;"
npx wrangler d1 execute <base> --remote --file=d1/respaldo-banco.sql
```

**Por qué hay que borrar antes.** El archivo que produce `d1 export` contiene
`CREATE TABLE`, pero no `DROP TABLE`. Si lo aplicas sobre una base que ya tiene esas
tablas, falla porque ya existen. O sea que la restauración **también** es
destructiva: reemplaza, no fusiona. Es exactamente la clase de detalle que solo
aparece cuando alguien ensaya la restauración de verdad, y por eso se ensaya.

---

## Ensayar la restauración · siempre contra pruebas

**Nunca contra producción.** No es prudencia excesiva: una restauración sobrescribe
la base en su lugar, así que «probar» la restauración de producción *es* destruir
producción. La base `examen-td-js-pruebas` existe justamente para poder romper algo
sin consecuencias.

Un respaldo que no se ha restaurado nunca no es un respaldo, así que este ensayo se
repite cada vez que cambie el procedimiento o la herramienta.

### El ensayo, paso a paso

**1 · Respaldar la base de pruebas.** Fuera del repositorio: el archivo versionado
es el de producción, y no queremos que un volcado de juguete lo pise.

```powershell
npx wrangler d1 export examen-td-js-pruebas --remote --output=$env:TEMP\respaldo-pruebas.sql
Get-Content $env:TEMP\respaldo-pruebas.sql -TotalCount 20
```

**2 · Destruir un dato de verdad.** No un dato inventado para la ocasión: uno de los
que están ahí.

```powershell
npx wrangler d1 execute examen-td-js-pruebas --remote --command "DELETE FROM prueba_tuberia WHERE clave='saludo';"
npx wrangler d1 execute examen-td-js-pruebas --remote --command "SELECT clave, valor FROM prueba_tuberia ORDER BY id;"
```

Tiene que quedar **una sola fila**, `entorno`. Si quieres verlo desde afuera, la
dirección de vista previa lee esta base: `/api/prueba` va a devolver un solo
registro.

**3 · Restaurar desde el archivo.**

```powershell
npx wrangler d1 execute examen-td-js-pruebas --remote --command "DROP TABLE IF EXISTS prueba_tuberia;"
npx wrangler d1 execute examen-td-js-pruebas --remote --file=$env:TEMP\respaldo-pruebas.sql
```

**4 · Comprobar que volvió.**

```powershell
npx wrangler d1 execute examen-td-js-pruebas --remote --command "SELECT clave, valor FROM prueba_tuberia ORDER BY id;"
```

Tienen que estar las **dos filas**, con `saludo` de vuelta y su valor original.

**5 · Anotar el resultado** en la iteración que lo pidió. Un ensayo que no queda
escrito no distingue entre «se hizo y funcionó» y «nadie lo hizo».

---

## Contra qué base estás trabajando

El error caro de esta configuración no es equivocarse de comando: es acertar el
comando contra la base equivocada. Tres señales, para que no haya que adivinar:

1. **En la línea de comandos no existe un entorno activo.** Cada comando nombra su
   base. Si el nombre no aparece escrito, no estás trabajando contra ninguna: estás
   trabajando contra la que wrangler decida.
2. **`--local` contra `--remote`.** Sin `--remote`, el comando toca tu copia local y
   nada más. Es la diferencia entre ensayar y hacer.
3. **`/api/estado` dice dónde está.** El campo `entorno` responde `produccion`,
   `pruebas` o `local`. Y el pie del cuestionario muestra el entorno cuando **no**
   es producción, así que una vista previa se delata sola sin que nadie tenga que
   acordarse de mirar.

---

## Dónde están las credenciales

En ninguna parte del repositorio. La sesión de wrangler vive en el perfil del
usuario, fuera del proyecto:

```
%APPDATA%\xdg.config\.wrangler\config\default.toml
```

El repositorio ignora `.wrangler/`, `.dev.vars` y `.env` con todas sus variantes, y
está comprobado que un archivo de credenciales puesto ahí queda efectivamente
ignorado. Lo único de Cloudflare que sí se versiona son los **identificadores** de
las bases, en `wrangler.toml`, que nombran pero no dan acceso (ADR-012).

Si alguna vez hay que revocar el acceso: se hace desde el panel de Cloudflare,
cerrando la sesión de wrangler y volviendo a autorizarla. Borrar el archivo local no
revoca nada del lado de Cloudflare.
