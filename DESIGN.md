# Laboro — Sistema de Diseño

Referencia visual y técnica de **Laboro**, agregador de empleos tech para el mercado peruano.
Personalidad: moderno, técnico, limpio y profesional — en la línea de Linear, Vercel Dashboard y GitHub.
Sin modo oscuro en esta versión. Todos los componentes son compatibles con **shadcn/ui + Tailwind CSS**.

---

## 1. Paleta de colores

### Colores base (UI)

| Token semántico | Hex | Uso |
|---|---|---|
| `background` | `#fbfbfc` | Fondo general de la página (blanco frío) |
| `foreground` | `#0b0b0f` | Texto principal, títulos |
| `card` | `#ffffff` | Fondo de tarjetas y paneles |
| `card-foreground` | `#0b0b0f` | Texto dentro de tarjetas |
| `popover` | `#ffffff` | Fondo de popovers, dropdowns, tooltips |
| `primary` | `#4f46e5` | Acento principal (índigo): botones, links, enlaces activos, series de gráficas |
| `primary-foreground` | `#ffffff` | Texto sobre `primary` |
| `secondary` | `#f2f2f5` | Superficies secundarias, hover sutil, cursor de gráficas |
| `secondary-foreground` | `#16161d` | Texto sobre `secondary` |
| `muted` | `#f2f2f5` | Superficies apagadas |
| `muted-foreground` | `#6b6b78` | Texto secundario, captions, labels, metadatos |
| `accent` | `#eef0fb` | Realce índigo suave: ítem de nav activo, chips de íconos |
| `accent-foreground` | `#4338ca` | Texto/íconos sobre `accent` |
| `border` | `rgba(11,11,15,0.08)` | Hairlines, bordes de tarjetas e inputs |
| `input` | `rgba(11,11,15,0.1)` | Borde de campos de formulario |
| `input-background` | `#ffffff` | Fondo de inputs |
| `ring` | `#4f46e5` | Anillo de foco (accesibilidad) |

### Colores de estado

| Estado | Hex | Uso |
|---|---|---|
| Éxito (success) | `#10b981` | Indicador "en vivo", modalidad Remoto, series positivas |
| Error (destructive) | `#dc2626` | Errores, acciones destructivas |
| Advertencia (warning) | `#f59e0b` | Modalidad Híbrido, alertas |
| Info | `#0ea5e9` | Informativo, gráfica secundaria (`chart-2`) |

> **Nota:** en esta versión no se usan `success`/`warning`/`info` como tokens formales de shadcn; se aplican vía los colores de modalidad y de gráficas. Si se desea, pueden promoverse a variables CSS (ver §6).

### Colores de gráficas (Stats)

| Token | Hex |
|---|---|
| `chart-1` | `#4f46e5` (índigo) |
| `chart-2` | `#0ea5e9` (sky) |
| `chart-3` | `#10b981` (emerald) |
| `chart-4` | `#f59e0b` (amber) |
| `chart-5` | `#ec4899` (pink) |

### Badges por modalidad (color semántico)

| Modalidad | Fondo | Texto | Borde | Ícono |
|---|---|---|---|---|
| **Remoto** | `#e7f6ee` | `#177245` | `#c3e8d3` | `Wifi` (verde) |
| **Presencial** | `#e8eefb` | `#2a4db0` | `#c9d6f5` | `Building2` (azul) |
| **Híbrido** | `#fdf1e0` | `#9a6700` | `#f5dfb2` | `Blend` (ámbar) |

Racional: verde = libertad/ubicuidad, azul = oficina/institucional, ámbar = mezcla.

### Badges por tecnología

Cada tecnología usa el color reconocible de su lenguaje/framework en la comunidad dev.
Estructura por tech: `bg` (fondo suave), `fg` (texto), `border`, `dot` (punto de color = color oficial).

