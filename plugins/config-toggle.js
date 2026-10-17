import { estaModoActivo, establecerEstadoModo } from '../lib/Modos/modo-utils.js'

const MODOS_EXCLUSIVOS = [
  'modoIA',
  'modoHot',
  'modoIlegal',
  'modoHuman',
  'modoSad',
  'modoPsico',
  'modoCustom',
]

function obtenerMapa(clave) {
  const actual = global.db.data[clave]
  if (!actual || typeof actual !== 'object' || Array.isArray(actual)) {
    global.db.data[clave] = {}
  }
  return global.db.data[clave]
}

function crearFeatureMapa(id, nombre, clave, aliases = []) {
  return {
    id,
    nombre,
    aliases: [id, ...aliases].map(alias => alias.toLowerCase()),
    estado: chat => global.db.data?.[clave]?.[chat] === true,
    cambiar: (chat, activo) => {
      obtenerMapa(clave)[chat] = activo
    },
  }
}

const FEATURES = [
  {
    id: 'welcome',
    nombre: 'Bienvenida y despedida',
    aliases: ['welcome', 'bienvenida', 'bienvenidas'],
    estado: chat => global.db.data?.bienvenidas?.[chat]?.enabled === true,
    cambiar: (chat, activo) => {
      const mapa = obtenerMapa('bienvenidas')
      const actual = mapa[chat]
      mapa[chat] = actual && typeof actual === 'object' && !Array.isArray(actual) ? actual : {}
      mapa[chat].enabled = activo
    },
  },
  crearFeatureMapa('antilink', 'Antilink', 'antiLink', ['anti-link']),
  crearFeatureMapa('antibot', 'Antibot', 'antiBot', ['antibots', 'nobots']),
  crearFeatureMapa('antiestados', 'Antiestados', 'antiEstados', ['antiestado', 'antistatus', 'antistatusmention']),
  crearFeatureMapa('cmd18', 'Comandos +18', 'cmd18', ['cmd+18', 'nsfwon']),
  {
    id: 'modohot',
    nombre: 'Modo Hot',
    aliases: ['modohot', 'hotmode', 'modosexy', 'hotai'],
    modo: 'modoHot',
    estado: chat => estaModoActivo('modoHot', chat),
    cambiar: (chat, activo) => establecerEstadoModo('modoHot', chat, activo),
  },
  {
    id: 'modoia',
    nombre: 'Modo IA',
    aliases: ['modoia', 'aimode', 'autoai', 'iamode'],
    modo: 'modoIA',
    estado: chat => estaModoActivo('modoIA', chat),
    cambiar: (chat, activo) => establecerEstadoModo('modoIA', chat, activo),
  },
]

const FEATURE_POR_ALIAS = new Map(
  FEATURES.flatMap(feature => feature.aliases.map(alias => [alias, feature]))
)

function estadoTexto(activo) {
  return activo ? 'Activo ✓' : 'Desactivado ✗'
}

function listarEstados(chat, usedPrefix) {
  const lineas = FEATURES.map(feature =>
    `> *${feature.nombre}* — ${estadoTexto(feature.estado(chat))}`
  )
  return [
    '⚙️ *Configuración del grupo*',
    ...lineas,
    '',
    `Usá ${usedPrefix}on <función> / ${usedPrefix}off <función> o ${usedPrefix}enable <función> / ${usedPrefix}disable <función>.`,
    `Funciones disponibles: ${FEATURES.map(feature => feature.id).join(', ')}.`,
  ].join('\n')
}

let handler = async (m, { usedPrefix, command, args, isOwner, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('[❗] Este comando solo funciona en grupos.')
  if (!isOwner && !isAdmin && !m.fromMe) {
    return m.reply('[❗] Solo el dueño o un administrador puede consultar o cambiar estos ajustes.')
  }

  const comando = String(command || '').toLowerCase()
  const nombreFuncion = String(args[0] || '').toLowerCase().trim()

  if (comando === 'on' && !nombreFuncion) {
    return m.reply(listarEstados(m.chat, usedPrefix))
  }

  if (!nombreFuncion) {
    return m.reply(`Uso: ${usedPrefix}${comando} <función>. Para ver los estados, escribí ${usedPrefix}on.`)
  }

  const feature = FEATURE_POR_ALIAS.get(nombreFuncion)
  if (!feature) {
    return m.reply(`Función no disponible. Escribí ${usedPrefix}on para ver las compatibles.`)
  }

  const activo = comando === 'on' || comando === 'enable'
  if (!isBotAdmin) {
    return m.reply('[❗] El bot debe ser administrador del grupo para cambiar estos ajustes.')
  }

  if (feature.modo && activo) {
    const otroModoActivo = MODOS_EXCLUSIVOS.find(modo =>
      modo !== feature.modo && estaModoActivo(modo, m.chat)
    )
    if (otroModoActivo) {
      return m.reply(`[❗] Ya hay otro modo activo (${otroModoActivo}). Desactivalo antes de prender ${feature.id}.`)
    }
  }

  feature.cambiar(m.chat, activo)
  await global.db.write()
  return m.reply(`⚙️ *${feature.nombre}:* ${estadoTexto(activo)}`)
}

handler.help = ['on', 'off', 'enable', 'disable']
handler.tags = ['group']
handler.command = ['on', 'off', 'enable', 'disable']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
