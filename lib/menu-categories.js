import fs from 'fs'
import { join } from 'path'
import os from 'os'
import { getMenuRentalLine } from './alquiler.js'
import { formatBotUptime } from './bot-uptime.js'
import { findGroupParticipant, candidatosJidRemitente, jidsSeSolapan } from './group-participant.js'
import { isMainBotConn, cleanBotNum } from '../plugins/modo-sub.js'
import { getStaffOwnerIds } from './staff.js'
import { construirBotonSoporte, obtenerLinkSoporte } from './soporte.js'

export const PREFIJO_FILA_MENU = 'painmenu_'
export const TEXTO_BOTON_MENU = 'ã€Œ ð—©ð—˜ð—¥ ð— ð—˜ð—¡ð—¨Ì ð—–ð—¢ð— ð—£ð—Ÿð—˜ð—§ð—¢ ã€'

const cmd = (p, name) => `> ãƒ» ${p}${name}`
const encabezadoSeccion = (name) => `ãƒ¼ ${name} ãƒ¼`
const filaSelector = (name) => `ãƒ» ${name}`
const grupoSelector = (name) => `ãƒ¼ ${name} ãƒ¼`
const pistaSelector = (text) => `ã€œ ${text}`

function seccionOwners(p, ctx) {
  const lÃ­neasSoporte = ctx?.esPrincipal
    ? `\n${cmd(p, 'soporte <link>')}\n${cmd(p, 'soporte del')}`
    : ''
  return `${encabezadoSeccion('ð™¾ðš†ð™½ð™´ðšðš‚')}
${cmd(p, 'mod @usuario / numero / lid')}
${cmd(p, 'mod del @usuario')}
${cmd(p, 'mod lista')}
_(staff por bot: principal â‰  subbots Â· owners de config en todos)_
${cmd(p, 'verplugin <nombre.js>')}
${cmd(p, 'replugin <nombre.js>')}
${cmd(p, 'addplugin <nombre.js>')}
${cmd(p, 'nameplugins <archivo.js> > <nuevo.js>')}
${cmd(p, 'update')}
${cmd(p, 'restart')}
${cmd(p, 'setvist on/off')}
${cmd(p, 'subme <mensaje>')}
${cmd(p, 'join <link>')}
${cmd(p, 'exit')}
${cmd(p, 'one 1h')}
${cmd(p, 'one infinito')}
${cmd(p, 'one oficial')}${lÃ­neasSoporte}`.trim()
}

function seccionAdmins(p) {
  return `${encabezadoSeccion('ð™°ð™³ð™¼ð™¸ð™½ðš‚')}
${cmd(p, 'ban @usuario / responder')}
${cmd(p, 'sban â†’ sticker ban (responder sticker)')}
${cmd(p, 'sban del / ver')}
${cmd(p, 'promote @usuario / responder')}
${cmd(p, 'demote @usuario / responder')}
${cmd(p, 'warn @usuario / responder')}
${cmd(p, 'delwarn @usuario / responder')}
${cmd(p, 'warnings @usuario / responder')}
${cmd(p, 'tag')}
${cmd(p, 'clas 3|13')}
${cmd(p, 'clas lista')}
${cmd(p, 'clas libres')}
${cmd(p, 'clas ocupados')}
${cmd(p, 'clas cupo @conEquipo @libre')}
${cmd(p, 'clas quitar @usuario')}
${cmd(p, 'clas mover @usuario N')}
${cmd(p, 'clas reset')}
${cmd(p, 'mute @usuario / responder')}
${cmd(p, 'delmute @usuario / responder')}
${cmd(p, 'temp <mensaje> <tiempo>')}
${cmd(p, 'open')}
${cmd(p, 'close')}
${cmd(p, 'delete')}
${cmd(p, 'fijar')}
${cmd(p, 'desfijar')}
${cmd(p, 'namegp <nombre>')}
${cmd(p, 'desgp <descripciÃ³n>')}
${cmd(p, 'photogp')}
${cmd(p, 'adg <numero>')}
${cmd(p, 'grupo on/off')}
${cmd(p, 'modosub')}
${cmd(p, 'modosub <n>')}
${cmd(p, 'modosub all')}
${cmd(p, 'antilink on/off')}
${cmd(p, 'antiimg on/off')}
${cmd(p, 'antiaudio on/off')}
${cmd(p, 'antivideo on/off')}
${cmd(p, 'antisticker on/off')}
${cmd(p, 'antispam on/off')}
${cmd(p, 'antibot on/off')}
${cmd(p, 'antiestados on/off')}
${cmd(p, 'antidelete on/off')}
${cmd(p, 'antis')}
${cmd(p, 'anticontact on/off')}
${cmd(p, 'antimention on/off')}
${cmd(p, 'antidocument on/off')}
${cmd(p, 'antipalabra on/off')}
${cmd(p, 'antipalabra add <palabra>')}
${cmd(p, 'antipalabra <palabra>')}
${cmd(p, 'antipalabra action delete|kick')}
${cmd(p, 'anticaracter on/off <limite>')}
${cmd(p, 'antiprefijo on/off')}
${cmd(p, 'soloadmin on/off')}
${cmd(p, 'welcome on/off')}
${cmd(p, 'modoia on/off')}
${cmd(p, 'modohot on/off')}
${cmd(p, 'modoilegal on/off')}
${cmd(p, 'modohuman on/off')}
${cmd(p, 'modosad on/off')}
${cmd(p, 'modospico on/off')}
${cmd(p, 'modo nombre|prompt')}
${cmd(p, 'modo nombre|prompt|ban,del,mute,warn,delwarn')}
${cmd(p, 'modo nombre|prompt|all')}
${cmd(p, 'modo off')}
${cmd(p, 'mododescargas on/off')}
${cmd(p, 'cmd18 on/off')}`.trim()
}

