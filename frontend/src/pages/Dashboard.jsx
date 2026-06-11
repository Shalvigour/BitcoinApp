import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Database, DollarSign, ArrowUpRight, TrendingUp, RefreshCw, Filter } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [liveOpportunities, setLiveOpportunities] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState('All');
  const [wsStatus, setWsStatus] = useState('connecting'); // connecting, connected, disconnected
  const [wsError, setWsError] = useState('');

  const stompClientRef = useRef(null);

  const BACKEND_BASE_URL = 'http://localhost:8081/bitcoin';

  // 1. WEB-SOCKET (LIVE FEED) CONNECTION EFFECT
  useEffect(() => {
    let retryTimeout;
    const connectWebSocket = () => {
      setWsStatus('connecting');
      setWsError('');
      try {
        const socket = new SockJS(`${BACKEND_BASE_URL}/bitcoin-ws`);
        const stompClient = Stomp.over(socket);

        stompClient.debug = () => {};

        stompClient.connect(
          {},
          (frame) => {
            setWsStatus('connected');
            setWsError('');
            stompClientRef.current = stompClient;

            stompClient.subscribe('/topic/arbitrage-alerts', (message) => {
              if (message.body) {
                const opportunity = JSON.parse(message.body);
                setLiveOpportunities((prev) => [opportunity, ...prev.slice(0, 14)]);
              }
            });
          },
          (error) => {
            console.error('STOMP protocol error:', error);
            setWsStatus('disconnected');
            setWsError(error?.headers?.message || error?.message || 'Handshake failed (possible CORS or network block)');
            retryTimeout = setTimeout(connectWebSocket, 5000);
          }
        );
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setWsStatus('disconnected');
        setWsError(err.toString());
        retryTimeout = setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  // 2. FETCH HISTORICAL OPPORTUNITIES (API CONNECTION)
  // - Page load hote hi MongoDB se save data fetch karenge from '/api/history'.
  // - Kyunki requests Security filter chain se checked hain, isliye JWT header zaroori hai: 'Authorization: Bearer <TOKEN>'.
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  // Filters logic
  const filteredHistory = history.filter((item) => {
    if (selectedCoin === 'All') return true;
    return item.coin?.toUpperCase() === selectedCoin.toUpperCase();
  });

  // Calculate quick mock statistics based on history database
  const totalArbitrages = history.length;
  const bestOpportunity = history.reduce((max, item) => (item.profitPercentage > max ? item.profitPercentage : max), 0);
  const avgProfit = history.length > 0 
    ? (history.reduce((sum, item) => sum + item.netProfit, 0) / history.length).toFixed(2) 
    : '0.00';

  const coinsList = ['All', ...new Set(history.map(item => item.coin).filter(Boolean))];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      animation: 'fadeIn 0.5s ease'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Terminal Console</h1>
          <p style={{ color: '#94a3b8' }}>Welcome back, {user?.firstName}. Welcome to real-time arbitrage streams.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* WS Status Badge */}
          <div style={{
            background: wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.1)' : wsStatus === 'connecting' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.2)' : wsStatus === 'connecting' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontFamily: 'Space Grotesk',
            color: wsStatus === 'connected' ? '#34d399' : wsStatus === 'connecting' ? '#fbbf24' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: wsStatus === 'connected' ? '#10b981' : wsStatus === 'connecting' ? '#f59e0b' : '#ef4444',
              display: 'inline-block',
              boxShadow: `0 0 10px ${wsStatus === 'connected' ? '#10b981' : wsStatus === 'connecting' ? '#f59e0b' : '#ef4444'}`
            }}></span>
            {wsStatus === 'connected' 
              ? 'WEBSOCKET ACTIVE' 
              : wsStatus === 'connecting' 
                ? 'CONNECTING SOCKET' 
                : `SOCKET OFFLINE ${wsError ? `(${wsError})` : ''}`}
          </div>

          <button onClick={fetchHistory} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Database Signals</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{totalArbitrages}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Best Margin</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#34d399' }}>
              {bestOpportunity > 0 ? `${bestOpportunity.toFixed(2)}%` : '0.00%'}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Avg Net Profit</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>${avgProfit}</div>
          </div>
        </div>
      </div>

      {/* WORKSPACE PANELS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px'
      }}>
        
        {/* LIVE FEEDS */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.03)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#10b981" />
              Live Arbitrage Feed
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Update frequency: Real-time</span>
          </div>

          {liveOpportunities.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div className="spinner" style={{ borderColor: 'rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981' }}></div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Listening for market deviations. Waiting for profits &gt; 0.05%...
              </p>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Ensure your Spring Boot backend runs OKX/Kraken/Binance Streamers to generate tick alerts.
              </span>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th>Buy Exchange</th>
                    <th>Sell Exchange</th>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                    <th>Net Profit</th>
                    <th>Margin</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOpportunities.map((opp, idx) => (
                    <tr key={opp.id || idx} className="live-alert-card">
                      <td><strong style={{ color: '#ffffff' }}>{opp.coin}</strong></td>
                      <td><span className="badge badge-indigo">{opp.buyExchange}</span></td>
                      <td><span className="badge badge-rose">{opp.sellExchange}</span></td>
                      <td>${opp.buyPrice?.toFixed(2)}</td>
                      <td>${opp.sellPrice?.toFixed(2)}</td>
                      <td style={{ color: '#34d399', fontWeight: 600 }}>+${opp.netProfit?.toFixed(2)}</td>
                      <td><span className="badge badge-emerald">{opp.profitPercentage?.toFixed(2)}%</span></td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {opp.timestamp ? new Date(opp.timestamp).toLocaleTimeString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* HISTORICAL LOG DATABASE */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="#6366f1" />
              Logged Opportunities (MongoDB Audit)
            </h2>

            {/* Filter controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Filter size={16} color="#64748b" />
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Coin Filter:</span>
              <select 
                className="form-select" 
                style={{ width: '110px', padding: '6px 12px', fontSize: '0.85rem', margin: 0 }}
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
              >
                {coinsList.map((coin) => (
                  <option key={coin} value={coin}>{coin}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '12px',
              color: '#94a3b8',
              fontSize: '0.9rem'
            }}>
              No historical opportunities logged for selection.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Coin</th>
                    <th>Buy Route</th>
                    <th>Sell Route</th>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                    <th>Fees & Net Profit</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td><strong>{item.coin}</strong></td>
                      <td><span className="badge badge-indigo" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>{item.buyExchange}</span></td>
                      <td><span className="badge badge-rose" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>{item.sellExchange}</span></td>
                      <td>${item.buyPrice?.toFixed(2)}</td>
                      <td>${item.sellPrice?.toFixed(2)}</td>
                      <td style={{ color: '#34d399', fontWeight: 600 }}>+${item.netProfit?.toFixed(2)}</td>
                      <td><span className="badge badge-emerald">{item.profitPercentage?.toFixed(2)}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
