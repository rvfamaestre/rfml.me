# Revisión del contenido, 14 de septiembre de 2026

Cada fórmula, figura y cifra se contrastó con su fuente, y se comprobó que muestra lo esencial del proyecto, no solo que sea correcta. Las rutas locales cuelgan de `Documents/VSC`, salvo `MATLAB`, `COMSOL` y `Altair`, que cuelgan de `Documents`. No se han copiado informes privados al sitio.

| Entrada | Fuente | Qué se muestra y por qué |
| --- | --- | --- |
| traffic | `comillas/tfg/thesis` (resumen y `chapters/ch04_model.tex`), código y `requirements.txt` | Fórmula del hueco temporal pedido: la regla fija α̊ y SAC solo suma Δα, acotado a 0,1. Es la idea central de la tesis. Cifras del resumen: 33,4 % menos de dispersión de velocidad frente a la regla y 54,3 % menos de combustible y CO₂ frente a no controlar, en el anillo de 300 m con 22 coches (11 automatizados). Sustituyen al 76 % del CV, que no aparece en la tesis. Herramientas por imports: PyTorch, NumPy, SciPy y Matplotlib; Optuna por el resumen; LaTeX por la tesis. |
| lattice | `MATLAB/fabadd-termproject-v0/TPMS_Lattice_Gen.m` (l. 236 y 280), `COMSOL/fabadd-frying-pan/Poster.pdf`, `Altair/models/wishbone` | El script guarda el sólido donde el giroide supera un umbral que cambia con la densidad local, así que se muestra F > t y no F = 0. |
| scheduler | [notion-scheduler](https://github.com/rvfamaestre/notion-scheduler) | Diagrama del propio repositorio. Sin fórmula. |
| azores | Sin material original; solo un resultado de LinkedIn sobre una iniciativa en las Azores | Solo nombre, lugar y tipo de evento. No se añade nada más. El año queda sin confirmar. |
| mit | `personal/courses/mitx-15.455x/Problem Sets/E.3.R` | El ejercicio en R valora opciones por Monte Carlo con la tasa libre de riesgo. Se muestra ese estimador en lugar de la ecuación genérica del movimiento browniano geométrico. |
| life | [cws-jdv](https://github.com/rvfamaestre/cws-jdv) y presentación | Regla B3/S23 y capturas del juego. Pygame y LaTeX confirmados. Se quita "escribí la documentación", que no se puede comprobar; el repositorio se publicó en 2026. |
| robot | [cvt-vac](https://github.com/rvfamaestre/cvt-vac) (`cv2`, `.ino`, `.slx`) y presentación final | Foto del robot. Mi parte según el organigrama: simulación en MATLAB, Simulink y Stateflow, e interfaz. Sin fórmula. |
| portfolio | [mds-pfm](https://github.com/rvfamaestre/mds-pfm) (`opt_portfolio` en `main.ipynb`) y presentación | La fórmula coincide con el problema de CVXPY: w ≥ 0, suma 1, riesgo ≤ σ²max y límite de concentración sobre los activos con riesgo. μ sale de una media móvil exponencial y Σ de un GARCH. Cifras de la tabla de la presentación. Matplotlib añadido por la figura. |
| reinforcement | `personal/courses/stanford-cs234` (README y requirements) | Ecuación de Bellman óptima, base de la iteración de valores del A1. PyTorch en A2 y A3, NumPy en A1. |
| regions | Resultado indexado de LinkedIn | Revisión coescrita sobre instituciones extractivas, infraestructura de transporte y dependencia urbana, con sus implicaciones de política. No hay informe ni repositorio en GitHub, así que no se añaden fórmula ni herramientas. |
| databox | `centralesupelec/pole-projet/p18/p18-fdb-rework/wordpress/playchain-exercises` | Plugin de WordPress (PHP y JavaScript) con ejercicios, corrección automática, Data Lab y soporte multilingüe. |
| labor | [eci-tp1](https://github.com/rvfamaestre/eci-tp1) (`mvp.py` e informe) | Regresión entre países con las tendencias en logaritmos, igual que el código. Figura de 1980 a 2000 del informe. Matplotlib añadido por la figura. |
| combustion | `personal/projects/MR/mr_mp_erico_rafael.pdf` (diap. 14) y `centralesupelec/rm/rm-mp` | El trabajo trata la ignición asistida por plasma en un reactor perfectamente agitado. Se muestra la ecuación de especies con el término de plasma y la potencia de cada pulso, en lugar de la ley de Arrhenius genérica. LaTeX por la presentación Beamer. |
| adn | CV | Pipeline de n8n con agentes para categorizar productos, adoptado internamente. Se quita "rellenar datos de producto". |
| powertrain | `centralesupelec/cvt/mvs/EI/README.md` y hojas `.xlsm` | Fabricante ficticio del segmento C, tecnologías añadidas paso a paso, ciclos NEDC y WLTP, y CO₂. |
| sound | `personal/projects/Electrónica/Informe2_GE3.pdf` (p. 5) | Filtro activo pasabanda inversor: f₀ y Q del informe. Con R₁ = 4 kΩ, R₂ = 16 kΩ, R₃ = 160 Ω y C = 1 µF da unos 101 Hz y Q ≈ 5. LTspice, rectificador de media onda y Arduino con PWM confirmados. |
| perunidad, paris | CV | Sin cambios. |

## Logos

Son los logos oficiales de cada herramienta, con sus fuentes en `assets/tools/SOURCES.md`. JavaScript, LTspice y Stateflow van sin logo: JavaScript no tiene uno oficial y de los otros dos no encontré una fuente oficial.

## Móvil y escritorio

Probado con Playwright en 390 x 844, 375 x 667 y 360 x 640: deslizar en los dos sentidos, límites de la primera y la última página, gesto vertical, arrastre corto, deslizar desde un cuadro y desde la barra, barra que no tapa ningún cuadro, cambiar de cuadro, tocar la barra para abrir, cerrar y fórmulas que caben en pantalla. En escritorio: panel a la izquierda al pasar el ratón, arrastrar, zoom y logos que cargan.
