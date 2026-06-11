import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Zap, Layers, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '120px'
    }}>
      {/* HERO SECTION */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        animation: 'fadeIn 0.6s ease'
      }}>
        {/* Glow effect tag */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '9999px',
          padding: '6px 16px',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontFamily: 'Space Grotesk',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ⚡ Real-time Multi-Exchange Analytics
        </div>

        <h1 className="gradient-text" style={{
          fontSize: '4rem',
          lineHeight: '1.1',
          maxWidth: '850px'
        }}>
          Detect and Execute <span style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Bitcoin Arbitrage</span> Instantly
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1.2rem',
          maxWidth: '650px',
          lineHeight: '1.6'
        }}>
          Monitor price discrepancies between top exchanges (Binance, Coinbase, WazirX, OKX, Kraken, Bybit). Automatically computes network fees, trading slippage, and displays guaranteed profit options.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px'
        }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Open Console Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Engineered for Millisecond Performance</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>Our server consumes real-time websockets to feed instant price variations.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1'
            }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>STOMP Socket Engine</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Connects directly to the Spring Boot message broker `/topic/arbitrage-alerts` to feed active price tick options instantly.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4'
            }}>
              <RefreshCw size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>Multi-Exchange Stream</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Simultaneously tracks order books across Binance, Coinbase, Bybit, WazirX, OKX, and Kraken to locate discrepancy margins.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>Secure JWT Protection</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Protects critical dashboard endpoints using cryptographically signed JSON Web Tokens (JWT) ensuring only authenticated queries succeed.
            </p>
          </div>
        </div>
      </section>

      {/* STATS PREVIEW DISPLAY */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center',
        background: 'rgba(17, 22, 34, 0.4)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '48px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '2rem' }}>Persistent Arbitrage Auditing</h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Any arbitrage opportunity yielding above 0.05% net profit after factoring in simulated exchange commission fees (0.1% buy commission + 0.1% sell commission + 1% WazirX TDS) is logged into our MongoDB database for audit trails.
          </p>
          <div style={{ display: 'flex', gap: '40px', marginTop: '12px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#34d399' }}>0.05%</div>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Minimum Profit Threshold</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#818cf8' }}>&lt; 100ms</div>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Alert Propagation Speed</p>
            </div>
          </div>
        </div>

        {/* Pseudo Mockup of Live Ticker */}
        <div className="glass-card" style={{
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <span style={{ color: '#818cf8', fontWeight: 600, fontFamily: 'Space Grotesk' }}>LIVE DEMO ALERTS</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span> Live Listening
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'white' }}>BTC/USDT</strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Buy: Binance → Sell: WazirX</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 'bold' }}>+$184.20 (0.28%)</span>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Just now</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'white' }}>BTC/USDT</strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Buy: Kraken → Sell: OKX</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 'bold' }}>+$96.50 (0.15%)</span>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>2 mins ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