| Tech | dot (color oficial) | fg (texto) | bg (fondo) |
|---|---|---|---|
| React | `#61dafb` | `#0b7285` | `#e7f8fd` |
| Next.js | `#111111` | `#111111` | `#f2f2f3` |
| TypeScript | `#3178c6` | `#2059a6` | `#e8effb` |
| JavaScript | `#f7df1e` | `#8a6d00` | `#fdf7e0` |
| Vue | `#42b883` | `#2c8560` | `#e7f7ef` |
| Angular | `#dd0031` | `#b30320` | `#fdeaec` |
| Node.js | `#539e43` | `#3c6c2a` | `#ecf5e8` |
| Python | `#3776ab` | `#2b5a86` | `#eaf1f8` |
| Django | `#092e20` | `#0c4b33` | `#e6f0ec` |
| Java | `#e76f00` | `#a8480a` | `#fdefe6` |
| Go | `#00add8` | `#0b7c99` | `#e6f7fb` |
| PHP | `#777bb4` | `#4b4f97` | `#eeeefb` |
| Laravel | `#ff2d20` | `#b32b1f` | `#fdeceb` |
| Ruby | `#cc342d` | `#a01d17` | `#fceceb` |
| Rust | `#dea584` | `#8a5a2b` | `#f5ede6` |
| .NET | `#512bd4` | `#5a2d91` | `#f0eafb` |
| C# | `#9179c8` | `#4338ca` | `#eef0fb` |
| Docker | `#2496ed` | `#1665c0` | `#e7f1fd` |
| Kubernetes | `#326ce5` | `#2647c2` | `#e9edfc` |
| AWS | `#ff9900` | `#a35800` | `#fff2e0` |
| PostgreSQL | `#4169e1` | `#2b4a86` | `#e9edf8` |
| MongoDB | `#00ed64` | `#237a3a` | `#e9f6ec` |
| GraphQL | `#e10098` | `#a3106e` | `#fcebf5` |
| Tailwind | `#38bdf8` | `#0d7490` | `#e6f7fb` |
| Flutter | `#54c5f8` | `#1a6cc0` | `#e6f4fd` |
| Kotlin | `#7f52ff` | `#6a2fb0` | `#f2eafb` |
| Swift | `#f05138` | `#c14e0f` | `#fdeee6` |
| *fallback* | `#9ca3af` | `#4b4b57` | `#f2f2f5` |

> Toda tech no listada usa el estilo *fallback* (gris neutro).

---

## 2. Tipografía

**Familias** (Google Fonts):

- **Geist** — display y body. `https://fonts.google.com/specimen/Geist`
- **Geist Mono** — datos, métricas, marca "laboro", tiempos, código, etiquetas técnicas. `https://fonts.google.com/specimen/Geist+Mono`

Import (en `src/styles/fonts.css`):

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap');
```

Variables:

```css
--font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

**Tamaño raíz:** `15px` (`--font-size`). Los `rem` de Tailwind se calculan sobre esta base.

### Escala tipográfica

| Rol | Clase Tailwind | Tamaño (rem / ~px @15px) | Font-weight | Line-height | Uso |
|---|---|---|---|---|---|
| Display / Hero | `text-5xl` | `3rem` / ~48px | 600 (semibold) | 1.1 | Titular del hero |
| H1 página | `text-2xl`–`text-3xl` | `1.5–1.875rem` / 24–30px | 600 | 1.1–1.5 | Título de página |
| H2 | `text-xl` | `1.25rem` / ~20px | 500 (medium) | 1.5 | Secciones |
| H3 | `text-lg` / `text-sm font-semibold` | `1.125rem` / ~18px | 500–600 | 1.5 | Subsecciones, títulos de card |
| Body | `text-base` (default) | `1rem` / 15px | 400 (normal) | 1.5 | Texto de párrafo |
| Body pequeño | `text-sm` | `0.875rem` / ~14px | 400 | 1.5 | Descripciones, metadatos |
| Label | `label` / `text-sm` | `0.875–1rem` | 500 | 1.5 | Etiquetas de campos |
| Caption / meta | `text-xs` | `0.75rem` / ~12px | 400 | 1.4–1.5 | Tiempos, hints, footer |
| Badge | `text-xs` | `0.75rem` / ~12px | 500 | 1 | Badges de tech, modalidad, "Nuevo" |
| Uppercase label | `text-xs uppercase tracking-wide` | `0.75rem` | 600 | 1.5 | Títulos de sección de filtros |
| Métrica / dato | `text-3xl font-mono` | `1.875rem` / ~30px | 600 | 1 | Números de StatCard |

