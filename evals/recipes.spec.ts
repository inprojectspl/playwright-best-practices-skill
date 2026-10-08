import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { test as base, expect } from '@playwright/test'

type Service = { url: string; records: Set<string> }
const test = base.extend<{ ownedId: string }, { service: Service }>({
  service: [async ({}, use) => {
    const records = new Set<string>()
    const server = createServer((req, res) => {
      const url = new URL(req.url!, 'http://localhost')
      const id = url.searchParams.get('id')!
      if (url.pathname === '/records') {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'POST') records.add(id)
        if (req.method === 'DELETE') records.delete(id)
        res.end(JSON.stringify([...records]))
      } else if (url.pathname === '/heartbeat') {
        res.end('ok')
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.end(`<button disabled>Save</button><script>
          setInterval(() => fetch('/heartbeat'), 25);
          ${url.pathname === '/broken' ? '' : 'setTimeout(() => document.querySelector("button").disabled = false, 150);'}
        </script>`)
      }
    })
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    const address = server.address() as { port: number }
    try { await use({ url: `http://127.0.0.1:${address.port}`, records }) }
    finally { await new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())) }
  }, { scope: 'worker' }],
  ownedId: async ({ request, service }, use) => {
    const id = randomUUID()
    await request.post(`${service.url}/records?id=${id}`)
    try { await use(id) }
    finally { await request.delete(`${service.url}/records?id=${id}`) }
  },
})

test('waits for enabled state while background requests continue', async ({ page, service }) => {
  await page.goto(service.url)
  const button = page.getByRole('button', { name: 'Save' })
  await expect(button).toBeVisible()
  await expect(button).toBeEnabled()
})

test('detects a visible control that never becomes enabled', async ({ page, service }) => {
  await page.goto(`${service.url}/broken`)
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
  await expect(expect(page.getByRole('button', { name: 'Save' })).toBeEnabled({ timeout: 200 })).rejects.toThrow()
})

test('browser contexts isolate storage, not backend records', async ({ browser, service }) => {
  const a = await browser.newContext()
  const b = await browser.newContext()
  const id = randomUUID()
  try {
    const page = await a.newPage()
    await page.goto(service.url)
    await page.evaluate(() => localStorage.setItem('user', 'a'))
    const other = await b.newPage()
    await other.goto(service.url)
    expect(await other.evaluate(() => localStorage.getItem('user'))).toBeNull()
    await a.request.post(`${service.url}/records?id=${id}`)
    expect(await (await b.request.get(`${service.url}/records`)).json()).toContain(id)
  } finally {
    await a.request.delete(`${service.url}/records?id=${id}`)
    await a.close()
    await b.close()
  }
})

test('fixture cleanup executes after a controlled failure', async ({ ownedId, service }) => {
  test.fail()
  expect(service.records.has(ownedId)).toBe(true)
  expect('actual').toBe('intentionally wrong')
})

test('no test-owned records remain after failure teardown', async ({ service }) => {
  expect([...service.records]).toEqual([])
})