function seccionSubBot(p) {
  return `${encabezadoSeccion('ð™²ð™¼ð™³ ðš‚ðš„ð™± ð™±ð™¾ðšƒ')}
${cmd(p, 'qr')}
${cmd(p, 'code')}
${cmd(p, 'bots')}
${cmd(p, 'botinfo')}
${cmd(p, 'reconnect')}
${cmd(p, 'setbotname')}
${cmd(p, 'setbotimg')}
${cmd(p, 'setautoread')}
${cmd(p, 'delsubbot nÃºmero confirmar')}
${cmd(p, 'ds')}`.trim()
}

function seccionJuegosRpg(p) {
  return `${encabezadoSeccion('ð™¶ð™°ð™¼ð™´ðš‚ ðšð™¿ð™¶')}
${cmd(p, 'balance')}
${cmd(p, 'bal')}
${cmd(p, 'coins')}
${cmd(p, 'transf @usuario <cantidad>')}
${cmd(p, 'dado')}
${cmd(p, 'daily / dda')}
${cmd(p, 'adivinanza')}
${cmd(p, 'pescar')}
${cmd(p, 'michi @usuario')}
${cmd(p, 'miner @usuario')}
${cmd(p, 'bomba @usuario [apuesta]')}
${cmd(p, 'bomba [apuesta] @usuario')}
${cmd(p, 'slot <cantidad>')}
${cmd(p, 'ruleta <rojo/negro/par/impar/0-36> <cantidad USD>')}
${cmd(p, 'moneda <cara/sello> <cantidad>')}
${cmd(p, 'work')}
${cmd(p, 'suerte')}
${cmd(p, 'banco')}
${cmd(p, 'deposit <cantidad/all>')}
${cmd(p, 'withdraw <cantidad/all>')}
${cmd(p, 'change <banco>')}
${cmd(p, 'unirsebank <banco>')}
${cmd(p, 'robar')}
${cmd(p, 'sorpresa')}
${cmd(p, 'w / rw')}
${cmd(p, 'claim / c')}
${cmd(p, 'harem')}
${cmd(p, 'vharem <nÂ°>')}
${cmd(p, 'darhr @user <nÂ°>')}
${cmd(p, 'vender <nÂ°> <precio>')}
${cmd(p, 'cancelarg <orden>')}
${cmd(p, 'tiendag')}
${cmd(p, 'comprarg <orden>')}
${cmd(p, 'topharem / gacha')}`.trim()
}

function seccionPerfil(p) {
  return `${encabezadoSeccion('ð™¿ð™´ðšð™µð™¸ð™» ðšð™¿ð™¶')}
${cmd(p, 'perfil')}
${cmd(p, 'setbirth <fecha>')}
${cmd(p, 'setdesc <descripciÃ³n>')}
${cmd(p, 'setfav <personaje>')}
${cmd(p, 'setgenre <hombre/mujer>')}
${cmd(p, 'birthdays')}
${cmd(p, 'setname <nombre>')}
`.trim()
}

function seccionTop(p) {
  return `${encabezadoSeccion('ðšƒð™¾ð™¿ ðšð™¿ð™¶')}
${cmd(p, 'topcoins')}
${cmd(p, 'topharem / gacha')}
${cmd(p, 'topinactivos')}
${cmd(p, 'topactivos')}`.trim()
}

function seccionBusquedas(p) {
  return `${encabezadoSeccion('ð™±ðš„ðš‚ðš€ðš„ð™´ð™³ð™°ðš‚')}
${cmd(p, 'google <bÃºsqueda>')}
${cmd(p, 'yt <bÃºsqueda>')}
${cmd(p, 'tiktok <bÃºsqueda/link>')}
${cmd(p, 'tiktok2 <bÃºsqueda/link>')}
${cmd(p, 'scsearch <bÃºsqueda>')}
${cmd(p, 'ly <canciÃ³n>')}
${cmd(p, 'onlyfans <username>')}
${cmd(p, 'imagen <busqueda>')}
${cmd(p, 'pixabay <tema>')}
${cmd(p, 'wall <busqueda>')}
${cmd(p, 'pinterest <busqueda>')}
${cmd(p, 'bsticker <busqueda>')}`.trim()
}

