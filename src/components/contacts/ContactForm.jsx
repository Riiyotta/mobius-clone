import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '../legal/Icons'

// Contact Form (contacts.md §3) + "Button Contact Form" (§5.3).
// No backend: submit never sends data. After native validation passes the button shows its
// Loading variant for SUBMIT_LOADING_MS, then its Success variant ("Thank you" + Check).
// The original's post-submit behaviour (reset / redirect / timing) is unknown (§8).
export const SUBMIT_LOADING_MS = 1500

// Phosphor icons (bold) for the button states. Not in the recon assets; library paths.
const Spinner = (props) => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm33.25,62.75a12,12,0,0,0,8.49-3.52L204.37,68.6a12,12,0,0,0-17-17L164.77,74.26a12,12,0,0,0,8.48,20.49ZM224,116H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z" />
  </svg>
)
const Check = (props) => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
  </svg>
)

// Every word is its own <p> (§3).
const words = (s) => s.split(' ').map((w, i) => <p key={i} className="ct-w">{w}</p>)

const Field = ({ size, children, select }) => (
  <div className={`ct-field ct-f-${size}${select ? ' ct-select' : ''}`}>{children}</div>
)

function SubmitButton({ state, desktop }) {
  const Icon2 = state === 'loading' ? Spinner : state === 'success' ? Check : ArrowRight
  return (
    <button
      type="submit"
      className={`ct-btn${desktop ? ' ct-btn-desk' : ''}`}
      data-state={state}
      data-cursor="hidden"
      aria-busy={state === 'loading' || undefined}
    >
      <section className="ct-btn-bg" />
      <p className="ct-btn-text">{state === 'success' ? 'Thank you' : 'Get in Touch'}</p>
      <ArrowRight className="ct-btn-ic ct-btn-ic1" />
      <span className="ct-btn-ic ct-btn-ic2">
        <Icon2 className={state === 'loading' ? 'ct-spin' : undefined} />
      </span>
    </button>
  )
}

export default function ContactForm({ desktop }) {
  const [state, setState] = useState('idle') // idle | loading | success
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const onSubmit = (e) => {
    e.preventDefault() // only fires after native constraint validation passes; nothing is sent
    if (state !== 'idle') return
    setState('loading')
    timer.current = setTimeout(() => setState('success'), SUBMIT_LOADING_MS)
  }

  return (
    <form className="ct-form" onSubmit={onSubmit}>
      <div className="ct-group">
        {words('Hey Möbius®, my name is')}
        <Field size="440">
          <input className="ct-input" type="text" name="Name" placeholder="Your Name *" required />
        </Field>
        {words('and I’m writing from')}
        <Field size="440">
          <input className="ct-input" type="text" name="Company Name" placeholder="Company Name" />
        </Field>
        {words('.')}
      </div>

      <div className="ct-group">
        {words('I’m getting in touch because I’d like to')}
        <Field size="full">
          <textarea className="ct-input ct-textarea" name="Message" placeholder="Message *" required />
        </Field>
        {words('My budget is roughly')}
        <Field size="240" select>
          <select className="ct-input" name="Budget" required defaultValue="">
            <option value="" disabled>Select a Budget *</option>
            <option>$5,000 - $10,000</option>
            <option>$10,000 - $20,000</option>
            <option>$20,000 +</option>
          </select>
        </Field>
        {words("and I'd like to start")}
        <Field size="480" select>
          <select className="ct-input" name="Timeframe" required defaultValue="">
            <option value="" disabled>Choose a Timeframe *</option>
            <option>As soon as possible</option>
            <option>Next month</option>
            <option>Whenever you’re available</option>
          </select>
        </Field>
        {words('.')}
      </div>

      <div className="ct-group">
        {words('You can contact me at')}
        <Field size="440">
          <input className="ct-input" type="email" name="Email" placeholder="Email *" required />
        </Field>
        {words('.')}
        {words('Looking forward to your reply!')}
      </div>

      <p className="ct-terms">
        By submitting, you agree to our <a href="./">Terms</a> and <a href="./">Privacy Policy.</a>
      </p>

      <SubmitButton state={state} desktop={desktop} />
    </form>
  )
}
