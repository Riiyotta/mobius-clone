import { useLayoutEffect, useRef, useState } from 'react'
import { Plus } from '../legal/Icons'

// Career Accordion (studio.md §3.5.4, §5.4). Not the shared FAQ: independent toggles, the row's clip
// height tweens 0.8s cubic-bezier(.6,0,.4,1) between the role title and the full Q&A container, and the
// Plus rotates 0 → 45°. Content is revealed purely by the clip (no fade).
const APPLY = 'Submit your PDF portfolio and CV (max 10MB) to '
const ROLES = [
  {
    title: 'Brand Designer',
    desc: 'We’re looking for a Brand Designer who can shape visual systems with clarity and intentionality. You’ll work on identity projects from early exploration to final delivery, helping define how brands look, feel, and communicate. This role is for someone who values structure, refined aesthetics, and thoughtful craft.',
    doList: [
      'Develop visual identities and design systems',
      'Create logos, marks, typographic setups, and color directions',
      'Build brand guidelines and asset libraries',
      'Work closely with the team on concepts and refinements',
      'Present ideas clearly and confidently to the team and clients',
    ],
    lookList: [
      'Strong visual sense and attention to detail',
      'Ability to think conceptually',
      'Experience with branding projects',
      'Comfort working in a small, collaborative environment',
    ],
  },
  {
    title: 'Digital Product Designer',
    desc: 'As a Digital Product Designer, you’ll help shape websites, platforms, and digital experiences that feel intentional and intuitive. You’ll work across UX and UI, creating structure, flow, and polished visual interfaces that reflect the Möbius® approach to clarity and craft.',
    doList: [
      'Design page structures, flows, and interactions',
      'Develop UI systems, components, and responsive layouts',
      'Collaborate on motion direction and microinteractions',
      'Work with developers or Framer builders to ensure accurate implementation',
      'Participate in reviews and push the work toward clarity',
    ],
    lookList: [
      'Experience across UX and UI',
      'Strong typography and layout skills',
      'Understanding of interaction and responsive design',
      'Ability to simplify complex ideas into clear interfaces',
    ],
  },
  {
    title: 'Creative Developer (Framer Focus)',
    desc: 'We’re looking for a Creative Developer with strong Framer skills to help bring our digital work to life. You’ll collaborate closely with designers to translate interfaces, motion, and structure into smooth, reliable interactions. This role is perfect for someone who loves mixing creativity with technical execution.',
    doList: [
      'Build websites and interactive experiences in Framer',
      'Implement animations, transitions, and motion systems',
      'Maintain performance and clean structure across pages',
      'Translate design assets into functional components',
      'Work directly with the design team to refine details',
    ],
    lookList: [
      'Strong Framer experience (React knowledge is a plus)',
      'Good understanding of layout, spacing, and visual detail',
      'Ability to problem-solve and adapt designs into real interactions',
      'Interest in motion, micro-interactions, and creative development',
    ],
  },
]

const List = ({ items }) => (
  <ul className="st-ci-ul">
    {items.map((t) => <li key={t}><p className="st-p">{t}</p></li>)}
  </ul>
)

function Item({ role }) {
  const [open, setOpen] = useState(false)
  const [h, setH] = useState({ closed: undefined, open: undefined })
  const qaRef = useRef(null)
  const titleRef = useRef(null)

  useLayoutEffect(() => {
    const measure = () => setH({
      closed: titleRef.current.getBoundingClientRect().height,
      open: qaRef.current.getBoundingClientRect().height,
    })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(qaRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`st-ci ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} data-cursor="hidden">
      <div className="st-ci-plus">
        <h4 className="st-ci-ph" aria-hidden="true">A</h4>
        <Plus className="st-ci-icon" />
      </div>
      <div className="st-ci-role" style={{ height: open ? h.open : h.closed }}>
        <div ref={qaRef} className="st-ci-qa">
          <h4 ref={titleRef} className="st-ci-title"><strong>{role.title}</strong></h4>
          <p className="st-p">{role.desc}</p>
          <div className="st-ci-block">
            <h6 className="st-ci-bh"><strong>What you’ll do</strong></h6>
            <List items={role.doList} />
          </div>
          <div className="st-ci-block">
            <h6 className="st-ci-bh"><strong>What we’re looking for</strong></h6>
            <List items={role.lookList} />
          </div>
          <div className="st-ci-block">
            <h6 className="st-ci-bh"><strong>How to apply</strong></h6>
            <p className="st-p">
              {APPLY}
              {/* Source quirk kept: href and visible address differ. */}
              <a className="st-ci-mail" href="mailto:hello@world.com"><strong>hello@wearemobis.com</strong></a>
              {' to be considered for the role.'}
            </p>
          </div>
          <div className="st-ci-border" />
        </div>
      </div>
    </div>
  )
}

export default function CareerAccordion() {
  return (
    <div className="st-acc">
      {ROLES.map((r) => <Item key={r.title} role={r} />)}
    </div>
  )
}