function seccionOsint(p) {
  return `${encabezadoSeccion('ð™¾ðš‚ð™¸ð™½ðšƒ - ð™±ð™´ðšƒð™°')}
${cmd(p, 'ip <direcciÃ³n IP>')}
${cmd(p, 'ip2 <direcciÃ³n IP>')}
${cmd(p, 'sher <nombre/apodo>')}
${cmd(p, 'webinfo <URL>')}
${cmd(p, 'tik <@usuario>')}`.trim()
}

function seccionIA(p) {
  return `${encabezadoSeccion('ð™¸ð™½ðšƒð™´ð™»ð™¸ð™¶ð™´ð™½ð™²ð™¸ð™° ð™°.ð™¸')}
${cmd(p, 'gemini <texto>')}
${cmd(p, 'chatgpt <texto>')}
${cmd(p, 'kora <texto>')}
${cmd(p, 'replia <texto>')}
${cmd(p, 'copilot <texto>')}
${cmd(p, 'animg <texto>')}`.trim()
}

function seccionDescargas(p) {
  return `${encabezadoSeccion('ð™³ð™´ðš‚ð™²ð™°ðšð™¶ð™°ðš‚')}
${cmd(p, 'play <bÃºsqueda/url>')}
${cmd(p, 'sc <bÃºsqueda/url/nÃºmero>')}
${cmd(p, 'play2 <bÃºsqueda>')}
${cmd(p, 'aptoide <app>')}
${cmd(p, 'git <url>')}
${cmd(p, 'tiktok2 <link>')}
${cmd(p, 'fb <link>')}
${cmd(p, 'ig <link>')}
${cmd(p, 'igs <bÃºsqueda>')}
${cmd(p, 'ytvideo <link>')}`.trim()
}

function seccionReacciones(p) {
  return `${encabezadoSeccion('ðšð™´ð™°ð™²ð™²ð™¸ð™¾ð™½ð™´ðš‚')}
${cmd(p, 'reir')}
${cmd(p, 'happy')}
${cmd(p, 'sad')}
${cmd(p, 'angry')}
${cmd(p, 'dance')}
${cmd(p, 'slap @usuario')}
${cmd(p, 'kiss @usuario')}
${cmd(p, 'hug @usuario')}`.trim()
}

function seccionAdicionales(p) {
  return `${encabezadoSeccion('ð™°ð™³ð™¸ð™²ð™¸ð™¾ð™½ð™°ð™»ð™´ðš‚')}
${cmd(p, 'nota <contenido>')}
${cmd(p, 'delnota <numero>')}
${cmd(p, 'vernotas')}
${cmd(p, 'id')}
${cmd(p, 'infogrupo')}
${cmd(p, 'traducir')}
${cmd(p, 'speed <audio>')}
${cmd(p, 'slow <audio>')}
${cmd(p, 'audio <video>')}
${cmd(p, 'sss <imagen/video ver una vez>')}
${cmd(p, 'ssa <audio/nota de voz una vez>')}
${cmd(p, 'text <imagen/sticker>')}
${cmd(p, 'pdf <imagen/sticker> nombre')}
${cmd(p, 'tepdf <responder texto/img> nombre')}
${cmd(p, 'resize <imagen/sticker> 800x600')}
${cmd(p, 'ge o gr <texto/enlace/imagen>')}
${cmd(p, 'leerqr <imagen con QR>')}
${cmd(p, 'hd <imagen/sticker>')}
${cmd(p, 'ssimg <foto> tÃ­tulo|artista')}
${cmd(p, 'sfimg <foto> texto')}
${cmd(p, 'imgay <foto> texto')}
${cmd(p, 'tts <texto>')}
${cmd(p, 'stt <nota de voz/audio>')}
${cmd(p, 'cat <texto>')}`.trim()
}

function seccionStickers(p) {
  return `${encabezadoSeccion('ðš‚ðšƒð™¸ð™²ð™ºð™´ðšðš‚')}
${cmd(p, 'sticker')}
${cmd(p, 'st <texto>')}
${cmd(p, 'brat <texto>')}
${cmd(p, 'sgay <foto> texto')}
${cmd(p, 'sw <responder/@user> texto')}
${cmd(p, 'toimg')}
${cmd(p, 'delmeta nombre|autor')}
${cmd(p, 'setmeta pack | autor')}
${cmd(p, 'delstickermeta')}`.trim()
}

function seccionDiversion(p) {
  return `${encabezadoSeccion('ð™³ð™¸ðš…ð™´ðšðš‚ð™¾ð™½')}
${cmd(p, 'top <nombre>|emoji')}
${cmd(p, 'topgays')}
${cmd(p, 'topfeos')}
${cmd(p, 'toplindos')}
${cmd(p, 'topburros')}
${cmd(p, 'topmachos')}
${cmd(p, 'topparejas')}
${cmd(p, 'toppajeros')}
${cmd(p, 'topmancos')}
${cmd(p, 'topinfieles')}
${cmd(p, 'topfieles')}
${cmd(p, 'topotakus')}
${cmd(p, 'topfemboys')}
${cmd(p, 'toptrans')}
${cmd(p, 'topfracasados')}
${cmd(p, 'topingenieros')}
${cmd(p, 'meme')}
${cmd(p, 'snake')}
${cmd(p, 'dino')}
${cmd(p, 'mem')}
${cmd(p, 'personalidad @usuario')}
${cmd(p, 'ship @usuario')}`.trim()
}