**Pesos disponibles:** 400 (normal), 500 (medium), 600 (semibold). No usar >600.
Los headings HTML (`h1`–`h4`) ya tienen estilos base en `theme.css`; las utilidades de Tailwind los sobreescriben.

---

## 3. Espaciado

Escala base de Tailwind (múltiplos de 4px). Tokens usados en el diseño:

| Token Tailwind | px | Uso típico |
|---|---|---|
| `1` | 4px | Gap entre punto e ícono en badges |
| `1.5` | 6px | Gap en badges, chips de tech |
| `2` | 8px | Gap pequeño entre ítems |
| `2.5` | 10px | Gap en listas de checkboxes |
| `3` | 12px | Gap entre elementos, padding de nav |
| `4` | 16px | Padding de cards compactas, gap de grids, gap entre cards del listado |
| `5` | 20px | Padding estándar de cards (`p-5`) |
| `6` | 24px | Gap por defecto de `Card` de shadcn |
| `7` | 28px | Separadores en detalle (`my-7`) |
| `8` | 32px | Padding de bloques destacados, gap de columnas (`gap-8`) |
| `14` | 56px | Padding vertical de secciones (`py-14`) |
| `16` / `24` | 64 / 96px | Padding vertical del hero (`py-16 sm:py-24`) |

**Contenedor:** ancho máximo `max-w-6xl` (72rem / ~1152px), padding horizontal `px-4 sm:px-6`.
**Sticky offset:** elementos sticky usan `top-20` (80px) para librar el navbar (`h-14` = 56px).

Reglas rápidas:
- Gap entre cards del listado: **`space-y-3`** (12px).
- Gap de grids de cards: **`gap-4`** (16px).
- Padding interno de card: **`p-5`** (20px), compactas `p-4` (16px).

---

## 4. Bordes y sombras

### Radio de bordes

`--radius: 0.5rem` (8px). Derivados de shadcn:

| Token | Valor | Componentes |
|---|---|---|
| `rounded-sm` (`radius-sm`) | `calc(radius - 4px)` = 4px | Puntos, celdas de gráficas, chips internos |
| `rounded-md` (`radius-md`) | `calc(radius - 2px)` = 6px | **Badges, Buttons, Inputs, Select, chips de tech** |
| `rounded-lg` (`radius-lg`) | `0.5rem` = 8px | Bloques medianos |
| `rounded-xl` | `calc(radius + 4px)` = 12px | **Cards, paneles, estados vacíos, sidebar de filtros** |
| `rounded-full` | — | Avatares, punto "en vivo", ícono de estado vacío/404 |

### Sombras

El diseño es plano por defecto (bordes hairline en vez de sombras). Sombras específicas:

| Nombre | Valor | Uso |
|---|---|---|
| Hover de card | `0 2px 16px -4px rgba(79,70,229,0.18)` | Elevación índigo sutil al hacer hover sobre `JobCard` |
| Popover / dropdown | `shadow-md` de Tailwind | Tooltips de gráficas, menús |
| Badge "Nuevo" | `shadow-sm` | Realce mínimo del badge primario |

> Nunca usar sombras pesadas (`shadow-2xl`). La jerarquía se logra con borde + fondo blanco sobre fondo `#fbfbfc`.

---

## 5. Componentes

