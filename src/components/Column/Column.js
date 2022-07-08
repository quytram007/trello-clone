import './Column.scss'
import Task from '../Task/Task'
const Column = () => {

    return (
        <>
            <div className='column'>
                <header>BrainStorm</header>
                <ul className='task-list'>
                    <Task />
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                    <li className='task-item'>Second</li>
                </ul>
                <footer>Add another card</footer>
            </div>
        </>
    )
}
export default Column;