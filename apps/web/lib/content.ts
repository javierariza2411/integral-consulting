export const SITE = {
  name: 'Integral Consulting SAS.',
  tagline: 'Estrategia financiera · Crecimiento sostenible',
  email: 'integralconsulting.sas@gmail.com',
  phone: '+57 321 494 6748',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '573214946748',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

export interface Service {
  slug: string; tag: string; title: string; summary: string; scope: string[]; deliverables: string[]; standards: string[]; sectors: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'consultoria-contable-financiera', tag: 'Información confiable', title: 'Consultoría contable y financiera',
    summary: 'Diagnóstico, implementación y fortalecimiento de procesos contables; preparación y análisis de estados financieros, políticas, cierres, consolidación y reportes gerenciales.',
    scope: ['Diagnóstico y fortalecimiento de procesos contables', 'Preparación y análisis de estados financieros', 'Políticas contables y cierres', 'Consolidación y reportes gerenciales', 'Acompañamiento a la administración'],
    deliverables: ['Diagnóstico con hoja de ruta priorizada', 'Políticas y procedimientos documentados', 'Estados financieros y reportes para la dirección'],
    standards: ['NIIF / IFRS', 'NIC / IAS'], sectors: ['Comercio y servicios', 'Grupos empresariales', 'Industrial y manufactura', 'Salud'],
  },
  {
    slug: 'auditoria-financiera-procesos', tag: 'Aseguramiento independiente', title: 'Auditoría financiera y de procesos',
    summary: 'Evaluación objetiva de la información financiera, los controles y los procesos. Identificamos riesgos, oportunidades de mejora y acciones concretas para elevar la confiabilidad de la operación.',
    scope: ['Auditoría de estados financieros', 'Auditoría de procesos y controles', 'Auditoría de proyectos de cooperación internacional', 'Identificación de riesgos y oportunidades de mejora'],
    deliverables: ['Informe ejecutivo de hallazgos', 'Plan de acción con responsables', 'Seguimiento a recomendaciones'],
    standards: ['NIA / ISA', 'Normas de trabajos de aseguramiento', 'Independencia, ética y escepticismo profesional'], sectors: ['ESAL y fundaciones', 'Cooperación internacional', 'Salud', 'Sector solidario'],
  },
  {
    slug: 'revisoria-fiscal', tag: 'Cumplimiento estratégico', title: 'Revisoría fiscal',
    summary: 'Ejercicio independiente de vigilancia y aseguramiento, con comunicación ejecutiva sobre hallazgos, cumplimiento, control interno y protección del interés de accionistas y terceros.',
    scope: ['Vigilancia y aseguramiento independiente', 'Evaluación del control interno', 'Verificación de cumplimiento legal y estatutario', 'Comunicación ejecutiva a socios, juntas y asambleas'],
    deliverables: ['Dictámenes e informes de ley', 'Cartas de recomendaciones de control interno', 'Alertas oportunas a la administración'],
    standards: ['NIA / ISA', 'COSO', 'Régimen aplicable a la entidad'], sectors: ['Salud', 'Sector solidario', 'Comercio y servicios', 'Entidades vigiladas'],
  },
  {
    slug: 'asesoria-tributaria', tag: 'Decisiones con impacto', title: 'Asesoría tributaria',
    summary: 'Planeación fiscal dentro del marco legal, revisión de obligaciones, atención de requerimientos, debida diligencia, diagnóstico de riesgos y estructuración de alternativas sostenibles.',
    scope: ['Planeación tributaria', 'Revisión de obligaciones fiscales', 'Atención de requerimientos de autoridades', 'Debida diligencia y diagnóstico de riesgos fiscales', 'Estructuración de alternativas sostenibles'],
    deliverables: ['Matriz de obligaciones y calendario', 'Diagnóstico de riesgo fiscal', 'Conceptos y alternativas documentadas'],
    standards: ['Estatuto Tributario', 'Doctrina y regulación aplicable', 'Requerimientos DIAN y autoridades territoriales'], sectors: ['ESAL', 'Comercio y servicios', 'Estrategias corporativas y transaccionales'],
  },
  {
    slug: 'control-interno-cumplimiento', tag: 'Control que habilita', title: 'Control interno y cumplimiento',
    summary: 'Diseño y evaluación de matrices de riesgo, controles preventivos y programas de cumplimiento como SAGRILAFT y PTEE, según la aplicabilidad de cada organización.',
    scope: ['Matrices de riesgo y controles preventivos', 'Programas SAGRILAFT y PTEE (cuando aplique)', 'Evaluación del sistema de control interno', 'Mapeo de obligaciones regulatorias'],
    deliverables: ['Matriz de riesgos y controles', 'Políticas y procedimientos de cumplimiento', 'Plan de implementación y seguimiento'],
    standards: ['COSO', 'SAGRILAFT', 'PTEE', 'Buenas prácticas de gobierno corporativo'], sectors: ['Entidades con exposición regulatoria', 'Grupos empresariales', 'Sector público'],
  },
  {
    slug: 'costos-cartera-auditoria-especializada', tag: 'Eficiencia operacional', title: 'Costos, cartera y auditoría especializada',
    summary: 'Costos industriales, gestión de cartera y glosas, auditoría médica y revisión de procesos para identificar fugas de valor y mejorar el desempeño.',
    scope: ['Costos industriales y de producción', 'Gestión de cartera y glosas', 'Auditoría médica', 'Revisión de procesos y fugas de valor'],
    deliverables: ['Modelo de costos', 'Diagnóstico de cartera y glosas', 'Plan de mejora con indicadores'],
    standards: ['Marco sectorial aplicable', 'NIIF para inventarios y costos'], sectors: ['Salud', 'Industrial y manufactura'],
  },
];

