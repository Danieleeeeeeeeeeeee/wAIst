const { useState, useEffect } = React;

// SVG Icons as components
const LeafIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: '#22c55e', strokeWidth: 2 },
  React.createElement('path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' }),
  React.createElement('path', { d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' })
);

const BoltIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
);

const CloudIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' })
);

const DropletIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('path', { d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' })
);

const ChartIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
  React.createElement('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
  React.createElement('line', { x1: '6', y1: '20', x2: '6', y2: '14' })
);

const InfoIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
  React.createElement('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
);

const MapPinIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
  React.createElement('circle', { cx: '12', cy: '10', r: '3' })
);

const SettingsIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
  React.createElement('path', { d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' })
);

const LightbulbIcon = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: '#f59e0b', strokeWidth: 2 },
  React.createElement('path', { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }),
  React.createElement('path', { d: 'M9 18h6' }),
  React.createElement('path', { d: 'M10 22h4' })
);

// Main App Component
const AICarbonTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usage, setUsage] = useState({
    queries: 0,
    images: 0,
    serviceCounts: {
      chatgpt: 0,
      claude: 0,
      gemini: 0,
      copilot: 0,
      midjourney: 0,
      dalle: 0
    },
    lastReset: Date.now()
  });

  // Energy consumption estimates based on Nature Sustainability research
  const ENERGY_PER_QUERY = 0.0005; // kWh per text query (~0.5 Wh)
  const ENERGY_PER_IMAGE = 0.0029; // kWh per image generation (~2.9 Wh)
  const CARBON_PER_KWH = 0.155; // kg CO2 per kWh (US average from study)
  const WATER_PER_KWH = 1.87; // Liters per kWh

  useEffect(() => {
    chrome.storage.local.get(['usage'], (result) => {
      if (result.usage) {
        setUsage(result.usage);
      }
    });

    const handleStorageChange = (changes) => {
      if (changes.usage) {
        setUsage(changes.usage.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Calculate totals
  const totalQueries = Object.values(usage.serviceCounts || {}).reduce((a, b) => a + b, 0);
  const energyConsumed = (usage.queries || 0) * ENERGY_PER_QUERY + (usage.images || 0) * ENERGY_PER_IMAGE;
  const carbonEmissions = energyConsumed * CARBON_PER_KWH;
  const waterFootprint = energyConsumed * WATER_PER_KWH;

  // Get max queries for progress bar calculation
  const maxQueries = Math.max(...Object.values(usage.serviceCounts || { default: 1 }), 1);

  // Render Header
  const renderHeader = () => {
    return React.createElement('div', { className: 'header' },
      React.createElement('div', { className: 'header-title' },
        React.createElement(LeafIcon),
        React.createElement('h1', null, 'AI Carbon Tracker')
      ),
      React.createElement('p', { className: 'header-subtitle' }, 'Based on Nature Sustainability research')
    );
  };

  // Render Tabs
  const renderTabs = () => {
    return React.createElement('div', { className: 'tabs' },
      React.createElement('button', {
        className: `tab ${activeTab === 'dashboard' ? 'active' : ''}`,
        onClick: () => setActiveTab('dashboard')
      }, 'Dashboard'),
      React.createElement('button', {
        className: `tab ${activeTab === 'regions' ? 'active' : ''}`,
        onClick: () => setActiveTab('regions')
      }, 'Regions'),
      React.createElement('button', {
        className: `tab ${activeTab === 'tips' ? 'active' : ''}`,
        onClick: () => setActiveTab('tips')
      }, 'Tips')
    );
  };

  // Render Dashboard Tab
  const renderDashboard = () => {
    return React.createElement('div', { className: 'content' },
      // Hero Banner
      React.createElement('div', { className: 'hero-banner' },
        React.createElement('h2', null, 'Your AI Impact This Month'),
        React.createElement('p', null, 'Track and reduce your environmental footprint')
      ),

      // Energy Card
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement(BoltIcon),
          React.createElement('span', null, 'Energy Consumed')
        ),
        React.createElement('div', { className: 'stat-value' },
          energyConsumed.toFixed(4),
          React.createElement('span', null, ' kWh')
        ),
        React.createElement('div', { className: 'stat-equivalent' },
          '≈ ' + Math.round(energyConsumed * 50) + ' hours of laptop charging'
        )
      ),

      // Carbon Card
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement(CloudIcon),
          React.createElement('span', null, 'Carbon Emissions')
        ),
        React.createElement('div', { className: 'stat-value' },
          carbonEmissions.toFixed(4),
          React.createElement('span', null, ' kg CO'),
          React.createElement('sub', null, '2')
        ),
        React.createElement('div', { className: 'stat-equivalent' },
          '≈ ' + (carbonEmissions * 2.3).toFixed(1) + ' miles driven in a car'
        )
      ),

      // Water Card
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement(DropletIcon),
          React.createElement('span', null, 'Water Footprint')
        ),
        React.createElement('div', { className: 'stat-value' },
          waterFootprint.toFixed(4),
          React.createElement('span', null, ' Liters')
        ),
        React.createElement('div', { className: 'stat-equivalent' },
          '≈ ' + Math.ceil(waterFootprint / 0.24) + ' cup' + (Math.ceil(waterFootprint / 0.24) !== 1 ? 's' : '') + ' of water'
        )
      ),

      // Service Breakdown
      React.createElement('div', { className: 'service-breakdown' },
        React.createElement('div', { className: 'service-breakdown-header' },
          React.createElement(ChartIcon),
          React.createElement('span', null, 'Service Breakdown')
        ),
        ['chatgpt', 'claude', 'midjourney'].map(service => {
          const count = usage.serviceCounts?.[service] || 0;
          const percentage = maxQueries > 0 ? (count / maxQueries) * 100 : 0;
          return React.createElement('div', { key: service, className: 'service-item' },
            React.createElement('div', { className: 'service-item-header' },
              React.createElement('span', { className: 'service-name' },
                service.charAt(0).toUpperCase() + service.slice(1)
              ),
              React.createElement('span', { className: 'service-queries' }, count + ' queries')
            ),
            React.createElement('div', { className: 'service-bar' },
              React.createElement('div', {
                className: `service-bar-fill ${service}`,
                style: { width: `${percentage}%` }
              })
            )
          );
        })
      ),

      // Footer
      React.createElement('div', { className: 'footer' },
        'Data from "Environmental impact and net-zero pathways for sustainable AI servers in the USA" (Nature Sustainability, 2025)'
      )
    );
  };

  // Render Regions Tab
  const renderRegions = () => {
    const regions = [
      { name: 'US West (WA, OR, CA)', pue: '1.1', carbon: '0.12', water: '1.8', renewable: '85%', color: 'green' },
      { name: 'US East (VA, NC)', pue: '1.15', carbon: '0.28', water: '2.1', renewable: '65%', color: 'yellow' },
      { name: 'US Central (TX, NE)', pue: '1.12', carbon: '0.35', water: '1.5', renewable: '75%', color: 'orange' },
      { name: 'US South (FL, GA)', pue: '1.2', carbon: '0.38', water: '2.5', renewable: '45%', color: 'red' }
    ];

    return React.createElement('div', { className: 'content' },
      // Hero Banner
      React.createElement('div', { className: 'hero-banner blue' },
        React.createElement('h2', null, 'Regional Impact'),
        React.createElement('p', null, 'Where your AI requests are processed')
      ),

      // Research Note
      React.createElement('div', { className: 'research-note' },
        React.createElement(InfoIcon),
        React.createElement('p', null,
          React.createElement('strong', null, 'From the research: '),
          'Southern states like Florida have 9% higher PUE and up to 39% higher water intensity than northern states like Washington.'
        )
      ),

      // Region Cards
      regions.map((region, index) =>
        React.createElement('div', { key: index, className: `region-card ${region.color}` },
          React.createElement('div', { className: 'region-card-header' },
            React.createElement(MapPinIcon),
            React.createElement('span', { className: 'region-name' }, region.name)
          ),
          React.createElement('div', { className: 'region-stats' },
            `PUE: ${region.pue} | Carbon: ${region.carbon} kg/kWh`,
            React.createElement('br'),
            `Water: ${region.water} L/kWh | Renewable: ${region.renewable}`
          )
        )
      ),

      // Optimal Locations
      React.createElement('div', { className: 'optimal-locations' },
        React.createElement('div', { className: 'optimal-locations-header' },
          React.createElement(SettingsIcon),
          React.createElement('span', null, 'Optimal Locations (from study)')
        ),
        React.createElement('div', { className: 'optimal-best' },
          React.createElement('div', { className: 'optimal-best-dot' }),
          React.createElement('div', { className: 'optimal-best-text' },
            React.createElement('strong', null, 'Best: '),
            React.createElement('span', null, 'Texas, Montana, Nebraska, South Dakota')
          )
        ),
        React.createElement('p', { className: 'optimal-reason' },
          'Low water scarcity + abundant renewables + favorable grid factors'
        )
      )
    );
  };

  // Render Tips Tab
  const renderTips = () => {
    const tips = [
      {
        title: 'Use Efficient Prompting',
        description: 'Clear, concise prompts reduce computational overhead. Avoid unnecessary regenerations.'
      },
      {
        title: 'Choose Lighter Models',
        description: 'Use smaller models for simple tasks. Save advanced models for complex problems.'
      },
      {
        title: 'Batch Your Requests',
        description: 'Group similar queries together to optimize server utilization (study shows 25-72% GPU utilization variance).'
      },
      {
        title: 'Support Green AI Providers',
        description: 'Choose services committed to renewable energy and transparency. The study found best practices can reduce carbon by 73%.'
      }
    ];

    return React.createElement('div', { className: 'content' },
      // Hero Banner
      React.createElement('div', { className: 'hero-banner purple' },
        React.createElement('h2', null, 'Sustainability Tips'),
        React.createElement('p', null, 'Reduce your AI environmental impact')
      ),

      // Tips
      tips.map((tip, index) =>
        React.createElement('div', { key: index, className: 'tip-card' },
          React.createElement('h3', null, tip.title),
          React.createElement('p', null, tip.description)
        )
      ),

      // Research Finding
      React.createElement('div', { className: 'research-finding' },
        React.createElement(LightbulbIcon),
        React.createElement('p', null,
          React.createElement('strong', null, 'Research Finding: '),
          'AI servers could consume 147-245 TWh annually by 2030. Your conscious usage helps reduce this impact.'
        )
      ),

      // Footer
      React.createElement('div', { className: 'footer' },
        'Data from "Environmental impact and net-zero pathways for sustainable AI servers in the USA" (Nature Sustainability, 2025)'
      )
    );
  };

  // Main render
  return React.createElement('div', { className: 'container' },
    renderHeader(),
    renderTabs(),
    activeTab === 'dashboard' && renderDashboard(),
    activeTab === 'regions' && renderRegions(),
    activeTab === 'tips' && renderTips()
  );
};

// Render the app
ReactDOM.render(
  React.createElement(AICarbonTracker),
  document.getElementById('root')
);