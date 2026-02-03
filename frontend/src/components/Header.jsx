import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as Icon from 'feather-icons-react'
import { useTheme } from '../contexts/ThemeContext'
import { Dropdown, Spinner } from 'react-bootstrap'
import leadService from '../services/leadService'
import contactService from '../services/contactService'
import offerService from '../services/offerService'
import { useEffect } from 'react'
import { useCallback } from 'react'

const Header = ({ onMenuClick, onToggleSidebar, sidebarCollapsed }) => {
    const { user, logout } = useAuth()
    const { darkMode, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState({ leads: [], contacts: [], offers: [] })
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const performSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults({ leads: [], contacts: [], offers: [] })
            return
        }
        setIsSearching(true)
        setShowResults(true)
        try {
            // In a real app, you might have a single search endpoint
            // Here we parallelize the searches using existing services
            const [leads, contacts, offers] = await Promise.all([
                leadService.getAll(),
                contactService.getAll(),
                offerService.getAll()
            ])

            const filteredLeads = leads.filter(l =>
                l.name?.toLowerCase().includes(query.toLowerCase()) ||
                l.email?.toLowerCase().includes(query.toLowerCase()) ||
                l.company?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3)

            const filteredContacts = contacts.filter(c =>
                `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
                c.email?.toLowerCase().includes(query.toLowerCase()) ||
                c.companyName?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3)

            const filteredOffers = offers.filter(o =>
                o.reference?.toLowerCase().includes(query.toLowerCase()) ||
                o.title?.toLowerCase().includes(query.toLowerCase()) ||
                o.client?.companyName?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3)

            setSearchResults({ leads: filteredLeads, contacts: filteredContacts, offers: filteredOffers })
        } catch (error) {
            console.error("Search failed", error)
        } finally {
            setIsSearching(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch(searchQuery)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchQuery, performSearch])

    const hasResults = searchResults.leads.length > 0 || searchResults.contacts.length > 0 || searchResults.offers.length > 0

    return (
        <header
            className="nxl-header"
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                left: sidebarCollapsed ? '80px' : '280px',
                zIndex: 1020,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '0',
                transition: 'left 0.3s ease',
            }}
        >
            <div
                className="header-wrapper d-flex align-items-center justify-content-between px-4"
                style={{
                    height: '80px',
                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
                }}
            >
                {/* Header Left: Toggle */}
                <div className="d-flex align-items-center gap-4">
                    <button
                        className="btn btn-light bg-transparent border-0 p-2 rounded-circle hover-primary transition-all"
                        onClick={onToggleSidebar}
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <Icon.Menu size={20} />
                    </button>
                </div>

                {/* Header Center: Search (Centered) */}
                <div className="d-none d-md-flex align-items-center position-relative mx-auto" style={{ zIndex: 1060 }}>
                    <Icon.Search
                        size={16}
                        className="position-absolute ms-3 text-muted"
                        style={{ pointerEvents: 'none', zIndex: 1 }}
                    />
                    <input
                        type="text"
                        className="form-control border-0 bg-light ps-5 pe-4 rounded-pill"
                        placeholder="Rechercher tout (leads, contacts, offres)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowResults(true)}
                        style={{
                            height: '40px',
                            width: '400px',
                            fontSize: '0.9rem',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    />
                    {isSearching && (
                        <div className="position-absolute end-0 me-3">
                            <Spinner animation="border" size="sm" variant="primary" />
                        </div>
                    )}

                    {/* Search Results Dropdown */}
                    {showResults && searchQuery.length >= 2 && (
                        <div className="position-absolute top-100 start-0 w-100 bg-white shadow-lg rounded-4 mt-2 p-2 border overflow-hidden"
                            style={{ minWidth: '400px', maxHeight: '400px', overflowY: 'auto' }}>
                            {!isSearching && !hasResults && (
                                <div className="p-3 text-center text-muted">Aucun résultat trouvé pour "{searchQuery}"</div>
                            )}

                            {searchResults.leads.length > 0 && (
                                <div className="mb-2">
                                    <h6 className="px-3 py-2 text-primary fw-bold small text-uppercase mb-0">Leads</h6>
                                    {searchResults.leads.map(lead => (
                                        <div key={lead._id} className="px-3 py-2 hover-bg-light cursor-pointer rounded-3 d-flex align-items-center" onClick={() => { navigate(`/leads/view/${lead._id}`); setShowResults(false); }}>
                                            <Icon.Target size={14} className="me-2 text-muted" />
                                            <div>
                                                <div className="fw-bold small">{lead.name}</div>
                                                <div className="text-muted smaller">{lead.company}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchResults.contacts.length > 0 && (
                                <div className="mb-2">
                                    <h6 className="px-3 py-2 text-success fw-bold small text-uppercase mb-0">Contacts</h6>
                                    {searchResults.contacts.map(contact => (
                                        <div key={contact._id} className="px-3 py-2 hover-bg-light cursor-pointer rounded-3 d-flex align-items-center" onClick={() => { navigate(`/contacts/view/${contact._id}`); setShowResults(false); }}>
                                            <Icon.User size={14} className="me-2 text-muted" />
                                            <div>
                                                <div className="fw-bold small">{contact.firstName} {contact.lastName}</div>
                                                <div className="text-muted smaller">{contact.companyName}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchResults.offers.length > 0 && (
                                <div className="mb-0">
                                    <h6 className="px-3 py-2 text-warning fw-bold small text-uppercase mb-0">Offres</h6>
                                    {searchResults.offers.map(offer => (
                                        <div key={offer._id} className="px-3 py-2 hover-bg-light cursor-pointer rounded-3 d-flex align-items-center" onClick={() => { navigate(`/offers/view/${offer._id}`); setShowResults(false); }}>
                                            <Icon.FileText size={14} className="me-2 text-muted" />
                                            <div>
                                                <div className="fw-bold small">{offer.reference} - {offer.title}</div>
                                                <div className="text-muted smaller">{offer.client?.companyName}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Overlay to close results */}
                {showResults && <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }} onClick={() => setShowResults(false)}></div>}

                {/* Header Right: Actions & Profile */}
                <div className="d-flex align-items-center gap-3">

                    {/* Theme Toggle */}
                    <button
                        className="btn btn-light bg-white border shadow-sm p-2 rounded-circle d-flex align-items-center justify-content-center transition-transform hover-scale"
                        onClick={toggleTheme}
                        style={{ width: '40px', height: '40px' }}
                    >
                        {darkMode ? <Icon.Sun size={18} className="text-warning" /> : <Icon.Moon size={18} className="text-primary" />}
                    </button>

                    {/* Notifications */}
                    <Dropdown align="end">
                        <Dropdown.Toggle as="button" className="btn btn-light bg-white border shadow-sm p-2 rounded-circle d-flex align-items-center justify-content-center position-relative no-caret transition-transform hover-scale" style={{ width: '40px', height: '40px' }}>
                            <Icon.Bell size={18} className="text-secondary" />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light p-1">
                                <span className="visually-hidden">New alerts</span>
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 p-0 overflow-hidden" style={{ width: '300px' }}>
                            <div className="p-3 border-bottom bg-light">
                                <h6 className="fw-bold mb-0 text-dark">Notifications</h6>
                            </div>
                            <div className="p-3 text-center text-muted fs-6">
                                <Icon.Inbox size={24} className="mb-2 opacity-50" />
                                <p className="mb-0 small">Aucune nouvelle notification</p>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className="vr mx-2 text-muted opacity-25"></div>

                    {/* User Profile */}
                    <Dropdown align="end">
                        <Dropdown.Toggle as="div" className="d-flex align-items-center gap-3 cursor-pointer p-1 rounded-pill pe-3 hover-bg-light transition-all border border-transparent hover-border no-caret">
                            <div className="avatar bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                }}>
                                <span className="fw-bold fs-6">{user?.name?.charAt(0) || 'U'}</span>
                            </div>
                            <div className="d-none d-xl-block text-start">
                                <h6 className="mb-0 fw-bold text-dark fs-14">{user?.name || 'Utilisateur'}</h6>
                                <span className="text-muted fs-11">{user?.role?.name || 'Admin'}</span>
                            </div>
                            <Icon.ChevronDown size={14} className="text-muted ms-1" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 p-2 mt-2" style={{ width: '220px' }}>
                            <Dropdown.Item as={Link} to="/profile" className="rounded-3 py-2 d-flex align-items-center">
                                <Icon.User size={16} className="me-2 text-primary" /> Mon Profil
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/settings" className="rounded-3 py-2 d-flex align-items-center">
                                <Icon.Settings size={16} className="me-2 text-primary" /> Paramètres
                            </Dropdown.Item>
                            <Dropdown.Divider className="my-2 opacity-50" />
                            <Dropdown.Item onClick={() => { logout(); navigate('/login'); }} className="rounded-3 py-2 d-flex align-items-center text-danger hover-bg-danger-subtle">
                                <Icon.LogOut size={16} className="me-2" /> Déconnexion
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
            </div>
        </header>
    )
}

export default Header
