import Column from "../Column/Column";
import "./BoardContent.scss"

import { initData } from "../../actions/initData";

import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'

import { mapOrders } from "../../utilities/sort";

import { Container, Draggable } from "react-smooth-dnd";

import { applyDrag } from "../../utilities/applyDrag";
import { v4 as uuidv4 } from 'uuid';

const BoardContent = () => {

    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    const [isShowAddColumn, setIsShowAddColumn] = useState(false)
    const onColumnDrop = (dropResult) => {
        console.log('into info', dropResult);
        // const scene = Object.assign({}, this.state.scene);
        // scene.children = applyDrag(scene.children, dropResult);
        // this.setState({
        //     scene
        // });
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(column => column.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)
    }

    const onCardDrop = (dropResult, columnId) => {
        if (dropResult.remmovedIndex !== null || dropResult.addedIndex !== null) {

            let newColumns = [...columns];

            let currentColumns = newColumns.find(column => column.id === columnId)
            currentColumns.cards = applyDrag(currentColumns.cards, dropResult)
            currentColumns.cardOrder = currentColumns.cards.map(card => card.id)
            setColumns(newColumns)
        }
    }
    const handleAddColumn = () => {
        if (!valueInput) {
            if (inputRef && inputRef.current) {
                inputRef.current.focus();
            }
            return;
        }
        const _columns = _.cloneDeep(columns)
        _columns.push({
            id: uuidv4(),
            boardId: board.id,
            title: valueInput,
            cards: []
        })
        setColumns(_columns)
        setValueInput('')
        inputRef.current.focus();
    }

    const [valueInput, setValueInput] = useState('')
    const inputRef = useRef(null)
    useEffect(() => {
        if (isShowAddColumn === true && inputRef && inputRef.current)
            inputRef.current.focus();
    }, [isShowAddColumn])
    useEffect(() => {
        const boardInitData = initData.boards.find(item => item.id === 'board-1');
        if (boardInitData) {
            setBoard(boardInitData);

            //sort Column
            setColumns(mapOrders(boardInitData.columns, boardInitData.columnOrder, 'id'))
        }
    }

        , []);

    const onUpdateColumn = (newColumn) => {
        const columnIdUpdate = newColumn.id;
        let ncolumns = [...columns];
        let index = ncolumns.findIndex(item => item.id === columnIdUpdate)

        if (newColumn._destroy) {
            ncolumns.splice(index, 1);
        } else {
            ncolumns[index] = newColumn;
        }
        setColumns(ncolumns)
    }
    if (_.isEmpty(board)) {
        return (<> <div className='not-found'>Board not found</div> </>)
    }

    return (
        <>
            <div className='board-columns'>
                <Container orientation="horizontal"

                    getChildPayload={index => columns[index]}

                    onDrop={onColumnDrop}

                    dragHandleSelector=".column-drag-handle"

                    dropPlaceholder={
                        {
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'column-drop-preview'
                        }
                    }

                > {
                        columns && columns.length > 0 && columns.map((column, index) => {
                            return (
                                <Draggable key={column.id}>
                                    <Column
                                        column={column}
                                        onCardDrop={onCardDrop}
                                        onUpdateColumn={onUpdateColumn} />
                                </Draggable>)
                        }

                        )
                    }
                    {(isShowAddColumn === false) ?
                        <div className="add-new-column" onClick={() => setIsShowAddColumn(true)}>
                            <i className="fa fa-plus icon"></i>
                            Add New Column
                        </div>
                        :
                        <div className='content-add-column'>
                            <input type='text' className="form-control" ref={inputRef} value={valueInput} onChange={(event) => setValueInput(event.target.value)} />
                            <div className="group-btn">
                                <button className="btn btn-success" onClick={() => handleAddColumn()}>Add column</button>
                                <i className="fa fa-times icon" onClick={() => setIsShowAddColumn(false)} />
                            </div>
                        </div>
                    }
                </Container> </div> </>)
}

export default BoardContent;