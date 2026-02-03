import * as Icon from 'feather-icons-react'

const StatCard = ({ title, value, total, icon, progress, color = 'primary' }) => {
    const IconComponent = Icon[icon] || Icon.HelpCircle

    return (
        <div className="card stretch stretch-full">
            <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-4">
                    <div className="d-flex gap-4 align-items-center">
                        <div className="avatar-text avatar-lg bg-gray-200">
                            <IconComponent size={20} />
                        </div>
                        <div>
                            <div className="fs-4 fw-bold text-dark">
                                {value}{total && <span>/{total}</span>}
                            </div>
                            <h3 className="fs-13 fw-semibold text-truncate-1-line">{title}</h3>
                        </div>
                    </div>
                    <a href="javascript:void(0);">
                        <Icon.MoreVertical size={16} />
                    </a>
                </div>
                {progress !== undefined && (
                    <div className="pt-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <span className="fs-12 fw-medium text-muted text-truncate-1-line">{title}</span>
                            <div className="w-100 text-end">
                                <span className="fs-12 text-dark">{progress}%</span>
                            </div>
                        </div>
                        <div className="progress mt-2 ht-3">
                            <div
                                className={`progress-bar bg-${color}`}
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatCard
