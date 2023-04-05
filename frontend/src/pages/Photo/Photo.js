import './Photo.css';

import { uploads } from '../../utils/config';

// Components
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import PhotoItem from '../../components/PhotoItem';

// Hooks
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LikeContainer from '../../components/LikeContainer';

// Redux
import { getPhoto, like, comment } from '../../slices/photoSlice';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

const Photo = () => {
    const { id } = useParams();

    const { photo, loading, message, error } = useSelector((state) => state.photo);

    const { user } = useSelector((state) => state.auth);

    const [commentText, setCommentText] = useState("");

    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    // Load photo data
    useEffect(() => {
        dispatch(getPhoto(id));
    }, [dispatch, id])

    // like a photo
    const handleLike = () => {
        dispatch(like(photo._id));

        resetMessage();
    }

    // Insert a comment
    const handleComment = (e) => {
        e.preventDefault();

        const commentData = {
            comment: commentText,
            id: photo._id
        }

        dispatch(comment(commentData))

        setCommentText("")
        resetMessage()
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div id="photo">
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <div className="message-container">
                {error && <Message msg={error} type='error' />}
                {message && <Message msg={message} type='success' />}
            </div>
            <div className="comments">
                {photo.comments && (
                    <>
                        <h3>Comentários: ({photo.comments.length})</h3>
                        <form onSubmit={handleComment}>
                            <input
                                type="text"
                                placeholder='Insira o seu comentário...'
                                onChange={(e) => setCommentText(e.target.value)}
                                value={commentText || ""}
                            />
                            <input type="submit" value="Enviar" />
                        </form>
                        {photo.comments.length === 0 && <p>Não á comentários...</p>}
                        {photo.comments.map((comment, index) => (
                            <div className="comment" key={index}>
                                <div className='author'>
                                    {comment.userImage && (
                                        <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                                    )}
                                    <Link to={`/users/${comment.userId}`}>
                                        <p>{comment.userName}</p>
                                    </Link>
                                </div>
                                <p>{comment.comment}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default Photo;