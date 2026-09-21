const CATEGORIAS = [
  { id: "techo", nombre: "Lámparas de Techo" },
  { id: "smart", nombre: "Iluminación Smart" },
  { id: "exterior", nombre: "Iluminación Exterior" },
  { id: "adornos", nombre: "Adornos" }
];

const PRODUCTOS = [
  { codigo: "LMP-001", nombre: "Lámpara Colgante Nordic Oak", categoria: "techo", precio: 45990, stock: 14, stockCritico: 3,
    descripcion: "Lámpara colgante de madera clara y pantalla de lino, ideal para comedores minimalistas. Emite una luz cálida y difusa que resalta la textura del ambiente.", imagen: "../img/techo 1.jpg" },
  { codigo: "LMP-002", nombre: "Plafón LED Aura Redondo", categoria: "techo", precio: 32990, stock: 22, stockCritico: 5,
    descripcion: "Plafón LED de bajo perfil con luz regulable en tres tonalidades, perfecto para dormitorios y pasillos.", imagen: "../img/techo 2.jpg" },
  { codigo: "LMP-003", nombre: "Araña Moderna Cristal Line", categoria: "techo", precio: 89990, stock: 3, stockCritico: 3,
    descripcion: "Lámpara araña de líneas de cristal y estructura en bronce cepillado, pieza central para living o hall de entrada.", imagen: "../img/techo 3.jpg" },
  { codigo: "LMP-004", nombre: "Riel de Focos Orientables Track", categoria: "techo", precio: 39990, stock: 10, stockCritico: 4,
    descripcion: "Sistema de riel con 3 focos orientables, ideal para iluminar cuadros, repisas o zonas de trabajo.", imagen: "../img/techo 4.jpg" },
  { codigo: "SMT-001", nombre: "Ampolleta Smart RGB WiFi", categoria: "smart", precio: 12990, stock: 40, stockCritico: 8,
    descripcion: "Ampolleta inteligente compatible con app móvil y asistentes de voz, más de 16 millones de colores.", imagen: "../img/smart 1.jpg" },
  { codigo: "SMT-002", nombre: "Tira LED Smart 5m", categoria: "smart", precio: 18990, stock: 25, stockCritico: 6,
    descripcion: "Tira LED RGB de 5 metros con control por app, ideal para ambientar veladores, muebles o cielos falsos.", imagen: "../img/smart 2.jpg" },
  { codigo: "SMT-003", nombre: "Enchufe Inteligente con Dimmer", categoria: "smart", precio: 9990, stock: 30, stockCritico: 6,
    descripcion: "Enchufe WiFi con control de intensidad para transformar cualquier lámpara en un dispositivo inteligente.", imagen: "../img/smart 3.jpg" },
  { codigo: "SMT-004", nombre: "Panel Smart Modular Hexagonal", categoria: "smart", precio: 54990, stock: 8, stockCritico: 3,
    descripcion: "Paneles hexagonales táctiles que se combinan libremente en el muro, sincronizables con música.", imagen: "../img/smart 4.jpg" },
  { codigo: "EXT-001", nombre: "Foco Solar Jardín Pathway", categoria: "exterior", precio: 7990, stock: 50, stockCritico: 10,
    descripcion: "Foco solar resistente al agua para senderos de jardín, encendido automático al anochecer.", imagen: "../img/exterior 1.jpg" },
  { codigo: "EXT-002", nombre: "Farol Exterior Minimalista", categoria: "exterior", precio: 24990, stock: 16, stockCritico: 4,
    descripcion: "Farol de pared en aluminio negro mate, certificado IP44 para exteriores.", imagen: "../img/exterior 2.jpg" },
  { codigo: "EXT-003", nombre: "Guirnalda LED Exterior 10m", categoria: "exterior", precio: 15990, stock: 20, stockCritico: 5,
    descripcion: "Guirnalda de luces cálidas resistente a la intemperie, perfecta para terrazas y patios.", imagen: "../img/exterior 3.jpg" },
  { codigo: "ADR-001", nombre: "Jarrón Cerámico Terracota", categoria: "adornos", precio: 14990, stock: 18, stockCritico: 4,
    descripcion: "Jarrón decorativo de cerámica artesanal en tono terracota, disponible en dos tamaños.", imagen: "../img/adorno 1.jpg" },
  { codigo: "ADR-002", nombre: "Espejo Decorativo Redondo", categoria: "adornos", precio: 27990, stock: 12, stockCritico: 3,
    descripcion: "Espejo circular con marco de bambú natural, aporta luminosidad y amplitud visual a cualquier ambiente.", imagen: "../img/adorno 2.jpg" },
  { codigo: "ADR-003", nombre: "Set Velas Aromáticas x3", categoria: "adornos", precio: 11990, stock: 35, stockCritico: 8,
    descripcion: "Set de tres velas de cera de soya con aromas madera, vainilla y cítrico, en frascos reutilizables.", imagen: "../img/adorno 3.jpg" }
];

