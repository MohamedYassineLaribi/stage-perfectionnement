import PageHeader from '@components/PageHeader'
import StatCard from '@components/StatCard'

const Analytics = () => {
    const analyticsStats = [
        { title: 'Site Sessions', value: '12.4k', icon: 'Globe', progress: 45, color: 'primary' },
        { title: 'Avg. Visit Duration', value: '4m 32s', icon: 'Clock', progress: 12, color: 'success' },
        { title: 'Bounce Rate', value: '32%', icon: 'ArrowDownRight', progress: 32, color: 'danger' },
        { title: 'New Users', value: '1.2k', icon: 'UserPlus', progress: 68, color: 'info' },
    ]

    return (
        <div className="main-content">
            <PageHeader title="Analytics" breadcrumb={[{ label: 'Analytics' }]} />

            <div className="row mb-4">
                {analyticsStats.map((stat, idx) => (
                    <div key={idx} className="col-xxl-3 col-md-6 mb-4">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card stretch stretch-full border-0 shadow-sm rounded-4">
                        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                            <h5 className="card-title fw-bold mb-0">Répartition Géographique des Clients</h5>
                            <PageHeader.Link to="/customers" label="Détails" />
                        </div>
                        <div className="card-body">
                            <div className="rounded-4 overflow-hidden position-relative" style={{ height: '400px', background: '#f8f9fa' }}>
                                <iframe
                                    title="Client Map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src="https://maps.google.com/maps?q=Paris,Marseille,Lyon,Toulouse,Nice&t=&z=5&ie=UTF8&iwloc=&output=embed"
                                    style={{ filter: 'grayscale(0.2) contrast(1.1) brightness(1.1)', border: 'none' }}
                                ></iframe>
                                <div className="position-absolute bottom-0 end-0 m-3 bg-white p-2 rounded shadow-sm small">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                                        <span>Concentration forte</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                                        <span>Concentration modérée</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card stretch stretch-full border-0 shadow-sm rounded-4">
                        <div className="card-header bg-transparent border-0 py-3">
                            <h5 className="card-title fw-bold mb-0">Top Régions</h5>
                        </div>
                        <div className="card-body pt-0">
                            {[
                                { name: 'Île-de-France', count: 42, color: 'primary' },
                                { name: 'Auvergne-Rhône-Alpes', count: 28, color: 'info' },
                                { name: 'Provence-Alpes-Côte d\'Azur', count: 15, color: 'success' },
                                { name: 'Occitanie', count: 12, color: 'warning' }
                            ].map((region, idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="d-flex justify-content-between mb-1 small">
                                        <span className="fw-bold">{region.name}</span>
                                        <span className="text-muted">{region.count} clients</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div
                                            className={`progress-bar bg-${region.color}`}
                                            style={{ width: `${(region.count / 42) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Simple internal component if PageHeader.Link doesn't exist
PageHeader.Link = ({ to, label }) => (
    <button className="btn btn-sm btn-light rounded-pill px-3" onClick={() => window.location.href = to}>{label}</button>
);

export default Analytics
