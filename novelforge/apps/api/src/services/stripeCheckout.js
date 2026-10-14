import { config } from '../config.js'
import { randomToken } from '../security/crypto.js'

/**
 * Create a Stripe Checkout Session when STRIPE_SECRET_KEY is set.
 * Falls back to local test paid order otherwise.
 */
export async function createStorefrontCheckout({
  store,
  book,
  email,
  successUrl,
  cancelUrl,
}) {
  const token = randomToken(24)
  await store.saveDownloadToken(token, {
    bookId: book.id,
    exp: Date.now() + config.exportTtlMs,
    maxUses: 3,
    uses: 0,
  })

  if (!config.stripe.secretKey) {
    const order = await store.createOrder({
      book_id: book.id,
      slug: book.storefront.slug,
      email: email || null,
      amount_cents: book.storefront.price_cents,
      currency: book.storefront.currency,
      status: 'paid_test',
      stripe_mode: 'test_bypass',
      download_token: token,
    })
    return {
      orderId: order.id,
      status: order.status,
      downloadToken: token,
      downloadPath: `/v1/store/download?token=${token}`,
      checkoutUrl: null,
      note: 'Test mode: order marked paid without Stripe. Set STRIPE_SECRET_KEY for Checkout.',
    }
  }

  const order = await store.createOrder({
    book_id: book.id,
    slug: book.storefront.slug,
    email: email || null,
    amount_cents: book.storefront.price_cents,
    currency: book.storefront.currency,
    status: 'pending_payment',
    stripe_mode: 'checkout_session',
    download_token: token,
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.stripe.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      mode: 'payment',
      success_url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: cancelUrl,
      client_reference_id: order.id,
      ...(email ? { customer_email: email } : {}),
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': String(book.storefront.currency || 'eur').toLowerCase(),
      'line_items[0][price_data][unit_amount]': String(book.storefront.price_cents),
      'line_items[0][price_data][product_data][name]': book.working_title || 'Book download',
      'metadata[order_id]': order.id,
      'metadata[book_id]': book.id,
      'automatic_tax[enabled]': 'true',
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.error?.message || `Stripe HTTP ${res.status}`)
    err.code = 'stripe_error'
    err.status = 502
    throw err
  }

  return {
    orderId: order.id,
    status: 'pending_payment',
    downloadToken: token,
    downloadPath: `/v1/store/download?token=${token}`,
    checkoutUrl: data.url,
    sessionId: data.id,
    note: 'Complete Stripe Checkout; download token activates after payment (test: usable immediately for local QA).',
  }
}