function seccionNsfw(p) {
  return `${encabezadoSeccion('ð™½ðš‚ð™µðš†')}
${cmd(p, 'cmd18 on/off')}
${cmd(p, 'waifu')}
${cmd(p, 'waifu2')}
${cmd(p, 'neko')}
${cmd(p, 'corean')}
${cmd(p, 'tik18')}
${cmd(p, 'tetas')}
${cmd(p, 'girls')}
${cmd(p, 'xnxx <url>')}
${cmd(p, 'xnxx <bÃºsqueda>')}
${cmd(p, 'hentai <url>')}
${cmd(p, 'hentai <bÃºsqueda>')}
${cmd(p, 'xvideos <url>')}
${cmd(p, 'xvideos <bÃºsqueda>')}`.trim()
}

const GRUPOS_CATEGORIA = [
  { title: grupoSelector('ðš‚ðšƒð™°ð™µð™µ'), ids: ['creador', 'owners', 'admins'] },
  { title: grupoSelector('ðšð™¿ð™¶'), ids: ['juegos', 'perfil', 'top'] },
  { title: grupoSelector('ðš„ðšƒð™¸ð™»ð™¸ð™³ð™°ð™³ð™´ðš‚'), ids: ['busquedas', 'osint', 'ia', 'descargas'] },
  { title: grupoSelector('ð™¼ð™´ð™³ð™¸ð™°'), ids: ['reacciones', 'stickers', 'adicionales'] },
  { title: grupoSelector('ð™´ðš‡ðšƒðšð™°ðš‚'), ids: ['subbot', 'diversion', 'nsfw'] },
]

const DEFS_CATEGORIA = [
  { id: 'owners', label: 'ð™¾ðš†ð™½ð™´ðšðš‚', hint: 'gestiÃ³n del bot', roles: ['owner'], body: seccionOwners },
  { id: 'creador', label: 'ðŸ‘‘ CREADOR', hint: 'contacto oficial', roles: ['all'], body: (p) => 'Contacto oficial: ' + cmd(p, 'owner') },
  { id: 'admins', label: 'ð™°ð™³ð™¼ð™¸ð™½ðš‚', hint: 'moderaciÃ³n grupal', roles: ['owner', 'admin'], body: seccionAdmins },
  { id: 'subbot', label: 'ðš‚ðš„ð™± ð™±ð™¾ðšƒ', hint: 'qr Â· bots Â· config', roles: ['all'], body: seccionSubBot },
  { id: 'juegos', label: 'ð™¶ð™°ð™¼ð™´ðš‚ ðšð™¿ð™¶', hint: 'economÃ­a Â· gacha Â· casino', roles: ['all'], body: seccionJuegosRpg },
  { id: 'perfil', label: 'ð™¿ð™´ðšð™µð™¸ð™»', hint: 'tu perfil rpg', roles: ['all'], body: seccionPerfil },
  { id: 'top', label: 'ðšƒð™¾ð™¿', hint: 'rankings', roles: ['all'], body: seccionTop },
  { id: 'busquedas', label: 'ð™±ðš„ðš‚ðš€ðš„ð™´ð™³ð™°ðš‚', hint: 'google Â· yt Â· tiktok', roles: ['all'], body: seccionBusquedas },
  { id: 'osint', label: 'ð™¾ðš‚ð™¸ð™½ðšƒ', hint: 'ip Â· sherlock', roles: ['all'], body: seccionOsint },
  { id: 'ia', label: 'ð™¸ð™°', hint: 'gemini Â· chatgpt', roles: ['all'], body: seccionIA },
  { id: 'descargas', label: 'ð™³ð™´ðš‚ð™²ð™°ðšð™¶ð™°ðš‚', hint: 'play Â· ig Â· fb', roles: ['all'], body: seccionDescargas },
  { id: 'reacciones', label: 'ðšð™´ð™°ð™²ð™²ð™¸ð™¾ð™½ð™´ðš‚', hint: 'gifs Â· acciones', roles: ['all'], body: seccionReacciones },
  { id: 'adicionales', label: 'ð™°ð™³ð™¸ð™²ð™¸ð™¾ð™½ð™°ð™»ð™´ðš‚', hint: 'notas Â· tts Â· pdf', roles: ['all'], body: seccionAdicionales },
  { id: 'stickers', label: 'ðš‚ðšƒð™¸ð™²ð™ºð™´ðšðš‚', hint: 'crear Â· editar', roles: ['all'], body: seccionStickers },
  { id: 'diversion', label: 'ð™³ð™¸ðš…ð™´ðšðš‚ð™¸ð™¾ð™½', hint: 'tops Â· memes', roles: ['all'], body: seccionDiversion },
  { id: 'nsfw', label: 'ð™½ðš‚ð™µðš†', hint: '+18 Â· cmd18', roles: ['all'], body: seccionNsfw },
]

