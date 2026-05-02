export default function AgentPerformance({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(229,234,245,0.3)', fontSize: '14px' }}>
        No agent data yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((agent) => {
        const rate = agent.totalAssigned > 0 ? Math.round((agent.closed / agent.totalAssigned) * 100) : 0;
        return (
          <div key={agent._id} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(160,210,235,0.08)',
            borderRadius: '14px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #8459B3, #D0B0F4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '14px', color: 'white',
                }}>
                  {agent.agentName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{agent.agentName}</div>
                  <div style={{ color: 'rgba(160,210,235,0.45)', fontSize: '12px' }}>{agent.agentEmail}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '20px', fontFamily: 'Playfair Display, serif' }}>
                  {agent.totalAssigned}
                </div>
                <div style={{ color: 'rgba(229,234,245,0.35)', fontSize: '11px' }}>total leads</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '4px', marginBottom: '10px' }}>
              <div style={{
                width: `${rate}%`, height: '4px', borderRadius: '999px',
                background: 'linear-gradient(90deg, #8459B3, #A0D2EB)',
                transition: 'width 0.6s ease',
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'rgba(229,234,245,0.4)' }}>{rate}% close rate</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#A0D2EB' }}>{agent.new} new</span>
                <span style={{ color: '#fb923c' }}>{agent.inProgress} active</span>
                <span style={{ color: '#34d399' }}>{agent.closed} closed</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}