export const SECTORS = [
  { name: 'Salud', text: 'Auditoría médica, glosas, cartera, costos, control financiero y cumplimiento sectorial para IPS, EPS, clínicas y proveedores.', tags: ['Auditoría médica', 'Supersalud'] },
  { name: 'ESAL', text: 'Acompañamiento contable, tributario y de control para entidades sin ánimo de lucro, fundaciones, corporaciones y asociaciones.', tags: ['Donaciones', 'Régimen tributario'] },
  { name: 'Sector solidario', text: 'Gobierno, control, información financiera y cumplimiento para cooperativas, fondos de empleados y asociaciones mutuales.', tags: ['Cooperativas', 'Gobierno'] },
  { name: 'Estrategias corporativas y transaccionales', text: 'Adquisiciones, disposiciones, escisiones (spin-offs), empresas conjuntas (joint ventures), financiamientos, reorganizaciones y reestructuraciones.', tags: ['M&A', 'Reorganización'] },
  { name: 'Entidades con exposición regulatoria', text: 'Mapeo de obligaciones, matrices de cumplimiento y acompañamiento preventivo ante DIAN, UGPP, secretarías y superintendencias.', tags: ['Riesgo fiscal', 'Compliance'] },
  { name: 'Grupos empresariales y expansión', text: 'Consolidación, reportes para dirección, debida diligencia, análisis de riesgos y acompañamiento multijurisdiccional.', tags: ['NIIF', 'Consolidación'] },
  { name: 'Comercio y servicios', text: 'Control de ingresos, márgenes, flujo de caja, obligaciones tributarias y procesos para escalar con orden.', tags: ['Rentabilidad', 'Flujo de caja'] },
  { name: 'Sector público y entidades vigiladas', text: 'Control fiscal, información bajo marcos públicos y preparación para requerimientos de organismos de vigilancia.', tags: ['NICSP', 'CGN'] },
  { name: 'Industrial y manufactura', text: 'Costos de producción, inventarios, eficiencia operativa, control interno y lectura financiera para decisiones de inversión.', tags: ['Costos', 'Inventarios'] },
];

