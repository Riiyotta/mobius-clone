import ParallaxImage from './ParallaxImage'
import ContactInfo from './ContactInfo'

// Image + contact card (contacts.md §2.2; tablet §6; phone §7).
// Desktop: card overlaid on the 100vh image. Tablet/phone: card in flow below the image.
export default function ContactImage({ desktop, phone }) {
  const P = desktop ? 300 : phone ? 0 : 200
  return (
    <section className="ct-img">
      <div className="ct-img-in">
        <div className="ct-bar" />
        <div className="ct-img-c">
          <div className="ct-par-pad">
            <ParallaxImage src="/assets/img/uFUviw9ZrPHHXKTg0Uk6Ceg3IM.jpg" P={P} />
          </div>
          <div className="ct-info">
            <div className="ct-info-sp" />
            <div className="ct-info-sec">
              <ContactInfo desktop={desktop} />
            </div>
            <div className="ct-info-sp2" />
          </div>
        </div>
      </div>
    </section>
  )
}
