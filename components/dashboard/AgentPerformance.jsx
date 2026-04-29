export default function AgentPerformance({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No agent data yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((agent) => {
        const closedRate = agent.totalAssigned > 0
          ? Math.round((agent.closed / agent.totalAssigned) * 100)
          : 0;

        return (
          <div key={agent._id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                  {agent.agentName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{agent.agentName}</p>
                  <p className="text-gray-500 text-xs">{agent.agentEmail}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-bold text-lg">{agent.totalAssigned}</span>
                <p className="text-gray-500 text-xs">total leads</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${closedRate}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{closedRate}% close rate</span>
              <div className="flex gap-3">
                <span className="text-blue-400">🔵 {agent.new} new</span>
                <span className="text-orange-400">🟠 {agent.inProgress} active</span>
                <span className="text-emerald-400">🟢 {agent.closed} closed</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}