export function obtenerIdCategoriaMenu(rowId) {
  if (!rowId || !String(rowId).startsWith(PREFIJO_FILA_MENU)) return null
  return String(rowId).slice(PREFIJO_FILA_MENU.length)
}

export function extraerIdFilaListaMenu(m) {
  return (
    m?.msg?.singleSelectReply?.selectedRowId ||
    m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    (m?.mtype === 'listResponseMessage' && m?.msg?.singleSelectReply?.selectedRowId) ||
    ''
  )
}

export function extraerIdSeleccionMenu(m) {
  const filaLista = extraerIdFilaListaMenu(m)
  if (filaLista) return filaLista

  const flujoNativo =
    m?.msg?.nativeFlowResponseMessage ||
    m?.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (flujoNativo?.paramsJson) {
    const id = parsearIdPainMenuDeJson(flujoNativo.paramsJson)
    if (id) return id
  }

  const idBoton =
    m?.msg?.selectedButtonId ||
    m?.message?.buttonsResponseMessage?.selectedButtonId
  if (idBoton) return idBoton

  const idProfundo = buscarIdPainMenuProfundo(m?.message || m)
  if (idProfundo) return idProfundo

  return ''
}

function parsearIdPainMenuDeJson(crudo) {
  if (!crudo) return ''
  try {
    const parseado = typeof crudo === 'string' ? JSON.parse(crudo) : crudo
    const candidatos = [
      parseado?.id,
      parseado?.main_arg,
      parseado?.selected_id,
      parseado?.selectedRowId,
      parseado?.rowId,
    ]
    for (const valor of candidatos) {
      if (valor && String(valor).startsWith(PREFIJO_FILA_MENU)) {
        return String(valor)
      }
    }
  } catch {}
  return ''
}

function buscarIdPainMenuProfundo(valor, profundidad = 0) {
  if (!valor || profundidad > 10) return ''
  if (typeof valor === 'string') {
    if (valor.startsWith(PREFIJO_FILA_MENU)) return valor
    const desdeJson = parsearIdPainMenuDeJson(valor)
    if (desdeJson) return desdeJson
    return ''
  }
  if (Array.isArray(valor)) {
    for (const item of valor) {
      const encontrado = buscarIdPainMenuProfundo(item, profundidad + 1)
      if (encontrado) return encontrado
    }
    return ''
  }
  if (typeof valor === 'object') {
    for (const clave of Object.keys(valor)) {
      const encontrado = buscarIdPainMenuProfundo(valor[clave], profundidad + 1)
      if (encontrado) return encontrado
    }
  }
  return ''
}

function crearIdsOwner(number) {
  const numeroLimpio = String(number).replace(/[^0-9]/g, '')
  if (!numeroLimpio) return []
  return [
    numeroLimpio + '@s.whatsapp.net',
    numeroLimpio + '@lid',
    numeroLimpio + '@hosted.lid'
  ]
}

/** Convierte global.prefix (RegExp) a texto visible: ".", "/" etc. */
export function formatearPrefijoVisible(prefix, fallback = '.') {
  if (!prefix) return fallback
  if (typeof prefix === 'string') return prefix
  if (Array.isArray(prefix)) {
    for (const item of prefix) {
      const formateado = formatearPrefijoVisible(item, '')
      if (formateado) return formateado
    }
    return fallback
  }
  if (prefix instanceof RegExp) {
    const coincidencia = prefix.source.match(/^\^\[((?:\\.|[^\]\\])+)\]/)
    if (coincidencia) {
      const chars = coincidencia[1].replace(/\\(.)/g, '$1').split('')
      if (chars.includes('.')) return '.'
      if (chars.includes('/')) return '/'
      return chars[0] || fallback
    }
    return fallback
  }
  return fallback
}

