# Iteración 32 · Rediseño del panel fijo

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada

## Objetivo

Reorganizar la mitad izquierda de `cuestionario.html`: las tres barras de progreso
pasan de vertical a **horizontal**, ocupando todo el ancho disponible de su panel, y
el espacio liberado se aprovecha para orientar mejor al estudiante.

## Contexto

Las barras verticales funcionan, pero desperdician el ancho del panel y limitan la
información que cabe. En horizontal, cada barra puede llevar su etiqueta, su cifra y
su porcentaje en la misma línea, y queda espacio para un índice de módulos.

Se mantienen los colores actuales: amarillo para el avance, ruby para los errores y
esmeralda para los aciertos.

## Tareas

- [ ] Convertir las tres barras a formato horizontal, a todo el ancho del panel.
- [ ] Conservar los colores y los íconos ya asociados a cada barra.
- [ ] Añadir un índice de los siete módulos con el avance de cada uno, que además
      sirva para saltar a ese módulo.
- [ ] Revisar el comportamiento del panel en pantallas de altura reducida: con más
      contenido, el panel fijo puede no caber.
- [ ] Asegurar que la información no dependa solo del color: cada barra debe ser
      comprensible en escala de grises.

## Criterios de aceptación

- [ ] Las tres barras son horizontales y ocupan el ancho del panel.
- [ ] Cada barra muestra su etiqueta, su cifra absoluta y su porcentaje.
- [ ] El índice de módulos refleja el avance real de cada uno y permite saltar.
- [ ] En una ventana de 700 píxeles de alto, el panel sigue siendo usable: se
      demuestra con captura o descripción del comportamiento.
- [ ] En pantallas bajo el punto de corte de escritorio, el panel se apila sin
      romperse.
- [ ] Una captura en escala de grises permite distinguir qué representa cada barra.
- [ ] El diseño mantiene la identidad del sitio: no se introducen colores fuera de
      la paleta ya establecida.

## Notas de la iteración

_Pendiente._
