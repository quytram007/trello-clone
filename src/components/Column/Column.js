import './Column.scss'
import Card from '../Card/Card'
import { mapOrders } from '../../utilities/sort';
const Column = (props) => {
    const { column } = props;
    const cards = mapOrders(column.cards, column.cardOrder, 'id');
    return (
        <>
            <div className='column'>
                <header>{column.title}</header>
                <ul className='card-list'>
                    {cards && cards.length > 0 && cards.map((card, index) => {
                        return (
                            <Card
                                key={card.id}
                                card={card}
                            />
                        )
                    })}
                </ul>
                <footer>Add another card</footer>
            </div>
        </>
    )
}
export default Column;