export async function resolverContextoMenu(m, conn, usedPrefix) {
  usedPrefix = formatearPrefijoVisible(
    usedPrefix || conn?.prefix || global.prefix,
    '.',
  )

  let nombreBot = global.namebot || 'PAIN BOT'
  let mainImg = './storage/img/menu3.jpg'
  const botActual = cleanBotNum(conn.user?.jid || conn.user?.id)
  const esPrincipal = isMainBotConn(conn)
  const tipo = esPrincipal ? 'Principal Bot' : 'Sub Bot'

  if (!esPrincipal && botActual) {
    const rutaConfigGlobal = join('./Serbot', botActual, 'config.json')
    if (fs.existsSync(rutaConfigGlobal)) {
      const configGlobal = JSON.parse(fs.readFileSync(rutaConfigGlobal, 'utf8'))
      if (configGlobal.img) mainImg = configGlobal.img
      if (configGlobal.name) nombreBot = configGlobal.name
    }
  }

  const todosIdsOwner = [
    conn.decodeJid(conn.user.id),
    ...(!esPrincipal && global.conn?.user?.id ? [conn.decodeJid(global.conn.user.id)] : []),
    ...global.owner.flatMap(([number]) => crearIdsOwner(number)),
    ...(global.ownerLid || []).flatMap(([number]) => crearIdsOwner(number)),
    ...getStaffOwnerIds(conn),
  ]

  const idsRemitente = candidatosJidRemitente(m, conn)
  const esROwner = jidsSeSolapan(idsRemitente, todosIdsOwner)
  const esOwner = esROwner || m.fromMe
  const esMods = esOwner || (global.mods || []).some(v =>
    jidsSeSolapan(idsRemitente, crearIdsOwner(v))
  )

  let esRAdmin = false
  let esAdmin = false
  let esCreadorGrupo = false
  if (m.isGroup) {
    try {
      const groupMetadata = conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(_ => null)
      if (groupMetadata) {
        const participants = groupMetadata.participants || []
        const user = findGroupParticipant(participants, m, conn) || {}
        esRAdmin = user?.admin == 'superadmin' || false
        esAdmin = esRAdmin || user?.admin == 'admin' || false
        esCreadorGrupo = groupMetadata.owner === m.sender ||
          groupMetadata.subjectOwner === m.sender ||
          user?.admin === 'superadmin'
      }
    } catch (error) {
      console.error('Error obteniendo metadata del grupo:', error)
    }
  }

  let rolUsuario = 'Miembro'
  if (esROwner || esOwner) {
    if (esCreadorGrupo) rolUsuario = 'ðŸ‘‘ Staff Bot y Grupo'
    else if (esRAdmin || esAdmin) rolUsuario = 'ðŸ‘‘ Staff Bot y Admin'
    else rolUsuario = 'ðŸ‘‘ Staff Bot'
  } else if (esMods) {
    if (esCreadorGrupo) rolUsuario = 'Moderador del Bot y Creador'
    else if (esRAdmin || esAdmin) rolUsuario = 'Moderador del Bot y Admin'
    else rolUsuario = 'Moderador del Bot'
  } else if (esCreadorGrupo) {
    rolUsuario = 'ðŸ‘‘ Creador del Grupo'
  } else if (esRAdmin || esAdmin) {
    rolUsuario = 'ð–¢  Admin del Grupo'
  }

  const botFormatUptime = formatBotUptime(conn)
  const totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
  const registrados = Object.values(global.db?.data?.users || {}).filter(usuario => usuario?.registered === true).length
  const totalRamMB = Math.round(os.totalmem() / 1024 / 1024)
  const processRamMB = Math.round(process.memoryUsage().rss / 1024 / 1024)
  const rentalLine = m.isGroup
    ? `> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ð™°ð™»ðš€ðš„ð™¸ð™»ð™´ðš:  ${getMenuRentalLine(m.chat)}\n`
    : ''

  let botonSoporte = null
  let linkSoporte = null
  try {
    botonSoporte = construirBotonSoporte(conn)
    linkSoporte = obtenerLinkSoporte(conn)
  } catch {}

  return {
    usedPrefix,
    nombreBot,
    mainImg,
    tipo,
    userRole: rolUsuario,
    botFormatUptime,
    totalf,
    registrados,
    totalRamMB,
    processRamMB,
    rentalLine,
    isOwner: esOwner,
    isAdmin: esAdmin,
    botonSoporte,
    linkSoporte,
    esPrincipal,
  }
}

function puedeVerCategoria(cat, ctx) {
  if (cat.roles.includes('all')) return true
  if (cat.roles.includes('owner') && ctx.isOwner) return true
  if (cat.roles.includes('admin') && (ctx.isOwner || ctx.isAdmin)) return true
  return false
}

function aFilaSelector(cat, ctx) {
  const body = cat.body(ctx.usedPrefix, ctx)
  const cantidad = (body.match(/^> ãƒ» /gm) || []).length
  return {
    id: cat.id,
    title: filaSelector(cat.label),
    description: pistaSelector(cantidad ? cat.hint + " Â· " + cantidad + " comandos" : cat.hint),
    rowId: `${PREFIJO_FILA_MENU}${cat.id}`,
    body,
  }
}

export function construirCategoriasMenu(ctx) {
  return DEFS_CATEGORIA
    .filter(cat => puedeVerCategoria(cat, ctx))
    .map(cat => ({
      ...aFilaSelector(cat, ctx),
      img: ctx.mainImg,
    }))
}

function construirSeccionesAgrupadas(categorias, mapearFila) {
  const porId = Object.fromEntries(categorias.map(cat => [cat.id, cat]))
  const usados = new Set()
  const secciones = []

  for (const grupo of GRUPOS_CATEGORIA) {
    const filas = grupo.ids
      .map(id => porId[id])
      .filter(Boolean)
      .map(cat => {
        usados.add(cat.id)
        return mapearFila(cat)
      })
    if (filas.length) secciones.push({ title: grupo.title, rows: filas })
  }

  const restantes = categorias.filter(cat => !usados.has(cat.id))
  if (restantes.length) {
    secciones.push({
      title: grupoSelector('ð™¾ðšƒðšð™¾ðš‚'),
      rows: restantes.map(mapearFila),
    })
  }

  return secciones
}

