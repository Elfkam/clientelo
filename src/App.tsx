import { ComparisonSection } from "./components/ComparisonSection";
import { HeroSection } from "./components/HeroSection";
import { LeadSection } from "./components/LeadSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { SourcesSection } from "./components/SourcesSection";
import { useEtfComparison, useFunnelTracking } from "./hooks";

function App() {
    const {
        selectedEtfs,
        selectedTickers,
        selectedFunds,
        toggleFund,
        selectFund,
    } = useEtfComparison();
    const track = useFunnelTracking(selectedTickers);
    const handleLeadCtaClick = () => track("lead_cta_click", "lead");

    return (
        <>
            <SiteHeader />
            <main id="top">
                <HeroSection />
                <ComparisonSection
                    selectedEtfs={selectedEtfs}
                    selectedFunds={selectedFunds}
                    toggleFund={toggleFund}
                    selectFund={selectFund}
                    onLeadCtaClick={handleLeadCtaClick}
                />
                <LeadSection track={track} />
                <SourcesSection />
            </main>
            <SiteFooter />
        </>
    );
}

export default App;
