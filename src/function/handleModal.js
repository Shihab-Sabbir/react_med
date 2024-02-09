export const handleModal = (name, status, setModalVisible) => {
    setModalVisible({
        modal: name,
        status: status
    })
}