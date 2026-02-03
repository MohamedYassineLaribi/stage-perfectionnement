import { Link } from 'react-router-dom'

const PageHeader = ({ title, breadcrumb = [], children }) => {
    return (
        <div className="page-header">
            <div className="page-header-left d-flex align-items-center">
                <div className="page-header-title">
                    <h5 className="m-b-10">{title}</h5>
                </div>
                <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    {breadcrumb.map((item, index) => (
                        <li key={index} className="breadcrumb-item">
                            {item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="page-header-right ms-auto">
                <div className="page-header-right-items">
                    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
                        {children || (
                            <a href="javascript:void(0);" className="btn btn-md btn-light-brand">
                                <span>Filter</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHeader
