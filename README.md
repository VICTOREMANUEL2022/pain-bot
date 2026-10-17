# ðŸ¤– VictorBot_TEM_ZAPIA_BOT_MD

**Fork personalizado por Victor y Jenny PÃ©rez**  
*Basado en PAIN Bot, con crÃ©ditos al proyecto original.*

<p align="center">
  <a href="https://whatsapp.com/channel/0029VbAEza0LSmbjWpKh1L2f">
    ðŸ“¢ <strong>Canal oficial de WhatsApp</strong>
  </a>
  &nbsp; | &nbsp;
  <a href="https://github.com/VICTOREMANUEL2022/pain-bot">
    ðŸ’» <strong>Repositorio de VictorBot</strong>
  </a>
</p>

Bot de WhatsApp multi-dispositivo (Baileys), personalizado como **VictorBot_TEM_ZAPIA_BOT_MD**. Incluye descargas, IA, administraciÃ³n de grupos, RPG, stickers y mÃ¡s.

El repositorio **incluye `node_modules`**. No es necesario ejecutar `npm install`: clona y arranca.

```bash
git clone https://github.com/VICTOREMANUEL2022/pain-bot
cd pain-bot
npm start
```

| | |
|---|---|
| **Bot** | VictorBot_TEM_ZAPIA_BOT_MD |
| **Repositorio** | [VICTOREMANUEL2022/pain-bot](https://github.com/VICTOREMANUEL2022/pain-bot) |
| **Canal oficial** | [Canal de WhatsApp](https://whatsapp.com/channel/0029VbAEza0LSmbjWpKh1L2f) |
| **Proyecto base** | [nexusday/pain-bot](https://github.com/nexusday/pain-bot) |
| **Runtime** | Node.js 20+ |
| **Dependencias** | Incluidas en el repo (`node_modules`) |
| **Licencia** | GPL-3.0-or-later |

---

## Ãndice

1. [Requisitos](#requisitos)
2. [Inicio rÃ¡pido](#inicio-rÃ¡pido)
3. [Termux](#termux)
4. [Vincular cuenta](#vincular-cuenta)
5. [PM2 en Termux](#pm2-en-termux)
6. [ConfiguraciÃ³n](#configuraciÃ³n)
7. [Uso](#uso)
8. [Estructura](#estructura)
9. [Actualizar](#actualizar)
10. [Problemas frecuentes](#problemas-frecuentes)
11. [Aviso y crÃ©ditos](#aviso-y-crÃ©ditos)

---

## Requisitos

| Componente | Detalle |
|------------|---------|
| Node.js | 20 LTS o superior |
| Git | versiÃ³n reciente |
| FFmpeg | recomendado (audio, video, stickers) |
| Espacio | el clone es pesado por `node_modules` (~cientos de MB) |

No hace falta `npm` salvo que quieras reinstalar dependencias a mano.

---

## Inicio rÃ¡pido

Windows, Linux o macOS:

```bash
git clone https://github.com/VICTOREMANUEL2022/pain-bot
cd pain-bot
npm start
```

Listo. Las dependencias ya vienen en el proyecto.

En Debian/Ubuntu, si te falta FFmpeg:

```bash
sudo apt update
sudo apt install -y ffmpeg git
```

Solo si algo falla al arrancar (mÃ³dulos rotos o incompletos):

```bash
npm install
# o: npm install --legacy-peer-deps
```

---

## Termux

### Preparar el entorno

Termux desde [F-Droid](https://f-droid.org/packages/com.termux/). Luego:

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git ffmpeg
```

Verifica:

```bash
node -v && git --version
```

### Clonar y arrancar

**No hace falta `npm install`.** Con clonar basta:

```bash
cd ~
git clone https://github.com/VICTOREMANUEL2022/pain-bot
cd pain-bot
npm start
```

Si por algÃºn error de mÃ³dulos necesitas reinstalar (opcional):

```bash
npm install --no-bin-links
```

---

## Vincular cuenta

El mÃ©todo principal de vinculaciÃ³n es por **cÃ³digo de 8 dÃ­gitos** (pairing code). No hace falta escanear QR.

### Arranque

```bash
cd pain-bot   # o: cd ~/pain-bot en Termux
npm start
```

### Pasos en la terminal

1. Cuando pregunte el mÃ©todo de sesiÃ³n, escribe:

```text
code
```

2. Ingresa el nÃºmero del WhatsApp que usarÃ¡ el bot, **con cÃ³digo de paÃ­s y sin sÃ­mbolos**:

```text
51999999999
```

3. La terminal mostrarÃ¡ un cÃ³digo de **8 caracteres** (ej. `ABCD-EFGH`).

### Pasos en WhatsApp (telÃ©fono)

1. Abre WhatsApp en el dispositivo del nÃºmero indicado  
2. **Ajustes â†’ Dispositivos vinculados â†’ Vincular un dispositivo**  
3. Elige **Vincular con nÃºmero de telÃ©fono**  
4. Escribe el cÃ³digo de 8 dÃ­gitos que saliÃ³ en la terminal  

La sesiÃ³n se guarda en `Sessions/`. Conserva esa carpeta si no quieres volver a vincular.

> Tip: la primera vinculaciÃ³n hazla con `npm start` en primer plano para copiar el cÃ³digo con calma. DespuÃ©s puedes pasar a PM2.

Detener el proceso: `Ctrl + C`.

---

## PM2 en Termux

Para mantener el bot en segundo plano sin dejar la terminal abierta:

```bash
npm install -g pm2
cd ~/pain-bot
```

**Importante:** vincula primero con `npm start` y el cÃ³digo. Cuando la sesiÃ³n ya estÃ© en `Sessions/`:

```bash
pm2 start index.js --name painbot
pm2 save
```

| Comando | AcciÃ³n |
|---------|--------|
| `pm2 status` | Estado del proceso |
| `pm2 logs painbot` | Logs en vivo |
| `pm2 restart painbot` | Reiniciar |
| `pm2 stop painbot` | Detener |
| `pm2 delete painbot` | Eliminar de PM2 |

Recuperar PM2 al reabrir Termux:

```bash
pm2 startup
pm2 save
```

Desactiva la optimizaciÃ³n de baterÃ­a para Termux en Android; si no, el sistema puede matar el proceso.

---

## ConfiguraciÃ³n

Edita `config.js` (mejor con el bot detenido al cambiar owners):

| Variable | DescripciÃ³n |
|----------|-------------|
| `global.owner` | Owners: `['codigoPaisNumero', 'Nombre', true]` |
| `global.namebot` | Nombre del bot |
| `global.packname` | Nombre en stickers |
| `global.author` | Autor |
| `global.moneda` | Moneda del RPG |
| `global.APIs` | APIs externas |

```js
global.owner = [
  ['51999999999', 'TuNombre', true],
]
```

Sin `+`, espacios ni guiones en el nÃºmero.

**No publiques cÃ³digos de vinculaciÃ³n, sesiones, contraseÃ±as, tokens ni claves de API.**

---

## Uso

Prefijo por defecto: `.`

```text
.menu
.menu2
.play nombre de canciÃ³n
.video bÃºsqueda o enlace
.ia mensaje
.s
```

MÃ¡s comandos en `.menu` / `.menu2` dentro del chat.

---

## Estructura

```text
pain-bot/
â”œâ”€â”€ config.js         ConfiguraciÃ³n global
â”œâ”€â”€ index.js          Entrada
â”œâ”€â”€ main.js           ConexiÃ³n y ciclo
â”œâ”€â”€ handler.js        Mensajes y comandos
â”œâ”€â”€ plugins/          Comandos (hot reload)
â”œâ”€â”€ lib/              Utilidades y modos
â”œâ”€â”€ node_modules/     Dependencias (incluidas en el repo)
â”œâ”€â”€ storage/          Datos persistentes
â”œâ”€â”€ Sessions/         SesiÃ³n de WhatsApp (no versionar)
â””â”€â”€ package.json
```

Los plugins suelen recargarse al guardar. Si no aparece uno nuevo, reinicia con `npm start` o `pm2 restart painbot`.

---

## Actualizar

```bash
cd pain-bot
git pull origin main
npm start
# o: pm2 restart painbot
```

No hace falta `npm install` tras el pull mientras `node_modules` venga actualizado en el repo.

Haz backup de `Sessions/` y de tu `config.js` antes de un `git pull` si tocaste owners o APIs.

---

## Problemas frecuentes

**No sale el cÃ³digo de vinculaciÃ³n**  
Escribe `code` (no `qr`) cuando pregunte el mÃ©todo. Cierra otras instancias del bot y vuelve a `npm start`.

**El cÃ³digo expira o no se acepta**  
Pide uno nuevo reiniciando. En WhatsApp usa *Vincular con nÃºmero de telÃ©fono*, no el escÃ¡ner de cÃ¡mara.

**Error de mÃ³dulos / â€œCannot find moduleâ€**  
El repo ya trae `node_modules`. Si falta o estÃ¡ daÃ±ado:

```bash
# PC
npm install

# Termux
npm install --no-bin-links
```

**SesiÃ³n cerrada / logged out**

```bash
rm -rf Sessions
npm start
```

Vuelve a vincular con el cÃ³digo de 8 dÃ­gitos.

**El bot no responde en un grupo**  
Revisa si estÃ¡ desactivado, silenciado o si faltan permisos de admin para comandos de grupo.

**Termux se cierra solo**  
Ajustes de Android â†’ sin optimizaciÃ³n de baterÃ­a para Termux.

---

## Aviso y crÃ©ditos

Uso personal o educativo. Respeta las [polÃ­ticas de WhatsApp](https://www.whatsapp.com/legal) y la ley de tu paÃ­s. El uso indebido de automatizaciÃ³n puede banear la cuenta vinculada; conviene un nÃºmero secundario.

**Seguridad:** no publiques cÃ³digos de vinculaciÃ³n, sesiones, contraseÃ±as, tokens ni claves de API.

| | |
|---|---|
| **Proyecto** | VictorBot_TEM_ZAPIA_BOT_MD |
| **PersonalizaciÃ³n** | Victor y Jenny PÃ©rez |
| **Proyecto base** | PAIN Bot, por Sunkovv |
| **NÃºcleo** | [Baileys](https://github.com/WhiskeySockets/Baileys) (WhiskeySockets) |
| **Repositorio base** | [nexusday/pain-bot](https://github.com/nexusday/pain-bot) |
| **Este fork** | [VICTOREMANUEL2022/pain-bot](https://github.com/VICTOREMANUEL2022/pain-bot) |

---

*VictorBot_TEM_ZAPIA_BOT_MD â€” fork personalizado por Victor y Jenny PÃ©rez.*
