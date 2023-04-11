import "./Home.css";

// Components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import Loading from "../../components/Loading"
import { Link } from "react-router-dom";

// Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// Redux
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    const { user } = useSelector((state) => state.auth);

    const { photos, loading } = useSelector((state) => state.photo);

    useEffect(() => {
        dispatch(getPhotos())
    }, [dispatch])

    // like a photo
    const handleLike = (photo) => {
        dispatch(like(photo._id))

        resetMessage()
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div id="home">
            {photos && photos.map((photo) => (
                <div key={photo._id}>
                    <PhotoItem photo={photo} />
                    <LikeContainer photo={photo} user={user} handleLike={handleLike} />
                    <Link className="btn" to={`/photos/${photo._id}`}>Ver mais</Link>
                </div>
            ))}

            {photos && photos.length === 0 && (
                <h2 className="no-photos">
                    Ainda não há Fotos publicadas, <Link to={`/users/${user._id}`}>Publique a primeria Foto</Link>
                </h2>
            )}

        </div>
    )
}

export default Home;