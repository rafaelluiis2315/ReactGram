import './Photo.css';

import { uploads } from '../../utils/config';

// Components
import Message from '../../components/Message';
import { Link } from 'react-router-dom';

// Hooks
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux

const Photo = () => {
    const { id } = useParams();

    return (
        <div>Photo</div>
    )
}

export default Photo;