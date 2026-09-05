/**
 * Capa 2 de la barrera de ADR-015: rechaza el comando antes de que se ejecute.
 *
 * Lo invoca Claude Code como enganche `PreToolUse` sobre Bash y PowerShell. Recibe
 * por la entrada estandar el JSON de la llamada y responde por la salida estandar
 * si la deja pasar o no.
 *
 * QUE NO HACE, y conviene saberlo antes de confiarse (H-014):
 * Esta capa solo ve la linea de comandos. El incidente que origino la barrera
 * ejecuto `powershell -File correr.ps1`, y el `--remote` vivia dentro del archivo,
 * tres capas mas abajo: leyendo esa linea no se ve nada. Por eso esta capa es la
 * barata, no la que sostiene. La que sostiene es la capa 1 —el entorno sin
 * credenciales—, que la heredan todos los procesos hijos y no se puede esquivar
 * metiendo el comando dentro de un archivo.
 *
 * Consecuencia asumida a proposito: escribir documentacion que mencione
 * `wrangler ... --remote` desde un heredoc de bash tambien queda bloqueado, porque
 * desde aca no se distingue un comando de un texto que habla de un comando. La
 * salida no es afinar el patron hasta que deje pasar el caso: es escribir esos
 * archivos con la herramienta de escritura en vez de con el shell.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Testigo de que este guion se ejecuto.
 *
 * Sin esto, `verificar-barrera` solo podia comprobar que el enganche estuviera
 * DECLARADO en el archivo de ajustes, que no es lo mismo que estar VIVO: un
 * enganche declarado en un archivo que Claude Code no llega a cargar no rechaza
 * nada, y la comprobacion decia «en pie» igualmente. Paso de verdad el 2026-09-04.
 *
 * Como el comprobador se lanza a traves de la misma herramienta que dispara este
 * enganche, si el enganche esta vivo el testigo se acaba de escribir cuando el
 * comprobador lo lee. Si esta muerto, envejece y se nota.
 */
const dejarTestigo = () => {
  try {
    const carpeta = join(RAIZ, '.wrangler');
    mkdirSync(carpeta, { recursive: true });
    writeFileSync(join(carpeta, 'barrera-ultimo-uso.txt'), new Date().toISOString());
  } catch {
    // Que no se pueda escribir el testigo no es motivo para frenar el trabajo. El
    // comprobador lo vera envejecer y lo dira por su cuenta.
  }
};

/** Lo que nunca debe salir de este entorno hacia la cuenta de Cloudflare. */
const PROHIBIDO = [
  {
    patron: /--remote\b/,
    exige: /wrangler|datos:/,
    motivo: 'lleva --remote, que habla con la cuenta de Cloudflare',
  },
  {
    patron: /wrangler\s+(login|logout|whoami|secret|deploy)\b/,
    motivo: 'es un comando de wrangler que necesita la cuenta',
  },
  {
    patron: /wrangler\s+d1\s+(create|delete|export|time-travel)\b/,
    motivo: 'es un comando de wrangler d1 que actua sobre la base de la nube',
  },
  {
    patron: /wrangler\s+pages\s+(deploy|delete)\b/,
    motivo: 'publica o borra en Cloudflare Pages',
  },
];

const AVISO = [
  'ADR-015: Claude Code no ejecuta wrangler contra la cuenta de Cloudflare.',
  '',
  'Motivo del rechazo: el comando %MOTIVO%.',
  '',
  'Que hacer en su lugar: escribe el comando en el mensaje para que lo ejecute',
  'el autor en su terminal, y trabaja con la salida que el te pase. Para probar',
  'contra una base local usa --local, que si esta permitido.',
  '',
  'Si lo que ibas a hacer era escribir documentacion que menciona el comando,',
  'usa la herramienta de escritura de archivos en vez del shell.',
  '',
  'Esta es la capa 2 de la barrera de H-014, y es la mas debil: solo ve la linea',
  'de comandos. Que te haya frenado a ti no significa que frene a un comando',
  'escondido dentro de un archivo.',
].join('\n');

const responder = (objeto) => {
  dejarTestigo();
  process.stdout.write(JSON.stringify(objeto));
  process.exit(0);
};

const permitir = () =>
  responder({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow' },
  });

let entrada = '';

try {
  entrada = readFileSync(0, 'utf8');
} catch {
  // Sin entrada no hay nada que juzgar. No es motivo para bloquear el trabajo.
  permitir();
}

let llamada;

try {
  llamada = JSON.parse(entrada || '{}');
} catch {
  permitir();
}

const comando = `${llamada?.tool_input?.command ?? ''}`;

if (!comando.trim()) permitir();

const encontrado = PROHIBIDO.find(
  ({ patron, exige }) => patron.test(comando) && (!exige || exige.test(comando))
);

if (!encontrado) permitir();

responder({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: AVISO.replace('%MOTIVO%', encontrado.motivo),
  },
  systemMessage: 'Barrera de ADR-015: comando rechazado por hablar con la cuenta de Cloudflare.',
});
