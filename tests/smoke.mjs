import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const port = 5317
const debugPort = 9327
const profile = await mkdtemp(join(tmpdir(), 'etf-chrome-'))
const vite = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: process.env, stdio: 'ignore',
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
  for (let attempt = 0; attempt < 30; attempt++) {
    if (await evaluate(`document.querySelectorAll('select').length === 2`)) break
    await pause(100)
  }
  assert.equal(await evaluate(`document.querySelectorAll('select').length`), 2)
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('button[aria-pressed]').parentElement).display`), 'none')
  assert.equal(await evaluate(`document.documentElement.scrollWidth > innerWidth`), false)
  assert.equal(await evaluate(`document.querySelector('[aria-label="Srovnání vybraných ETF"]').scrollWidth > document.querySelector('[aria-label="Srovnání vybraných ETF"]').clientWidth`), false)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x => x.name === 'landing_view').length`), 1)
  assert.equal(await evaluate(`[...document.querySelector('#etf-select-0').options].some(x => x.value === 'VUG')`), false)
  assert.equal(await evaluate(`[...document.querySelector('#etf-select-1').options].some(x => x.value === 'VTV')`), false)
  assert.equal(await evaluate(`Math.abs(document.querySelector('#etf-select-0').getBoundingClientRect().top - document.querySelector('#etf-select-1').getBoundingClientRect().top) < 2`), true)
  assert.equal(await evaluate(`document.querySelectorAll('tbody tr').length`), 5)

  for (let index = 0; index < 4; index++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  }
  assert.equal(await evaluate(`document.activeElement.id`), 'etf-select-0')
  await evaluate(`document.querySelector('#etf-select-0').value='VOO';document.querySelector('#etf-select-0').dispatchEvent(new Event('change',{bubbles:true}))`)
  await pause(50)
  assert.equal(await evaluate(`document.querySelector('#etf-select-0').value`), 'VOO')
  assert.equal(await evaluate(`[...document.querySelector('#etf-select-1').options].some(x => x.value === 'VOO')`), false)
  await evaluate(`document.querySelector('#etf-select-1').value='VB';document.querySelector('#etf-select-1').dispatchEvent(new Event('change',{bubbles:true}))`)
  await pause(50)
  assert.equal(await evaluate(`document.querySelector('#etf-select-1').value`), 'VB')
  assert.equal(await evaluate(`[...document.querySelector('#etf-select-0').options].some(x => x.value === 'VB')`), false)
  assert.equal(await evaluate(`document.querySelector('caption').textContent.includes('VOO a VB')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.some(x => x.name === 'compare_change' && x.campaign.ad_variant === 'a')`), true)
  assert.equal(await evaluate(`document.querySelector('[aria-label="Srovnání vybraných ETF"]').scrollWidth > document.querySelector('[aria-label="Srovnání vybraných ETF"]').clientWidth`), false)

  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 700, deviceScaleFactor: 1, mobile: true })
  assert.equal(await evaluate(`document.documentElement.scrollWidth > innerWidth`), false)
  assert.equal(await evaluate(`document.querySelector('[aria-label="Srovnání vybraných ETF"]').scrollWidth > document.querySelector('[aria-label="Srovnání vybraných ETF"]').clientWidth`), false)

  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false })
  assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('button[aria-pressed]').parentElement).display`), 'none')
  await evaluate(`document.querySelectorAll('button[aria-pressed=true]')[0].click()`)
  await pause(50)
  assert.equal(await evaluate(`document.querySelectorAll('button[aria-pressed=true]').length`), 1)
  assert.equal(await evaluate(`document.querySelector('[role=status]').textContent.includes('druhé ETF')`), true)
  await evaluate(`document.querySelector('button[aria-pressed=true]').click()`)
  await pause(50)
  assert.equal(await evaluate(`document.querySelectorAll('button[aria-pressed=true]').length`), 0)
  assert.equal(await evaluate(`document.querySelector('[role=status]').textContent.includes('Vyberte dvě ETF')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.at(-1).selectedEtfs.length`), 0)
  await evaluate(`document.querySelectorAll('button[aria-pressed]')[2].click()`)
  await pause(50)
  await evaluate(`document.querySelectorAll('button[aria-pressed]')[1].click()`)
  await pause(50)
  assert.equal(await evaluate(`document.querySelector('caption').textContent.includes('VTV a VUG')`), true)
  assert.equal(await evaluate(`document.querySelector('details summary').textContent.includes('Podrobnosti a rizika')`), true)

  await evaluate(`window.__requests=[];window.fetch=(...args)=>{window.__requests.push(args);throw Error('Unexpected form request')}`)
  await evaluate(`document.querySelector('#email').value='bad';document.querySelector('form').requestSubmit()`)
  await pause(30)
  assert.equal(await evaluate(`window.__requests.length`), 0)
  assert.equal(await evaluate(`document.querySelector('#form-message').textContent.includes('platnou')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.some(x=>x.name==='lead_demo_error' && x.errorType==='validation')`), true)

  await evaluate(`document.querySelector('#email').value='test@example.com';document.querySelector('form').requestSubmit()`)
  assert.equal(await evaluate(`document.querySelector('button[type=submit]').disabled`), true)
  assert.equal(await evaluate(`document.querySelector('button[type=submit]').textContent.includes('Načítání')`), true)
  await evaluate(`document.querySelector('form').requestSubmit()`)
  await pause(500)
  assert.equal(await evaluate(`document.querySelector('button[type=submit]').disabled`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x=>x.name==='lead_demo_complete').length`), 0)
  await pause(650)
  assert.equal(await evaluate(`document.querySelector('[role=status] h3').textContent.includes('Ukázka dokončena')`), true)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x=>x.name==='lead_demo_complete').length`), 1)
  assert.equal(await evaluate(`window.etfTrackingEvents.filter(x=>x.name==='lead_demo_attempt').length`), 2)
  assert.equal(await evaluate(`JSON.stringify(window.etfTrackingEvents).includes('test@example.com')`), false)
  assert.equal(await evaluate(`window.__requests.length`), 0)
  console.log('Browser smoke passed: comparison, keyboard, validation, one-second demo loading, duplicate-click guard, local completion, UTM, no email in tracking or network.')

} finally {
  socket?.close()
  chrome.kill('SIGTERM')
  vite.kill('SIGTERM')
  await rm(profile, { recursive: true, force: true })
}