export function construirRespuestaCategoria(category, ctx, { interactive = false } = {}) {
  if (interactive) return category.body
  return `${category.body}

> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  Escribe ${ctx.usedPrefix}menu para volver.`.trim()
}

function construirCamposFlujoNativo(ctx, categorias) {
  const flujo = [{
    text: TEXTO_BOTON_MENU,
    sections: construirSeccionesInteractivas(categorias),
    icon: 'default',
  }]

  if (ctx?.botonSoporte?.url) {
    flujo.push({
      text: ctx.botonSoporte.text || 'ã€Ž Soporte ã€',
      url: ctx.botonSoporte.url,
    })
  }

  return {
    footer: ctx.nombreBot,
    nativeFlow: flujo,
  }
}

function construirContextInfoInteractivo(sender) {
  return {
    ...(global.rcanal?.contextInfo || {}),
    ...(sender ? { mentionedJid: [sender] } : {}),
  }
}

export function construirEncabezadoMenu(m, ctx) {
  const fecha = new Date().toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  return `
ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. ð™±ð™¸ð™´ð™½ðš…ð™´ð™½ð™¸ð™³ð™¾/ð™°  @${m.sender.split('@')[0]}

   âœ¦ MENÃš PRINCIPAL DE ${ctx.nombreBot} âœ¦  
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. Powered by: VictorBot_TEM_ZAPIA_BOT_MD
${ctx.rentalLine}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ðŸ“… FECHA: ${fecha}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ðšð™¾ð™»:  ${ctx.userRole}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ð™±ð™¾ðšƒ:  ${ctx.nombreBot}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ðšƒð™¸ð™¿ð™¾:  ${ctx.tipo}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ðšƒð™¸ð™´ð™¼ð™¿ð™¾ ð™°ð™²ðšƒð™¸ðš…ð™¾:  ${ctx.botFormatUptime}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ð™²ð™¾ð™¼ð™°ð™½ð™³ð™¾ðš‚:  ${ctx.totalf}
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  ðŸ“Š REGISTRADOS: ${ctx.registrados}

 ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. ð™¿ðšð™¾ð™¿ð™¸ð™´ðšƒð™°ðšð™¸ð™¾ðš‚ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  âŠ¹ wa.me/59894243071 âŠ¹ *VictorBot_TEM_ZAPIA_BOT*


 ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. ð™²ð™°ð™½ð™°ð™»ð™´ðš‚ ð™¾ð™µð™¸ð™²ð™¸ð™°ð™»ð™´ðš‚ ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  âŸ… https://whatsapp.com/channel/0029VbAEza0LSmbjWpKh1L2f âŸ†

ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. ðšð™´ð™¿ð™¾ðš‚ð™¸ðšƒð™¾ðšð™¸ð™¾ ð™¾ð™µð™¸ð™²ð™¸ð™°ð™»
> ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.  âŸ… https://github.com/VICTOREMANUEL2022/pain-bot âŸ†

ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. *ð™´ð™»ð™¸ð™¶ð™´ ðš„ð™½ð™° ð™²ð™°ðšƒð™´ð™¶ð™¾ðšÃð™°* ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾.`.trim()
}

export function construirSeccionesLista(categorias) {
  return construirSeccionesAgrupadas(categorias, cat => ({
    title: cat.title,
    description: cat.description,
    rowId: cat.rowId,
  }))
}


export function construirSeccionesInteractivas(categorias) {
  return construirSeccionesAgrupadas(categorias, cat => ({
    header: '',
    title: cat.title,
    description: cat.description,
    id: cat.rowId,
  }))
}


export function construirContenidoMenuInteractivo(ctx, categorias, header, media = {}, sender) {
  return {
    ...media,
    caption: header,
    ...construirCamposFlujoNativo(ctx, categorias),
    contextInfo: construirContextInfoInteractivo(sender),
  }
}


export function construirContenidoCategoriaInteractivo(ctx, categorias, caption, media = {}, sender) {
  return {
    ...media,
    caption,
    ...construirCamposFlujoNativo(ctx, categorias),
    contextInfo: construirContextInfoInteractivo(sender),
  }
}


export function construirContenidoSelectorFlujoNativo(ctx, categorias) {
  return {
    text: 'ð“‚ƒ à£ª Ö´Ö¶Ö¸â˜¾. ð™´ð™»ð™¸ð™¶ð™´ ðš„ð™½ð™° ð™²ð™°ðšƒð™´ð™¶ð™¾ðšÃð™° ðš™ðšŠðš›ðšŠ ðšŸðšŽðš› ðšœðšžðšœ ðšŒðš˜ðš–ðšŠðš—ðšðš˜ðšœ.',
    ...construirCamposFlujoNativo(ctx, categorias),
  }
}

export function buscarCategoriaMenu(categorias, categoryId) {
  return categorias.find(cat => cat.id === categoryId) || null
}

