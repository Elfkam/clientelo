import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const port = 5317
const debugPort = 9327
const profile = await mkdtemp(join(tmpdir(), 'etf-chrome-'))
const vite = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, VITE_FORMSPREE_ENDPOINT: 'https://formspree.io/f/test123' }, stdio: 'ignore',
})
const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
  '--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${debugPort}`,
  '--remote-allow-origins=*', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' })

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
async function waitFor(url) {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { const response = await fetch(url); if (response.ok) return response } catch { /* Startup in progress. */ }
    await pause(100)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

let socket
try {
  await Promise.all([waitFor(`http://127.0.0.1:${port}/`), waitFor(`http://127.0.0.1:${debugPort}/json/list`)])
  const pages = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()
  socket = new WebSocket(pages[0].webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  let nextId = 0
  const pending = new Map()
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (!pending.has(message.id)) return
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    message.error ? reject(message.error) : resolve(message.result)
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/?utm_source=smoke&ad_variant=a` })
  await pause(700)
  assert.equal(await evaluate(`document.querySelectorAll('button[aria-pressed]').length`), 5)
  assert.equal(await evaluate(`document.documentElement.scrollWidth > innerWidth`), false)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x => x.name === 'landing_view').length`), 1)

  for (let index = 0; index < 5; index++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  }
  assert.equal(await evaluate(`document.activeElement.textContent.includes('VUG')`), true)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', text: ' ', windowsVirtualKeyCode: 32 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await pause(50)
  assert.equal(await evaluate(`document.querySelectorAll('button[aria-pressed=true]').length`), 2)
  assert.equal(await evaluate(`document.querySelector('caption').textContent.includes('VUG')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.some(x => x.name === 'compare_change' && x.campaign.ad_variant === 'a')`), true)

  await evaluate(`window.__requests=[];window.__mockStatus=429;window.fetch=async (...args)=>{window.__requests.push(args);await new Promise(r=>setTimeout(r,100));if(window.__mockStatus==='network')throw Error('network');return new Response('{}',{status:window.__mockStatus})}`)
  await evaluate(`document.querySelector('#email').value='bad';document.querySelector('form').requestSubmit()`)
  await pause(30)
  assert.equal(await evaluate(`window.__requests.length`), 0)
  assert.equal(await evaluate(`window.etfTrackingEvents.some(x=>x.errorType==='validation')`), true)

  await evaluate(`document.querySelector('#email').value='test@example.com';document.querySelector('form').requestSubmit()`)
  assert.equal(await evaluate(`document.querySelector('button[type=submit]').disabled`), true)
  await pause(180)
  assert.equal(await evaluate(`document.querySelector('#form-message').textContent.includes('Příliš mnoho pokusů')`), true)
  await evaluate(`window.__mockStatus='network';document.querySelector('form').requestSubmit()`)
  await pause(180)
  assert.equal(await evaluate(`document.querySelector('#form-message').textContent.includes('Nepodařilo se připojit')`), true)
  await evaluate(`window.__mockStatus=200;document.querySelector('form').requestSubmit()`)
  await pause(180)
  assert.equal(await evaluate(`document.querySelector('[role=status] h3').textContent.includes('jsme přijali')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x=>x.name==='lead_submit_success').length`), 1)
  assert.equal(await evaluate(`JSON.stringify(window.etfTrackingEvents).includes('test@example.com')`), false)
  assert.equal(await evaluate(`window.__requests.every(x=>x[0]==='https://formspree.io/f/test123')`), true)
  console.log('Browser smoke passed: mobile layout, keyboard, comparison, validation, pending, 429, network error, retry, success, UTM, no email in tracking.')
} finally {
  socket?.close()
  chrome.kill('SIGTERM')
  vite.kill('SIGTERM')
  await rm(profile, { recursive: true, force: true })
}
