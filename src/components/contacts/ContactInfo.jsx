import CharRise from '../fx/CharRise'

// Contact Info card (contacts.md §2.2, §6, §7). Desktop values are <h5> 32/700, tablet/phone <h6>.
// Email/phone are "Button C" links (§5.1): underline grows on hover (desktop), cursor Hidden.
// The displayed email and its mailto href differ in the source; kept verbatim.
const ADDRESS = ['Möbius® Studio', 'Schwedter Straße 112', '10437 Berlin, Germany']

function LinkC({ href, text, Tag }) {
  return (
    <a href={href} className="ct-link" data-cursor="hidden">
      <Tag className="ct-val">{text}</Tag>
      <div className="ct-link-line" />
    </a>
  )
}

export default function ContactInfo({ desktop }) {
  const Tag = desktop ? 'h5' : 'h6'
  return (
    <div className="ct-card">
      <div className="ct-block">
        <p className="ct-label">Email</p>
        <LinkC href="mailto:hello@world.com" text="hello@mobius.com" Tag={Tag} />
      </div>
      <div className="ct-block">
        <p className="ct-label">Phone</p>
        <LinkC href="tel:00000000" text="+49 30 648 92 770" Tag={Tag} />
      </div>
      <div className="ct-block">
        <p className="ct-label ct-label-addr">Address</p>
        <div className="ct-addr">
          {ADDRESS.map((line, i) => (
            <div key={line} className="ct-addr-line">
              <Tag className="ct-val">
                {/* §4: chars y 50 → 0, spring 0.8 (duration/ease overridden in contacts.css), stagger 0.025, delay 0.2/0.3/0.4 */}
                {desktop ? <CharRise text={line} from={50} delay={0.2 + i * 0.1} /> : line}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