| Componente | Base shadcn/ui | Variantes | Estados | Notas |
|---|---|---|---|---|
| **Button** | `button.tsx` | `default` (índigo), `secondary`, `outline`, `ghost`, `destructive`, `link` · tamaños `sm`, `default`, `lg` | default · hover (`bg-primary/90` etc.) · active · focus-visible (ring) · disabled (`opacity-50`) | CTA principal usa `default size="lg"` |
| **JobCardRow** (listado) | `Card` | horizontal | default · hover (borde índigo + sombra, título vira a `primary`, aparece `ArrowUpRight`) | Título, empresa, badges tech (máx 4 + contador), modalidad, ubicación, salario, fuente, tiempo, badge "Nuevo" (<24h) |
| **JobCardGrid** (home/similares) | `Card` | vertical | default · hover (idéntico a row) | Versión compacta 1 columna interna |
| **ModalityBadge** | (custom sobre patrón `Badge`) | `Remoto`, `Presencial`, `Híbrido` | estático | Color semántico + ícono lucide |
| **TechBadge** | (custom sobre patrón `Badge`) | 27 techs + fallback | estático · seleccionable en filtros (borde = color dot) | Punto de color + nombre |
| **Input de búsqueda** | `input.tsx` | con ícono `Search` a la izquierda (`pl-9`) | default · focus (ring índigo) · placeholder (`muted-foreground`) | Fondo `input-background`, borde `input` |
| **Sidebar de filtros** | `Card` + `Input` + `Checkbox` + `Button` | desktop (columna sticky `w-64`) · mobile (`Sheet` lateral) | ítem activo (checkbox marcado / chip con borde de color) · botón "Limpiar filtros (n)" | Secciones: Búsqueda, Tecnología (chips), Modalidad, Ciudad, Fuente, Fecha (botones) |
| **Select (orden)** | `select.tsx` | `sm` | default · open · focus | "Más recientes" / "Mayor salario" |
| **Pagination** | `pagination.tsx` | numérica + prev/next | página activa (`isActive`) · deshabilitado en extremos (`pointer-events-none opacity-50`) | Aparece solo si `totalPages > 1` |
| **Empty state** | `Card` (dashed) + `Button` | listado sin resultados | estático + acción "Limpiar filtros" | Ícono `SearchX` en círculo `secondary` |
| **StatCard** | `Card` | métrica | estático | Label + ícono en chip `accent` + valor `font-mono text-3xl` + hint |
| **ChartCard** | `Card` + `recharts` + `Skeleton` | barras H, dona, línea, barras V | **loading** (Skeleton 900ms) · loaded | Tooltip custom con borde `border` y `shadow-md` |
| **Breadcrumb** | `breadcrumb.tsx` | Inicio › Empleos › [título] | link · página actual (truncada) | Solo en detalle |
| **Navbar** | (custom) + `NavLink` | — | link · hover (`bg-secondary`) · activo (`bg-accent text-accent-foreground`) | Sticky, blur de fondo |

---

## 6. Tokens de Tailwind

Este proyecto usa **Tailwind v4** (config vía `@theme` en CSS, sin `tailwind.config.js`). Abajo se dan **ambas** formas.

