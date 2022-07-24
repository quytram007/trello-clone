import './Column.scss'
import Card from '../Card/Card'
import { mapOrders } from '../../utilities/sort';
import { Container, Draggable } from 'react-smooth-dnd';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmModal from '../Common/ConfirmModal';
import { useEffect, useRef, useState } from 'react';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constant';
import { FormControl } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
const Column = (props) => {
    const { column, onCardDrop, onUpdateColumn } = props;
    const cards = mapOrders(column.cards, column.cardOrder, 'id');

    const [valueNewCard, setValueNewCard] = useState('')
    const [isShowModelDelete, setisShowModelDelete] = useState(false);
    const [titleColumn, setTitleColumn] = useState('');
    const [isFirstClick, setIsFirstClick] = useState(true);
    const inputRef = useRef(null)
    const inputTextAreaRef = useRef(null)
    const [isShowAddCard, setIsShowAddCard] = useState(false)
    useEffect(() => {
        if (column && column.title) {
            setTitleColumn(column.title)
        }
    }, [column])

    useEffect(() => {
        if (isShowAddCard === true && inputTextAreaRef && inputTextAreaRef.current) {
            inputTextAreaRef.current.focus();
        }

    }, [isShowAddCard])
    const toggleModal = () => {
        setisShowModelDelete(!isShowModelDelete)
    }
    const onModalAction = (type) => {
        if (type === MODAL_ACTION_CLOSE) {

        }
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn)
        }

        toggleModal();
    }
    const selectAllText = (event) => {
        setIsFirstClick(false);
        if (isFirstClick) {
            event.target.select();
        } else {
            inputRef.current.setSelectionRange(titleColumn.length, titleColumn.length)
        }
    }
    const handleClickOutSide = () => {
        setIsFirstClick(true)
        const newColumn = {
            ...column,
            title: titleColumn,
            _destroy: false
        }
        onUpdateColumn(newColumn)
    }
    const handleConfirmNewCard = () => {
        if (isShowAddCard === true && !valueNewCard) {
            inputTextAreaRef.current.focus();
            return;
        }

        const newCard = {
            id: uuidv4(),
            boardId: column.boardId,
            columnId: column.id,
            title: valueNewCard,
            image: null
        }
        let newColumn = { ...column };
        newColumn.cards = [...newColumn.cards, newCard];
        newColumn.cardOrder = newColumn.cards.map(card => card.id)

        onUpdateColumn(newColumn)
        setValueNewCard("")
        setIsShowAddCard(!isShowAddCard)
    }

    return (
        <>
            <div className='column'>
                <header className='column-drag-handle'>
                    <div className='column-title'>
                        <FormControl
                            className='customize-input-column'
                            size='sm'
                            type='text'
                            value={titleColumn}
                            onClick={selectAllText}
                            onChange={(event) => setTitleColumn(event.target.value)}
                            spellCheck='false'
                            onBlur={handleClickOutSide}
                            onMouseDown={(e) => e.preventDefault()}
                            ref={inputRef}
                        />
                    </div>
                    <div className='column-dropdown'>
                        <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic" size='sm'>

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Add Card</Dropdown.Item>
                                <Dropdown.Item onClick={toggleModal}>Remove Card</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header>

                <div className='card-list'>
                    <Container
                        groupName="col"
                        onDragStart={e => console.log("drag started", e)}
                        onDragEnd={e => console.log("drag end", e)}
                        onDrop={(dropResult) => onCardDrop(dropResult, column.id)}
                        getChildPayload={index => cards[index]
                        }
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        onDragEnter={() => {
                            console.log("drag enter:", column.id);
                        }}
                        onDragLeave={() => {
                            console.log("drag leave:", column.id);
                        }}
                        onDropReady={p => console.log('Drop ready: ', p)}
                        dropPlaceholder={{
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'card-drop-preview'
                        }}
                        dropPlaceholderAnimationDuration={200}
                    >
                        {cards && cards.length > 0 && cards.map((card, index) => {
                            return (
                                <Draggable key={card.id}>
                                    <Card
                                        card={card}
                                    />
                                </Draggable>
                            )
                        })}
                    </Container>
                    {(isShowAddCard === true) &&
                        <div className='add-new-card'>
                            <textarea type='text'
                                className="form-control"
                                rows='2'
                                ref={inputTextAreaRef}
                                placeholder='Enter a new card...'
                                value={valueNewCard}
                                onChange={(event) => { setValueNewCard(event.target.value) }}
                            ></textarea>
                            <div className="group-btn"          >
                                <button className="btn btn-primary"
                                    onClick={() => { handleConfirmNewCard() }}>
                                    Add Card</button>
                                <i className="fa fa-times icon" onClick={() => setIsShowAddCard(!isShowAddCard)} />
                            </div>
                        </div>
                    }
                </div>
                {isShowAddCard === false &&
                    <footer>
                        <div className='footer-action' onClick={() => setIsShowAddCard(!isShowAddCard)}>
                            <i className='fa fa-plus icon'></i>
                            Add another card
                        </div>
                    </footer>
                }
            </div>
            <ConfirmModal
                show={isShowModelDelete}
                title={"Remove a column"}
                content={`Are you sure to remove this column: <b>${column.title}</b>`}
                onAction={onModalAction}
            />
        </>
    )
}
export default Column;