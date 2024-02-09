import React, { useEffect, useState } from 'react';
import '../assets/scss/Modal.scss';
import { fetchContacts } from '../function/fetchContacts';
import { useNavigate } from 'react-router-dom';

const Modal = ({ label }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [searchNow, setSearchNow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selected, setSelected] = useState({
        isSelected: false,
        id: "",
        phone: "",
        country: ""
    })
    const [onlyEven, setOnlyEven] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let country;
        if (label === "US Contacts") {
            country = "United States"
        }
        else {
            country = "";
        }

        fetchContacts(contacts, setContacts, country, searchQuery, currentPage, setIsLoading);

    }, [label, searchQuery, searchNow, currentPage])

    const handleSearchChange = (e) => {
        const newValue = e.target.value;
        setSearchInput(newValue)
        setTimeout(() => {
            setSearchQuery(newValue);
        }, 2000)
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
        navigate('/Problem-2')
    };

    const handleCheckboxChange = (e) => {
        setOnlyEven(e.target.checked);
    };

    const filteredContacts = contacts?.filter(contact => {
        if (onlyEven) {
            return contact.id % 2 === 0;
        } else {
            return true;
        }
    });


    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const bottom = scrollHeight - Math.ceil(scrollTop) === clientHeight;
        if (bottom && !isLoading) {
            setScrollPosition(scrollTop - 100);
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        const scrollableElement = document.getElementById('modalContent');
        scrollableElement.addEventListener('scroll', handleScroll);
        // scrollableElement.scrollTop = 0;

        return () => {
            scrollableElement.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, scrollPosition]);

    console.log({ currentPage, contacts })

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!isOpen}>
            {!selected.isSelected ? <div className="modal-dialog" role="document"
                onScroll={handleScroll}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{label}</h5>
                        <button type="button" className="close" onClick={toggleModal} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Search contacts..."
                                className="form-control"
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => {
                                    setSearchNow((prev) => !prev)
                                }}
                                onKeyUp={() => {
                                    if (e.key === 'Enter') {
                                        setSearchNow((prev) => !prev);
                                    }
                                }}
                            >
                                Search
                            </button>
                        </div>
                        <div
                            id='modalContent' style={{ maxHeight: '62vh', overflowY: 'auto' }}
                        >
                            {filteredContacts?.map(contact => (
                                <div key={contact.id} className="border mb-2 p-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelected({
                                            isSelected: true,
                                            id: contact?.id,
                                            phone: contact?.phone,
                                            country: contact?.country?.name
                                        })
                                    }}
                                >
                                    <p><strong>ID:</strong> {contact?.id}</p>
                                    <p><strong>Phone:</strong> {contact?.phone}</p>
                                    <p><strong>Country:</strong> {contact?.country?.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {
                        isLoading && <p>Loading...</p>
                    }
                    <div className="modal-footer d-flex justify-content-between">
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="onlyEvenCheckboxFooter"
                                checked={onlyEven}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="onlyEvenCheckboxFooter">Only even</label>
                        </div>
                        <div className='d-flex gap-2'>
                            <button type="button"
                                className="btn btn-white border"
                                onClick={() => navigate('/problem-2/all-contacts')}                            >
                                A
                            </button>
                            <button type="button"
                                className="btn"
                                onClick={() => navigate('/problem-2/us-contacts')}
                                style={{ background: '#ff7f50' }}
                            >
                                B
                            </button>
                            <button type="button" className="btn btn-white border" onClick={toggleModal}>C</button>
                        </div>
                    </div>
                </div>
            </div>
                :
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><strong>Contact ID : {selected?.id}</strong></h5>
                            <button type="button" className="close" onClick={toggleModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="border mb-2 p-2">
                                <p><strong>Phone:</strong> {selected?.phone}</p>
                                <p><strong>Country:</strong> {selected?.country}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className='d-flex gap-2'>
                                <button type="button" className="btn btn-white border" onClick={toggleModal}>C</button>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    );
};

export default Modal;
