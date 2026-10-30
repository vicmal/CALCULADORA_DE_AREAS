# CALCULADORA_DE_AREAS v3 — DXF PRO: qué cambió y cómo publicar

Base: v2 (mediana GPS 20 s, persistencia, caché offline, confirmación,
crédito @victorhugomalave). Esta v3 solo cambia el plano DXF y añade la
pantalla de datos. NO incluye todavía el límite de prueba de 5 usos;
eso queda pendiente de la decisión entre límite de DXF o bloqueo total.

## Qué cambió en el DXF

1. **Pantalla "Datos del plano"** (botón en resultados, antes del DXF):
   Localidad, Propietario/Ocupante, Levantó, Calculó, Dibujó, Escala de
   impresión, Hoja N° y los cuatro colindantes (Norte, Sur, Este, Oeste).
   Todo opcional. Los datos del profesional se guardan en el teléfono
   para el próximo plano; los del lote se borran con Nuevo cálculo.
   Escribe colindantes cortos (ej: Río Amana), no frases largas.
2. **Cuadro de colindantes** en el DXF, a la derecha del lote, después
   del cuadro de coordenadas y antes de la tabla de lados. Solo aparece
   si al menos un colindante tiene texto. La tabla anterior, que el
   código llamaba "linderos", sigue siendo distancia y rumbo por lado;
   ahora no hay confusión entre lados y colindantes.
3. **Rótulo lleno, no en blanco**: localidad, propietario, escala,
   fecha, levantó, calculó, dibujó, hoja, más área en m² y en ha y
   perímetro total. El área y el perímetro también salen destacados
   en el encabezado del contenido, no solo en el rótulo.
4. **Escala gráfica** en metros reales, debajo del rótulo, con dos
   tramos iguales al intervalo de la cuadrícula. Como el DXF está en
   metros 1:1, la barra escala junto con el plano al imprimir y vale
   a cualquier escala de impresión. La escala numérica del rótulo
   sigue siendo la que el usuario escribe (la de su impresión).
5. **Marco del plano** alrededor de todo: lote, cuadrícula, norte,
   tablas, rótulo y escala gráfica, calculado con los anchos reales
   de las tablas para no cortar textos.
6. **Flecha de norte rellena** (SOLID), apuntando al norte de
   cuadrícula UTM (eje +Y).
7. **Datum corregido a WGS84** en la declaratoria. El cálculo es WGS84
   (proj4); no se declara una transformación a SIRGAS-REGVEN que no se
   hizo. Si el plano debe certificarse como REGVEN, avisar antes de
   publicar para ajustar la nota con su equivalencia.
8. **Nota de método** en el DXF: "GPS, mediana 20 s por vértice" o
   "Coordenadas UTM ingresadas" en modo manual.

## Publicar

En el repo `vicmal/CALCULADORA_DE_AREAS`, raíz, reemplazar `index.html`
por este archivo y `sw.js` por este archivo (el caché subió a v3, para
que los teléfonos que ya tenían la v2 actualicen; si solo se cambia el
HTML, el service worker viejo puede seguir sirviendo la v2). Manifest
e iconos ya están en el repo. Hacer push; Pages redespliega solo.

## Prueba antes de darla por buena

1. Abrir la app, calcular un lote de prueba (4 vértices bastan).
2. Pulsar "Datos del plano", llenar localidad, propietario, los tres
   profesionales, escala 1:1000 y al menos dos colindantes (ej: Norte
   Río Amana, Este Terrenos de R. Dambre).
3. Generar el DXF y abrirlo en AutoCAD (o QGIS/LibreCAD para una
   revisión rápida): verificar que el rótulo sale lleno, que el cuadro
   de colindantes aparece, que la escala gráfica y el marco están, y
   que el área en m²/ha y el perímetro coinciden con la pantalla.
4. Repetir con colindantes vacíos: el cuadro de colindantes NO debe
   aparecer, y el resto del plano debe salir completo.
