import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { handleModal } from '../function/handleModal';
import { useNavigate } from 'react-router-dom';

const Problem2 = () => {
    const [modalVisible, setModalVisible] = useState({
        modal: "",
        open: false
    });
    const [contacts, setContacts] = useState([]);
    const [usContacts, setUsContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [onlyEven, setOnlyEven] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://contact.mediusware.com/api/contacts/');
            const data = await response.json();
            setContacts(data.results);
            // Filter US Contacts
            const usContacts = data.results.filter(contact => contact.country.name === 'United States');
            setUsContacts(usContacts);
            setFilteredContacts(data.results);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
        setIsLoading(false);
    };

    const openModalA = () => {
        handleModal("Modal_A", true, setModalVisible)
    };

    const openModalB = () => {
        handleModal("Modal_B", true, setModalVisible)
    };

    const closeModal = () => {
        handleModal("", false, setModalVisible)
    };


    const handleCheckboxChange = () => {
        setOnlyEven(!onlyEven);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    // Filtering contacts based on search term and even IDs
    useEffect(() => {
        const filtered = contacts.filter(contact =>
            contact.phone.includes(searchTerm) &&
            (!onlyEven || contact.id % 2 === 0)
        );
        setFilteredContacts(filtered);
    }, [searchTerm, onlyEven, contacts]);

    // Load more contacts when scrolling to the bottom
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight
            ) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-outline-primary" type="button" onClick={() => navigate('all-contacts')}>All Contacts</button>
                    <button className="btn btn-lg btn-outline-warning" type="button" onClick={() => navigate('us-contacts')}>US Contacts</button>
                </div>
            </div>

            {modalVisible.modal === "Modal_A" && <Modal contacts={contacts} closeModal={closeModal} label="All Contacts" modalVisible={modalVisible} setModalVisible={setModalVisible} />}
            {modalVisible.modal === "Modal_B" && <Modal contacts={contacts} closeModal={closeModal} label="US Contacts" modalVisible={modalVisible} setModalVisible={setModalVisible} />}

            {/* Pagination */}
            {isLoading && <div>Loading...</div>}
            {!isLoading && (
                <button onClick={() => setCurrentPage(prevPage => prevPage + 1)}>Load More</button>
            )}
        </div>
    );
};

export default Problem2;
