import Column from "../Column/Column";
import "./BoardContent.scss"

import {
    initData
}

    from "../../actions/initData";

import {
    useState,
    useEffect
}

    from 'react'
import _ from 'lodash'

import {
    mapOrders
}

    from "../../utilities/sort";

import {
    Container,
    Draggable
}

    from "react-smooth-dnd";

import { applyDrag } from "../../utilities/applyDrag";

const BoardContent = () => {

    const [board,
        setBoard] = useState({}

        );
    const [columns,
        setColumns] = useState([]);

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

    useEffect(() => {
        const boardInitData = initData.boards.find(item => item.id === 'board-1');
        if (boardInitData) {
            setBoard(boardInitData);

            //sort Column
            setColumns(mapOrders(boardInitData.columns, boardInitData.columnOrder, 'id'))
        }
    }

        , []);

    if (_.isEmpty(board)) {
        return (<> <div className='not-found'>Board not found</div> </>)
    }

    return (<> <div className='board-columns'> <Container orientation="horizontal"

        getChildPayload={
            index => columns[index]
        }

        onDrop={
            onColumnDrop
        }

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
                return (<Draggable key={
                    column.id
                }

                > <Column column={
                    column}

                    onCardDrop={onCardDrop}


                    /> </Draggable>)
            }

            )
        }

    </Container> </div> </>)
}

export default BoardContent;