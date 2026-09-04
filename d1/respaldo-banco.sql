PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE prueba_tuberia (
  id             INTEGER PRIMARY KEY,
  clave          TEXT NOT NULL UNIQUE,
  valor          TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);
INSERT INTO "prueba_tuberia" ("id","clave","valor","actualizado_en") VALUES(1,'saludo','Verificado por Felipe el 3 de septiembre','2026-09-03');
INSERT INTO "prueba_tuberia" ("id","clave","valor","actualizado_en") VALUES(2,'entorno','Cambia este valor para comprobar que el dato no esta fijo en el codigo.','2026-09-03');
