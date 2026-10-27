import { CategoryGrid } from '../features/home/CategoryGrid'
import { HeroSection } from '../features/home/HeroSection'
import { HowToOrder } from '../features/home/HowToOrder'
import { NewsAndDownloads } from '../features/home/NewsAndDownloads'
import { PartnersStrip } from '../features/home/PartnersStrip'
import { usePageTitle } from '../lib/usePageTitle'

/** Home page ("/"): hero, partners, categories, how to order, news and downloads. */
export function HomePage() {
  usePageTitle(undefined)

  return (
    <>
      <HeroSection />
      <PartnersStrip />
      <CategoryGrid />
      <HowToOrder />
      <NewsAndDownloads />
    </>
  )
}
