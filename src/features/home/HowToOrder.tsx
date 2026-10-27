import { useId } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../../components/ui/SectionHeader'
import styles from './HowToOrder.module.css'

const STEPS: { title: string; text: string }[] = [
  {
    title: 'Alegeți produsele',
    text: 'Căutați după cod sau navigați pe categorii și adăugați produsele în lista de ofertă.',
  },
  {
    title: 'Trimiteți cererea',
    text: 'Completați datele firmei și cantitățile dorite. Puteți adăuga un mesaj cu detalii despre proiect.',
  },
  {
    title: 'Primiți oferta',
    text: 'Un consultant revine cu prețuri, disponibilitate și termen de livrare.',
  },
]

/** "Cum comanzi": the three-step quote flow, in a white card. */
export function HowToOrder() {
  const headingId = useId()

  return (
    <section className={`container ${styles.root}`} aria-labelledby={headingId}>
      <div className={styles.card}>
        <div className={styles.header}>
          <SectionHeader
            eyebrow="Cum comanzi"
            title="Fără coș de cumpărături. Doar ofertă rapidă."
            size="lg"
            id={headingId}
            action={
              <Link to="/lista-oferta" className="btn btn--primary">
                Cere ofertă
              </Link>
            }
          />
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