export const DIFFERENTIATORS = [
  ['Cumplimiento con criterio', 'Alineación con marcos contables, fiscales y sectoriales aplicables, traducida en controles útiles para la gestión.'],
  ['Transparencia financiera', 'Información clara, precisa y oportuna para socios, juntas, asambleas, inversionistas y administraciones.'],
  ['Prevención antes que reacción', 'Matrices de control y alertas para anticipar requerimientos, inexactitudes, sanciones y contingencias.'],
  ['Visión multidisciplinaria', 'Contabilidad, auditoría, tributario, derecho, auditoría médica, costos industriales y control fiscal en una sola conversación.'],
  ['Analítica para decidir mejor', 'Uso de datos y herramientas de inteligencia de negocios para enfocar riesgos, detectar patrones y priorizar acciones.'],
  ['Acompañamiento directivo', 'Atención cercana y personalizada, adaptada al sector, al tamaño y a la etapa de cada organización.'],
];

export const METHOD = [
  ['Entender', 'Conocemos la estrategia, el contexto regulatorio, los procesos y las prioridades de la dirección.'],
  ['Diagnosticar', 'Evaluamos riesgos, brechas, datos y controles con una mirada independiente y basada en evidencia.'],
  ['Diseñar', 'Construimos una hoja de ruta priorizada, con responsables, entregables y decisiones claras.'],
  ['Acompañar', 'Seguimos la implementación, medimos avances y ajustamos la solución a la evolución del negocio.'],
];

export const PRINCIPLES = [
  ['Confidencialidad', 'Protegemos la información.'], ['Integridad', 'Actuamos con coherencia.'], ['Adaptabilidad', 'Respondemos al contexto.'],
  ['Independencia', 'Decidimos con objetividad.'], ['Rigor técnico', 'Sustentamos cada conclusión.'], ['Ética', 'Cuidamos la confianza.'],
  ['Fe', 'Acreditamos la legalidad de los datos.'],
];

export const CASES = [
  { sector: 'Sector salud', title: 'ANAS WAYUU EPSI', role: 'Asesor externo · 2002–2003', text: 'Recuperación del estándar financiero y fortalecimiento patrimonial. Asesoría ejecutiva a una EPS indígena bajo medida especial de la Superintendencia Nacional de Salud, con foco en saneamiento financiero, fortalecimiento del patrimonio técnico y recuperación de la viabilidad institucional.' },
  { sector: 'Sector salud', title: 'COOPSACARIBE ARS', role: 'Fundador y responsable de la estructura contable, financiera y tributaria · 1999–2001', text: 'Estructuración y puesta en marcha de la arquitectura contable, financiera y tributaria. Participación en el cumplimiento de los requisitos regulatorios de patrimonio y afiliación, incluida la estructuración de una alternativa de financiación para viabilizar el inicio de operaciones.' },
  { sector: 'Sector salud', title: 'FUNDACIÓN TIEMPO DE VIDA IPS', role: 'Creación y consolidación institucional', text: 'Creación y consolidación de una IPS con experiencia en atención a pacientes con VIH-SIDA, artritis reumatoide y consultas especializadas. Fortalecimiento de la estructura para la prestación de servicios de salud y desarrollo de alianzas estratégicas con EPS.' },
];

export const INTERNATIONAL = [
  ['Noruega', 'Ministerio de Relaciones Exteriores: Programa “Transición a una Paz Arcoíris”', 'Auditorías 2021–2024'],
  ['España', 'Diakonia: “El trabajo comunitario para la construcción de paz LGBTI”', 'Auditoría 2020'],
  ['Estados Unidos', 'Fundación Interamericana: “Cualificación de capacidades locales para la paz en sectores sociales LGBT de la región Caribe”', 'Auditorías 2017–2019'],
];