function formatCLP(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

function obtenerProducto(codigo) {
  for (let i = 0; i < PRODUCTOS.length; i++) {
    if (PRODUCTOS[i].codigo === codigo) {
      return PRODUCTOS[i];
    }
  }
  return null;
}

function obtenerNombreCategoria(id) {
  for (let i = 0; i < CATEGORIAS.length; i++) {
    if (CATEGORIAS[i].id === id) {
      return CATEGORIAS[i].nombre;
    }
  }
  return id;
}

const BLOGS = [
  {
    imagen: "../img/blog 1.jpg",
    id: "temperatura-luz-descanso",
    titulo: "Cómo la temperatura de luz afecta tu descanso diario",
    resumen: "La luz cálida o fría de tus lámparas influye directamente en tu ritmo circadiano y en la calidad de tu sueño. Te contamos cómo elegirla bien.",
    cuerpo: [
      "La temperatura de color de una ampolleta se mide en grados Kelvin (K) y determina si la luz se percibe cálida, neutra o fría. Este factor, muchas veces ignorado al decorar, tiene un impacto directo en nuestro reloj biológico.",
      "Las luces cálidas (2700K–3000K) imitan el tono anaranjado del atardecer y favorecen la producción de melatonina, la hormona del sueño. Por eso son ideales para dormitorios, veladores y livings donde se busca relajación en la noche.",
      "Las luces neutras (3500K–4500K) equilibran calidez y claridad, y funcionan bien en cocinas o zonas de trabajo donde se necesita buena visibilidad sin perder confort visual.",
      "Las luces frías (5000K en adelante) simulan la luz del mediodía y estimulan el estado de alerta. Son útiles en oficinas o talleres, pero se recomienda evitarlas un par de horas antes de dormir.",
      "En Lumina Home recomendamos combinar distintas temperaturas según el momento del día: usa iluminación smart regulable para pasar de una luz activa durante el día a una cálida y tenue en la noche, cuidando así tu descanso de forma automática."
    ]
  },
  {
    imagen: "../img/blog 2.jpg",
    id: "tendencias-iluminacion-minimalista",
    titulo: "Tendencias en iluminación minimalista para este año",
    resumen: "Líneas limpias, materiales naturales y control inteligente: así se ve la iluminación minimalista que está marcando tendencia en los hogares.",
    cuerpo: [
      "El minimalismo en iluminación no significa menos luz, sino luz con intención. Este año las tendencias apuntan a piezas funcionales que también son objetos de diseño.",
      "1. Formas geométricas simples: esferas, cilindros y líneas rectas reemplazan las estructuras recargadas, aportando orden visual a los espacios.",
      "2. Materiales naturales: madera clara, lino, cerámica y metales mate se combinan con LEDs cálidos para lograr ambientes acogedores sin perder sobriedad.",
      "3. Iluminación por capas: en vez de un solo punto de luz central, se recomienda combinar luz general, de acento y de tarea, todas controlables de forma independiente.",
      "4. Control inteligente integrado: paneles y ampolletas smart permiten ajustar intensidad y color desde el celular, adaptando la atmósfera sin agregar más objetos visibles.",
      "5. Exteriores con la misma sobriedad: faroles y guirnaldas de líneas simples extienden el lenguaje minimalista del interior hacia patios y terrazas."
    ]
  }
];

function obtenerBlog(id) {
  for (let i = 0; i < BLOGS.length; i++) {
    if (BLOGS[i].id === id) {
      return BLOGS[i];
    }
  }
  return null;
}

const REGIONES_CHILE = [
  { region: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { region: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Huara", "Camiña", "Colchane", "Pica"] },
  { region: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "San Pedro de Atacama", "Tocopilla", "María Elena"] },
  { region: "Atacama", comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco"] },
  { region: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Andacollo", "Vicuña", "Illapel", "Los Vilos", "Ovalle", "Combarbalá", "Monte Patria"] },
  { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes", "San Felipe", "Quillota", "La Ligua", "Isla de Pascua"] },
  { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Puente Alto", "San Bernardo", "Vitacura", "Lo Barnechea", "Peñalolén", "La Reina", "Macul", "Independencia", "Recoleta", "Melipilla", "Talagante", "Colina"] },
  { region: "Libertador Gral. Bernardo O'Higgins", comunas: ["Rancagua", "Machalí", "Rengo", "San Fernando", "Santa Cruz", "Pichilemu", "Graneros"] },
  { region: "Maule", comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "San Javier", "Molina"] },
  { region: "Ñuble", comunas: ["Chillán", "Chillán Viejo", "Bulnes", "San Carlos", "Quirihue", "Yungay"] },
  { region: "Biobío", comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Coronel", "Los Ángeles", "Lota", "Hualpén", "Arauco", "Cañete"] },
  { region: "La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria", "Nueva Imperial"] },
  { region: "Los Ríos", comunas: ["Valdivia", "La Unión", "Panguipulli", "Río Bueno", "Futrono", "Lanco"] },
  { region: "Los Lagos", comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón", "Frutillar", "Chonchi"] },
  { region: "Aysén del Gral. Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Aysén", "Chile Chico", "Cochrane"] },
  { region: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

const USUARIOS_SEED = [
  { run: "199608584", nombre: "Abraham", apellidos: "Herrera", correo: "ab.herreraa@duoc.cl", password: "admin123",
    fechaNacimiento: "1998-11-13", tipoUsuario: "administrador", region: "Región Metropolitana de Santiago", comuna: "Puente alto",
    direccion: "Cabo virgenes 2178" },
  { run: "179654326", nombre: "Matías", apellidos: "Reyes Contreras", correo: "matias.reyes@luminahome.cl", password: "vendedor123",
    fechaNacimiento: "1995-09-03", tipoUsuario: "vendedor", region: "Valparaíso", comuna: "Viña del Mar",
    direccion: "3 Norte 456" },
  { run: "203456786", nombre: "Camila", apellidos: "Ibáñez Rojas", correo: "camila.ibanez@gmail.com",
    fechaNacimiento: "1998-01-20", tipoUsuario: "cliente", region: "Biobío", comuna: "Concepción",
    direccion: "Los Carrera 2340" }
];

function buscarUsuarioPorCredenciales(correo, password) {
  const limpio = correo.trim().toLowerCase();
  for (let i = 0; i < USUARIOS_SEED.length; i++) {
    if (USUARIOS_SEED[i].correo.toLowerCase() === limpio && USUARIOS_SEED[i].password === password) {
      return USUARIOS_SEED[i];
    }
  }
  return null;
}
