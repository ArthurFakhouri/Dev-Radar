import { faTrash, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './styles.css'

function DevItem({ dev, onDelete }) {

    const [deleteStep, setDeleteStep] = useState(0);
    const [deleteIcon, setDeleteIcon] = useState(faTrash);

    function handleHover(e){
        e.target.style.color = "#666";
    }

    function handleReset(e){
        setDeleteStep(0);
        setDeleteIcon(faTrash);

        e.target.style.color = "#888";
        e.target.style.transition = "transition: color .5s;";
    }

    function handleDeleteDev(e){
        if(!deleteStep){
            setDeleteIcon(faTrashCanArrowUp);
            e.target.style.color = "red";
            setDeleteStep(1);
        } else {
            onDelete(dev.github_username);
        }
    }

    return (
        <li className='dev-item'>
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className='user-info'>
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
                <div className='user-settings'>
                    <FontAwesomeIcon onMouseOver={handleHover} onMouseLeave={handleReset} onClick={handleDeleteDev} icon={deleteIcon} />
                </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        </li>
    )
}

export default DevItem;