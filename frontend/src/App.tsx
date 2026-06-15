import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBand } from './components/StatsBand';
import { HowItWorks } from './components/HowItWorks';
import { Dashboard } from './components/Dashboard';
import { PayoutSimulator } from './components/PayoutSimulator';
import { Underwriters } from './components/Underwriters';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="bg-aurora min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <HowItWorks />
        <Dashboard />

        <section id="simulator" className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">See the math</h2>
            <p className="mt-3 text-slate-400">
              The payout scales with severity above the threshold, the same way it does on-chain.
            </p>
          </div>
          <div className="mt-8">
            <PayoutSimulator />
          </div>
        </section>

        <Underwriters />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default App;