const CLAVES_COINCIDENCIA_CATEGORIA = {
  creador: ['CREADOR', 'CREATOR', 'DUEÃ‘O', 'ðŸ‘‘ CREADOR'],
  owners: ['OWNERS', 'ð™¾ðš†ð™½ð™´ðšðš‚'],
  admins: ['ADMINS', 'ð™°ð™³ð™¼ð™¸ð™½ðš‚'],
  subbot: ['SUB BOT', 'ðš‚ðš„ð™± ð™±ð™¾ðšƒ'],
  juegos: ['GAMES RPG', 'GAME RPG', 'ð™¶ð™°ð™¼ð™´ðš‚ ðšð™¿ð™¶', 'ð™¶ð™°ð™¼ð™´ ðšð™¿ð™¶', 'GAMES', 'GAME', 'ð™¶ð™°ð™¼ð™´', 'ECONOM', 'ð™´ð™²ð™¾ð™½ð™¾ð™¼'],
  perfil: ['PERFIL', 'ð™¿ð™´ðšð™µð™¸ð™»'],
  top: ['TOP RPG', 'ðšƒð™¾ð™¿ ðšð™¿ð™¶'],
  busquedas: ['BUSQUEDA', 'ð™±ðš„ðš‚ðš€'],
  osint: ['OSINT', 'ð™¾ðš‚ð™¸ð™½ðšƒ'],
  ia: ['INTELIGENCIA', 'ð™¸ð™½ðšƒð™´ð™»ð™¸ð™¶ð™´ð™½ð™²ð™¸ð™°'],
  descargas: ['DESCARGA', 'ð™³ð™´ðš‚ð™²ð™°ðšð™¶'],
  reacciones: ['REACCION', 'ðšð™´ð™°ð™²ð™²ð™¸ð™¾ð™½'],
  adicionales: ['ADICIONAL', 'ð™°ð™³ð™¸ð™²ð™¸ð™¾ð™½ð™°ð™»'],
  stickers: ['STICKER', 'ðš‚ðšƒð™¸ð™²ð™ºð™´ðš'],
  diversion: ['DIVERSION', 'ð™³ð™¸ðš…ð™´ðšðš‚ð™¸ð™¾ð™½'],
  nsfw: ['NSFW', 'ð™½ðš‚ð™µðš†'],
}

export function buscarCategoriaMenuDesdeMensaje(m, categorias) {
  const rowId = extraerIdSeleccionMenu(m)
  const porId = buscarCategoriaMenu(categorias, obtenerIdCategoriaMenu(rowId))
  if (porId) return porId

  const etiqueta = [
    m?.msg?.title,
    m?.msg?.description,
    m?.msg?.singleSelectReply?.selectedRowId,
    m?.message?.listResponseMessage?.title,
    m?.message?.listResponseMessage?.description,
    m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId,
    m?.text,
  ].filter(Boolean).join(' ')

  if (!etiqueta) return null

  for (const cat of categorias) {
    const claves = CLAVES_COINCIDENCIA_CATEGORIA[cat.id] || [cat.id.toUpperCase()]
    if (claves.some(clave => etiqueta.toUpperCase().includes(clave.toUpperCase()))) {
      return cat
    }
  }

  return null
}

export function construirTextoMenuCompleto(m, ctx, categorias) {
  const encabezado = construirEncabezadoMenu(m, ctx).replace(
    'ð™´ð™»ð™¸ð™¶ð™´ ðš„ð™½ð™° ð™²ð™°ðšƒð™´ð™¶ð™¾ðšÃð™°',
    'ð™²ð™¾ð™¼ð™°ð™½ð™³ð™¾ðš‚',
  )
  const cuerpo = categorias.map(cat => cat.body).join('\n\n')
  return `${encabezado}\n\n${cuerpo}`.trim()
}

export {
  PREFIJO_FILA_MENU as MENU_ROW_PREFIX,
  TEXTO_BOTON_MENU as MENU_BUTTON_TEXT,
  obtenerIdCategoriaMenu as getMenuCategoryId,
  extraerIdFilaListaMenu as extractMenuListRowId,
  extraerIdSeleccionMenu as extractMenuSelectionId,
  formatearPrefijoVisible as formatDisplayPrefix,
  resolverContextoMenu as resolveMenuContext,
  construirCategoriasMenu as buildMenuCategories,
  construirRespuestaCategoria as buildCategoryResponse,
  construirEncabezadoMenu as buildMenuHeader,
  construirSeccionesLista as buildListSections,
  construirSeccionesInteractivas as buildInteractiveSections,
  construirContenidoMenuInteractivo as buildInteractiveMenuContent,
  construirContenidoCategoriaInteractivo as buildCategoryInteractiveContent,
  construirContenidoSelectorFlujoNativo as buildNativeFlowPickerContent,
  buscarCategoriaMenu as findMenuCategory,
  buscarCategoriaMenuDesdeMensaje as findMenuCategoryFromMessage,
  construirTextoMenuCompleto as buildFullMenuText
}