### Opción A — `tailwind.config.js` (Tailwind v3 / shadcn clásico con Next.js)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1152px" } },
    extend: {
      colors: {
        background: "#fbfbfc",
        foreground: "#0b0b0f",
        card: { DEFAULT: "#ffffff", foreground: "#0b0b0f" },
        popover: { DEFAULT: "#ffffff", foreground: "#0b0b0f" },
        primary: { DEFAULT: "#4f46e5", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f2f2f5", foreground: "#16161d" },
        muted: { DEFAULT: "#f2f2f5", foreground: "#6b6b78" },
        accent: { DEFAULT: "#eef0fb", foreground: "#4338ca" },
        destructive: { DEFAULT: "#dc2626", foreground: "#ffffff" },
        success: "#10b981",
        warning: "#f59e0b",
        info: "#0ea5e9",
        border: "rgba(11,11,15,0.08)",
        input: "rgba(11,11,15,0.1)",
        ring: "#4f46e5",
        chart: {
          1: "#4f46e5", 2: "#0ea5e9", 3: "#10b981", 4: "#f59e0b", 5: "#ec4899",
        },
        // Modalidad
        modality: {
          remoto:      { DEFAULT: "#177245", bg: "#e7f6ee", border: "#c3e8d3" },
          presencial:  { DEFAULT: "#2a4db0", bg: "#e8eefb", border: "#c9d6f5" },
          hibrido:     { DEFAULT: "#9a6700", bg: "#fdf1e0", border: "#f5dfb2" },
        },
      },
      fontFamily: {
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "calc(0.5rem - 4px)",
        md: "calc(0.5rem - 2px)",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        card: "0 2px 16px -4px rgba(79,70,229,0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Opción B — Tailwind v4 (`@theme` en `theme.css`, lo que usa este proyecto)

```css
:root {
  --font-size: 15px;
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --background: #fbfbfc;
  --foreground: #0b0b0f;
  --card: #ffffff;
  --card-foreground: #0b0b0f;
  --primary: #4f46e5;
  --primary-foreground: #ffffff;
  --secondary: #f2f2f5;
  --muted-foreground: #6b6b78;
  --accent: #eef0fb;
  --accent-foreground: #4338ca;
  --border: rgba(11,11,15,0.08);
  --ring: #4f46e5;
  --chart-1: #4f46e5; --chart-2: #0ea5e9; --chart-3: #10b981;
  --chart-4: #f59e0b; --chart-5: #ec4899;
  --radius: 0.5rem;
}

@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* …resto de mapeos color-* → var(--*) */
  --radius-md: calc(var(--radius) - 2px);
  --radius-xl: calc(var(--radius) + 4px);
}
```

---

## 7. Reglas de uso

### Color
- **Nunca combinar** `primary` (índigo) con `destructive` (rojo) como acentos adyacentes; el índigo es el único acento de marca.
- El fondo de página es **siempre** `#fbfbfc`; las tarjetas **siempre** `#ffffff`. No poner tarjeta blanca sobre blanco puro sin borde.
- El acento `accent` (índigo suave) se reserva para **estado activo** (nav, chips de ícono). No usarlo como fondo de contenido extenso.
- Texto de párrafo: `foreground` sobre `card`/`background`; metadatos: `muted-foreground`. **Nunca** usar `muted-foreground` para texto de párrafo largo (contraste insuficiente).
- Los colores de modalidad y de tech **solo** viven dentro de sus badges. No usarlos como fondos de sección ni botones.
- Verde (`#10b981`) es exclusivo de "éxito / remoto / en vivo". No usarlo decorativamente.

### Componentes que van juntos
- `JobCardRow` **siempre** dentro del listado de `/jobs` con `space-y-3`; nunca suelta.
- Todo `Input` de búsqueda lleva el ícono `Search` a la izquierda (`pl-9`).
- `Pagination` va **al final** del listado y solo si hay más de una página.
- El **Empty state** reemplaza al listado (no coexiste con cards) y siempre incluye la acción "Limpiar filtros".
- En mobile, el sidebar de filtros **siempre** se presenta como `Sheet` lateral con botón "Ver N resultados" fijo abajo.
- Las gráficas (`ChartCard`) **siempre** muestran `Skeleton` durante la carga antes de renderizar.
- Toda card clicable usa el patrón hover unificado: borde `primary/40` + `shadow-card` + título vira a `primary`.

### Espaciado fijo vs flexible
- **Fijos:** radio de badges/botones (`rounded-md`), radio de cards (`rounded-xl`), altura de navbar (`h-14`), offset sticky (`top-20`), ancho del contenedor (`max-w-6xl`).
- **Flexibles (responsive):** padding vertical de secciones (`py-14` → ajustable), padding del hero (`py-16 sm:py-24`), columnas de grid (1 → 2 → 3 según breakpoint ~`sm`/`lg`), ancho del sidebar (`w-64` desktop / full en Sheet).
- Breakpoint principal de colapso: **`lg` (~1024px)** — el sidebar de filtros pasa a drawer y los grids reducen columnas.

### Tipografía
- `font-mono` (Geist Mono) **solo** para: marca "laboro", números de métricas, tiempos ("Hace 3h"), y etiquetas técnicas. Nunca para párrafos.
- No superar peso 600. No usar `italic`.
- Respetar la jerarquía: una sola `H1` por página.
