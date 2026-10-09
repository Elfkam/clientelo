import { ComparisonSection } from './components/ComparisonSection'
import { HeroSection } from './components/HeroSection'
import { IntroSection } from './components/IntroSection'
import { LeadSection } from './components/LeadSection'
import { PrivacySection } from './components/PrivacySection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SourcesSection } from './components/SourcesSection'
import { useEtfComparison, useFunnelTracking } from './hooks'

function App() {
  const { selectedEtfs, selectedFunds, toggleFund } = useEtfComparison()
  const track = useFunnelTracking(selectedEtfs)
  const handleLeadCtaClick = () => track('lead_cta_click', 'lead')

  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <IntroSection />
        <ComparisonSection
          selectedEtfs={selectedEtfs}
          selectedFunds={selectedFunds}
          toggleFund={toggleFund}
          onLeadCtaClick={handleLeadCtaClick}
        />
        <LeadSection track={track} />
        <SourcesSection />
        <PrivacySection />
      </main>
      <SiteFooter />
    </>
  )
}

export default App
